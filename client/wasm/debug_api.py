# Hosts shaders on localhost, to allow hot-reloading them from wasm.
# Now it saves scenes too.

import os
from http.server import HTTPServer, SimpleHTTPRequestHandler
from urllib.parse import urlparse

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST')
        self.send_header('Cache-Control', 'no-store, no-cache, must-revalidate')
        return super(CORSRequestHandler, self).end_headers()
    
    def do_POST(self):
        content_length = int(self.headers['Content-Length'])
        post_body = self.rfile.read(content_length)
        
        # Parse the URL and extract the name
        parsed_path = urlparse(self.path)
        path_parts = parsed_path.path.split('/')
        if len(path_parts) > 2 and path_parts[1] == 'SaveScene':
            scene_name = path_parts[2]
        else:
            scene_name = 'Unknown'

        file_data = post_body.decode('utf-8')
        with open(f'scenes/{scene_name}.h', 'w') as f:
            f.write(file_data)

        self.send_response(200)
        self.end_headers()



os.chdir('src/')
httpd = HTTPServer(('localhost', 8000), CORSRequestHandler)
httpd.serve_forever()