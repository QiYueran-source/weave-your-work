"""Serve the round's MCP servers over a local HTTP port.

A node's tools come from an MCP server fast-agent connects to. Both servers
hold state the round owns (the record pens, the machine's knobs), so they live
in the round's own process and reach the agents over Streamable HTTP on the
loopback interface instead of running as separate children that would each hold
a copy of that state.

The tool functions are the same ones the in-process server defines; only the
transport differs.
"""

from __future__ import annotations

import asyncio
import logging
import socket
import threading
import time
from dataclasses import dataclass, field
from pathlib import Path

from fastmcp import FastMCP
from fastmcp.tools import Tool

HOST = "127.0.0.1"
PATH = "/mcp"

# fastmcp logs every request at INFO; a round does not need that in the console.
for _name in ("fastmcp", "httpx2", "mcp"):
    logging.getLogger(_name).setLevel(logging.WARNING)


@dataclass
class HttpServer:
    name: str
    mcp: FastMCP
    port: int = 0
    _thread: threading.Thread | None = field(default=None, repr=False)
    _error: BaseException | None = field(default=None, repr=False)

    @property
    def url(self) -> str:
        return f"http://{HOST}:{self.port}{PATH}"

    def start(self) -> None:
        self.port = _free_port()
        self._thread = threading.Thread(target=self._serve, name=f"mcp-{self.name}", daemon=True)
        self._thread.start()
        deadline = time.monotonic() + 10
        while time.monotonic() < deadline:
            if self._error is not None:
                raise RuntimeError(f"{self.name} server failed to start: {self._error}")
            if _port_open(self.port):
                return
            time.sleep(0.05)
        raise RuntimeError(f"{self.name} server did not open port {self.port} in time")

    def _serve(self) -> None:
        try:
            asyncio.run(self._serve_async())
        except BaseException as exc:  # recorded, then raised to whoever is starting
            self._error = exc

    async def _serve_async(self) -> None:
        try:
            await self.mcp.run_http_async(
                transport="streamable-http",
                host=HOST,
                port=self.port,
                path=PATH,
                show_banner=False,
                log_level="warning",
            )
        except BaseException as exc:  # recorded, then raised to whoever is starting
            self._error = exc


def as_fastmcp(name: str, inner) -> FastMCP:
    """Re-register an MCP server's tools on a FastMCP instance that can serve HTTP.

    The inner server keeps its tool functions, its descriptions, and its state;
    FastMCP only carries them over a transport.
    """

    mcp = FastMCP(name)
    manager = getattr(inner, "_tool_manager", None)
    for tool in (manager._tools.values() if manager else []):
        mcp.add_tool(Tool.from_function(tool.fn, name=tool.name, description=tool.description))
    return mcp


def _free_port() -> int:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.bind((HOST, 0))
        return sock.getsockname()[1]


def _port_open(port: int) -> bool:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(0.2)
        return sock.connect_ex((HOST, port)) == 0
