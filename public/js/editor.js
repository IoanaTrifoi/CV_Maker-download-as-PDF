/* ═══════════════════════════════════════════════════════════════
   CV Builder — editor.js  (Paint 2005 edition)
   ═══════════════════════════════════════════════════════════════ */

// ── State ──────────────────────────────────────────────────────
const state = {
  blocks: [],
  selectedId: null,
  templates: [],
  activeTemplateId: null,
  page: CVBlocks.defaultPage(),
};

// Undo/redo history
const history = [];
let historyIndex = -1;
const HISTORY_MAX = 50;

// DOM refs
const canvas = document.getElementById('canvas');
const propsPanel = document.getElementById('propsPanel');
const statusLeftEl = document.getElementById('statusLeft');
const statusMidEl = document.getElementById('statusMid');
const colorbarPalette = document.getElementById('colorbarPalette');
const colorSwatchFg = document.getElementById('colorSwatchFg');
const colorSwatchBg = document.getElementById('colorSwatchBg');
const colorbarInfo = document.getElementById('colorbarInfo');
let sortables = [];

// Active color mode for palette bar ('fg' = text, 'bg' = background)
let colorMode = 'fg';
let activeFg = '#000080';
let activeBg = '#ffffff';

// ── Status helpers ─────────────────────────────────────────────
function setStatus(text, type = '') {
  if (statusLeftEl) {
    statusLeftEl.textContent = text;
    statusLeftEl.className = type ? `status ${type}` : '';
  }
  // Also update the old #status in menubar-right if it exists
  const legacyStatus = document.getElementById('status');
  if (legacyStatus && legacyStatus !== statusLeftEl) {
    legacyStatus.textContent = text;
    legacyStatus.className = 'status ' + type;
  }
}

function setMid(text) {
  if (statusMidEl) statusMidEl.textContent = text;
}

// ── History (undo/redo) ─────────────────────────────────────────
function pushHistory() {
  const snapshot = JSON.stringify({ blocks: state.blocks, page: state.page });
  if (historyIndex < history.length - 1) history.splice(historyIndex + 1);
  history.push(snapshot);
  if (history.length > HISTORY_MAX) history.shift();
  historyIndex = history.length - 1;
  updateUndoRedoBtns();
}

function undo() {
  if (historyIndex <= 0) return;
  historyIndex--;
  const snap = JSON.parse(history[historyIndex]);
  state.blocks = CVBlocks.normalizeBlocks(snap.blocks || []);
  state.page = snap.page || CVBlocks.defaultPage();
  state.selectedId = null;
  renderCanvas();
  renderProps();
  updateUndoRedoBtns();
  setStatus(t('status_undo'), '');
}

function redo() {
  if (historyIndex >= history.length - 1) return;
  historyIndex++;
  const snap = JSON.parse(history[historyIndex]);
  state.blocks = CVBlocks.normalizeBlocks(snap.blocks || []);
  state.page = snap.page || CVBlocks.defaultPage();
  state.selectedId = null;
  renderCanvas();
  renderProps();
  updateUndoRedoBtns();
  setStatus(t('status_redo'), '');
}

function updateUndoRedoBtns() {
  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;
  ['tbUndoBtn', 'undoBtn'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.disabled = !canUndo;
  });
  ['tbRedoBtn', 'redoBtn'].forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.disabled = !canRedo;
  });
}

// ── Block helpers ───────────────────────────────────────────────
function getSelected() {
  return state.selectedId ? CVBlocks.findBlock(state.blocks, state.selectedId) : null;
}

function selectBlock(id) {
  state.selectedId = id;
  renderCanvas();
  renderProps();
  const found = CVBlocks.findBlock(state.blocks, id);
  if (found) setMid(blockLabel(found.block));
}

function blockLabel(block) {
  const map = {
    header: t('bl_header'),
    section: `${t('bl_section')}: ${block.title || ''}`,
    container: t('bl_container'),
    paragraph: t('bl_paragraph'),
    heading: t('bl_heading'),
    emoji: t('bl_emoji_line'),
    'emoji-line': t('bl_emoji_line'),
    badge: t('bl_badge'),
    quote: t('bl_quote'),
    highlight: t('bl_highlight'),
    callout: t('bl_callout'),
    'icon-row': t('bl_icon_row'),
    dots: t('bl_skill_dots'),
    columns: t('bl_columns'),
    progress: block.label || t('bl_progress'),
    'circle-progress': block.label || t('bl_circle_progress'),
    'skill-dots': block.label || t('bl_skill_dots'),
    timeline: block.heading || t('bl_timeline'),
    'skill-row': block.label || t('bl_skill_row'),
    'link-row': block.label || t('bl_link_row'),
    divider: t('bl_divider'),
    spacer: t('bl_spacer'),
    shape: t('bl_shape'),
    image: t('bl_image'),
  };
  return map[block.type] || block.type;
}

// ── Resize handles ──────────────────────────────────────────────
function renderResizeHandles(id) {
  return `
    <div class="resize-handle resize-e" data-resize-id="${id}" data-axis="w" title="${t('resize_w')}">↔</div>
    <div class="resize-handle resize-s" data-resize-id="${id}" data-axis="h" title="${t('resize_h')}">↕</div>
    <div class="resize-handle resize-se" data-resize-id="${id}" data-axis="both" title="${t('resize_both')}">↘</div>`;
}

function frameStyleForBlock(block) {
  const { width, height } = CVBlocks.getDims(block);
  let style = CVBlocks.boxStyleFromDims(width, height);
  const m = Number(block.box?.margin ?? 0);
  if (m > 0) style += `margin:${m}px;`;
  return style;
}

// ── Drop zone render ────────────────────────────────────────────
function renderDropZone(block) {
  const layout = block.layout || block;
  const grid = layout.grid || block.grid || '1';
  const boxStyle = CVBlocks.layoutBoxStyle(block.layout ? { layout: block.layout } : block);
  const customGridStyle = grid === 'custom'
    ? `style="grid-template-columns:repeat(${Math.max(1, Number(block.gridCols || 3))},1fr);"`
    : '';
  return `
    <div class="drop-zone-wrap resizable-frame" style="${boxStyle}" data-drop-wrap-id="${block.id}">
      <div class="drop-zone grid-preview-${grid}" ${customGridStyle} data-drop-zone data-drop-id="${block.id}">
        ${(block.children || []).map((child) => renderCanvasBlock(child, true)).join('') || `<div class="drop-hint">${t('drop_hint')}</div>`}
      </div>
      ${renderResizeHandles(block.id)}
    </div>`;
}

