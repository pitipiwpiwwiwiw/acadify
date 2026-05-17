require('dotenv').config();

// ===========================
// acadify — Local Server
// Uses Groq API (FREE)
// Run: node server.js
// Open: http://localhost:3000
// ===========================
const http  = require('http');
const fs    = require('fs');
const path  = require('path');
const https = require('https');

const PORT     = 3000;
const GROQ_KEY = process.env.GROQ_KEY;

const MIME = { '.html':'text/html','.css':'text/css','.js':'application/javascript','.png':'image/png','.jpg':'image/jpeg','.ico':'image/x-icon' };

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin','*');
  res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers','Content-Type');
  if (req.method==='OPTIONS') { res.writeHead(204); res.end(); return; }

  if (req.method==='POST' && req.url==='/api/ai') {
    let body = '';
    req.on('data', chunk => body+=chunk);
    req.on('end', () => {
      let payload;
      try { payload=JSON.parse(body); } catch { res.writeHead(400,{'Content-Type':'application/json'}); res.end(JSON.stringify({error:'Invalid JSON'})); return; }
      if (!GROQ_KEY || GROQ_KEY==='YOUR_GROQ_API_KEY_HERE') {
        res.writeHead(500,{'Content-Type':'application/json'});
        res.end(JSON.stringify({error:'No API key. Open server.js and paste your Groq key.'})); return;
      }
      const postData = JSON.stringify({ model:'llama-3.3-70b-versatile', messages:[{role:'user',content:payload.prompt}], temperature:0.7, max_tokens:2000 });
      const options = { hostname:'api.groq.com', path:'/openai/v1/chat/completions', method:'POST',
        headers:{'Content-Type':'application/json','Authorization':`Bearer ${GROQ_KEY}`,'Content-Length':Buffer.byteLength(postData)} };
      const apiReq = https.request(options, apiRes => {
        let data='';
        apiRes.on('data', chunk => data+=chunk);
        apiRes.on('end', () => {
          let parsed; try { parsed=JSON.parse(data); } catch { res.writeHead(500,{'Content-Type':'application/json'}); res.end(JSON.stringify({error:'Parse error'})); return; }
          if (parsed.error) { res.writeHead(500,{'Content-Type':'application/json'}); res.end(JSON.stringify({error:parsed.error.message})); return; }
          const text = parsed?.choices?.[0]?.message?.content;
          if (!text) { res.writeHead(500,{'Content-Type':'application/json'}); res.end(JSON.stringify({error:'Empty response'})); return; }
          console.log('✅ AI response sent for prompt starting with:',payload.prompt.substring(0,60)+'...');
          res.writeHead(200,{'Content-Type':'application/json'});
          res.end(JSON.stringify({content:[{text}]}));
        });
      });
      apiReq.on('error', err => { res.writeHead(500,{'Content-Type':'application/json'}); res.end(JSON.stringify({error:err.message})); });
      apiReq.write(postData); apiReq.end();
    });
    return;
  }

  let filePath = req.url==='/' ? '/index.html' : req.url;
  filePath = path.join(__dirname, filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) { res.writeHead(404); res.end('Not found'); return; }
    const mime = MIME[path.extname(filePath)] || 'text/plain';
    res.writeHead(200,{'Content-Type':mime}); res.end(data);
  });
});

server.listen(PORT, () => {
  console.log('');
    if (!GROQ_KEY) {
        console.log('  ⚠️  Missing Groq API key in .env');
        console.log('  👉  Get FREE key at: https://console.groq.com');
    } else {
    console.log('  ✅  acadify is running!');
  }
  console.log(`  👉  Open: http://localhost:${PORT}`);
  console.log('  Press Ctrl+C to stop\n');
});