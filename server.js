const http = require('http');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');
const { URL } = require('url');

const PORT = 3847;
const ROOT = __dirname;
const PUBLIC = path.join(ROOT, 'public');
const CV_HTML = path.join(ROOT, 'output', 'lebenslauf_ioana_trifoi.html');
const CV_PDF = path.join(ROOT, 'output', 'lebenslauf_ioana_trifoi.pdf');
const BLOCKS_FILE = path.join(ROOT, 'data', 'cv-blocks.json');
const TEMPLATES_DIR = path.join(ROOT, 'data', 'templates');
const SEED_BLOCKS = path.join(ROOT, 'data', 'cv-blocks.json');
const UPLOADS_DIR = path.join(ROOT, 'uploads');
const OUTPUT_DIR = path.join(ROOT, 'output');

const CHROME_CANDIDATES = [
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\msedge.exe',
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
};

function findChrome() {
  return CHROME_CANDIDATES.find((p) => fs.existsSync(p));
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on('data', (chunk) => chunks.push(chunk));
    req.on('end', () => resolve(Buffer.concat(chunks)));
    req.on('error', reject);
  });
}

function sendJson(res, status, data) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function serveStatic(res, filePath, headOnly = false) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    if (headOnly) res.end();
    else res.end(data);
  });
}

function parseMultipart(buffer, boundary) {
  const parts = buffer.toString('binary').split(`--${boundary}`);
  for (const part of parts) {
    if (!part.includes('Content-Disposition')) continue;
    const match = part.match(/name="([^"]+)"(?:; filename="([^"]+)")?/);
    if (!match) continue;
    const [, name, filename] = match;
    const dataStart = part.indexOf('\r\n\r\n');
    if (dataStart === -1) continue;
    let body = part.slice(dataStart + 4);
    if (body.endsWith('\r\n')) body = body.slice(0, -2);
    if (name === 'image' && filename) {
      return { filename, data: Buffer.from(body, 'binary') };
    }
  }
  return null;
}

function defaultPage() {
  return { marginTop: 10, marginRight: 12, marginBottom: 10, marginLeft: 12 };
}

function loadBlocks() {
  if (!fs.existsSync(BLOCKS_FILE)) {
    return { blocks: [], page: defaultPage() };
  }
  const raw = JSON.parse(fs.readFileSync(BLOCKS_FILE, 'utf8'));
  if (Array.isArray(raw)) {
    return { blocks: raw, page: defaultPage() };
  }
  return {
    blocks: Array.isArray(raw.blocks) ? raw.blocks : [],
    page: { ...defaultPage(), ...(raw.page || {}) },
  };
}

function saveBlocks(blocks, page = defaultPage()) {
  fs.mkdirSync(path.dirname(BLOCKS_FILE), { recursive: true });
  fs.writeFileSync(BLOCKS_FILE, JSON.stringify({ blocks, page }, null, 2), 'utf8');
}

