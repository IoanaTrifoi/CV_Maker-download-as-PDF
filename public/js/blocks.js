const PALETTE_GROUPS = [
  {
    title: 'Text & conținut',
    items: [
      { type: 'paragraph', label: 'Text', icon: '📝', desc: 'Paragraf liber' },
      { type: 'heading', label: 'Titlu mare', icon: '🔤', desc: 'Titlu evidențiat' },
      { type: 'emoji-line', label: 'Emoji + text', icon: '😊', desc: 'Rând cu emoji' },
      { type: 'quote', label: 'Citat', icon: '💬', desc: 'Citat evidențiat' },
      { type: 'highlight', label: 'Evidențiere', icon: '🖍️', desc: 'Casetă colorată' },
      { type: 'callout', label: 'Notă', icon: '📌', desc: 'Mesaj important' },
      { type: 'timeline', label: 'Experiență', icon: '📅', desc: 'Dată + titlu + listă' },
      { type: 'skill-row', label: 'Rând skill', icon: '⚙️', desc: 'Etichetă + valoare' },
      { type: 'progress', label: 'Bară progres', icon: '📊', desc: 'Nivel competență' },
      { type: 'circle-progress', label: 'Cerc %', icon: '◎', desc: 'Competență circulară SVG' },
      { type: 'skill-dots', label: 'Puncte nivel', icon: '●', desc: 'Rating cu puncte (1-5)' },
      { type: 'link-row', label: 'Link', icon: '🔗', desc: 'Link portofolio' },
    ],
  },
  {
    title: 'Emoji & decor',
    items: [
      { type: 'emoji', label: 'Emoji', icon: '✨', desc: 'Emoji mare' },
      { type: 'badge', label: 'Badge', icon: '🏷️', desc: 'Etichetă colorată' },
      { type: 'icon-row', label: 'Icon + text', icon: '⭐', desc: 'Pictogramă + text' },
      { type: 'dots', label: 'Puncte', icon: '⚫', desc: 'Linie decorativă' },
      { type: 'divider', label: 'Linie', icon: '➖', desc: 'Separator' },
      { type: 'shape', label: 'Formă', icon: '⬛', desc: 'Dreptunghi / cerc' },
      { type: 'image', label: 'Imagine', icon: '🖼️', desc: 'Upload de pe PC' },
    ],
  },
  {
    title: 'Layout & grid',
    items: [
      { type: 'section', label: 'Secțiune', icon: '📁', desc: 'Secțiune cu titlu' },
      { type: 'container', label: 'Container', icon: '📦', desc: 'Cutie cu grid interior' },
      { type: 'columns', label: '2 coloane', icon: '▥', desc: 'Text în două coloane' },
      { type: 'spacer', label: 'Spațiu', icon: '↕️', desc: 'Spațiu gol' },
    ],
  },
];

const PALETTE = PALETTE_GROUPS.flatMap((g) => g.items);

const COLOR_PALETTE = [
  '#111827', '#1f2937', '#374151', '#4b5563', '#6b7280',
  '#2563eb', '#1d4ed8', '#3b82f6', '#7c3aed', '#9333ea',
  '#059669', '#10b981', '#14b8a6', '#0891b2', '#0ea5e9',
  '#dc2626', '#ef4444', '#f97316', '#d97706', '#eab308',
  '#ffffff', '#f9fafb', '#f3f4f6', '#e5e7eb', '#dbeafe',
  '#fef3c7', '#fee2e2', '#ecfdf5', '#f3e8ff', 'transparent',
];

const GRID_TYPES = [
  { value: '1', label: '1 coloană' },
  { value: '2', label: '2 coloane' },
  { value: '3', label: '3 coloane' },
  { value: '4', label: '4 coloane' },
  { value: 'sidebar-left', label: 'Sidebar stânga' },
  { value: 'sidebar-right', label: 'Sidebar dreapta' },
  { value: 'custom', label: 'Matrice personalizată' },
];

const SHADOW_TYPES = [
  { value: 'none', label: 'Fără umbră' },
  { value: 'sm', label: 'Umbră mică' },
  { value: 'md', label: 'Umbră medie' },
  { value: 'lg', label: 'Umbră mare' },
];

const EMOJI_LIST = [
  '😀', '😊', '🙂', '😎', '🤩', '🥳', '👍', '👏', '💪', '🙌',
  '❤️', '💙', '💚', '💛', '💜', '🧡', '✨', '⭐', '🌟', '🔥',
  '💡', '🎯', '🚀', '📌', '📎', '✅', '☑️', '✔️', '📁', '📂',
  '💼', '🎓', '🏆', '🥇', '🛠️', '💻', '📱', '🌐', '🔗', '📧',
  '📞', '📍', '🏠', '🌍', '🇩🇪', '🇷🇴', '🇬🇧', '⚡', '🎨', '🧠',
];