// ── Block preview (canvas preview HTML) ────────────────────────
function renderBlockPreview(block) {
  if (block.type === 'header') {
    const photo = block.photo || { width: 128, height: 176 };
    const pw = photo.width || 128;
    const ph = photo.height || 176;
    const img = block.image
      ? `<div class="image-resize-frame rounded shadow-sm border border-gray-200" style="${CVBlocks.imageFrameStyle(pw, ph)}" data-image-frame-id="${block.id}">
          <img src="${CVBlocks.fileUrl(block.image)}" class="preview-photo-img" style="${CVBlocks.imageFillStyle('cover')}" alt="">
          ${renderResizeHandles(block.id)}
        </div>`
      : '<div class="preview-photo">📷</div>';
    return `<div class="preview-header"><div><div class="preview-name">${block.name || ''}</div><div class="preview-title">${block.title || ''}</div><div class="preview-contacts">${(block.contacts || []).slice(0, 3).map((c) => `<div>• ${c.text || ''}</div>`).join('')}</div></div>${img}</div>`;
  }
  if (block.type === 'section') {
    const layout = block.layout || CVBlocks.defaultLayout();
    const tc = block.titleColor || '#111827';
    const grid = layout.grid || '1';
    const frameStyle = CVBlocks.layoutBoxStyle({ layout });
    const customGridStyle = grid === 'custom'
      ? `style="grid-template-columns:repeat(${Math.max(1, Number(layout.gridCols || 3))},1fr);"`
      : '';
    return `
      <div class="preview-section-wrap drop-zone-wrap resizable-frame" style="${frameStyle}" data-drop-wrap-id="${block.id}">
        <div class="preview-section-title" style="color:${tc}"><i class="fa-solid ${block.icon || 'fa-circle'}"></i> ${block.title || ''}</div>
        <div class="drop-zone grid-preview-${grid}" ${customGridStyle} data-drop-zone data-drop-id="${block.id}">
          ${(block.children || []).map((child) => renderCanvasBlock(child, true)).join('') || `<div class="drop-hint">${t('drop_hint')}</div>`}
        </div>
        ${renderResizeHandles(block.id)}
      </div>`;
  }
  if (block.type === 'container') return renderDropZone(block);
  if (block.type === 'paragraph') return `<p class="preview-text" style="color:${block.textColor || '#374151'}">${block.text || ''}</p>`;
  if (block.type === 'heading') return `<h4 class="preview-heading" style="color:${block.textColor || '#111827'}">${block.text || ''}</h4>`;
  if (block.type === 'emoji') return `<div class="preview-emoji size-${block.size || 'lg'}" style="text-align:${block.align || 'left'}">${block.emoji || '✨'}</div>`;
  if (block.type === 'emoji-line') return `<p class="preview-text">${block.emoji || '😊'} ${block.text || ''}</p>`;
  if (block.type === 'badge') return `<span class="preview-badge" style="background:${block.color || '#dbeafe'};color:${block.textColor || '#1e3a8a'}">${block.emoji || ''} ${block.text || ''}</span>`;
  if (block.type === 'quote') return `<blockquote class="preview-quote">${block.text || ''}</blockquote>`;
  if (block.type === 'highlight') return `<div class="preview-highlight" style="background:${block.color || '#fffbeb'};border-color:${block.borderColor || '#f59e0b'}">${block.text || ''}</div>`;
  if (block.type === 'callout') return `<div class="preview-callout">${block.emoji || '💡'} <strong>${block.title || ''}</strong><div>${block.text || ''}</div></div>`;
  if (block.type === 'icon-row') return `<div class="preview-icon-row"><i class="fa-solid ${block.icon || 'fa-star'}" style="color:${block.color || '#3b82f6'}"></i> ${block.text || ''}</div>`;
  if (block.type === 'dots') return `<div class="preview-dots">${'●'.repeat(Math.min(Number(block.count) || 5, 8))}</div>`;
  if (block.type === 'columns') return `<div class="preview-columns"><div>${block.left || ''}</div><div>${block.right || ''}</div></div>`;
  if (block.type === 'progress') return `<div><div class="preview-progress-label"><span>${block.label || ''}</span><span>${block.value ?? 80}%</span></div><div class="preview-progress-bar"><span style="width:${block.value ?? 80}%;background:${block.color || '#3b82f6'}"></span></div></div>`;
  if (block.type === 'timeline') {
    const items = (block.items || []).filter(Boolean);
    const itemsHtml = items.length ? `<ul class="preview-timeline-list">${items.map((i) => `<li>${i.replace(/<[^>]+>/g, '')}</li>`).join('')}</ul>` : '';
    return `<div class="preview-timeline"><span class="preview-period">${block.period || ''}</span><div><strong>${block.heading || ''}</strong>${block.subtitle ? `<div class="muted">${block.subtitle}</div>` : ''}${itemsHtml}</div></div>`;
  }
  if (block.type === 'skill-row') return `<div class="preview-skill"><strong>${block.label || ''}</strong> ${block.value || ''}</div>`;
  if (block.type === 'link-row') return `<div class="preview-link">🔗 ${block.label || ''} — ${block.description || ''}</div>`;
  if (block.type === 'divider') return '<hr class="preview-divider">';
  if (block.type === 'spacer') return `<div class="preview-spacer size-${block.size || 'md'}"></div>`;
  if (block.type === 'shape') return `<div class="preview-shape"><div style="${CVBlocks.shapeStyle(block)}"></div></div>`;
  if (block.type === 'image') {
    const w = block.width || 128;
    const h = block.height || 176;
    const fit = block.objectFit || 'cover';
    const src = CVBlocks.fileUrl(block.src);
    return `<div class="preview-image-wrap">
      <div class="image-resize-frame" style="${CVBlocks.imageFrameStyle(w, h)}" data-image-frame-id="${block.id}">
        <img src="${src}" class="preview-image-thumb" style="${CVBlocks.imageFillStyle(fit)}" alt="${block.alt || ''}">
        ${renderResizeHandles(block.id)}
      </div>
      <div class="preview-image-meta">${w}×${h} px</div>
    </div>`;
  }
  if (block.type === 'circle-progress') {
    const pct = Math.min(100, Math.max(0, Number(block.value || 0)));
    const sz = Math.min(80, Number(block.size || 80));
    const r = (sz - 8) / 2;
    const circ = 2 * Math.PI * r;
    const offset = circ - (pct / 100) * circ;
    const col = block.color || '#3b82f6';
    return `<div style="display:inline-flex;flex-direction:column;align-items:center;gap:4px;">
      <svg width="${sz}" height="${sz}" viewBox="0 0 ${sz} ${sz}">
        <circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="#e5e7eb" stroke-width="5"/>
        <circle cx="${sz/2}" cy="${sz/2}" r="${r}" fill="none" stroke="${col}" stroke-width="5"
          stroke-dasharray="${circ.toFixed(2)}" stroke-dashoffset="${offset.toFixed(2)}"
          stroke-linecap="round" transform="rotate(-90 ${sz/2} ${sz/2})"/>
        <text x="${sz/2}" y="${sz/2}" text-anchor="middle" dominant-baseline="central"
          font-size="${Math.round(sz * 0.18)}px" font-weight="700" fill="${col}">${pct}%</text>
      </svg>
      <span style="font-size:0.65rem;font-weight:600;color:#6b7280;max-width:${sz+16}px;text-align:center;">${block.label || ''}</span>
    </div>`;
  }
  if (block.type === 'skill-dots') {
    const maxDots = Math.max(1, Number(block.max || 5));
    const val = Math.min(maxDots, Math.max(0, Number(block.value || 0)));
    const col = block.color || '#3b82f6';
    const sz = block.dotSize === 'sm' ? 7 : block.dotSize === 'lg' ? 12 : 10;
    const dots = Array.from({ length: maxDots }).map((_, i) =>
      `<span style="width:${sz}px;height:${sz}px;border-radius:50%;display:inline-block;${i < val ? `background:${col}` : `border:2px solid ${col};opacity:0.3`}"></span>`
    ).join('');
    return `<div style="display:flex;align-items:center;gap:6px;font-size:0.8rem;">
      <span style="min-width:70px;font-weight:500;color:#374151;">${block.label || ''}</span>
      <span style="display:flex;gap:3px;">${dots}</span>
    </div>`;
  }
  return '';
}

function renderCanvasBlock(block, nested = false) {
  const inner = renderBlockPreview(block);
  const isDrop = CVBlocks.isDropParent(block.type);
  const hasOwnImageFrame = block.type === 'image' || block.type === 'header';
  const body = isDrop || hasOwnImageFrame
    ? inner
    : `<div class="resizable-frame" style="${frameStyleForBlock(block)}" data-frame-id="${block.id}">${inner}${renderResizeHandles(block.id)}</div>`;

  return `
    <article class="canvas-block${state.selectedId === block.id ? ' selected' : ''}${nested ? ' nested' : ''}" data-id="${block.id}" data-type="${block.type}">
      <div class="block-toolbar">
        <span class="drag-handle" title="${t('drag_handle_title')}">⠿</span>
        <span class="block-type">${blockLabel(block)}</span>
        <button type="button" class="icon-btn delete-btn" data-delete="${block.id}" title="${t('delete_block')}">✕</button>
      </div>
      <div class="block-body">${body}</div>
    </article>`;
}

// ── Canvas render ───────────────────────────────────────────────
function renderCanvas() {
  canvas.innerHTML = state.blocks.map((b) => renderCanvasBlock(b)).join('');
  bindCanvasEvents();
  initSortables();
  setupResizeHandles();
  updateDropHint();
}

function updateDropHint() {
  const hint = document.getElementById('canvasDropHint');
  if (!hint) return;
  hint.style.display = state.blocks.length === 0 ? 'flex' : 'none';
}

