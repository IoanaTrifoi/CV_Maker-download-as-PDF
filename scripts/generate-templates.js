const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE_FILE = path.join(ROOT, 'data', 'cv-blocks.json');
const OUT_DIR = path.join(ROOT, 'data', 'templates');

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function reassignIds(blocks, prefix = 't') {
  let n = 0;
  function walk(list) {
    return list.map((block) => {
      const copy = { ...block, id: `${prefix}-${++n}` };
      if (copy.children) copy.children = walk(copy.children);
      return copy;
    });
  }
  return walk(blocks);
}

function sectionLayout(overrides = {}) {
  return {
    grid: '1',
    margin: 0,
    padding: 12,
    shadow: 'none',
    bgColor: 'transparent',
    borderColor: '#e5e7eb',
    boxWidth: 0,
    boxHeight: 0,
    ...overrides,
  };
}

function styleSections(blocks, fn) {
  blocks.forEach((b) => {
    if (b.type === 'section') {
      b.layout = sectionLayout(fn(b));
      if (fn.titleColor) b.titleColor = fn.titleColor(b);
    }
    if (b.children) styleSections(b.children, fn);
  });
}

function contactsFromHeader(header) {
  return (header.contacts || []).map((c) => ({
    type: 'icon-row',
    icon: c.icon,
    text: c.text,
    color: '#4b5563',
    box: { width: 0, height: 0 },
  }));
}

function buildSidebarClassic(base) {
  const header = base.find((b) => b.type === 'header');
  const sections = base.filter((b) => b.type === 'section');
  const skills = sections.find((s) => s.title === 'Kenntnisse & Tools');
  const langs = sections.find((s) => s.title === 'Sprachen & Sonstiges');
  const mainSections = sections.filter((s) => s !== skills && s !== langs);

  const sidebarChildren = [
    {
      type: 'image',
      src: header?.image || 'ioana_profil.jpg',
      alt: header?.name || 'Foto',
      width: 128,
      height: 176,
      objectFit: 'cover',
    },
    { type: 'heading', text: header?.name || 'Nume Prenume', textColor: '#292d2d' },
    { type: 'paragraph', text: header?.title || 'Titlu profesional', textColor: '#4b5563' },
    { type: 'divider', style: 'solid' },
    ...contactsFromHeader(header || { contacts: [] }),
  ];
  if (skills) sidebarChildren.push({ ...deepClone(skills), layout: sectionLayout({ bgColor: 'transparent', padding: 8 }) });
  if (langs) sidebarChildren.push({ ...deepClone(langs), layout: sectionLayout({ bgColor: 'transparent', padding: 8 }) });

  mainSections.forEach((s) => {
    s.layout = sectionLayout({ padding: 14, borderColor: '#e6e3dd' });
    s.titleColor = '#292d2d';
  });

  return [{
    type: 'container',
    grid: 'sidebar-left',
    bgColor: '#e6e3dd',
    borderColor: '#d6d3cd',
    padding: 16,
    margin: 0,
    shadow: 'md',
    boxWidth: 0,
    boxHeight: 0,
    children: [
      {
        type: 'container',
        grid: '1',
        bgColor: '#e6e3dd',
        padding: 12,
        margin: 0,
        shadow: 'none',
        borderColor: 'transparent',
        boxWidth: 0,
        boxHeight: 0,
        children: sidebarChildren,
      },
      {
        type: 'container',
        grid: '1',
        bgColor: '#ffffff',
        padding: 20,
        margin: 0,
        shadow: 'none',
        borderColor: 'transparent',
        boxWidth: 0,
        boxHeight: 0,
        children: mainSections,
      },
    ],
  }];
}

