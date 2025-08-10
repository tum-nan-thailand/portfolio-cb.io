const http = require('http');
const fs = require('fs');
const path = require('path');

const port = 3006;

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf'
};

const baseDir = path.resolve(__dirname);

const server = http.createServer((req, res) => {
  // Decode URL to handle Thai characters properly
  let safePath = decodeURIComponent(req.url);
  if (safePath === '/' || safePath === '') {
    safePath = '/index.html';
  }

  // Normalize and join the path to prevent directory traversal
  const filePath = path.resolve(baseDir, '.' + safePath);
  if (!filePath.startsWith(baseDir)) {
    res.writeHead(403, { 'Content-Type': 'text/html' });
    res.end('<h1>403 - Forbidden</h1>', 'utf-8');
    return;
  }

  const extname = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';
  
  // Add CORS headers for PDF files
  if (extname === '.pdf') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  }
  
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found
        console.log(`File not found: ${filePath}`);
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - File Not Found</h1>', 'utf-8');
      } else {
        // Server error
        console.error(`Server error: ${error.code} for ${filePath}`);
        res.writeHead(500);
        res.end(`Server Error: ${error.code}`);
      }
    } else {
      // Success
      console.log(`Serving: ${filePath} (${contentType})`);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, () => {
  console.log(`🚀 Portfolio server running at http://localhost:${port}`);
  console.log(`📁 Serving files from: ${__dirname}`);
  console.log('✨ Press Ctrl+C to stop the server');
});
