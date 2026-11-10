// Read the checkout's GitHub repository from `origin`. A missing, ambiguous, or
// non-GitHub remote is a stop for the person, never a reason to pick another.
import { execFileSync } from 'node:child_process'

export function parseRepository(remote) {
  const match = /^(?:git@github\.com:|ssh:\/\/git@github\.com\/|https:\/\/github\.com\/)([A-Za-z0-9_.-]+)\/([A-Za-z0-9_.-]+?)(?:\.git)?\/?$/.exec(remote)
  if (!match) throw new Error(`origin is not a supported github.com repository URL: ${remote}`)
  return `${match[1]}/${match[2]}`
}

export function repositoryFromOrigin(root) {
  let stdout
  try {
    stdout = execFileSync('git', ['remote', 'get-url', '--all', 'origin'], {
      cwd: root,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
      timeout: 15000,
    })
  } catch (error) {
    throw new Error(`origin cannot be read from ${root}; confirm the checkout and its remote`)
  }
  const remotes = stdout.trim().split(/\r?\n/).filter(Boolean)
  if (remotes.length !== 1) {
    throw new Error(`origin must have exactly one fetch URL; found ${remotes.length}`)
  }
  return parseRepository(remotes[0])
}