const STYLE_TEMPLATES = [
  {
    id: '2',
    name: 'Minimal Întunecat',
    description: 'Design curat, accente gri închis (#3d3d3d)',
    colors: ['#3d3d3d', '#4d4d50'],
    build(base) {
      const b = deepClone(base);
      styleSections(b, () => ({ borderColor: '#e5e7eb', padding: 14 }));
      b.forEach((block) => {
        if (block.type === 'section') block.titleColor = '#3d3d3d';
        if (block.type === 'header' && block.title) block.title = block.title;
      });
      return b;
    },
  },
  {
    id: '3',
    name: 'Navy & Auriu',
    description: 'Sidebar albastru închis cu accente aurii',
    colors: ['#00122d', '#ffb63a'],
    build(base) {
      const b = deepClone(base);
      styleSections(b, () => ({ bgColor: '#f8fafc', borderColor: '#00122d', padding: 16, shadow: 'sm' }));
      b.forEach((block) => {
        if (block.type === 'section') {
          block.titleColor = '#00122d';
          block.icon = block.icon || 'fa-star';
        }
      });
      const skills = b.find((s) => s.type === 'section' && s.title === 'Kenntnisse & Tools');
      if (skills) {
        skills.children.unshift({
          type: 'shape',
          color: '#ffb63a',
          height: 6,
          width: 100,
          shapeKind: 'line',
          scale: 100,
          border: false,
        });
      }
      return b;
    },
  },
  {
    id: '4',
    name: 'Corporate Albastru',
    description: 'Titluri albastre corporate (#022f6a)',
    colors: ['#022f6a', '#ebebeb'],
    build(base) {
      const b = deepClone(base);
      styleSections(b, () => ({ borderColor: '#022f6a', padding: 14, shadow: 'sm' }));
      b.forEach((block) => {
        if (block.type === 'section') block.titleColor = '#022f6a';
      });
      return b;
    },
  },
  {
    id: '5',
    name: 'Modern Galben',
    description: 'Accente galbene vibrante (#fccb14)',
    colors: ['#fccb14', '#232426'],
    build(base) {
      const b = deepClone(base);
      styleSections(b, () => ({ bgColor: '#fffbeb', borderColor: '#fccb14', padding: 14 }));
      b.forEach((block) => {
        if (block.type === 'section') block.titleColor = '#232426';
      });
      const header = b.find((x) => x.type === 'header');
      if (header) {
        b.unshift({
          type: 'shape',
          color: '#fccb14',
          height: 12,
          width: 100,
          shapeKind: 'line',
          scale: 100,
          border: false,
        });
      }
      return b;
    },
  },
  {
    id: '6',
    name: 'Monocrom Elegant',
    description: 'Stil sobriu, tonuri charcoal (#22201d)',
    colors: ['#22201d', '#292828'],
    build(base) {
      const b = deepClone(base);
      styleSections(b, () => ({ borderColor: '#d1d5db', padding: 12, shadow: 'none' }));
      b.forEach((block) => {
        if (block.type === 'section') block.titleColor = '#22201d';
        if (block.type === 'paragraph') block.textColor = '#374151';
      });
      return b;
    },
  },
  {
    id: '7',
    name: 'Soft Bej',
    description: 'Fundaluri calde, accente nude (#dfd7d3)',
    colors: ['#dfd7d3', '#49454b'],
    build(base) {
      const b = deepClone(base);
      styleSections(b, () => ({ bgColor: '#faf8f7', borderColor: '#dfd7d3', padding: 16, shadow: 'sm' }));
      b.forEach((block) => {
        if (block.type === 'section') block.titleColor = '#49454b';
      });
      return b;
    },
  },
  {
    id: '8',
    name: 'Creativ Colorat',
    description: 'Accente turcoaz, portocaliu și galben',
    colors: ['#07a5c3', '#f14902', '#f4b324'],
    build(base) {
      const b = deepClone(base);
      const accents = ['#07a5c3', '#f14902', '#f4b324', '#2b2d2f'];
      let i = 0;
      b.forEach((block) => {
        if (block.type === 'section') {
          const accent = accents[i++ % accents.length];
          block.titleColor = accent;
          block.layout = sectionLayout({ borderColor: accent, padding: 14, shadow: 'sm', bgColor: '#ffffff' });
        }
      });
      b.unshift({
        type: 'emoji',
        emoji: '✨',
        size: 'lg',
        align: 'center',
      });
      return b;
    },
  },
];

const TEMPLATE_1 = {
  id: '1',
  name: 'Sidebar Bej',
  description: 'Coloană laterală stânga (ca exemplul 1.svg)',
  colors: ['#e6e3dd', '#292d2d'],
};

const base = JSON.parse(fs.readFileSync(BASE_FILE, 'utf8'));

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });

const index = [];

index.push({
  id: TEMPLATE_1.id,
  name: TEMPLATE_1.name,
  description: TEMPLATE_1.description,
  preview: `/templates/${TEMPLATE_1.id}.svg`,
  colors: TEMPLATE_1.colors,
});

const t1blocks = reassignIds(buildSidebarClassic(base), 'tpl1');
fs.writeFileSync(path.join(OUT_DIR, '1.json'), JSON.stringify({ id: '1', ...TEMPLATE_1, blocks: t1blocks }, null, 2));

for (const tpl of STYLE_TEMPLATES) {
  index.push({
    id: tpl.id,
    name: tpl.name,
    description: tpl.description,
    preview: `/templates/${tpl.id}.svg`,
    colors: tpl.colors,
  });
  const blocks = reassignIds(tpl.build(base), `tpl${tpl.id}`);
  fs.writeFileSync(path.join(OUT_DIR, `${tpl.id}.json`), JSON.stringify({ id: tpl.id, name: tpl.name, description: tpl.description, blocks }, null, 2));
}

fs.writeFileSync(path.join(OUT_DIR, 'index.json'), JSON.stringify(index, null, 2));
console.log('Generated', index.length, 'templates in', OUT_DIR);
