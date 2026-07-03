const fs = require('fs');
const path = require('path');

const dir = process.argv[2] || path.join(__dirname, '..', '..', 'CV-EXEMPLE');

for (const f of fs.readdirSync(dir).filter((x) => x.endsWith('.svg')).sort()) {
  const fp = path.join(dir, f);
  const s = fs.readFileSync(fp, 'utf8');
  const texts = (s.match(/<text[\s\S]*?<\/text>/g) || []).length;
  const images = (s.match(/xlink:href="data:image/g) || []).length;
  const clips = (s.match(/clipPath/g) || []).length;
  const fills = [...new Set((s.match(/fill="(#[0-9a-fA-F]{3,8})"/g) || []).map((x) => x.slice(6, -1)))].slice(0, 10);
  const hasLeftSidebar = /L 240\.183594 0 L 240\.183594/.test(s);
  const hasRightCol = /L 354/.test(s);
  const mb = (fs.statSync(fp).size / 1e6).toFixed(1);
  console.log(JSON.stringify({ f, mb, texts, images, clips, hasLeftSidebar, hasRightCol, fills }));
}