function bindCanvasEvents() {
  canvas.querySelectorAll('.canvas-block').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      if (e.target.closest('.delete-btn') || e.target.closest('.drag-handle') || e.target.closest('.resize-handle')) return;
      selectBlock(el.dataset.id);
    });
  });

  canvas.querySelectorAll('.delete-btn').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      pushHistory();
      CVBlocks.removeBlock(state.blocks, btn.dataset.delete);
      if (state.selectedId === btn.dataset.delete) state.selectedId = null;
      renderCanvas();
      renderProps();
    });
  });
}

// ── Sortable (drag-to-reorder on canvas) ───────────────────────
function initSortables() {
  sortables.forEach((s) => s.destroy());
  sortables = [];

  sortables.push(Sortable.create(canvas, {
    group: { name: 'cv', pull: true, put: true },
    animation: 150,
    handle: '.drag-handle',
    draggable: ':scope > .canvas-block',
    filter: '.drop-hint',
    onEnd: () => { syncFromDom(); pushHistory(); },
  }));

  canvas.querySelectorAll('[data-drop-zone]').forEach((zone) => {
    sortables.push(Sortable.create(zone, {
      group: { name: 'cv', pull: true, put: true },
      animation: 150,
      handle: '.drag-handle',
      draggable: '.canvas-block.nested',
      onEnd: () => { syncFromDom(); pushHistory(); },
    }));
  });
}

function syncZoneChildren(zoneEl) {
  const children = [];
  zoneEl?.querySelectorAll(':scope > .canvas-block').forEach((childEl) => {
    const found = CVBlocks.findBlock(state.blocks, childEl.dataset.id);
    if (!found) return;
    const block = CVBlocks.clone(found.block);
    if (CVBlocks.isDropParent(block.type)) {
      const innerZone = childEl.querySelector(':scope > .block-body [data-drop-zone]');
      block.children = syncZoneChildren(innerZone);
    }
    children.push(block);
  });
  return children;
}

function syncFromDom() {
  const newBlocks = [];
  canvas.querySelectorAll(':scope > .canvas-block').forEach((el) => {
    const found = CVBlocks.findBlock(state.blocks, el.dataset.id);
    if (!found) return;
    const block = CVBlocks.clone(found.block);
    if (CVBlocks.isDropParent(block.type)) {
      const zone = el.querySelector(':scope > .block-body [data-drop-zone]');
      block.children = syncZoneChildren(zone);
    }
    newBlocks.push(block);
  });
  state.blocks = newBlocks;
}

// ── Drop zones (from toolbox / palette drag) ───────────────────
function insertBlockIntoParent(parentId, block) {
  const found = CVBlocks.findBlock(state.blocks, parentId);
  if (!found) return false;
  found.block.children = found.block.children || [];
  found.block.children.push(block);
  return true;
}

function addBlockToCanvas(type) {
  const block = CVBlocks.createBlock(type);
  let inserted = false;
  let parentLabel = '';
  if (state.selectedId) {
    const found = CVBlocks.findBlock(state.blocks, state.selectedId);
    if (found && CVBlocks.isDropParent(found.block.type)) {
      insertBlockIntoParent(state.selectedId, block);
      inserted = true;
      parentLabel = found.block.title || 'container';
    }
  }
  if (!inserted) state.blocks.push(block);
  state.selectedId = block.id;
  pushHistory();
  renderCanvas();
  renderProps();
  setStatus(inserted ? t('status_added_in', { name: blockLabel(block), parent: parentLabel }) : t('status_added', { name: blockLabel(block) }), 'ok');
  setTimeout(() => {
    const el = canvas.querySelector(`[data-id="${block.id}"]`);
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, 50);
}

function setupDropZones() {
  canvas.addEventListener('dragover', (e) => {
    if (e.dataTransfer.types.includes('text/block-type')) {
      e.preventDefault();
      const zone = e.target.closest('[data-drop-zone]');
      canvas.querySelectorAll('.drop-zone.drag-over').forEach((z) => z.classList.remove('drag-over'));
      if (zone) zone.classList.add('drag-over');
      else canvas.classList.add('drag-over');
    }
  });

  canvas.addEventListener('dragleave', (e) => {
    if (!canvas.contains(e.relatedTarget)) {
      canvas.classList.remove('drag-over');
      canvas.querySelectorAll('.drop-zone.drag-over').forEach((z) => z.classList.remove('drag-over'));
    }
  });

  canvas.addEventListener('drop', (e) => {
    e.preventDefault();
    canvas.classList.remove('drag-over');
    canvas.querySelectorAll('.drop-zone.drag-over').forEach((z) => z.classList.remove('drag-over'));

    const type = e.dataTransfer.getData('text/block-type');
    if (!type) return;

    const block = CVBlocks.createBlock(type);
    const zone = e.target.closest('[data-drop-zone]');

    if (zone) {
      e.stopPropagation();
      insertBlockIntoParent(zone.dataset.dropId, block);
    } else if (!e.target.closest('.canvas-block')) {
      state.blocks.push(block);
    } else {
      return;
    }

    state.selectedId = block.id;
    pushHistory();
    renderCanvas();
    renderProps();
  });
}

// ── Resize handles ──────────────────────────────────────────────
function setupResizeHandles() {
  canvas.querySelectorAll('[data-resize-id]').forEach((handle) => {
    handle.onmousedown = (e) => {
      e.stopPropagation();
      e.preventDefault();
      const id = handle.dataset.resizeId;
      const axis = handle.dataset.axis;
      const found = CVBlocks.findBlock(state.blocks, id);
      if (!found) return;

      const block = found.block;
      const ref = CVBlocks.getDimRef(block);
      const frame = canvas.querySelector(`[data-image-frame-id="${id}"], [data-frame-id="${id}"], [data-drop-wrap-id="${id}"]`);

      const startX = e.clientX;
      const startY = e.clientY;
      const origW = Number(ref.store[ref.w]) || frame?.offsetWidth || 128;
      const origH = Number(ref.store[ref.h]) || frame?.offsetHeight || 176;
      ref.store[ref.w] = origW;
      ref.store[ref.h] = origH;

      const onMove = (ev) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;
        if (axis === 'w' || axis === 'both') ref.store[ref.w] = Math.max(40, Math.round(origW + dx));
        if (axis === 'h' || axis === 'both') ref.store[ref.h] = Math.max(40, Math.round(origH + dy));
        if (frame) {
          frame.style.width = `${ref.store[ref.w]}px`;
          frame.style.height = `${ref.store[ref.h]}px`;
        }
        const meta = canvas.querySelector(`[data-id="${id}"] .preview-image-meta`);
        if (meta) meta.textContent = `${ref.store[ref.w]}×${ref.store[ref.h]} px`;
        updateDimLive(ref, block);
      };

      const onUp = () => {
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
        pushHistory();
        renderCanvas();
        renderProps();
      };

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    };
  });
}

function updateDimLive(ref, block) {
  let wKey = ref.w;
  let hKey = ref.h;
  if (block?.type === 'header') { wKey = 'photo.width'; hKey = 'photo.height'; }
  else if (block?.type === 'section') { wKey = 'layout.boxWidth'; hKey = 'layout.boxHeight'; }
  else if (block?.type === 'image') { wKey = 'width'; hKey = 'height'; }
  const wEl = propsPanel.querySelector(`[data-live="${wKey}"]`);
  const hEl = propsPanel.querySelector(`[data-live="${hKey}"]`);
  if (wEl) wEl.textContent = `${ref.store[ref.w]}px`;
  if (hEl) hEl.textContent = `${ref.store[ref.h]}px`;
}

// ── Props panel helpers ─────────────────────────────────────────
function field(label, key, value, multiline = false) {
  if (multiline) return `<label class="prop-field"><span>${label}</span><textarea data-key="${key}">${value || ''}</textarea></label>`;
  return `<label class="prop-field"><span>${label}</span><input data-key="${key}" value="${(value ?? '').toString().replace(/"/g, '&quot;')}"></label>`;
}

function slider(label, key, value, min, max, step = 1, unit = '') {
  return `<label class="prop-field"><span>${label}: <strong data-live="${key}">${value}${unit}</strong></span><input type="range" data-key="${key}" data-unit="${unit}" min="${min}" max="${max}" step="${step}" value="${value}"></label>`;
}