function ensureDirs() {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

function readJsonFile(filePath) {
  let raw = fs.readFileSync(filePath, 'utf8');
  if (raw.charCodeAt(0) === 0xFEFF) raw = raw.slice(1); // strip BOM
  return JSON.parse(raw);
}

function loadTemplateIndex() {
  const indexPath = path.join(TEMPLATES_DIR, 'index.json');
  if (!fs.existsSync(indexPath)) return [];
  return readJsonFile(indexPath);
}

function loadTemplate(id) {
  const safeId = path.basename(id).replace(/[^0-9a-z-]/gi, '');
  const filePath = path.join(TEMPLATES_DIR, `${safeId}.json`);
  if (!filePath.startsWith(TEMPLATES_DIR) || !fs.existsSync(filePath)) {
    return null;
  }
  return readJsonFile(filePath);
}

function generatePdf() {
  return new Promise((resolve, reject) => {
    const chrome = findChrome();
    if (!chrome) {
      reject(new Error('Chrome sau Edge nu a fost găsit pe acest PC.'));
      return;
    }

    if (!fs.existsSync(CV_HTML)) {
      reject(new Error(`Fișierul CV nu există: ${CV_HTML}`));
      return;
    }

    const fileUrl = 'file:///' + CV_HTML.replace(/\\/g, '/');
    const args = [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--run-all-compositor-stages-before-draw',
      '--virtual-time-budget=12000',
      `--print-to-pdf=${CV_PDF}`,
      '--print-to-pdf-no-header',
      '--no-pdf-header-footer',
      fileUrl,
    ];

    const proc = spawn(chrome, args, { stdio: ['ignore', 'pipe', 'pipe'] });
    let stderr = '';

    proc.stderr.on('data', (chunk) => {
      stderr += chunk.toString();
    });

    proc.on('close', (code) => {
      if (code !== 0 || !fs.existsSync(CV_PDF)) {
        reject(new Error(stderr || `Chrome a eșuat cu codul ${code}`));
        return;
      }

      const stats = fs.statSync(CV_PDF);
      resolve({
        pdfPath: CV_PDF,
        sizeKb: Math.round(stats.size / 1024),
        updatedAt: stats.mtime.toISOString(),
      });
    });
  });
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);

  try {
    if (req.method === 'GET' && (url.pathname === '/' || url.pathname === '/index.html')) {
      return serveStatic(res, path.join(PUBLIC, 'index.html'));
    }

    if (req.method === 'GET' && (url.pathname.startsWith('/css/') || url.pathname.startsWith('/js/') || url.pathname.startsWith('/templates/'))) {
      const filePath = path.join(PUBLIC, url.pathname);
      if (!filePath.startsWith(PUBLIC)) {
        res.writeHead(403);
        return res.end('Forbidden');
      }
      return serveStatic(res, filePath);
    }

    if ((req.method === 'GET' || req.method === 'HEAD') && url.pathname.startsWith('/files/')) {
      const filename = decodeURIComponent(url.pathname.slice('/files/'.length));
      if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
        res.writeHead(403);
        return res.end('Forbidden');
      }
      const filePath = path.resolve(UPLOADS_DIR, filename);
      const uploadsRoot = path.resolve(UPLOADS_DIR);
      if (!filePath.startsWith(uploadsRoot)) {
        res.writeHead(403);
        return res.end('Forbidden');
      }
      return serveStatic(res, filePath, req.method === 'HEAD');
    }

    if (req.method === 'GET' && url.pathname === '/api/templates') {
      return sendJson(res, 200, { templates: loadTemplateIndex() });
    }

    const templateMatch = url.pathname.match(/^\/api\/templates\/([^/]+)$/);
    if (req.method === 'GET' && templateMatch) {
      const tpl = loadTemplate(templateMatch[1]);
      if (!tpl) {
        return sendJson(res, 404, { error: 'Șablon negăsit.' });
      }
      return sendJson(res, 200, tpl);
    }

    if (req.method === 'GET' && url.pathname === '/api/blocks') {
      const doc = loadBlocks();
      return sendJson(res, 200, doc);
    }

    if (req.method === 'POST' && url.pathname === '/api/blocks') {
      const body = await readBody(req);
      const payload = JSON.parse(body.toString('utf8'));
      if (!Array.isArray(payload.blocks)) {
        return sendJson(res, 400, { error: 'Date invalide.' });
      }
      saveBlocks(payload.blocks, payload.page || defaultPage());
      return sendJson(res, 200, { ok: true });
    }

    if (req.method === 'GET' && url.pathname === '/api/cv') {
      if (!fs.existsSync(CV_HTML)) {
        return sendJson(res, 404, { error: 'Fișierul CV nu a fost găsit.' });
      }
      const content = fs.readFileSync(CV_HTML, 'utf8');
      return sendJson(res, 200, {
        path: CV_HTML,
        content,
        pdfPath: CV_PDF,
        pdfExists: fs.existsSync(CV_PDF),
      });
    }

    if (req.method === 'POST' && url.pathname === '/api/cv') {
      const body = await readBody(req);
      const payload = JSON.parse(body.toString('utf8'));
      if (!payload.content || typeof payload.content !== 'string') {
        return sendJson(res, 400, { error: 'Conținut invalid.' });
      }
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
      fs.writeFileSync(CV_HTML, payload.content, 'utf8');
      return sendJson(res, 200, { ok: true, path: CV_HTML });
    }

    if (req.method === 'POST' && url.pathname === '/api/pdf') {
      const result = await generatePdf();
      return sendJson(res, 200, { ok: true, ...result });
    }

    if (req.method === 'GET' && url.pathname === '/api/pdf') {
      if (!fs.existsSync(CV_PDF)) {
        return sendJson(res, 404, { error: 'PDF-ul nu există încă. Generează-l mai întâi.' });
      }
      const data = fs.readFileSync(CV_PDF);
      res.writeHead(200, {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'inline; filename="lebenslauf_ioana_trifoi.pdf"',
      });
      return res.end(data);
    }

    if (req.method === 'POST' && url.pathname === '/api/upload-image') {
      const contentType = req.headers['content-type'] || '';
      const boundary = contentType.split('boundary=')[1];
      if (!boundary) {
        return sendJson(res, 400, { error: 'Upload invalid.' });
      }

      const buffer = await readBody(req);
      const file = parseMultipart(buffer, boundary);
      if (!file) {
        return sendJson(res, 400, { error: 'Nu s-a primit nicio imagine.' });
      }

      const ext = path.extname(file.filename).toLowerCase() || '.jpg';
      const safeName = `cv-upload-${Date.now()}${ext}`;
      const target = path.join(UPLOADS_DIR, safeName);
      fs.writeFileSync(target, file.data);
      return sendJson(res, 200, { ok: true, filename: safeName });
    }

    res.writeHead(404);
    res.end('Not found');
  } catch (error) {
    sendJson(res, 500, { error: error.message });
  }
});

server.listen(PORT, () => {
  ensureDirs();
  console.log('');
  console.log('  CV Maker PDF');
  console.log('  ------------');
  console.log(`  Deschide: http://localhost:${PORT}`);
  console.log(`  CV HTML:  ${CV_HTML}`);
  console.log(`  CV PDF:   ${CV_PDF}`);
  console.log(`  Uploads:  ${UPLOADS_DIR}`);
  console.log('');
});