const SOCIAL_EMOJI_LIST = [
  { emoji: '💼', label: 'LinkedIn' },
  { emoji: '🐙', label: 'GitHub' },
  { emoji: '📘', label: 'Facebook' },
  { emoji: '📷', label: 'Instagram' },
  { emoji: '🐦', label: 'X / Twitter' },
  { emoji: '▶️', label: 'YouTube' },
  { emoji: '🎵', label: 'TikTok' },
  { emoji: '💬', label: 'WhatsApp' },
  { emoji: '✈️', label: 'Telegram' },
  { emoji: '📌', label: 'Pinterest' },
  { emoji: '🎮', label: 'Discord' },
  { emoji: '👤', label: 'Profil' },
  { emoji: '📧', label: 'Email' },
  { emoji: '✉️', label: 'Mail' },
  { emoji: '🔗', label: 'Link' },
  { emoji: '🌐', label: 'Website' },
  { emoji: '📞', label: 'Telefon' },
  { emoji: '📱', label: 'Mobil' },
  { emoji: '💻', label: 'Portfolio' },
  { emoji: '📣', label: 'Promo' },
];

const SECTION_ICONS = [
  'fa-user', 'fa-briefcase', 'fa-graduation-cap', 'fa-wrench',
  'fa-globe', 'fa-link', 'fa-star', 'fa-heart', 'fa-code',
  'fa-rocket', 'fa-lightbulb', 'fa-trophy', 'fa-palette',
];

const SHAPE_KINDS = [
  { value: 'rect', label: 'Dreptunghi' },
  { value: 'rounded', label: 'Rotunjit' },
  { value: 'pill', label: 'Pastilă' },
  { value: 'circle', label: 'Cerc' },
  { value: 'line', label: 'Linie groasă' },
];

const FONT_FAMILIES = [
  { value: '', label: 'Default (Inter)' },
  { value: 'Poppins', label: 'Poppins' },
  { value: 'Roboto', label: 'Roboto' },
  { value: 'Montserrat', label: 'Montserrat' },
  { value: 'Playfair Display', label: 'Playfair Display — Serif' },
  { value: 'Lato', label: 'Lato' },
  { value: 'Open Sans', label: 'Open Sans' },
  { value: 'Oswald', label: 'Oswald — Condensat' },
  { value: 'Raleway', label: 'Raleway — Elegant' },
  { value: 'Bebas Neue', label: 'Bebas Neue — Bold Art' },
  { value: 'Dancing Script', label: 'Dancing Script — Cursiv' },
  { value: 'Pacifico', label: 'Pacifico — Brush' },
  { value: 'Lobster', label: 'Lobster — Retro' },
  { value: 'Comic Neue', label: 'Comic Neue — Casual' },
  { value: 'Abril Fatface', label: 'Abril Fatface — Display' },
];

const TEXT_ALIGNS = [
  { value: '', label: 'Default' },
  { value: 'left', label: 'Stânga' },
  { value: 'center', label: 'Centru' },
  { value: 'right', label: 'Dreapta' },
];

const TEXT_TRANSFORMS = [
  { value: '', label: 'Normal' },
  { value: 'uppercase', label: 'MAJUSCULE' },
  { value: 'capitalize', label: 'Capitalize' },
  { value: 'lowercase', label: 'minuscule' },
];

const DROP_TYPES = new Set(['section', 'container']);

function uid(prefix = 'b') {
  return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}

function clone(data) {
  return JSON.parse(JSON.stringify(data));
}

function defaultLayout() {
  return { grid: '1', gridCols: 3, gridRows: 2, margin: 0, padding: 12, shadow: 'none', bgColor: 'transparent', borderColor: '#e5e7eb', boxWidth: 0, boxHeight: 0, fontFamily: '', textAlign: '', opacity: 100, borderRadius: 10 };
}