function colorPicker(label, key, current) {
  return `
    <div class="color-picker-wrap">
      <div class="prop-subtitle">${label}</div>
      <div class="color-grid">
        ${CVBlocks.COLOR_PALETTE.map((c) => {
          const bg = c === 'transparent' ? 'linear-gradient(45deg,#ccc 25%,transparent 25%,transparent 75%,#ccc 75%),linear-gradient(45deg,#ccc 25%,transparent 25%,transparent 75%,#ccc 75%)' : c;
          const style = c === 'transparent' ? `background:${bg};background-size:8px 8px;background-position:0 0,4px 4px;` : `background:${c};`;
          return `<button type="button" class="color-btn ${current === c ? 'active' : ''}" style="${style}" data-color-key="${key}" data-color="${c}" title="${c}"></button>`;
        }).join('')}
      </div>
      <input type="color" data-key="${key}" value="${current && current.startsWith('#') && current.length === 7 ? current : '#2563eb'}" class="color-input-native">
    </div>`;
}

function layoutFields(block, isSection = false) {
  const L = isSection ? (block.layout || CVBlocks.defaultLayout()) : block;
  const prefix = isSection ? 'layout.' : '';
  let html = `<label class="prop-field"><span>${t('lbl_grid_type')}</span><select data-key="${prefix}grid">${CVBlocks.GRID_TYPES.map((g) => `<option value="${g.value}" ${(L.grid || '1') === g.value ? 'selected' : ''}>${g.label}</option>`).join('')}</select></label>`;
  if ((L.grid || '1') === 'custom') {
    const cols = Number(L.gridCols ?? 3);
    const rows = Number(L.gridRows ?? 2);
    html += `
    <div class="grid-matrix-config">
      <div class="grid-matrix-row">
        <label class="grid-matrix-label">${t('lbl_cols')}<input type="number" class="grid-matrix-num" id="gmCols" min="1" max="12" value="${cols}"></label>
        <span class="grid-matrix-x">×</span>
        <label class="grid-matrix-label">${t('lbl_rows')}<input type="number" class="grid-matrix-num" id="gmRows" min="1" max="10" value="${rows}"></label>
        <button type="button" class="btn-apply-grid" id="applyGridBtn">${t('lbl_generate')}</button>
      </div>
      <div class="grid-matrix-preview" style="grid-template-columns:repeat(${cols},1fr);grid-template-rows:repeat(${rows},1fr);">
        ${Array.from({length: cols * rows}).map((_, i) => `<div class="grid-cell-preview">${i + 1}</div>`).join('')}
      </div>
    </div>`;
  }
  html += slider(t('lbl_margin'), `${prefix}margin`, L.margin ?? 0, 0, 48, 1, 'px');
  html += slider(t('lbl_padding'), `${prefix}padding`, L.padding ?? 12, 0, 48, 1, 'px');
  html += `<label class="prop-field"><span>${t('lbl_shadow')}</span><select data-key="${prefix}shadow">${CVBlocks.SHADOW_TYPES.map((s) => `<option value="${s.value}" ${(L.shadow || 'none') === s.value ? 'selected' : ''}>${s.label}</option>`).join('')}</select></label>`;
  html += colorPicker(t('lbl_bg_color'), `${prefix}bgColor`, L.bgColor || 'transparent');
  html += colorPicker(t('lbl_border_color'), `${prefix}borderColor`, L.borderColor || '#e5e7eb');
  html += slider(t('lbl_width'), `${prefix}boxWidth`, L.boxWidth ?? 0, 0, 700, 1, 'px');
  html += slider(t('lbl_height'), `${prefix}boxHeight`, L.boxHeight ?? 0, 0, 600, 1, 'px');
  html += `<label class="prop-field"><span>${t('lbl_font_family')}</span><select data-key="${prefix}fontFamily">${CVBlocks.FONT_FAMILIES.map((f) => `<option value="${f.value}" ${(L.fontFamily || '') === f.value ? 'selected' : ''}>${f.label}</option>`).join('')}</select></label>`;
  html += `<label class="prop-field"><span>${t('lbl_text_align')}</span><select data-key="${prefix}textAlign">${CVBlocks.TEXT_ALIGNS.map((a) => `<option value="${a.value}" ${(L.textAlign || '') === a.value ? 'selected' : ''}>${a.label}</option>`).join('')}</select></label>`;
  html += slider(t('lbl_opacity'), `${prefix}opacity`, L.opacity ?? 100, 10, 100, 1, '%');
  html += slider(t('lbl_border_radius'), `${prefix}borderRadius`, L.borderRadius ?? 10, 0, 30, 1, 'px');
  return html;
}

function dimFields(block) {
  const ref = CVBlocks.getDimRef(block);
  const w = ref.store[ref.w] || 0;
  const h = ref.store[ref.h] || 0;
  let html = `<div class="prop-subtitle">${t('props_dims')}</div>`;
  if (block.type === 'section') {
    html += slider(t('lbl_width'), 'layout.boxWidth', w || 0, 0, 700, 1, 'px');
    html += slider(t('lbl_height'), 'layout.boxHeight', h || 0, 0, 600, 1, 'px');
  } else if (block.type === 'container') {
    html += slider(t('lbl_width'), 'boxWidth', w || 0, 0, 700, 1, 'px');
    html += slider(t('lbl_height'), 'boxHeight', h || 0, 0, 600, 1, 'px');
  } else if (block.type === 'image' || block.type === 'header') {
    const store = block.type === 'header' ? (block.photo || { width: 128, height: 176 }) : block;
    html += slider(t('lbl_width'), block.type === 'header' ? 'photo.width' : 'width', store.width || 128, 40, 400, 1, 'px');
    html += slider(t('lbl_height'), block.type === 'header' ? 'photo.height' : 'height', store.height || 176, 40, 500, 1, 'px');
    if (block.type === 'image') {
      html += `<label class="prop-field"><span>${t('lbl_image_fit')}</span><select data-key="objectFit"><option value="cover" ${(!block.objectFit || block.objectFit === 'cover') ? 'selected' : ''}>${t('lbl_fit_cover')}</option><option value="contain" ${block.objectFit === 'contain' ? 'selected' : ''}>${t('lbl_fit_contain')}</option></select></label>`;
    }
  } else {
    html += slider(t('lbl_width'), 'box.width', (block.box?.width) || 0, 0, 700, 1, 'px');
    html += slider(t('lbl_height'), 'box.height', (block.box?.height) || 0, 0, 600, 1, 'px');
    html += slider(t('lbl_margin'), 'box.margin', (block.box?.margin) || 0, 0, 48, 1, 'px');
  }
  return html;
}

function emojiPicker(key, current = '') {
  const general = CVBlocks.EMOJI_LIST.map((e) => `<button type="button" class="emoji-btn ${current === e ? 'active' : ''}" data-emoji-key="${key}" data-emoji="${e}" title="${e}">${e}</button>`).join('');
  const social = CVBlocks.SOCIAL_EMOJI_LIST.map(({ emoji, label }) => `<button type="button" class="emoji-btn emoji-social ${current === emoji ? 'active' : ''}" data-emoji-key="${key}" data-emoji="${emoji}" title="${label}">${emoji}</button>`).join('');
  return `
    <div class="emoji-picker-wrap">
      <div class="prop-subtitle">${t('props_emoji_general')}</div>
      <div class="emoji-grid">${general}</div>
      <div class="prop-subtitle">${t('props_emoji_social')}</div>
      <div class="emoji-grid emoji-grid-social">${social}</div>
      ${field(t('lbl_emoji_type'), key, current)}
    </div>`;
}

function renderPageSettings() {
  const p = state.page || CVBlocks.defaultPage();
  return `
    <div class="props-title">${t('lbl_page_margins')}</div>
    ${slider(t('lbl_margin_top'), 'page.marginTop', p.marginTop ?? 10, 0, 30, 1, 'mm')}
    ${slider(t('lbl_margin_right'), 'page.marginRight', p.marginRight ?? 12, 0, 30, 1, 'mm')}
    ${slider(t('lbl_margin_bottom'), 'page.marginBottom', p.marginBottom ?? 10, 0, 30, 1, 'mm')}
    ${slider(t('lbl_margin_left'), 'page.marginLeft', p.marginLeft ?? 12, 0, 30, 1, 'mm')}
  `;
}

