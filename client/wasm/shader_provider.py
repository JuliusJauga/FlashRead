# Hosts shaders on localhost, to allow hot-reloading them from wasm.

import os
from http.server import HTTPServer, SimpleHTTPRequestHandler

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super(CORSRequestHandler, self).end_headers()

os.chdir('src/rendering')
httpd = HTTPServer(('localhost', 8000), CORSRequestHandler)
httpd.serve_forever()