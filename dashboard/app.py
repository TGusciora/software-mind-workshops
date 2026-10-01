"""Owner dashboard: local, read-only, no login. Run: python3 dashboard/app.py"""

import json
import os
from http.server import BaseHTTPRequestHandler, HTTPServer
from pathlib import Path

import data

HOST = "127.0.0.1"  # local only
PORT = int(os.environ.get("PORT", "8080"))
INDEX = Path(__file__).resolve().parent / "static" / "index.html"


class Handler(BaseHTTPRequestHandler):
    def _send(self, code: int, body: bytes, ctype: str):
        self.send_response(code)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def do_GET(self):
        path = self.path.split("?")[0]
        if path == "/":
            self._send(200, INDEX.read_bytes(), "text/html; charset=utf-8")
        elif path == "/api/summary":
            payload = data.load_summary()
            self._send(500 if "error" in payload else 200, json.dumps(payload).encode(), "application/json")
        else:
            self._send(404, b"Not found", "text/plain")

    def log_message(self, *args):
        pass


def make_server(port: int = PORT) -> HTTPServer:
    return HTTPServer((HOST, port), Handler)


if __name__ == "__main__":
    print(f"Dashboard on http://{HOST}:{PORT}/")
    make_server().serve_forever()
