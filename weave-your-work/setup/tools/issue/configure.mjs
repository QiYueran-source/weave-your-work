#!/usr/bin/env node
// Generate one checkout's listener settings and systemd unit. The setup flow
// runs this after it has installed the project runtime and confirmed the
// repository with the person.
import { createHash } from 'node:crypto'
import fs from 'node:fs'
import net from 'node:net'
import { once } from 'node:events'
import path from 'node:path'
import process from 'node:process'
import projectRoot from './project-root.cjs'
import { repositoryFromOrigin } from './origin.mjs'

const { resolveProjectRoot } = projectRoot
const USAGE = 'Usage: node configure.mjs [--project <directory>] [--repository <owner/repo>] [--smee-url <url>] [--port <port>]'

function parseArgs(argv) {
  const values = {}
  const allowed = new Set(['--project', '--repository', '--smee-url', '--port'])
  for (let index = 0; index < argv.length; index++) {
    const argument = argv[index]
    if (!allowed.has(argument)) throw new Error(`Unknown argument ${argument}; ${USAGE}`)
    const value = argv[index + 1]
    if (value === undefined || value.startsWith('--')) throw new Error(`${argument} requires a value`)
    values[argument.slice(2)] = value
    index++
  }
  return values
}

function readSettings(file) {
  const values = {}
  let content
  try {
    content = fs.readFileSync(file, 'utf8')
  } catch (error) {
    if (error.code === 'ENOENT') return values
    throw error
  }
  for (const line of content.split(/\r?\n/)) {
    const text = line.trim()
    if (!text || text.startsWith('#')) continue
    const equals = text.indexOf('=')
    if (equals < 1) continue
    const key = text.slice(0, equals).trim()
    let value = text.slice(equals + 1).trim()
    if (value.length >= 2 && value.startsWith('"') && value.endsWith('"')) {
      value = JSON.parse(value)
    }
    values[key] = value
  }
  return values
}

function quoted(value) {
  return JSON.stringify(String(value))
}

// Unit files do not strip quotes around a path setting, so escape the bytes
// systemd would otherwise treat as separators or specifiers.
function unitPath(value) {
  return String(value).replace(/\\/g, '\\x5c').replace(/ /g, '\\x20').replace(/%/g, '%%')
}

function environmentFile(values) {
  return [
    `REPOSITORY=${quoted(values.repository)}`,
    `SMEE_URL=${quoted(values.smeeUrl)}`,
    `PORT=${quoted(values.port)}`,
    '',
  ].join('\n')
}

function unitFile({ root, envFile, node, listener, description }) {
  return [
    '[Unit]',
    `Description=${description}`,
    'After=network-online.target',
    'Wants=network-online.target',
    '',
    '[Service]',
    'Type=simple',
    `WorkingDirectory=${unitPath(root)}`,
    `EnvironmentFile=${unitPath(envFile)}`,
    `ExecStart=${quoted(node)} ${quoted(listener)}`,
    'Restart=on-failure',
    'RestartSec=5',
    '',
    '[Install]',
    'WantedBy=default.target',
    '',
  ].join('\n')
}

async function freePort() {
  const server = net.createServer()
  server.listen(0, '127.0.0.1')
  await once(server, 'listening')
  const { port } = server.address()
  await new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve())))
  return port
}

async function portAvailable(port) {
  const server = net.createServer()
  try {
    server.listen(port, '127.0.0.1')
    await once(server, 'listening')
    return true
  } catch (error) {
    if (error.code === 'EADDRINUSE') return false
    throw error
  } finally {
    if (server.listening) await new Promise((resolve) => server.close(resolve))
  }
}

function writeIfChanged(file, content) {
  try {
    if (fs.readFileSync(file, 'utf8') === content) return false
  } catch (error) {
    if (error.code !== 'ENOENT') throw error
  }
  const temporary = `${file}.tmp-${process.pid}`
  fs.writeFileSync(temporary, content)
  fs.renameSync(temporary, file)
  return true
}

async function main(argv) {
  const args = parseArgs(argv)
  const root = resolveProjectRoot(args.project === undefined ? {} : { project: args.project })
  const options = args.repository === undefined
    ? { repository: repositoryFromOrigin(root) }
    : { repository: args.repository }
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(options.repository)) {
    throw new Error('repository must be owner/repo')
  }

  const local = path.join(root, '.work-weave', 'local')
  const runtime = path.join(root, '.work-weave', 'runtime', 'issue')
  const listener = path.join(runtime, 'listener.mjs')
  if (!fs.existsSync(listener)) {
    throw new Error(`Listener is not installed at ${listener}; install the project runtime first`)
  }
  const envFile = path.join(local, 'issue-listener.env')
  const previous = readSettings(envFile)

  let port
  if (args.port !== undefined) {
    port = Number(args.port)
  } else if (previous.PORT !== undefined) {
    port = Number(previous.PORT)
  } else {
    port = await freePort()
  }
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error(`port must be an integer from 1 to 65535, got ${args.port ?? previous.PORT}`)
  }
  if (!(await portAvailable(port))) {
    throw new Error(`port ${port} is occupied; stop the other process or choose another port; no settings were written`)
  }

  const smeeUrl = args['smee-url'] ?? previous.SMEE_URL ?? ''
  const env = environmentFile({ repository: options.repository, smeeUrl, port })
  const hash = createHash('sha256').update(root).digest('hex').slice(0, 8)
  const service = `work-weave-issue-${hash}.service`
  const unit = unitFile({
    root,
    envFile,
    node: process.execPath,
    listener,
    description: `work-weave issue listener for ${root}`,
  })
  const unitPath = path.join(local, service)

  fs.mkdirSync(local, { recursive: true })
  const envChanged = writeIfChanged(envFile, env)
  const unitChanged = writeIfChanged(unitPath, unit)

  console.log(JSON.stringify({
    root,
    repository: options.repository,
    port,
    env: envFile,
    envChanged,
    unit: unitPath,
    unitChanged,
  }, null, 2))
  console.log(`Review the repository and port above, then link the unit with: systemctl --user link ${unitPath}`)
}

main(process.argv.slice(2)).catch((error) => {
  console.error(error.message)
  process.exit(1)
})