// ── Page settings inline dropdown ──────────────────────────────
function renderPageSettingsInline() {
  const container = document.getElementById('pageSettingsInline');
  if (!container) return;
  container.innerHTML = renderPageSettings();
  bindPropsEvents(container);
}

// ── Props panel render ──────────────────────────────────────────
function renderProps() {
  const found = getSelected();
  if (!found) {
    propsPanel.innerHTML = `<div class="props-empty-msg"><i class="fa-regular fa-hand-pointer"></i><p>${t('props_empty')}</p></div>`;
    renderPageSettingsInline();
    return;
  }

  const block = found.block;
  let html = `<div class="props-title">${blockLabel(block)}</div>`;

  if (block.type === 'header') {
    html += field(t('lbl_name'), 'name', block.name);
    html += field(t('lbl_title'), 'title', block.title);
    html += field(t('lbl_image'), 'image', block.image);
    html += `<label class="prop-field upload-field"><span>${t('lbl_upload_photo')}</span><input type="file" id="headerImageUpload" accept="image/*"></label>`;
    if (block.image) html += `<div class="upload-preview"><img src="${CVBlocks.fileUrl(block.image)}" alt=""></div>`;
    html += `<div class="prop-subtitle">${t('props_contacts')}</div>`;
    (block.contacts || []).forEach((c, i) => {
      html += `<div class="contact-edit">${field(t('lbl_text'), `contacts.${i}.text`, c.text)}${field(t('lbl_href'), `contacts.${i}.href`, c.href || '')}<button type="button" class="mini-btn" data-remove-contact="${i}">${t('lbl_delete')}</button></div>`;
    });
    html += `<button type="button" class="mini-btn" id="addContactBtn">${t('lbl_add_contact')}</button>`;
    html += dimFields(block);
  } else if (block.type === 'section') {
    html += field(t('lbl_section_title'), 'title', block.title);
    html += colorPicker(t('lbl_title_color'), 'titleColor', block.titleColor || '#111827');
    html += `<label class="prop-field"><span>${t('lbl_icon')}</span><select data-key="icon">${CVBlocks.SECTION_ICONS.map((ic) => `<option value="${ic}" ${block.icon === ic ? 'selected' : ''}>${ic}</option>`).join('')}</select></label>`;
    html += `<div class="prop-subtitle">${t('props_layout_section')}</div>`;
    html += layoutFields(block, true);
  } else if (block.type === 'container') {
    html += `<div class="prop-subtitle">${t('props_layout_container')}</div>`;
    html += layoutFields(block, false);
  } else if (block.type === 'paragraph') {
    html += field(t('lbl_text'), 'text', block.text, true);
    html += colorPicker(t('lbl_text_color'), 'textColor', block.textColor || '#374151');
    html += slider(t('lbl_line_height'), 'lineHeight', block.lineHeight ?? 1.6, 1.0, 2.5, 0.1, 'x');
    html += emojiPicker('leadingEmoji', '');
    html += dimFields(block);
  } else if (block.type === 'heading') {
    html += field(t('lbl_text'), 'text', block.text, true);
    html += colorPicker(t('lbl_text_color'), 'textColor', block.textColor || '#111827');
    html += `<label class="prop-field"><span>${t('lbl_text_transform')}</span><select data-key="textTransform">${CVBlocks.TEXT_TRANSFORMS.map((tr) => `<option value="${tr.value}" ${(block.textTransform || '') === tr.value ? 'selected' : ''}>${tr.label}</option>`).join('')}</select></label>`;
    html += slider(t('lbl_letter_spacing'), 'letterSpacing', block.letterSpacing ?? 0, -2, 10, 0.5, 'px');
    html += emojiPicker('leadingEmoji', '');
    html += dimFields(block);
  } else if (block.type === 'emoji') {
    html += emojiPicker('emoji', block.emoji);
    html += `<label class="prop-field"><span>${t('lbl_size')}</span><select data-key="size"><option value="sm" ${block.size === 'sm' ? 'selected' : ''}>${t('lbl_small')}</option><option value="md" ${block.size === 'md' ? 'selected' : ''}>${t('lbl_medium')}</option><option value="lg" ${!block.size || block.size === 'lg' ? 'selected' : ''}>${t('lbl_large')}</option><option value="xl" ${block.size === 'xl' ? 'selected' : ''}>${t('lbl_xlarge')}</option></select></label>`;
    html += `<label class="prop-field"><span>${t('lbl_align')}</span><select data-key="align"><option value="left" ${!block.align || block.align === 'left' ? 'selected' : ''}>${t('lbl_left')}</option><option value="center" ${block.align === 'center' ? 'selected' : ''}>${t('lbl_center')}</option><option value="right" ${block.align === 'right' ? 'selected' : ''}>${t('lbl_right')}</option></select></label>`;
  } else if (block.type === 'emoji-line') {
    html += emojiPicker('emoji', block.emoji);
    html += field(t('lbl_text'), 'text', block.text, true);
    html += colorPicker(t('lbl_text_color'), 'textColor', block.textColor || '#374151');
  } else if (block.type === 'badge') {
    html += emojiPicker('emoji', block.emoji);
    html += field(t('lbl_text'), 'text', block.text);
    html += colorPicker(t('lbl_bg'), 'color', block.color);
    html += colorPicker(t('lbl_text_color'), 'textColor', block.textColor);
  } else if (block.type === 'quote') {
    html += field(t('lbl_quote_text'), 'text', block.text, true);
    html += field(t('lbl_author'), 'author', block.author);
    html += colorPicker(t('lbl_text_color'), 'textColor', block.textColor || '#374151');
  } else if (block.type === 'highlight') {
    html += field(t('lbl_text'), 'text', block.text, true);
    html += colorPicker(t('lbl_bg'), 'color', block.color);
    html += colorPicker(t('lbl_border_color'), 'borderColor', block.borderColor);
    html += colorPicker(t('lbl_text_color'), 'textColor', block.textColor || '#1f2937');
  } else if (block.type === 'callout') {
    html += emojiPicker('emoji', block.emoji);
    html += field(t('lbl_heading'), 'title', block.title);
    html += field(t('lbl_text'), 'text', block.text, true);
  } else if (block.type === 'icon-row') {
    html += `<label class="prop-field"><span>${t('lbl_icon')}</span><select data-key="icon">${CVBlocks.SECTION_ICONS.map((ic) => `<option value="${ic}" ${block.icon === ic ? 'selected' : ''}>${ic}</option>`).join('')}</select></label>`;
    html += field(t('lbl_text'), 'text', block.text);
    html += colorPicker(t('lbl_icon_color'), 'color', block.color);
  } else if (block.type === 'dots') {
    html += slider(t('lbl_max'), 'count', block.count || 5, 2, 12, 1);
    html += field(t('lbl_color'), 'color', block.color);
  } else if (block.type === 'columns') {
    html += field(t('lbl_col1'), 'left', block.left, true);
    html += field(t('lbl_col2'), 'right', block.right, true);
  } else if (block.type === 'progress') {
    html += field(t('lbl_label'), 'label', block.label);
    html += slider(t('lbl_value'), 'value', block.value ?? 80, 0, 100, 1, '%');
    html += colorPicker(t('lbl_bar_color'), 'color', block.color);
  } else if (block.type === 'timeline') {
    html += field(t('lbl_period'), 'period', block.period);
    html += field(t('lbl_heading'), 'heading', block.heading);
    html += field(t('lbl_subtitle'), 'subtitle', block.subtitle);
    html += field(t('lbl_items'), 'itemsText', (block.items || []).join('\n'), true);
  } else if (block.type === 'skill-row') {
    html += field(t('lbl_label'), 'label', block.label);
    html += field(t('lbl_value'), 'value', block.value, true);
  } else if (block.type === 'link-row') {
    html += field(t('lbl_url'), 'url', block.url);
    html += field(t('lbl_label'), 'label', block.label);
    html += field(t('lbl_description'), 'description', block.description);
  } else if (block.type === 'divider') {
    html += `<label class="prop-field"><span>${t('lbl_style')}</span><select data-key="style"><option value="solid" ${!block.style || block.style === 'solid' ? 'selected' : ''}>${t('lbl_solid')}</option><option value="dashed" ${block.style === 'dashed' ? 'selected' : ''}>${t('lbl_dashed')}</option><option value="dots" ${block.style === 'dots' ? 'selected' : ''}>${t('lbl_dots_style')}</option></select></label>`;
  } else if (block.type === 'spacer') {
    html += `<label class="prop-field"><span>${t('lbl_size')}</span><select data-key="size"><option value="sm" ${block.size === 'sm' ? 'selected' : ''}>${t('lbl_small')}</option><option value="md" ${!block.size || block.size === 'md' ? 'selected' : ''}>${t('lbl_medium')}</option><option value="lg" ${block.size === 'lg' ? 'selected' : ''}>${t('lbl_large')}</option></select></label>`;
  } else if (block.type === 'shape') {
    html += `<label class="prop-field"><span>${t('lbl_shape_type')}</span><select data-key="shapeKind">${CVBlocks.SHAPE_KINDS.map((s) => `<option value="${s.value}" ${(block.shapeKind || 'rounded') === s.value ? 'selected' : ''}>${s.label}</option>`).join('')}</select></label>`;
    html += colorPicker(t('lbl_color'), 'color', block.color);
    html += colorPicker(t('lbl_border'), 'borderColor', block.borderColor || '#93c5fd');
    html += slider(t('lbl_width'), 'width', block.width ?? 100, 10, 100, 1, '%');
    html += slider(t('lbl_height'), 'height', block.height ?? 48, 8, 200, 1, 'px');
    html += slider(t('lbl_scale'), 'scale', block.scale ?? 100, 30, 150, 1, '%');
    html += `<label class="prop-field"><span>${t('lbl_border')}</span><input type="checkbox" data-key="border" ${block.border ? 'checked' : ''}></label>`;
  } else if (block.type === 'image') {
    html += `<label class="prop-field upload-field"><span>${t('lbl_upload_img')}</span><input type="file" id="imageUpload" accept="image/*"></label>`;
    if (block.src) html += `<div class="upload-preview"><img src="${CVBlocks.fileUrl(block.src)}" style="${CVBlocks.imageStyle(block)}" alt=""></div>`;
    html += field(t('lbl_filename'), 'src', block.src);
    html += field(t('lbl_alt'), 'alt', block.alt);
    html += dimFields(block);
  } else if (block.type === 'circle-progress') {
    html += field(t('lbl_label'), 'label', block.label);
    html += slider(t('lbl_value'), 'value', block.value ?? 80, 0, 100, 1, '%');
    html += colorPicker(t('lbl_ring_color'), 'color', block.color || '#3b82f6');
    html += `<label class="prop-field"><span>${t('lbl_size')}</span><select data-key="size"><option value="60" ${Number(block.size) === 60 ? 'selected' : ''}>${t('lbl_small')} (60px)</option><option value="80" ${!block.size || Number(block.size) === 80 ? 'selected' : ''}>${t('lbl_medium')} (80px)</option><option value="100" ${Number(block.size) === 100 ? 'selected' : ''}>${t('lbl_large')} (100px)</option><option value="120" ${Number(block.size) === 120 ? 'selected' : ''}>XL (120px)</option></select></label>`;
    html += dimFields(block);
  } else if (block.type === 'skill-dots') {
    html += field(t('lbl_label'), 'label', block.label);
    html += slider(t('lbl_value'), 'value', block.value ?? 4, 0, 10, 1);
    html += slider(t('lbl_max'), 'max', block.max ?? 5, 2, 10, 1);
    html += colorPicker(t('lbl_color'), 'color', block.color || '#3b82f6');
    html += `<label class="prop-field"><span>${t('lbl_dot_size')}</span><select data-key="dotSize"><option value="sm" ${block.dotSize === 'sm' ? 'selected' : ''}>${t('lbl_small')}</option><option value="md" ${!block.dotSize || block.dotSize === 'md' ? 'selected' : ''}>${t('lbl_medium')}</option><option value="lg" ${block.dotSize === 'lg' ? 'selected' : ''}>${t('lbl_large')}</option></select></label>`;
    html += dimFields(block);
  }

  if (!['divider', 'spacer', 'section', 'container', 'header', 'paragraph', 'heading', 'image', 'circle-progress', 'skill-dots'].includes(block.type)) {
    html += dimFields(block);
  }

  propsPanel.innerHTML = html;
  bindPropsEvents(propsPanel, block);
}

