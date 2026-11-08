#!/usr/bin/env python3
"""Receive smee-forwarded GitHub webhooks and queue communicate issues.

Run from the repository root:

    WEBHOOK_SECRET=<secret> python3 listener.py --port 8765

The smee client forwards the original headers, so the signature is checked
before anything is written. Only issues whose body starts with frontmatter
carrying `kind: communicate` are queued.
"""

import argparse
import hashlib
import hmac
import json
import os
import sys
from datetime import datetime, timezone
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

try:
    import tomllib
except ModuleNotFoundError:  # Python 3.10
    import tomli as tomllib

DEFAULT_PENDING = "../pending/pending-communications.md"


def load_config(root):
    path = root / ".waymark" / "handles.toml"
    if not path.exists():
        return {}, DEFAULT_PENDING
    with path.open("rb") as f:
        data = tomllib.load(f)
    pending = (data.get("pending") or {}).get("path", DEFAULT_PENDING)
    return data.get("handles", {}), pending


def queue_path(root, configured):
    return (root / ".waymark" / configured).resolve()


def parse_frontmatter(body):
    if not body or not body.startswith("---"):
        return None
    end = body.find("\n---", 3)
    if end == -1:
        return None
    data = {}
    key = None
    for line in body[3:end].splitlines():
        stripped = line.strip()
        if not stripped or stripped.startswith("#"):
            continue
        if stripped.startswith("- "):
            if key is None:
                return None
            data.setdefault(key, []).append(stripped[2:].strip().strip('"'))
            continue
        if ":" not in line:
            continue
        k, v = line.split(":", 1)
        k, v = k.strip(), v.strip()
        if v == "":
            key = k
            data[k] = []
        elif v.startswith("[") and v.endswith("]"):
            data[k] = [x.strip().strip('"') for x in v[1:-1].split(",") if x.strip()]
            key = None
        else:
            data[k] = v.strip('"')
            key = None
    return data


def owner_for(handles, handle):
    for table in handles.values():
        for owner, value in table.items():
            if value == handle:
                return owner
    return None


def append(queue, lines):
    queue.parent.mkdir(parents=True, exist_ok=True)
    existing = []
    if queue.exists():
        existing = [line for line in queue.read_text().splitlines() if line.strip()]
    new = []
    for line in lines:
        parts = line.split(" | ")
        url = parts[0][2:] if parts[0].startswith("- ") else parts[0]
        handle = ""
        for part in parts:
            if part.startswith("to="):
                handle = part.split(" ")[0][3:]
                break
        if any(url in entry and f"to={handle}" in entry for entry in existing):
            continue
        new.append(line)
    if new:
        with queue.open("a") as f:
            for line in new:
                f.write(line + "\n")
    return len(new)


def queue_payload(payload, root):
    if payload.get("action") != "opened":
        return 0
    issue = payload.get("issue") or {}
    front = parse_frontmatter(issue.get("body") or "")
    if not front or front.get("kind") != "communicate":
        return 0
    recipients = front.get("to") or []
    if isinstance(recipients, str):
        recipients = [recipients]
    sender = front.get("from") or (issue.get("user") or {}).get("login", "unknown")
    title = issue.get("title") or ""
    url = issue.get("html_url") or ""
    received = datetime.now(timezone.utc).isoformat(timespec="minutes")
    handles, configured = load_config(root)
    queue = queue_path(root, configured)
    lines = []
    for handle in recipients:
        owner = owner_for(handles, handle) or "unknown"
        lines.append(
            f"- {url} | from={sender} | to={handle} (owner={owner}) | {title} | {received}"
        )
    return append(queue, lines)


class Handler(BaseHTTPRequestHandler):
    secret = ""
    root = Path.cwd()

    def do_POST(self):
        if self.path != "/webhook":
            self.send_error(404)
            return
        length = int(self.headers.get("Content-Length", 0))
        raw = self.rfile.read(length)
        if self.secret:
            signature = self.headers.get("X-Hub-Signature-256", "")
            expected = "sha256=" + hmac.new(
                self.secret.encode(), raw, hashlib.sha256
            ).hexdigest()
            if not hmac.compare_digest(signature, expected):
                self.send_error(401, "bad signature")
                return
        try:
            payload = json.loads(raw)
        except json.JSONDecodeError:
            self.send_error(400, "bad json")
            return
        if self.headers.get("X-GitHub-Event") not in (None, "issues"):
            self.send_response(202)
            self.end_headers()
            return
        queued = queue_payload(payload, self.root)
        self.send_response(202)
        self.end_headers()
        self.wfile.write(f"queued {queued}\n".encode())

    def log_message(self, *args):
        pass


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--port", type=int, default=8765)
    args = parser.parse_args()
    Handler.secret = os.environ.get("WEBHOOK_SECRET", "")
    Handler.root = Path.cwd()
    if not Handler.secret:
        print("warning: WEBHOOK_SECRET is empty; signatures are not checked", file=sys.stderr)
    server = HTTPServer(("127.0.0.1", args.port), Handler)
    print(f"listening on http://127.0.0.1:{args.port}/webhook")
    server.serve_forever()


if __name__ == "__main__":
    main()