function createBlock(type) {
  switch (type) {
    case 'section':
      return { id: uid(), type, title: 'Secțiune nouă', icon: 'fa-star', titleColor: '#111827', layout: defaultLayout(), children: [] };
    case 'container':
      return { id: uid(), type, grid: '2', margin: 8, padding: 12, shadow: 'sm', bgColor: '#f9fafb', borderColor: '#e5e7eb', boxWidth: 0, boxHeight: 0, children: [] };
    case 'paragraph':
      return { id: uid(), type, text: 'Text nou. Click pentru a edita.', textColor: '#374151' };
    case 'heading':
      return { id: uid(), type, text: 'Titlu nou', textColor: '#111827' };
    case 'emoji':
      return { id: uid(), type, emoji: '✨', size: 'lg', align: 'left' };
    case 'emoji-line':
      return { id: uid(), type, emoji: '👍', text: 'Text cu emoji — click pentru editare', textColor: '#374151' };
    case 'badge':
      return { id: uid(), type, emoji: '🏷️', text: 'Badge nou', color: '#dbeafe', textColor: '#1e40af' };
    case 'quote':
      return { id: uid(), type, text: '„Un citat sau o idee importantă.”', author: '', textColor: '#374151' };
    case 'highlight':
      return { id: uid(), type, text: 'Text evidențiat', color: '#fef3c7', borderColor: '#f59e0b', textColor: '#1f2937' };
    case 'callout':
      return { id: uid(), type, emoji: '💡', title: 'Notă', text: 'Mesaj important pentru cititor.', textColor: '#374151' };
    case 'icon-row':
      return { id: uid(), type, icon: 'fa-star', text: 'Element cu pictogramă', color: '#2563eb' };
    case 'dots':
      return { id: uid(), type, count: 5, color: '#93c5fd', size: 'md' };
    case 'columns':
      return { id: uid(), type, left: 'Coloana stânga', right: 'Coloana dreapta' };
    case 'progress':
      return { id: uid(), type, label: 'Competență', value: 80, color: '#2563eb' };
    case 'timeline':
      return { id: uid(), type, period: '2024 – prezent', heading: 'Funcție / Studii', subtitle: 'Companie | Locație', items: ['Descriere activitate...'] };
    case 'skill-row':
      return { id: uid(), type, label: 'Categorie:', value: 'Valoare' };
    case 'link-row':
      return { id: uid(), type, url: 'https://example.com', label: 'site.ro', description: 'Descriere proiect' };
    case 'divider':
      return { id: uid(), type, style: 'solid' };
    case 'spacer':
      return { id: uid(), type, size: 'md' };
    case 'shape':
      return { id: uid(), type, color: '#dbeafe', borderColor: '#93c5fd', height: 48, width: 100, scale: 100, shapeKind: 'rounded', border: false };
    case 'image':
      return { id: uid(), type, src: 'alexandra_profil.jpg', alt: 'Fotografie', width: 128, height: 176, objectFit: 'cover' };
    case 'circle-progress':
      return { id: uid(), type, label: 'Competență', value: 80, color: '#3b82f6', size: 80 };
    case 'skill-dots':
      return { id: uid(), type, label: 'Abilitate', value: 4, max: 5, color: '#3b82f6', dotSize: 'md' };
    default:
      return { id: uid(), type: 'paragraph', text: 'Element nou', textColor: '#374151' };
  }
}