function bindPropsEvents(container, block = null) {
  // Grid select re-render props when value changes
  container.querySelectorAll('select[data-key$="grid"]').forEach((sel) => {
    sel.addEventListener('change', () => {
      applyProp(sel.dataset.key, sel.value);
      renderCanvas(); // asigură actualizarea canvas pentru containere (unde applyProp nu face asta)
      renderProps();
    });
  });

  // Generează button for custom grid
  const applyGridBtn = container.querySelector('#applyGridBtn');
  if (applyGridBtn) {
    applyGridBtn.addEventListener('click', () => {
      const cols = Math.max(1, Math.min(12, Number(container.querySelector('#gmCols')?.value || 3)));
      const rows = Math.max(1, Math.min(10, Number(container.querySelector('#gmRows')?.value || 2)));
      const found = getSelected();
      if (!found) return;
      const b = found.block;
      if (b.type === 'section') {
        b.layout = b.layout || CVBlocks.defaultLayout();
        b.layout.gridCols = cols;
        b.layout.gridRows = rows;
      } else {
        b.gridCols = cols;
        b.gridRows = rows;
      }
      pushHistory();
      renderCanvas();
      renderProps();
    });
  }

  container.querySelectorAll('[data-key]').forEach((el) => {
    if (el.tagName === 'SELECT' && el.dataset.key.endsWith('grid')) return; // already handled
    const eventName = el.tagName === 'SELECT' || el.type === 'checkbox' ? 'change' : 'input';
    el.addEventListener(eventName, () => {
      applyProp(el.dataset.key, el.type === 'checkbox' ? el.checked : el.value);
      const live = container.querySelector(`[data-live="${el.dataset.key}"]`);
      if (live) live.textContent = `${el.value}${el.dataset.unit || ''}`;
    });
  });

  container.querySelectorAll('.emoji-btn').forEach((btn) => {
    btn.addEventListener('click', () => { applyProp(btn.dataset.emojiKey, btn.dataset.emoji); renderProps(); });
  });

  container.querySelectorAll('.color-btn').forEach((btn) => {
    btn.addEventListener('click', () => { applyProp(btn.dataset.colorKey, btn.dataset.color); renderProps(); });
  });

  if (block) {
    container.querySelectorAll('[data-remove-contact]').forEach((btn) => {
      btn.addEventListener('click', () => {
        block.contacts.splice(Number(btn.dataset.removeContact), 1);
        pushHistory();
        renderCanvas();
        renderProps();
      });
    });

    document.getElementById('addContactBtn')?.addEventListener('click', () => {
      block.contacts = block.contacts || [];
      block.contacts.push({ icon: 'fa-envelope', text: 'contact@email.com', href: 'mailto:contact@email.com' });
      pushHistory();
      renderCanvas();
      renderProps();
    });

    bindImageUpload('imageUpload', (filename, dims) => {
      block.src = filename;
      block.width = dims.width;
      block.height = dims.height;
    });
    bindImageUpload('headerImageUpload', (filename, dims) => {
      block.image = filename;
      block.photo = block.photo || {};
      block.photo.width = dims.width;
      block.photo.height = dims.height;
    });
  }
}

