/**
 * Python Ecosystem Explainer - SVG Diagram & Visual Flow Engine
 * Handles rendering the centered 4-layer ecosystem map, dynamic Bezier SVG edges,
 * ambient idle flows, active animated data-flow particles, and internal process diagrams.
 */
window.PyExplainer = window.PyExplainer || {};

window.PyExplainer.Diagram = (function () {
  const { CATEGORIES, COLUMNS, LIBRARIES, EDGES } = window.PyExplainer;

  const ICONS = {
    python: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2c-3 0-4 1.3-4 3v2h5v1H6c-2 0-3 1.5-3 4s1 4 3 4h2v-2c0-1.7 1.3-3 3-3h4c1.7 0 3-1.3 3-3V5c0-1.7-1-3-4-3h-2z"/><path d="M12 22c3 0 4-1.3 4-3v-2h-5v-1h7c2 0 3-1.5 3-4s-1-4-3-4h-2v2c0 1.7-1.3 3-3 3h-4c-1.7 0-3 1.3-3 3v3c0 1.7 1 3 4 3h2z"/></svg>',
    numpy: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>',
    pandas: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 5h16M4 10h16M4 15h16M4 20h16M9 5v15M15 5v15"/></svg>',
    matplotlib: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="M7 15l4-4 3 3 5-7"/></svg>',
    'scikit-learn': '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="7" cy="15" r="2.5"/><circle cx="15" cy="7" r="2.5"/><circle cx="17" cy="16" r="2.5"/><path d="M5 19L19 5" stroke-dasharray="3 2"/></svg>',
    pytorch: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="6" r="2"/><circle cx="12" cy="18" r="2"/><circle cx="19" cy="12" r="2"/><path d="M7 11l3-4M7 13l3 4M14 7l3 4M14 17l3-4"/></svg>',
    flask: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3h6M10 3v5l-5 9a2 2 0 001.7 3h10.6a2 2 0 001.7-3l-5-9V3"/></svg>',
    django: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18M9 9v11"/></svg>',
    fastapi: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
    requests: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12h16M14 6l6 6-6 6"/><circle cx="6" cy="12" r="2"/></svg>',
    pytest: '<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="9"/></svg>'
  };

  function getRelatedSet(activeId) {
    const upstream = new Set();
    const downstream = new Set();
    if (!activeId) return { upstream, downstream };
    EDGES.forEach((edge) => {
      if (edge.to === activeId) upstream.add(edge.from);
      if (edge.from === activeId) downstream.add(edge.to);
    });
    return { upstream, downstream };
  }

  function renderEcosystemNodes(gridEl, state, onSelect, onHover) {
    gridEl.innerHTML = '';
    const focusId = state.hoverId || state.activeId;
    const { upstream, downstream } = getRelatedSet(focusId);

    COLUMNS.forEach((col) => {
      const colWrapper = document.createElement('div');
      colWrapper.className = 'flex flex-col min-h-0 h-full justify-between z-10';

      const colHeader = document.createElement('div');
      colHeader.className = 'text-center pb-1.5 shrink-0';
      colHeader.innerHTML = `
        <div class="text-[10px] font-bold uppercase tracking-wider text-slate-600">${col.title}</div>
        <div class="text-[10px] text-slate-400 hidden sm:block">${col.subtitle}</div>
      `;
      colWrapper.appendChild(colHeader);

      const nodesContainer = document.createElement('div');
      nodesContainer.className = 'flex-1 flex flex-col justify-around gap-2 py-1';

      const colLibs = LIBRARIES.filter((lib) => lib.column === col.id).sort((a, b) => a.row - b.row);

      colLibs.forEach((lib) => {
        const cat = CATEGORIES[lib.category];
        const isActive = lib.id === state.activeId;
        const isHovered = lib.id === state.hoverId;
        const isRelated = upstream.has(lib.id) || downstream.has(lib.id);

        let stateClass = '';
        if (isActive) {
          stateClass = 'is-active';
        } else if (focusId) {
          if (isHovered || isRelated) {
            stateClass = 'is-related';
          } else {
            stateClass = 'is-dimmed';
          }
        }

        const card = document.createElement('button');
        card.type = 'button';
        card.dataset.libId = lib.id;
        card.style.setProperty('--node-color', cat.color);
        card.style.setProperty('--node-glow', `${cat.color}44`);
        card.className = `node-card ${stateClass} w-full max-w-[235px] mx-auto text-left bg-white border border-slate-200 rounded-xl px-3 py-2.5 flex flex-col gap-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400`;

        const roleBadge = upstream.has(lib.id)
          ? '<span class="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-600">Input</span>'
          : downstream.has(lib.id)
            ? '<span class="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-sky-50 text-sky-700">Builds on</span>'
            : `<span class="text-[9px] font-medium text-slate-400 hidden xl:inline">${lib.kind}</span>`;

        card.innerHTML = `
          <div class="flex items-center justify-between gap-1.5">
            <div class="flex items-center gap-2 min-w-0">
              <span class="w-6 h-6 rounded-lg flex items-center justify-center shrink-0" style="background:${cat.bg}; color:${cat.color}; border:1px solid ${cat.border};">
                ${ICONS[lib.id] || ''}
              </span>
              <span class="font-semibold text-xs sm:text-[13.5px] text-slate-900 truncate">${lib.name}</span>
            </div>
            ${roleBadge}
          </div>
          <div class="flex items-center justify-between gap-1.5">
            <span class="text-[10px] font-medium px-1.5 py-0.5 rounded-md truncate" style="background:${cat.bg}; color:${cat.color};">
              ${lib.shortTag}
            </span>
            <span class="w-1.5 h-1.5 rounded-full shrink-0 ${isActive ? 'animate-ping' : ''}" style="background:${cat.color}; opacity:${isActive ? '1' : '0.45'};"></span>
          </div>
        `;

        card.addEventListener('click', () => onSelect(lib.id));
        if (onHover) {
          card.addEventListener('mouseenter', () => onHover(lib.id));
          card.addEventListener('mouseleave', () => onHover(null));
        }
        nodesContainer.appendChild(card);
      });

      colWrapper.appendChild(nodesContainer);
      gridEl.appendChild(colWrapper);
    });
  }

  function renderEcosystemEdges(canvasEl, svgEl, state) {
    const canvasRect = canvasEl.getBoundingClientRect();
    if (!canvasRect.width || !canvasRect.height) return;

    svgEl.setAttribute('viewBox', `0 0 ${canvasRect.width} ${canvasRect.height}`);
    svgEl.innerHTML = `
      <defs>
        <marker id="arrow-muted" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#94a3b8"></path>
        </marker>
        <marker id="arrow-active" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#2563eb"></path>
        </marker>
        <marker id="arrow-downstream" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5.5" markerHeight="5.5" orient="auto-start-reverse">
          <path d="M 0 1 L 10 5 L 0 9 z" fill="#059669"></path>
        </marker>
      </defs>
    `;

    const nodeEls = {};
    canvasEl.querySelectorAll('[data-lib-id]').forEach((el) => {
      nodeEls[el.dataset.libId] = el;
    });

    const focusId = state.hoverId || state.activeId;
    const focusLib = focusId ? LIBRARIES.find((l) => l.id === focusId) : null;
    const activeColor = focusLib ? CATEGORIES[focusLib.category].color : '#2563eb';

    EDGES.forEach((edge, idx) => {
      const fromEl = nodeEls[edge.from];
      const toEl = nodeEls[edge.to];
      if (!fromEl || !toEl) return;

      const fromRect = fromEl.getBoundingClientRect();
      const toRect = toEl.getBoundingClientRect();

      const x1 = fromRect.right - canvasRect.left;
      const y1 = fromRect.top + fromRect.height / 2 - canvasRect.top;
      const x2 = toRect.left - canvasRect.left;
      const y2 = toRect.top + toRect.height / 2 - canvasRect.top;

      const dx = Math.max(36, (x2 - x1) * 0.5);
      const d = `M ${x1} ${y1} C ${x1 + dx} ${y1}, ${x2 - dx} ${y2}, ${x2} ${y2}`;

      const isIncoming = focusId && edge.to === focusId;
      const isOutgoing = focusId && edge.from === focusId;
      const isConnected = isIncoming || isOutgoing;

      const basePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      basePath.setAttribute('d', d);
      basePath.setAttribute('id', `edge-path-${idx}`);

      if (!focusId) {
        // Initial unselected state: ambient flowing ecosystem links
        basePath.setAttribute('class', 'flow-edge is-ambient');
        basePath.setAttribute('marker-end', 'url(#arrow-muted)');
        svgEl.appendChild(basePath);
      } else if (isConnected) {
        const strokeColor = isIncoming ? activeColor : '#059669';
        basePath.setAttribute('class', 'flow-edge is-active');
        basePath.style.stroke = strokeColor;
        basePath.style.opacity = '0.35';
        basePath.setAttribute('marker-end', isIncoming ? 'url(#arrow-active)' : 'url(#arrow-downstream)');
        svgEl.appendChild(basePath);

        const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        overlay.setAttribute('d', d);
        overlay.setAttribute('class', 'flow-edge-overlay');
        overlay.style.stroke = strokeColor;
        svgEl.appendChild(overlay);

        const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        dot.setAttribute('r', '3.5');
        dot.setAttribute('fill', strokeColor);
        const anim = document.createElementNS('http://www.w3.org/2000/svg', 'animateMotion');
        anim.setAttribute('dur', isIncoming ? '1.5s' : '1.85s');
        anim.setAttribute('repeatCount', 'indefinite');
        anim.setAttribute('path', d);
        dot.appendChild(anim);
        svgEl.appendChild(dot);

        const mx = (x1 + x2) / 2;
        const my = (y1 + y2) / 2 - 5;
        const label = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        label.setAttribute('x', mx);
        label.setAttribute('y', my);
        label.setAttribute('text-anchor', 'middle');
        label.setAttribute('font-size', '9.5');
        label.setAttribute('font-weight', '600');
        label.setAttribute('fill', strokeColor);
        label.textContent = edge.label;
        svgEl.appendChild(label);
      } else {
        basePath.setAttribute('class', 'flow-edge is-dimmed');
        basePath.setAttribute('marker-end', 'url(#arrow-muted)');
        svgEl.appendChild(basePath);
      }
    });
  }

  function renderProcessDiagram(containerEl, detailEl, lib, selectedStageIdx, onStageClick) {
    const cat = CATEGORIES[lib.category];
    containerEl.innerHTML = '';

    lib.process.forEach((stage, idx) => {
      const isSelected = idx === selectedStageIdx;

      const stageBtn = document.createElement('button');
      stageBtn.type = 'button';
      stageBtn.className = `process-stage flex-1 min-w-0 rounded-lg border px-2 py-1.5 text-left flex flex-col justify-between ${
        isSelected ? 'is-selected bg-white' : 'bg-slate-50/80 border-slate-200 hover:bg-white'
      }`;
      if (isSelected) {
        stageBtn.style.borderColor = cat.color;
        stageBtn.style.backgroundColor = cat.bg;
      }

      stageBtn.innerHTML = `
        <div class="flex items-center justify-between gap-1">
          <span class="text-[9px] font-bold px-1 rounded" style="background:${isSelected ? cat.color : '#e2e8f0'}; color:${isSelected ? '#ffffff' : '#475569'};">
            ${idx + 1}
          </span>
          <span class="text-[9px] font-mono font-semibold truncate" style="color:${cat.color};">${stage.badge}</span>
        </div>
        <div class="text-[10.5px] font-semibold text-slate-800 truncate mt-0.5">${stage.title}</div>
      `;

      stageBtn.addEventListener('click', () => onStageClick(idx));
      containerEl.appendChild(stageBtn);

      if (idx < lib.process.length - 1) {
        const arrowWrap = document.createElement('div');
        arrowWrap.className = 'flex items-center shrink-0';
        arrowWrap.innerHTML = `
          <svg class="w-3.5 h-3.5" viewBox="0 0 18 14" fill="none">
            <path d="M1 7h13" stroke="${cat.color}" stroke-width="1.75" class="process-arrow"/>
            <path d="M11 3l4 4-4 4" stroke="${cat.color}" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
        `;
        containerEl.appendChild(arrowWrap);
      }
    });

    const activeStage = lib.process[selectedStageIdx] || lib.process[0];
    detailEl.innerHTML = `
      <div class="flex items-start gap-2 animate-pop">
        <span class="text-[9.5px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded shrink-0 mt-0.5" style="background:${cat.bg}; color:${cat.color};">
          Step ${selectedStageIdx + 1}: ${activeStage.title}
        </span>
        <p class="text-[11.5px] text-slate-700 leading-snug">${activeStage.detail}</p>
      </div>
    `;
  }

  return {
    ICONS,
    getRelatedSet,
    renderEcosystemNodes,
    renderEcosystemEdges,
    renderProcessDiagram
  };
})();