function esc(text = '') {
  return String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function fileUrl(filename, forExport = false) {
  if (!filename) return '';
  if (/^https?:\/\//i.test(filename)) return filename;
  if (forExport) return '../uploads/' + encodeURI(filename);
  return `/files/${encodeURIComponent(filename)}`;
}

function imageFrameStyle(width, height) {
  const w = Math.max(24, Number(width) || 128);
  const h = Math.max(24, Number(height) || 176);
  return `width:${w}px;height:${h}px;position:relative;overflow:hidden;flex-shrink:0;`;
}

function imageFillStyle(objectFit = 'cover') {
  return `width:100%;height:100%;object-fit:${objectFit};object-position:top center;display:block;`;
}

function normalizeBlock(block) {
  if (!block || typeof block !== 'object') return block;

  if (block.type === 'image') {
    if (!block.width || block.width <= 0) block.width = 128;
    if (!block.height || block.height <= 0) {
      block.height = block.scale ? Math.round(block.width * Number(block.scale) / 100) : 176;
    }
    delete block.scale;
    if (!block.objectFit) block.objectFit = 'cover';
  }

  if (block.type === 'header') {
    block.photo = block.photo || { width: 128, height: 176 };
    if (!block.nameColor) block.nameColor = '#111827';
    if (!block.titleColor) block.titleColor = '#1d4ed8';
    if (!block.contactColor) block.contactColor = '#4b5563';
    if (!block.iconColor) block.iconColor = '#9ca3af';
    if (!block.borderColor) block.borderColor = '#e5e7eb';
    if (!block.bgColor) block.bgColor = 'transparent';
    if (!block.nameTransform) block.nameTransform = 'uppercase';
    const pw = Number(block.photo.width) || 128;
    const ph = Number(block.photo.height) || 176;
    if (pw > 320 || ph > 400 || pw / Math.max(ph, 1) > 2.5 || ph / Math.max(pw, 1) > 2.5) {
      block.photo.width = 128;
      block.photo.height = 176;
    }
  }

  if (block.children) block.children = block.children.map(normalizeBlock);
  return block;
}

function normalizeBlocks(blocks) {
  return (blocks || []).map(normalizeBlock);
}

function emojiSize(size = 'md') {
  return ({ sm: '1.1rem', md: '1.6rem', lg: '2.2rem', xl: '3rem' })[size] || '1.6rem';
}

function shadowCss(shadow = 'none') {
  return ({ none: 'none', sm: '0 1px 4px rgba(0,0,0,.08)', md: '0 4px 14px rgba(0,0,0,.12)', lg: '0 10px 28px rgba(0,0,0,.16)' })[shadow] || 'none';
}

function layoutBoxStyle(block, forExport = false) {
  const layout = block.layout || block;
  const margin = Number(layout.margin ?? 0);
  const padding = Number(layout.padding ?? 12);
  const bg = layout.bgColor && layout.bgColor !== 'transparent' ? layout.bgColor : null;
  const bw = Number(layout.boxWidth ?? 0);
  const bh = Number(layout.boxHeight ?? 0);
  const borderRadius = layout.borderRadius !== undefined ? Number(layout.borderRadius) : 10;
  let style = 'box-sizing:border-box;';
  if (margin > 0) style += `margin:${margin}px;`;
  style += `padding:${padding}px;border-radius:${borderRadius}px;`;
  if (bg) style += `background:${bg};`;
  if (layout.borderColor && layout.borderColor !== 'transparent') {
    style += `border:1px solid ${layout.borderColor};`;
  }
  const sh = shadowCss(layout.shadow);
  if (sh !== 'none') style += `box-shadow:${sh};`;
  if (bw > 0) style += `width:${bw}px;max-width:100%;`;
  // La export PDF nu aplicăm min-height — lasăm conținutul să dicteze înălțimea
  if (bh > 0 && !forExport) style += `min-height:${bh}px;`;
  if (layout.fontFamily) style += `font-family:'${layout.fontFamily}',sans-serif;`;
  if (layout.textAlign) style += `text-align:${layout.textAlign};`;
  if ((layout.opacity ?? 100) < 100) style += `opacity:${(layout.opacity ?? 100) / 100};`;
  return style;
}

function itemBoxStyle(box = {}) {
  let style = 'box-sizing:border-box;';
  const w = Number(box.width ?? 0);
  const h = Number(box.height ?? 0);
  const m = Number(box.margin ?? 0);
  if (w > 0) style += `width:${w}px;max-width:100%;`;
  if (h > 0) style += `height:${h}px;overflow:hidden;`;
  if (m > 0) style += `margin:${m}px;`;
  return style;
}

function boxStyleFromDims(width, height) {
  let style = '';
  if (width > 0) style += `width:${width}px;max-width:100%;`;
  if (height > 0) style += `height:${height}px;overflow:hidden;`;
  return style;
}

function imageStyle(block) {
  const w = Math.max(1, Number(block.width ?? 128));
  const h = Math.max(1, Number(block.height ?? 176));
  const fit = block.objectFit || 'cover';
  return `width:${w}px;height:${h}px;min-width:${w}px;min-height:${h}px;max-width:${w}px;max-height:${h}px;object-fit:${fit};object-position:top center;display:block;`;
}

function getDimRef(block) {
  if (block.type === 'section') {
    block.layout = block.layout || defaultLayout();
    return { store: block.layout, w: 'boxWidth', h: 'boxHeight' };
  }
  if (block.type === 'container') {
    return { store: block, w: 'boxWidth', h: 'boxHeight' };
  }
  if (block.type === 'image') {
    return { store: block, w: 'width', h: 'height' };
  }
  if (block.type === 'header') {
    block.photo = block.photo || { width: 128, height: 176 };
    return { store: block.photo, w: 'width', h: 'height' };
  }
  block.box = block.box || { width: 0, height: 0 };
  return { store: block.box, w: 'width', h: 'height' };
}

function getDims(block) {
  const ref = getDimRef(block);
  return { width: Number(ref.store[ref.w] || 0), height: Number(ref.store[ref.h] || 0) };
}

function gridWrapClass(grid = '1', layout = {}) {
  if (grid === 'custom') return 'cv-grid-custom';
  const map = {
    '1': 'block',
    '2': 'grid grid-cols-1 sm:grid-cols-2 gap-4',
    '3': 'grid grid-cols-1 sm:grid-cols-3 gap-4',
    '4': 'grid grid-cols-2 sm:grid-cols-4 gap-3',
    'sidebar-left': 'cv-sidebar-l',
    'sidebar-right': 'cv-sidebar-r',
  };
  return map[grid] || map['1'];
}

function gridCustomStyle(layout = {}) {
  const cols = Math.max(1, Number(layout.gridCols || 3));
  return `display:grid;grid-template-columns:repeat(${cols},1fr);gap:8px;`;
}

function shapeStyle(block) {
  const w = Number(block.width ?? 100);
  const h = Number(block.height ?? 48);
  const scale = Number(block.scale ?? 100) / 100;
  const color = block.color || '#dbeafe';
  const border = block.border ? `2px solid ${block.borderColor || '#93c5fd'}` : 'none';
  const kind = block.shapeKind || 'rounded';
  let radius = kind === 'rounded' ? '10px' : kind === 'pill' ? '999px' : kind === 'circle' ? '50%' : '0';
  if (kind === 'line') return `width:${w}%;height:${Math.max(3, Math.round(h / 6))}px;background:${color};border-radius:999px;transform:scale(${scale});transform-origin:left center;`;
  if (kind === 'circle') return `width:${h}px;height:${h}px;background:${color};border:${border};border-radius:50%;transform:scale(${scale});transform-origin:left center;`;
  return `width:${w}%;height:${h}px;background:${color};border:${border};border-radius:${radius};transform:scale(${scale});transform-origin:left center;`;
}

function renderContact(contact, headerBlock = null) {
  const iconClass = contact.brand ? 'fa-brands' : 'fa-solid';
  const iconColor = headerBlock?.iconColor || '#9ca3af';
  const inner = contact.href ? `<a href="${esc(contact.href)}" class="link-hover">${esc(contact.text)}</a>` : `<span>${esc(contact.text)}</span>`;
  return `<div class="flex items-center gap-3"><i class="${iconClass} ${contact.icon} w-4 text-center" style="color:${iconColor};"></i>${inner}</div>`;
}

function renderTimeline(block, last = false) {
  const mb = last ? '' : ' mb-6';
  const items = (block.items || []).filter(Boolean);
  const subtitleHtml = block.subtitle
    ? `<div class="text-gray-600 text-sm mb-2">${esc(block.subtitle)}</div>`
    : '';
  const listHtml = items.length
    ? `<ul class="cv-timeline-list list-disc list-outside ml-4 space-y-1 text-gray-700 text-sm">${items.map((i) => `<li>${i}</li>`).join('')}</ul>`
    : '';
  return `<div class="grid grid-cols-1 sm:grid-cols-4 gap-4${mb} cv-item cv-timeline-entry"><div class="sm:col-span-1 text-gray-600 font-semibold">${esc(block.period)}</div><div class="sm:col-span-3"><h4 class="font-bold text-gray-900">${esc(block.heading)}</h4>${subtitleHtml}${listHtml}</div></div>`;
}

function renderChildrenContent(children) {
  const links = children.filter((c) => c.type === 'link-row');
  const others = children.filter((c) => c.type !== 'link-row');
  let inner = others.map((c, i) => renderChild(c, i, others)).join('\n');
  if (links.length) inner += `<ul class="space-y-3 text-sm">${links.map((c, i) => renderChild(c, i, links)).join('')}</ul>`;
  const skills = others.filter((c) => c.type === 'skill-row');
  if (skills.length && skills.length === others.length) {
    inner = `<div class="space-y-2 text-sm text-gray-700">${skills.map((c, i) => {
      const top = i === 0 ? '' : ' border-t border-gray-100 pt-2';
      return `<div class="grid grid-cols-1 sm:grid-cols-4 gap-2${top} cv-item"><div class="font-semibold text-gray-900">${esc(c.label)}</div><div class="sm:col-span-3">${esc(c.value)}</div></div>`;
    }).join('')}</div>`;
  }
  return inner;
}

function renderChild(block, index, siblings) {
  let html = renderChildInner(block, index, siblings);
  const box = block.box || {};
  const hasBox = Number(box.width) > 0 || Number(box.height) > 0 || Number(box.margin) > 0;
  if (hasBox && !CVBlocks.isDropParent(block.type) && block.type !== 'image') {
    html = `<div class="cv-item" style="${itemBoxStyle(box)}">${html}</div>`;
  }
  return html;
}

function renderChildInner(block, index, siblings) {
  const tc = block.textColor ? `color:${block.textColor};` : '';
  switch (block.type) {
    case 'header':
      return renderHeader(block);
    case 'section':
      return renderSection(block);
    case 'container':
      return renderContainer(block);
    case 'paragraph': {
      const lh = block.lineHeight ? `line-height:${block.lineHeight};` : '';
      return `<p class="text-gray-700 leading-relaxed text-justify cv-item" style="${tc}${lh}">${esc(block.text)}</p>`;
    }
    case 'heading': {
      const ls = block.letterSpacing ? `letter-spacing:${block.letterSpacing}px;` : '';
      const tt = block.textTransform ? `text-transform:${block.textTransform};` : '';
      return `<h4 class="font-bold text-lg cv-item" style="${tc || 'color:#111827'}${ls}${tt}">${esc(block.text)}</h4>`;
    }
    case 'emoji':
      return `<div class="cv-item" style="text-align:${block.align || 'left'};font-size:${emojiSize(block.size)};line-height:1;">${block.emoji || '✨'}</div>`;
    case 'emoji-line':
      return `<p class="text-sm cv-item flex items-center gap-2" style="${tc}"><span style="font-size:1.2rem">${block.emoji || '😊'}</span><span>${esc(block.text)}</span></p>`;
    case 'badge':
      return `<div class="cv-item"><span style="display:inline-flex;align-items:center;gap:6px;background:${block.color || '#dbeafe'};color:${block.textColor || '#1e40af'};padding:4px 10px;border-radius:999px;font-size:0.8rem;font-weight:600;">${block.emoji || ''} ${esc(block.text)}</span></div>`;
    case 'quote':
      return `<blockquote class="cv-item border-l-4 border-blue-500 pl-4 italic text-sm" style="${tc}">${esc(block.text)}${block.author ? `<div class="not-italic text-gray-500 mt-1">— ${esc(block.author)}</div>` : ''}</blockquote>`;
    case 'highlight':
      return `<div class="cv-item rounded-lg px-4 py-3 text-sm" style="background:${block.color || '#fef3c7'};border-left:4px solid ${block.borderColor || '#f59e0b'};${tc}">${esc(block.text)}</div>`;
    case 'callout':
      return `<div class="cv-item rounded-lg border border-blue-100 bg-blue-50 px-4 py-3"><div class="font-semibold text-blue-900 text-sm mb-1">${block.emoji || '💡'} ${esc(block.title)}</div><div class="text-sm" style="${tc}">${esc(block.text)}</div></div>`;
    case 'icon-row':
      return `<div class="cv-item flex items-center gap-2 text-sm" style="${tc}"><i class="fa-solid ${block.icon || 'fa-star'}" style="color:${block.color || '#2563eb'}"></i><span>${esc(block.text)}</span></div>`;
    case 'dots':
      return `<div class="cv-item flex gap-2 items-center">${Array.from({ length: Number(block.count || 5) }).map(() => `<span style="width:${block.size === 'sm' ? 6 : block.size === 'lg' ? 12 : 8}px;height:${block.size === 'sm' ? 6 : block.size === 'lg' ? 12 : 8}px;border-radius:50%;background:${block.color || '#93c5fd'};display:inline-block"></span>`).join('')}</div>`;
    case 'columns':
      return `<div class="cv-item grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-gray-700"><div>${esc(block.left)}</div><div>${esc(block.right)}</div></div>`;
    case 'progress':
      return `<div class="cv-item"><div class="flex justify-between text-sm mb-1"><span class="font-semibold text-gray-900">${esc(block.label)}</span><span class="text-gray-500">${Number(block.value || 0)}%</span></div><div class="h-2 rounded-full bg-gray-200 overflow-hidden"><div class="h-full rounded-full" style="width:${Math.min(100, Math.max(0, Number(block.value || 0)))}%;background:${block.color || '#2563eb'}"></div></div></div>`;
    case 'timeline':
      return renderTimeline(block, index === siblings.length - 1);
    case 'skill-row':
      return `<div class="grid grid-cols-1 sm:grid-cols-4 gap-2 border-t border-gray-100 pt-2 cv-item"><div class="font-semibold text-gray-900">${esc(block.label)}</div><div class="sm:col-span-3">${esc(block.value)}</div></div>`;
    case 'link-row':
      return `<li class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 cv-item"><a href="${esc(block.url)}" target="_blank" class="font-semibold text-blue-700 link-hover min-w-[200px]"><i class="fa-solid fa-arrow-up-right-from-square text-xs mr-1"></i> ${esc(block.label)}</a><span class="text-gray-600">- ${esc(block.description)}</span></li>`;
    case 'divider':
      return block.style === 'dashed' ? '<hr class="border-dashed border-gray-300 my-4 cv-item">' : block.style === 'dots' ? '<div class="cv-item text-center text-gray-300 tracking-[0.5em] my-3">• • •</div>' : '<hr class="border-gray-200 my-4 cv-item">';
    case 'spacer':
      return `<div class="cv-item" style="height:${block.size === 'sm' ? '12px' : block.size === 'lg' ? '36px' : '24px'}"></div>`;
    case 'shape':
      return `<div class="cv-item"><div style="${shapeStyle(block)}"></div></div>`;
    case 'image':
      return `<img src="${fileUrl(block.src, true)}" alt="${esc(block.alt || '')}" class="rounded shadow-sm border border-gray-200 cv-item" style="${imageStyle(block)}">`;
    case 'circle-progress':
      return renderCircleProgress(block);
    case 'skill-dots':
      return renderSkillDots(block);
    default:
      return '';
  }
}

function renderCustomGridChildren(children, cols) {
  const cells = children.map((c) => `<div class="cv-grid-cell">${renderChildInner(c, 0, [c])}</div>`);
  return cells.join('');
}

function renderContainer(block) {
  const grid = block.grid || '1';
  if (grid === 'custom') {
    const cols = Math.max(1, Number(block.gridCols || 3));
    const inner = renderCustomGridChildren(block.children || [], cols);
    const gridStyle = `display:grid;grid-template-columns:repeat(${cols},1fr);gap:8px;`;
    return `<div class="cv-section" style="${layoutBoxStyle(block, true)}"><div class="cv-grid-custom" style="${gridStyle}">${inner}</div></div>`;
  }
  const inner = renderChildrenContent(block.children || []);
  return `<div class="cv-section" style="${layoutBoxStyle(block, true)}"><div class="${gridWrapClass(grid)}">${inner}</div></div>`;
}

function renderSection(block) {
  const layout = block.layout || defaultLayout();
  const grid = layout.grid || '1';
  const titleColor = block.titleColor || '#111827';
  const titleHtml = `<h3 class="cv-section-title text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style="color:${titleColor}"><i class="fa-solid ${block.icon || 'fa-star'} text-blue-700"></i> ${esc(block.title)}</h3>`;
  if (grid === 'custom') {
    const cols = Math.max(1, Number(layout.gridCols || 3));
    const inner = renderCustomGridChildren(block.children || [], cols);
    const gridStyle = `display:grid;grid-template-columns:repeat(${cols},1fr);gap:8px;`;
    return `<section class="cv-section" style="${layoutBoxStyle({ layout }, true)}">${titleHtml}<div class="cv-grid-custom" style="${gridStyle}">${inner}</div></section>`;
  }
  const inner = renderChildrenContent(block.children || []);
  return `<section class="cv-section" style="${layoutBoxStyle({ layout }, true)}">${titleHtml}<div class="${gridWrapClass(grid)}">${inner}</div></section>`;
}

function renderCircleProgress(block) {
  const pct = Math.min(100, Math.max(0, Number(block.value || 0)));
  const sz = Number(block.size || 80);
  const r = (sz - 10) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  const col = block.color || '#3b82f6';
  return `<div class="cv-item" style="display:inline-flex;flex-direction:column;align-items:center;gap:4px;">
    <svg width="${sz}" height="${sz}" viewBox="0 0 ${sz} ${sz}">
      <circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="#e5e7eb" stroke-width="6"/>
      <circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="${col}" stroke-width="6"
        stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"
        stroke-linecap="round" transform="rotate(-90 ${sz/2} ${sz/2})"/>
      <text x="${sz/2}" y="${sz/2}" text-anchor="middle" dominant-baseline="central"
        font-size="${Math.round(sz * 0.18)}px" font-weight="700" fill="${col}">${pct}%</text>
    </svg>
    <span style="font-size:0.72rem;font-weight:600;text-align:center;color:#6b7280;max-width:${sz + 16}px;">${esc(block.label)}</span>
  </div>`;
}

function renderSkillDots(block) {
  const maxDots = Math.max(1, Number(block.max || 5));
  const val = Math.min(maxDots, Math.max(0, Number(block.value || 0)));
  const col = block.color || '#3b82f6';
  const sz = block.dotSize === 'sm' ? 8 : block.dotSize === 'lg' ? 14 : 11;
  const dots = Array.from({ length: maxDots }).map((_, i) =>
    i < val
      ? `<span style="width:${sz}px;height:${sz}px;border-radius:50%;background:${col};display:inline-block;flex-shrink:0;"></span>`
      : `<span style="width:${sz}px;height:${sz}px;border-radius:50%;border:2px solid ${col};display:inline-block;opacity:0.3;flex-shrink:0;"></span>`
  ).join('');
  return `<div class="cv-item" style="display:flex;align-items:center;gap:8px;font-size:0.85rem;">
    <span style="min-width:90px;font-weight:500;color:#374151;">${esc(block.label)}</span>
    <span style="display:flex;gap:3px;align-items:center;">${dots}</span>
  </div>`;
}

function renderHeader(block) {
  const contacts = (block.contacts || []).map((c) => renderContact(c, block)).join('\n');
  block.photo = block.photo || { width: 128, height: 176 };
  const photoStyle = imageStyle({ width: block.photo.width, height: block.photo.height, objectFit: 'cover' });
  const nameColor = block.nameColor || '#111827';
  const titleColor = block.titleColor || '#1d4ed8';
  const contactColor = block.contactColor || '#4b5563';
  const borderColor = block.borderColor || '#e5e7eb';
  const bgColor = block.bgColor && block.bgColor !== 'transparent' ? `background:${block.bgColor};` : '';
  const nameTransform = block.nameTransform ? `text-transform:${block.nameTransform};` : '';
  const titleTransform = block.titleTransform ? `text-transform:${block.titleTransform};` : '';
  const imgHtml = block.image
    ? `<img src="${fileUrl(block.image, true)}" alt="${esc(block.name)}" class="shrink-0 ml-0 sm:ml-8 rounded shadow-sm border border-gray-200" style="${photoStyle}">`
    : '';
  return `<header class="cv-header flex flex-col-reverse sm:flex-row justify-between items-start pb-6 mb-6 cv-item" style="border-bottom:2px solid ${borderColor};${bgColor}"><div class="flex-1 mt-4 sm:mt-0"><h1 class="text-4xl font-bold tracking-tight" style="color:${nameColor};${nameTransform}">${esc(block.name)}</h1><h2 class="text-xl font-medium mt-2" style="color:${titleColor};${titleTransform}">${esc(block.title)}</h2><div class="mt-4 space-y-1 text-sm" style="color:${contactColor}">${contacts}</div></div>${imgHtml}</header>`;
}

function defaultPage() {
  return { marginTop: 10, marginRight: 12, marginBottom: 10, marginLeft: 12 };
}

function blocksToHtml(blocks, page = defaultPage()) {
  const mt = Number(page.marginTop ?? 10);
  const mr = Number(page.marginRight ?? 12);
  const mb = Number(page.marginBottom ?? 10);
  const ml = Number(page.marginLeft ?? 12);
  const body = blocks.map((block) => {
    if (block.type === 'header') return renderHeader(block);
    if (block.type === 'section') return renderSection(block);
    if (block.type === 'container') return renderContainer(block);
    return renderChild(block, 0, [block]);
  }).join('\n');

  return `<!DOCTYPE html>
<html lang="de">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Curriculum Vitae</title>
    <script src="https://cdn.tailwindcss.com"><\/script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    <style>
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Oswald:wght@400;700&family=Raleway:wght@400;700&family=Bebas+Neue&family=Dancing+Script:wght@400;700&family=Pacifico&family=Lobster&family=Comic+Neue:wght@400;700&family=Abril+Fatface&family=Poppins:wght@400;600;700&family=Montserrat:wght@400;600;700&family=Playfair+Display:wght@400;700&display=swap');
        body { font-family: 'Inter', sans-serif; background-color: #f3f4f6; color: #1f2937; }
        @media print {
            @page { size: A4; margin: ${mt}mm ${mr}mm ${mb}mm ${ml}mm; }
            html { font-size: 72%; }
            body { background-color: white; padding: 0 !important; }
            .a4-container { box-shadow: none !important; margin: 0 !important; padding: 0 !important; width: 100% !important; max-width: 100% !important; min-height: auto !important; }
            /* Secțiunile și containerele mari SE POT rupe între pagini */
            .cv-section { break-inside: auto !important; page-break-inside: auto !important; min-height: 0 !important; margin-bottom: 0.75rem !important; }
            /* Titlul secțiunii rămâne lipit de primul element de conținut */
            .cv-section-title { break-after: avoid; page-break-after: avoid; margin-bottom: 0.5rem !important; }
            /* Elementele atomice mici rămân întregi pe o pagină */
            .cv-item { page-break-inside: avoid; break-inside: avoid; }
            /* Header compact în print */
            .cv-header { padding-bottom: 0.75rem !important; margin-bottom: 0.75rem !important; }
            /* Spațiu timeline mai compact */
            .cv-timeline-entry { margin-bottom: 0.5rem !important; }
        }
        .link-hover:hover { color: #2563eb; text-decoration: underline; }
        .cv-timeline-list { list-style-type: disc; list-style-position: outside; padding-left: 1.25rem; margin: 0.25rem 0 0 0.25rem; }
        .cv-timeline-list li { display: list-item; margin-bottom: 0.2rem; }
        .cv-grid-cell { border: 1px solid #e5e7eb; border-radius: 6px; padding: 8px; background: #fafafa; min-height: 48px; }
        .cv-grid-custom { gap: 8px; }
        .cv-sidebar-l { display: grid; grid-template-columns: 1fr 2fr; gap: 0; align-items: start; }
        .cv-sidebar-r { display: grid; grid-template-columns: 2fr 1fr; gap: 0; align-items: start; }
        .grid { display: grid; }
        .grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        .grid-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
        .grid-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
        .gap-3 { gap: 0.75rem; }
        .gap-4 { gap: 1rem; }
        .col-span-1 { grid-column: span 1 / span 1; }
        .col-span-2 { grid-column: span 2 / span 2; }
        .col-span-3 { grid-column: span 3 / span 3; }
    </style>
</head>
<body class="py-10 print:py-0">
    <div class="a4-container max-w-[210mm] mx-auto bg-white shadow-xl min-h-[297mm] p-12 sm:p-16">
${body}
    </div>
</body>
</html>`;
}

function findBlock(blocks, id, parent = null) {
  for (let i = 0; i < blocks.length; i++) {
    const block = blocks[i];
    if (block.id === id) return { block, parent, index: i, list: blocks };
    if (block.children) {
      const found = findBlock(block.children, id, block);
      if (found) return found;
    }
  }
  return null;
}

function removeBlock(blocks, id) {
  const found = findBlock(blocks, id);
  if (!found) return false;
  found.list.splice(found.index, 1);
  return true;
}

function reassignIds(blocks, prefix = 'b') {
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

function cloneBlocks(blocks) {
  return reassignIds(JSON.parse(JSON.stringify(blocks)));
}

function isDropParent(type) {
  return DROP_TYPES.has(type);
}

window.CVBlocks = {
  PALETTE_GROUPS, PALETTE, COLOR_PALETTE, GRID_TYPES, SHADOW_TYPES,
  FONT_FAMILIES, TEXT_ALIGNS, TEXT_TRANSFORMS,
  EMOJI_LIST, SOCIAL_EMOJI_LIST, SECTION_ICONS, SHAPE_KINDS, DROP_TYPES,
  uid, clone, createBlock, blocksToHtml, defaultPage, findBlock, removeBlock, reassignIds, cloneBlocks,
  shapeStyle, emojiSize, fileUrl, defaultLayout, isDropParent, layoutBoxStyle, itemBoxStyle, shadowCss,
  getDimRef, getDims, boxStyleFromDims, imageStyle, imageFrameStyle, imageFillStyle,
  normalizeBlock, normalizeBlocks,
};