// ── Apply prop ──────────────────────────────────────────────────
function applyProp(key, value) {
  if (key.startsWith('page.')) {
    const f = key.slice(5);
    state.page = state.page || CVBlocks.defaultPage();
    state.page[f] = Number(value);
    return;
  }

  const found = getSelected();
  if (!found) return;
  const block = found.block;

  if (key.startsWith('contacts.')) {
    const [, index, fieldName] = key.split('.');
    block.contacts[Number(index)][fieldName] = value;
  } else if (key.startsWith('layout.')) {
    const f = key.slice(7);
    block.layout = block.layout || CVBlocks.defaultLayout();
    if (['margin', 'padding', 'boxWidth', 'boxHeight', 'opacity', 'borderRadius', 'gridCols', 'gridRows'].includes(f)) block.layout[f] = Number(value);
    else { block.layout[f] = value; if (f === 'grid') { renderCanvas(); renderProps(); return; } }
  } else if (key.startsWith('photo.')) {
    const f = key.slice(6);
    block.photo = block.photo || { width: 128, height: 176 };
    block.photo[f] = Number(value);
  } else if (key.startsWith('box.')) {
    const f = key.slice(4);
    block.box = block.box || { width: 0, height: 0, margin: 0 };
    block.box[f] = Number(value);
  } else if (key === 'itemsText') {
    block.items = value.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
    renderCanvas();
    return;
  } else if (['height', 'width', 'scale', 'count', 'value', 'max', 'size', 'margin', 'padding', 'boxWidth', 'boxHeight', 'opacity', 'borderRadius', 'letterSpacing', 'lineHeight', 'gridCols', 'gridRows'].includes(key)) {
    block[key] = Number(value);
  } else if (key === 'leadingEmoji' && value) {
    block.text = `${value} ${block.text || ''}`.trim();
  } else {
    block[key] = value;
  }

  renderCanvas();
}

// ── Image upload ────────────────────────────────────────────────
async function uploadImage(file, onSuccess) {
  const blobUrl = URL.createObjectURL(file);
  const natural = await new Promise((resolve) => {
    const probe = new Image();
    probe.onload = () => resolve({ w: probe.naturalWidth, h: probe.naturalHeight });
    probe.onerror = () => resolve({ w: 128, h: 176 });
    probe.src = blobUrl;
  });
  URL.revokeObjectURL(blobUrl);

  const form = new FormData();
  form.append('image', file);
  const res = await fetch('/api/upload-image', { method: 'POST', body: form });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || t('err_upload'));

  const maxW = 128;
  const ratio = natural.h / natural.w;
  onSuccess(data.filename, { width: maxW, height: Math.max(40, Math.round(maxW * ratio)) });
  setStatus(t('status_img_uploaded'), 'ok');
}

function bindImageUpload(inputId, applyFilename) {
  document.getElementById(inputId)?.addEventListener('change', async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      await uploadImage(file, applyFilename);
      renderCanvas();
      renderProps();
    } catch (err) {
      setStatus(err.message, 'err');
    }
  });
}

// ── Templates ───────────────────────────────────────────────────
async function loadTemplates() {
  const res = await fetch('/api/templates');
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || t('err_load_tpl'));
  state.templates = data.templates || [];
  renderTemplateGridMenu();
}

function renderTemplateGridMenu() {
  const grid = document.getElementById('templateGridMenu');
  if (!grid) return;

  if (!state.templates.length) {
    grid.innerHTML = `<div class="tpl-loading">${t('tpl_no_templates')}</div>`;
    return;
  }

  grid.innerHTML = state.templates.map((tpl) => {
    const name = t(`tpl_${tpl.id}_name`) !== `tpl_${tpl.id}_name` ? t(`tpl_${tpl.id}_name`) : tpl.name;
    const desc = t(`tpl_${tpl.id}_desc`) !== `tpl_${tpl.id}_desc` ? t(`tpl_${tpl.id}_desc`) : (tpl.description || name);
    return `
    <button type="button" class="tpl-menu-card${state.activeTemplateId === tpl.id ? ' active' : ''}" data-template-id="${tpl.id}" title="${desc}">
      <img src="${tpl.preview}" alt="${name}" loading="lazy">
      <div class="tpl-menu-name">${name}</div>
      <div class="tpl-menu-swatches">${(tpl.colors || []).slice(0, 3).map((c) => `<span class="tpl-menu-swatch" style="background:${c}"></span>`).join('')}</div>
    </button>`;
  }).join('');

  grid.querySelectorAll('[data-template-id]').forEach((btn) => {
    btn.addEventListener('click', () => {
      closeAllMenus();
      applyTemplate(btn.dataset.templateId);
    });
  });
}

