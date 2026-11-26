/**
 * Python Ecosystem Explainer - Main Application Controller
 * Minimal 100vh Transformer Explainer-inspired canvas with click-to-explore
 * collapsible contextual explanation drawer and smooth SVG data-flow tracking.
 */
window.PyExplainer = window.PyExplainer || {};

document.addEventListener('DOMContentLoaded', () => {
  const { CATEGORIES, LIBRARIES, Diagram, Demos } = window.PyExplainer;

  const state = {
    activeId: null,   // null on initial screen so only the central visualization shows
    hoverId: null,
    stageIdx: 0
  };

  // Core DOM Elements
  const headerHintEl = document.getElementById('header-hint');
  const ecosystemCanvasEl = document.getElementById('ecosystem-canvas');
  const ecosystemSvgEl = document.getElementById('ecosystem-svg');
  const ecosystemGridEl = document.getElementById('ecosystem-grid');

  // Contextual Explanation Drawer Elements
  const detailPanelEl = document.getElementById('detail-panel');
  const detailBodyEl = document.getElementById('detail-panel-body');
  const detailCloseBtn = document.getElementById('detail-close-btn');
  const detailIconEl = document.getElementById('detail-icon');
  const detailTitleEl = document.getElementById('detail-title');
  const detailMetaEl = document.getElementById('detail-meta');
  const detailPipBtn = document.getElementById('detail-pip-btn');
  const detailPipText = document.getElementById('detail-pip-text');
  const detailRelationsEl = document.getElementById('detail-relations');
  const detailIntroEl = document.getElementById('detail-intro');
  const detailPurposeEl = document.getElementById('detail-purpose');
  const detailProcessEl = document.getElementById('detail-process');
  const detailProcessNoteEl = document.getElementById('detail-process-note');
  const detailUseCasesEl = document.getElementById('detail-usecases');
  const detailCodeEl = document.getElementById('detail-code');
  const detailCopyCodeBtn = document.getElementById('detail-copy-code-btn');
  const detailCodeNotesEl = document.getElementById('detail-code-notes');
  const detailDemoEl = document.getElementById('detail-demo');

  let edgeAnimFrame = null;

  function syncEdgesDuringTransition(durationMs = 380) {
    if (edgeAnimFrame) cancelAnimationFrame(edgeAnimFrame);
    const start = performance.now();
    function tick(now) {
      Diagram.renderEcosystemEdges(ecosystemCanvasEl, ecosystemSvgEl, state);
      if (now - start < durationMs) {
        edgeAnimFrame = requestAnimationFrame(tick);
      } else {
        edgeAnimFrame = null;
      }
    }
    edgeAnimFrame = requestAnimationFrame(tick);
  }

  function highlightPythonLine(rawLine) {
    const escaped = rawLine
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');

    const commentIdx = escaped.indexOf('#');
    const codePartRaw = commentIdx >= 0 ? escaped.slice(0, commentIdx) : escaped;
    const commentPart = commentIdx >= 0 ? `<span class="tok-com">${escaped.slice(commentIdx)}</span>` : '';

    const codePart = codePartRaw
      .replace(/(".*?")/g, '<span class="tok-str">$1</span>')
      .replace(/(@[\w.]+)/g, '<span class="tok-dec">$1</span>')
      .replace(/\b(from|import|def|async|return|class|for|in|if|assert|True|False)\b/g, '<span class="tok-kw">$1</span>')
      .replace(/\b(print|len|sorted|sum|round|int|float|str)\b/g, '<span class="tok-fn">$1</span>')
      .replace(/\b(\d+(?:\.\d+)?)\b/g, '<span class="tok-num">$1</span>');

    return codePart + commentPart || '&nbsp;';
  }

  function renderCodeBlock(lib) {
    const activeStage = lib.process[state.stageIdx] || lib.process[0];
    const highlighted = new Set(activeStage.lines || []);

    detailCodeEl.innerHTML = lib.code
      .map((line, i) => {
        const lineNum = i + 1;
        return `
          <div class="code-line ${highlighted.has(lineNum) ? 'is-highlighted' : ''}">
            <span class="code-linenum">${lineNum}</span>
            <span class="whitespace-pre">${highlightPythonLine(line)}</span>
          </div>
        `;
      })
      .join('');
  }

  function renderProcessAndCode(lib) {
    Diagram.renderProcessDiagram(detailProcessEl, detailProcessNoteEl, lib, state.stageIdx, (idx) => {
      state.stageIdx = idx;
      renderProcessAndCode(lib);
    });
    renderCodeBlock(lib);
  }

  function renderPanelContent(lib) {
    const cat = CATEGORIES[lib.category];
    const { upstream, downstream } = Diagram.getRelatedSet(lib.id);

    detailIconEl.innerHTML = Diagram.ICONS[lib.id] || '';
    detailIconEl.style.backgroundColor = cat.bg;
    detailIconEl.style.color = cat.color;
    detailIconEl.style.borderColor = cat.border;

    detailTitleEl.textContent = lib.name;
    detailMetaEl.textContent = `${cat.label} · ${lib.kind}`;
    detailMetaEl.style.backgroundColor = cat.bg;
    detailMetaEl.style.color = cat.color;
    detailPipText.textContent = lib.pipInstall;

    // Clickable Upstream / Downstream chips
    const relChips = [];
    upstream.forEach((id) => {
      const target = LIBRARIES.find((l) => l.id === id);
      if (target) {
        relChips.push(
          `<button type="button" data-jump="${target.id}" class="text-[10.5px] font-medium px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition">← ${target.name}</button>`
        );
      }
    });
    downstream.forEach((id) => {
      const target = LIBRARIES.find((l) => l.id === id);
      if (target) {
        relChips.push(
          `<button type="button" data-jump="${target.id}" class="text-[10.5px] font-medium px-2 py-0.5 rounded bg-sky-50 hover:bg-sky-100 text-sky-700 transition">${target.name} →</button>`
        );
      }
    });
    detailRelationsEl.innerHTML = relChips.join('');
    detailRelationsEl.querySelectorAll('[data-jump]').forEach((btn) => {
      btn.addEventListener('click', () => selectNode(btn.dataset.jump));
    });

    detailIntroEl.textContent = lib.explanation;
    detailPurposeEl.textContent = lib.purpose;

    detailUseCasesEl.innerHTML = lib.useCases
      .map(
        (uc) =>
          `<span class="text-[11px] font-medium px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">${uc}</span>`
      )
      .join('');

    renderProcessAndCode(lib);

    detailCodeNotesEl.innerHTML = (lib.codeAnnotations || [])
      .map(
        (ann) => `
        <div class="flex items-start gap-2 text-[11.5px] text-slate-600">
          <span class="font-mono text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0 mt-0.5" style="background:${cat.bg}; color:${cat.color};">
            L${ann.lines}
          </span>
          <span class="leading-snug">${ann.text}</span>
        </div>
      `
      )
      .join('');

    Demos.renderDemo(detailDemoEl, lib.id);

    // Smooth content refresh animation & reset internal scroll to top
    detailBodyEl.scrollTop = 0;
    detailBodyEl.classList.remove('animate-pop');
    void detailBodyEl.offsetWidth;
    detailBodyEl.classList.add('animate-pop');
  }

  function updateHeaderHint() {
    if (!state.activeId) {
      headerHintEl.innerHTML = '<span class="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span><span>Click a node to explore</span>';
    } else {
      const lib = LIBRARIES.find((l) => l.id === state.activeId);
      headerHintEl.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-emerald-500"></span><span>Exploring <strong>${lib ? lib.name : ''}</strong> · Esc to close</span>`;
    }
  }

  function openPanel(lib) {
    const wasClosed = detailPanelEl.classList.contains('is-closed');
    detailPanelEl.classList.remove('is-closed');
    detailPanelEl.classList.add('is-open');
    detailPanelEl.setAttribute('aria-hidden', 'false');
    renderPanelContent(lib);
    if (wasClosed) {
      syncEdgesDuringTransition(400);
    }
  }

  function closePanel() {
    state.activeId = null;
    state.hoverId = null;
    state.stageIdx = 0;
    detailPanelEl.classList.remove('is-open');
    detailPanelEl.classList.add('is-closed');
    detailPanelEl.setAttribute('aria-hidden', 'true');
    renderCanvas();
    syncEdgesDuringTransition(400);
  }

  function selectNode(id) {
    if (state.activeId === id) {
      closePanel();
      return;
    }
    state.activeId = id;
    state.stageIdx = 0;
    const lib = LIBRARIES.find((l) => l.id === id);
    if (!lib) return;
    renderCanvas();
    openPanel(lib);
  }

  function handleHover(id) {
    state.hoverId = id;
    renderCanvas();
  }

  function renderCanvas() {
    Diagram.renderEcosystemNodes(ecosystemGridEl, state, selectNode, handleHover);
    updateHeaderHint();
    requestAnimationFrame(() => {
      Diagram.renderEcosystemEdges(ecosystemCanvasEl, ecosystemSvgEl, state);
    });
  }

  // Controls
  detailCloseBtn.addEventListener('click', closePanel);

  detailPipBtn.addEventListener('click', () => {
    const lib = LIBRARIES.find((l) => l.id === state.activeId);
    if (!lib) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(lib.pipInstall).catch(() => {});
    }
    const prev = detailPipText.textContent;
    detailPipText.textContent = 'Copied!';
    setTimeout(() => {
      detailPipText.textContent = prev;
    }, 1000);
  });

  detailCopyCodeBtn.addEventListener('click', () => {
    const lib = LIBRARIES.find((l) => l.id === state.activeId);
    if (!lib) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(lib.code.join('\n')).catch(() => {});
    }
    detailCopyCodeBtn.textContent = 'Copied!';
    setTimeout(() => {
      detailCopyCodeBtn.textContent = 'Copy';
    }, 1000);
  });

  document.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    if (tag === 'INPUT' || tag === 'TEXTAREA') return;

    if (e.key === 'Escape' && state.activeId) {
      closePanel();
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
      e.preventDefault();
      if (!state.activeId) {
        selectNode(LIBRARIES[0].id);
        return;
      }
      const idx = LIBRARIES.findIndex((l) => l.id === state.activeId);
      const delta = e.key === 'ArrowRight' ? 1 : -1;
      const next = LIBRARIES[(idx + delta + LIBRARIES.length) % LIBRARIES.length];
      selectNode(next.id);
    }
  });

  if (typeof ResizeObserver !== 'undefined') {
    const ro = new ResizeObserver(() => {
      Diagram.renderEcosystemEdges(ecosystemCanvasEl, ecosystemSvgEl, state);
    });
    ro.observe(ecosystemCanvasEl);
  }
  window.addEventListener('resize', () => {
    Diagram.renderEcosystemEdges(ecosystemCanvasEl, ecosystemSvgEl, state);
  });

  // Initial minimal 100vh visualization render (no panel open)
  renderCanvas();
});