async function applyTemplate(templateId) {
  const tplMeta = state.templates.find((tpl) => tpl.id === templateId);
  const rawName = tplMeta?.name || `Template ${templateId}`;
  const i18nKey = `tpl_${templateId}_name`;
  const label = t(i18nKey) !== i18nKey ? t(i18nKey) : rawName;
  const ok = window.confirm(t('tpl_confirm', { name: label }));
  if (!ok) return;

  setStatus(t('status_loading_tpl', { name: label }), '');
  try {
    const res = await fetch(`/api/templates/${encodeURIComponent(templateId)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Eroare');

    state.blocks = CVBlocks.normalizeBlocks(CVBlocks.cloneBlocks(data.blocks || []));
    state.selectedId = null;
    state.activeTemplateId = templateId;
    pushHistory();
    renderTemplateGridMenu();
    renderCanvas();
    renderProps();
    setStatus(t('status_tpl_applied', { name: label }), 'ok');
  } catch (e) {
    setStatus(e.message, 'err');
  }
}

// ── Load & Save ─────────────────────────────────────────────────
async function loadBlocks() {
  setStatus(t('status_loading'), '');
  const res = await fetch('/api/blocks');
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || t('err_load'));
  state.blocks = CVBlocks.normalizeBlocks((data.blocks || []).map((b) => {
    if (b.type === 'section' && !b.layout) b.layout = CVBlocks.defaultLayout();
    return b;
  }));
  state.page = { ...CVBlocks.defaultPage(), ...(data.page || {}) };
  state.selectedId = null;
  state.activeTemplateId = null;
  history.length = 0;
  historyIndex = -1;
  pushHistory();
  renderTemplateGridMenu();
  renderCanvas();
  renderProps();
  setStatus(t('status_loaded'), 'ok');
}

async function saveAll(generatePdf = false) {
  setStatus(t('status_saving'), '');
  const html = CVBlocks.blocksToHtml(state.blocks, state.page);
  await Promise.all([
    fetch('/api/blocks', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ blocks: state.blocks, page: state.page }) }),
    fetch('/api/cv', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ content: html }) }),
  ]);
  if (!generatePdf) { setStatus(t('status_saved'), 'ok'); return; }
  setStatus(t('status_pdf'), '');
  const res = await fetch('/api/pdf', { method: 'POST' });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Eroare PDF');
  setStatus(t('status_pdf_done', { size: data.sizeKb }), 'ok');
}

// ── Menu bar dropdowns ──────────────────────────────────────────
function initMenuBar() {
  document.querySelectorAll('.menu-item').forEach((item) => {
    const label = item.querySelector('.menu-label');
    label?.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = item.classList.contains('open');
      closeAllMenus();
      if (!isOpen) {
        item.classList.add('open');
        // Render page settings inline when Pagină menu opens
        if (item.id === 'menuPagina') renderPageSettingsInline();
      }
    });
  });

  document.addEventListener('click', () => closeAllMenus());
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeAllMenus();
  });
}

function closeAllMenus() {
  document.querySelectorAll('.menu-item.open').forEach((m) => m.classList.remove('open'));
}

// ── Toolbox tool buttons ────────────────────────────────────────
function initToolbox() {
  document.querySelectorAll('.tool-btn[data-type]').forEach((btn) => {
    btn.addEventListener('click', () => {
      // Deactivate previous
      document.querySelectorAll('.tool-btn.active').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      addBlockToCanvas(btn.dataset.type);
      // Deactivate after short visual feedback
      setTimeout(() => btn.classList.remove('active'), 300);
    });
  });
}

// ── Color palette bar ───────────────────────────────────────────
const PALETTE_COLORS = [
  '#000000', '#ffffff', '#808080', '#c0c0c0',
  '#800000', '#ff0000', '#ff8080', '#ffcccc',
  '#804000', '#ff8000', '#ffcc80', '#fff0d0',
  '#808000', '#ffff00', '#ffff80', '#fffff0',
  '#008000', '#00ff00', '#80ff80', '#e0ffe0',
  '#008080', '#00ffff', '#80ffff', '#e0ffff',
  '#000080', '#0000ff', '#8080ff', '#e0e0ff',
  '#800080', '#ff00ff', '#ff80ff', '#ffe0ff',
  '#1d4ed8', '#2563eb', '#3b82f6', '#93c5fd',
  '#065f46', '#059669', '#10b981', '#6ee7b7',
  '#92400e', '#b45309', '#f59e0b', '#fcd34d',
  '#7f1d1d', '#991b1b', '#dc2626', '#fca5a5',
  'transparent',
];

function initColorbar() {
  if (!colorbarPalette) return;

  colorbarPalette.innerHTML = PALETTE_COLORS.map((c) => {
    if (c === 'transparent') {
      return `<div class="cb-color" data-color="${c}" title="Transparent" style="background:linear-gradient(45deg,#ccc 25%,transparent 25%,transparent 75%,#ccc 75%),linear-gradient(45deg,#ccc 25%,transparent 25%,transparent 75%,#ccc 75%);background-size:6px 6px;background-position:0 0,3px 3px;"></div>`;
    }
    return `<div class="cb-color" data-color="${c}" title="${c}" style="background:${c};"></div>`;
  }).join('');

  colorbarPalette.querySelectorAll('.cb-color').forEach((el) => {
    el.addEventListener('click', () => applyColorFromBar(el.dataset.color));
    el.addEventListener('contextmenu', (e) => {
      e.preventDefault();
      colorMode = 'bg';
      applyColorFromBar(el.dataset.color);
    });
  });

  // Click fg swatch → switch to fg mode
  colorSwatchFg?.addEventListener('click', () => { colorMode = 'fg'; updateColorbarInfo(); });
  // Click bg swatch → switch to bg mode
  colorSwatchBg?.addEventListener('click', () => { colorMode = 'bg'; updateColorbarInfo(); });

  updateColorSwatches();
}

function applyColorFromBar(color) {
  const found = getSelected();
  if (!found) {
    setStatus(t('status_no_selection'), '');
    return;
  }
  const block = found.block;
  const key = colorMode === 'fg' ? getTextColorKey(block) : getBgColorKey(block);
  if (!key) return;

  applyProp(key, color);
  if (colorMode === 'fg') activeFg = color;
  else activeBg = color;
  updateColorSwatches();
  renderProps();
}

function getTextColorKey(block) {
  const textColorTypes = ['paragraph', 'heading', 'quote', 'highlight', 'emoji-line', 'badge'];
  if (textColorTypes.includes(block.type)) return 'textColor';
  if (block.type === 'section') return 'titleColor';
  if (block.type === 'icon-row') return 'color';
  if (block.type === 'badge') return 'textColor';
  if (block.type === 'progress') return 'color';
  return 'textColor';
}

function getBgColorKey(block) {
  if (block.type === 'section') return 'layout.bgColor';
  if (block.type === 'container') return 'bgColor';
  if (block.type === 'highlight') return 'color';
  if (block.type === 'badge') return 'color';
  return 'layout.bgColor';
}

function updateColorSwatches() {
  if (colorSwatchFg) colorSwatchFg.style.background = activeFg;
  if (colorSwatchBg) colorSwatchBg.style.background = activeBg;
}

function updateColorbarInfo() {
  if (!colorbarInfo) return;
  colorbarInfo.textContent = colorMode === 'fg'
    ? t('colorbar_fg_mode')
    : t('colorbar_bg_mode');
}

// ── Keyboard shortcuts ──────────────────────────────────────────
function initKeyboard() {
  document.addEventListener('keydown', (e) => {
    // Ignore if focus is on input/textarea
    const tag = document.activeElement?.tagName;
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.ctrlKey && e.key === 'z' && !e.shiftKey) { e.preventDefault(); undo(); }
    if (e.ctrlKey && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) { e.preventDefault(); redo(); }
    if (e.ctrlKey && e.key === 's') { e.preventDefault(); saveAll(false).catch((err) => setStatus(err.message, 'err')); }
    if (e.key === 'Delete' || e.key === 'Backspace') {
      if (state.selectedId) {
        pushHistory();
        CVBlocks.removeBlock(state.blocks, state.selectedId);
        state.selectedId = null;
        renderCanvas();
        renderProps();
      }
    }
    if (e.key === 'Escape') {
      state.selectedId = null;
      renderCanvas();
      renderProps();
      closeAllMenus();
    }
  });
}

// ── Auto-save debounce ──────────────────────────────────────────
let autoSaveTimer = null;
function scheduleAutoSave() {
  clearTimeout(autoSaveTimer);
  autoSaveTimer = setTimeout(() => {
    saveAll(false).catch(() => {});
  }, 3000);
}

// ── Init ────────────────────────────────────────────────────────
function init() {
  initMenuBar();
  initToolbox();
  initColorbar();
  initKeyboard();
  setupDropZones();

  // Click outside canvas → deselect
  document.querySelector('.canvas-wrap')?.addEventListener('click', (e) => {
    if (e.target.closest('.canvas-block')) return;
    state.selectedId = null;
    renderCanvas();
    renderProps();
    setMid('');
  });

  // ── Menu Fișier ──
  document.getElementById('newCvBtn')?.addEventListener('click', () => {
    closeAllMenus();
    if (state.blocks.length > 0 && !window.confirm(t('confirm_new_cv'))) return;
    state.blocks = [];
    state.selectedId = null;
    state.activeTemplateId = null;
    pushHistory();
    renderCanvas();
    renderProps();
    setStatus(t('status_new_cv'), '');
  });

  document.getElementById('reloadBtn')?.addEventListener('click', () => {
    closeAllMenus();
    loadBlocks().catch((e) => setStatus(e.message, 'err'));
  });

  document.getElementById('saveBtn')?.addEventListener('click', () => {
    closeAllMenus();
    saveAll(false).catch((e) => setStatus(e.message, 'err'));
  });

  document.getElementById('pdfBtn')?.addEventListener('click', async () => {
    closeAllMenus();
    const btn = document.getElementById('pdfBtn');
    if (btn) btn.disabled = true;
    try {
      setStatus(t('status_pdf'), '');
      await saveAll(true);
    } catch (e) {
      setStatus(e.message, 'err');
    } finally {
      if (btn) btn.disabled = false;
    }
  });

  document.getElementById('openPdfBtn')?.addEventListener('click', () => {
    closeAllMenus();
    window.open('/api/pdf', '_blank');
  });

  // ── Menu Editare ──
  document.getElementById('undoBtn')?.addEventListener('click', () => { closeAllMenus(); undo(); });
  document.getElementById('redoBtn')?.addEventListener('click', () => { closeAllMenus(); redo(); });

  document.getElementById('selectAllBtn')?.addEventListener('click', () => {
    closeAllMenus();
    // Select first block as a visual cue
    if (state.blocks.length) selectBlock(state.blocks[0].id);
  });

  document.getElementById('deleteSelectedBtn')?.addEventListener('click', () => {
    closeAllMenus();
    if (state.selectedId) {
      pushHistory();
      CVBlocks.removeBlock(state.blocks, state.selectedId);
      state.selectedId = null;
      renderCanvas();
      renderProps();
    }
  });

  // ── Toolbar action buttons ──
  document.getElementById('tbUndoBtn')?.addEventListener('click', undo);
  document.getElementById('tbRedoBtn')?.addEventListener('click', redo);
  document.getElementById('tbSaveBtn')?.addEventListener('click', () => saveAll(false).catch((e) => setStatus(e.message, 'err')));
  document.getElementById('tbPdfBtn')?.addEventListener('click', async () => {
    const btn = document.getElementById('tbPdfBtn');
    if (btn) btn.disabled = true;
    try {
      setStatus(t('status_pdf'), '');
      await saveAll(true);
    } catch (e) {
      setStatus(e.message, 'err');
    } finally {
      if (btn) btn.disabled = false;
    }
  });

  // ── Undo/redo initial state ──
  updateUndoRedoBtns();

  // ── Load templates + blocks ──
  loadTemplates().catch((e) => setStatus(e.message, 'err'));
  loadBlocks().catch((e) => setStatus(e.message, 'err'));
}

init();
