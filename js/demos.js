/**
 * Python Ecosystem Explainer - Interactive Vanilla JS Demonstrations
 * Provides a live, interactive simulation widget for each library/framework.
 */
window.PyExplainer = window.PyExplainer || {};

window.PyExplainer.Demos = (function () {
  function renderDemo(container, libId) {
    switch (libId) {
      case 'python':
        return renderPythonDemo(container);
      case 'numpy':
        return renderNumpyDemo(container);
      case 'pandas':
        return renderPandasDemo(container);
      case 'matplotlib':
        return renderMatplotlibDemo(container);
      case 'scikit-learn':
        return renderSklearnDemo(container);
      case 'pytorch':
        return renderPytorchDemo(container);
      case 'flask':
        return renderFlaskDemo(container);
      case 'django':
        return renderDjangoDemo(container);
      case 'fastapi':
        return renderFastapiDemo(container);
      case 'requests':
        return renderRequestsDemo(container);
      case 'pytest':
        return renderPytestDemo(container);
      default:
        container.innerHTML = '<p class="text-xs text-slate-500">Select a node to launch its demo.</p>';
    }
  }

  function renderPythonDemo(container) {
    const modes = {
      list: {
        label: 'List Comprehension',
        steps: [
          { stage: 'AST Parse', mem: 'nums = [1, 2, 3, 4]', out: 'Builds loop node for x*x' },
          { stage: 'Bytecode', mem: 'LIST_APPEND in loop', out: 'Allocates eager list buffer' },
          { stage: 'CPython Eval', mem: '[1, 4, 9, 16] (96 bytes)', out: 'Result: [1, 4, 9, 16]' }
        ]
      },
      gen: {
        label: 'Generator (yield)',
        steps: [
          { stage: 'AST Parse', mem: 'gen = (x*x for x in nums)', out: 'Marks frame as suspendable' },
          { stage: 'Lazy Frame', mem: '<generator object> (112B)', out: 'Yields item #1 -> 1 on next()' },
          { stage: 'Stream Done', mem: 'Peak RAM: 1 item at a time', out: 'Memory-safe for 10M rows' }
        ]
      },
      dict: {
        label: 'Dict Hash Table',
        steps: [
          { stage: 'hash(key)', mem: 'hash("py") -> slot #4', out: 'O(1) bucket probe' },
          { stage: 'Store Entry', mem: '{"py": 3.12}', out: 'Compact key/value table' },
          { stage: 'Lookup', mem: 'table["py"] -> 3.12', out: 'Instant constant-time fetch' }
        ]
      }
    };

    let currentMode = 'list';
    let stepIdx = 0;

    function draw() {
      const m = modes[currentMode];
      const s = m.steps[stepIdx];
      container.innerHTML = `
        <div class="flex flex-col gap-2 h-full justify-between animate-pop">
          <div class="flex flex-wrap items-center justify-between gap-1.5">
            <div class="flex gap-1">
              ${Object.keys(modes).map((k) => `
                <button data-mode="${k}" class="px-2 py-1 rounded text-[11px] font-medium border transition ${
                  k === currentMode ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }">${modes[k].label}</button>
              `).join('')}
            </div>
            <button id="py-step-btn" class="px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold">
              Step (${stepIdx + 1}/3) →
            </button>
          </div>
          <div class="grid grid-cols-3 gap-2">
            ${m.steps.map((st, i) => `
              <div class="p-2 rounded-lg border text-left transition ${
                i === stepIdx ? 'border-blue-500 bg-blue-50/70' : 'border-slate-200 bg-slate-50/60 opacity-65'
              }">
                <div class="text-[10px] font-bold text-slate-500">Stage ${i + 1}</div>
                <div class="text-xs font-semibold text-slate-800">${st.stage}</div>
              </div>
            `).join('')}
          </div>
          <div class="rounded-lg bg-slate-900 text-slate-100 p-2.5 font-mono text-[11px] flex flex-col gap-1">
            <div><span class="text-slate-400">VM Frame:</span> <span class="text-sky-300">${s.mem}</span></div>
            <div><span class="text-slate-400">Behavior:</span> <span class="text-emerald-300">${s.out}</span></div>
          </div>
        </div>
      `;

      container.querySelectorAll('[data-mode]').forEach((btn) => {
        btn.addEventListener('click', () => {
          currentMode = btn.dataset.mode;
          stepIdx = 0;
          draw();
        });
      });
      container.querySelector('#py-step-btn').addEventListener('click', () => {
        stepIdx = (stepIdx + 1) % 3;
        draw();
      });
    }
    draw();
  }

  function renderNumpyDemo(container) {
    let base = [[2, 4, 6], [8, 10, 12]];
    let op = 'orig';

    function compute() {
      if (op === 'orig') return { shape: '(2, 3)', data: base, note: 'Contiguous float/int array in RAM' };
      if (op === 'transpose') {
        const t = [0, 1, 2].map((c) => [base[0][c], base[1][c]]);
        return { shape: '(3, 2)', data: t, note: 'Zero-copy stride view (.T)' };
      }
      if (op === 'broadcast') {
        const b = base.map((r) => r.map((v) => v + 10));
        return { shape: '(2, 3)', data: b, note: 'Scalar +10 broadcasted across all cells in C' };
      }
      if (op === 'reshape') {
        const flat = base.flat();
        return { shape: '(3, 2)', data: [[flat[0], flat[1]], [flat[2], flat[3]], [flat[4], flat[5]]], note: 'reshape(3, 2) re-indexes the same buffer' };
      }
      const means = [0, 1, 2].map((c) => Number(((base[0][c] + base[1][c]) / 2).toFixed(1)));
      return { shape: '(3,)', data: [means], note: 'axis=0 collapses rows via SIMD mean()' };
    }

    function draw() {
      const res = compute();
      const maxVal = Math.max(...res.data.flat(), 1);
      container.innerHTML = `
        <div class="flex flex-col gap-2 h-full justify-between animate-pop">
          <div class="flex flex-wrap gap-1">
            ${[
              ['orig', 'Original'],
              ['transpose', 'grid.T'],
              ['broadcast', 'grid + 10'],
              ['reshape', 'reshape(3,2)'],
              ['mean', 'mean(axis=0)']
            ].map(([id, lbl]) => `
              <button data-np-op="${id}" class="px-2 py-1 rounded text-[11px] font-mono font-medium border transition ${
                op === id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200 hover:bg-blue-50'
              }">${lbl}</button>
            `).join('')}
          </div>
          <div class="flex items-center justify-between gap-3 bg-slate-50 border border-slate-200 rounded-lg p-2.5">
            <div class="flex flex-col gap-1.5">
              ${res.data.map((row, rIdx) => `
                <div class="flex gap-1.5">
                  ${row.map((val, cIdx) => {
                    const intensity = Math.min(0.85, 0.15 + (val / (maxVal + 4)) * 0.7);
                    return `
                      <button data-cell="${rIdx}-${cIdx}" title="${op === 'orig' ? 'Click cell to +2' : ''}"
                        class="matrix-cell w-12 h-8 rounded-md font-mono text-xs font-bold border border-blue-200 flex items-center justify-center"
                        style="background: rgba(37, 99, 235, ${intensity}); color: ${intensity > 0.5 ? '#ffffff' : '#1e3a8a'};">
                        ${val}
                      </button>
                    `;
                  }).join('')}
                </div>
              `).join('')}
            </div>
            <div class="text-right font-mono text-[11px] text-slate-600 flex flex-col gap-1">
              <div>shape: <span class="font-bold text-blue-700">${res.shape}</span></div>
              <div>dtype: <span class="text-slate-800">int64</span></div>
              <div class="text-[10px] font-sans text-slate-500 max-w-[140px]">${op === 'orig' ? 'Tip: click any cell to +2' : res.note}</div>
            </div>
          </div>
          <div class="text-[11px] font-mono text-slate-600 bg-slate-100 rounded px-2.5 py-1">
            ${res.note}
          </div>
        </div>
      `;

      container.querySelectorAll('[data-np-op]').forEach((b) => {
        b.addEventListener('click', () => {
          op = b.dataset.npOp;
          draw();
        });
      });
      if (op === 'orig') {
        container.querySelectorAll('[data-cell]').forEach((cell) => {
          cell.addEventListener('click', () => {
            const [r, c] = cell.dataset.cell.split('-').map(Number);
            base[r][c] = base[r][c] >= 20 ? 2 : base[r][c] + 2;
            draw();
          });
        });
      }
    }
    draw();
  }

  function renderPandasDemo(container) {
    const rows = [
      { name: 'Amina', track: 'AI/ML', score: 94 },
      { name: 'Bilal', track: 'Web', score: 82 },
      { name: 'Sara', track: 'AI/ML', score: 88 },
      { name: 'Zain', track: 'Web', score: 91 },
      { name: 'Hina', track: 'Data', score: 79 }
    ];
    let filter85 = false;
    let sortDesc = false;
    let groupBy = false;

    function draw() {
      let active = rows.filter((r) => (!filter85 ? true : r.score >= 85));
      if (sortDesc) active = [...active].sort((a, b) => b.score - a.score);

      let displayHtml = '';
      if (groupBy) {
        const groups = {};
        active.forEach((r) => {
          groups[r.track] = groups[r.track] || [];
          groups[r.track].push(r.score);
        });
        const agg = Object.entries(groups).map(([track, scores]) => ({
          track,
          count: scores.length,
          mean: (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1)
        }));
        displayHtml = `
          <table class="w-full text-left text-[11px] font-mono">
            <thead class="bg-blue-50 text-blue-800">
              <tr><th class="px-2 py-1">track (index)</th><th class="px-2 py-1">count</th><th class="px-2 py-1">mean(score)</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${agg.map((g) => `<tr><td class="px-2 py-1 font-semibold">${g.track}</td><td class="px-2 py-1">${g.count}</td><td class="px-2 py-1 text-blue-700 font-bold">${g.mean}</td></tr>`).join('')}
            </tbody>
          </table>
        `;
      } else {
        displayHtml = `
          <table class="w-full text-left text-[11px] font-mono">
            <thead class="bg-slate-100 text-slate-600">
              <tr><th class="px-2 py-1">#</th><th class="px-2 py-1">name</th><th class="px-2 py-1">track</th><th class="px-2 py-1">score</th></tr>
            </thead>
            <tbody class="divide-y divide-slate-100">
              ${active.map((r, i) => `
                <tr>
                  <td class="px-2 py-1 text-slate-400">${i}</td>
                  <td class="px-2 py-1 font-semibold text-slate-800">${r.name}</td>
                  <td class="px-2 py-1"><span class="px-1.5 py-0.2 rounded bg-blue-50 text-blue-700">${r.track}</span></td>
                  <td class="px-2 py-1 font-bold ${r.score >= 85 ? 'text-emerald-600' : 'text-amber-600'}">${r.score}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        `;
      }

      container.innerHTML = `
        <div class="flex flex-col gap-1.5 h-full justify-between animate-pop">
          <div class="flex flex-wrap gap-1.5">
            <button id="pd-filter" class="px-2 py-0.5 rounded text-[11px] font-mono border ${filter85 ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'}">
              score >= 85
            </button>
            <button id="pd-sort" class="px-2 py-0.5 rounded text-[11px] font-mono border ${sortDesc ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'}">
              sort_values(desc)
            </button>
            <button id="pd-group" class="px-2 py-0.5 rounded text-[11px] font-mono border ${groupBy ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-700 border-slate-200'}">
              groupby("track").mean()
            </button>
          </div>
          <div class="border border-slate-200 rounded-lg overflow-y-auto slim-scroll bg-white max-h-[104px]">${displayHtml}</div>
          <div class="text-[11px] font-mono text-slate-500 truncate">
            Pipeline: df${filter85 ? '[df["score"]>=85]' : ''}${sortDesc ? '.sort_values("score")' : ''}${groupBy ? '.groupby("track").mean()' : ''} → ${active.length} rows
          </div>
        </div>
      `;

      container.querySelector('#pd-filter').addEventListener('click', () => { filter85 = !filter85; draw(); });
      container.querySelector('#pd-sort').addEventListener('click', () => { sortDesc = !sortDesc; draw(); });
      container.querySelector('#pd-group').addEventListener('click', () => { groupBy = !groupBy; draw(); });
    }
    draw();
  }

  function renderMatplotlibDemo(container) {
    let chartType = 'line';
    let showGrid = true;
    let scale = 1.0;
    const basePts = [42, 58, 65, 81, 93];

    function draw() {
      const pts = basePts.map((v) => Math.min(98, Math.round(v * scale)));
      const w = 320;
      const h = 118;
      const padL = 28;
      const padB = 18;
      const plotW = w - padL - 12;
      const plotH = h - padB - 10;

      const coords = pts.map((v, i) => ({
        x: padL + (i / (pts.length - 1)) * (plotW - 24) + 12,
        y: 10 + plotH - (v / 100) * plotH,
        v
      }));

      let seriesSvg = '';
      if (chartType === 'line') {
        const d = coords.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ');
        seriesSvg = `
          <path d="${d}" fill="none" stroke="#2563eb" stroke-width="2.5" stroke-linecap="round"/>
          ${coords.map((p) => `<circle cx="${p.x}" cy="${p.y}" r="4" fill="#ffffff" stroke="#2563eb" stroke-width="2"/>`).join('')}
        `;
      } else if (chartType === 'bar') {
        seriesSvg = coords.map((p) => `
          <rect x="${p.x - 11}" y="${p.y}" width="22" height="${10 + plotH - p.y}" rx="3" fill="#3b82f6" opacity="0.88"/>
        `).join('');
      } else {
        seriesSvg = coords.map((p, i) => `
          <circle cx="${p.x}" cy="${p.y}" r="${5 + (i % 2) * 2}" fill="#7c3aed" opacity="0.82"/>
        `).join('');
      }

      container.innerHTML = `
        <div class="flex flex-col gap-2 h-full justify-between animate-pop">
          <div class="flex flex-wrap items-center justify-between gap-2">
            <div class="flex gap-1">
              ${['line', 'bar', 'scatter'].map((t) => `
                <button data-mpl="${t}" class="px-2 py-1 rounded text-[11px] font-medium border capitalize ${
                  chartType === t ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 border-slate-200'
                }">ax.${t}()</button>
              `).join('')}
              <button id="mpl-grid" class="px-2 py-1 rounded text-[11px] font-medium border ${
                showGrid ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'
              }">grid</button>
            </div>
            <label class="flex items-center gap-1.5 text-[11px] text-slate-600">
              <span>Scale: ${scale.toFixed(1)}x</span>
              <input id="mpl-scale" type="range" min="0.5" max="1.1" step="0.1" value="${scale}" class="w-20 accent-blue-600">
            </label>
          </div>
          <div class="bg-white border border-slate-200 rounded-lg p-1.5 flex items-center justify-center">
            <svg viewBox="0 0 ${w} ${h}" class="w-full max-h-[128px]">
              ${showGrid ? [25, 50, 75].map((g) => {
                const gy = 10 + plotH - (g / 100) * plotH;
                return `<line x1="${padL}" y1="${gy}" x2="${w - 10}" y2="${gy}" stroke="#e2e8f0" stroke-dasharray="3 3"/>`;
              }).join('') : ''}
              <line x1="${padL}" y1="10" x2="${padL}" y2="${10 + plotH}" stroke="#64748b" stroke-width="1.2"/>
              <line x1="${padL}" y1="${10 + plotH}" x2="${w - 10}" y2="${10 + plotH}" stroke="#64748b" stroke-width="1.2"/>
              ${seriesSvg}
              ${coords.map((p, i) => `<text x="${p.x}" y="${h - 4}" text-anchor="middle" font-size="9" fill="#64748b">E${i + 1}</text>`).join('')}
            </svg>
          </div>
          <div class="text-[11px] font-mono text-slate-500">Values: [${pts.join(', ')}] · Figure + Axes Artist Tree</div>
        </div>
      `;

      container.querySelectorAll('[data-mpl]').forEach((b) => {
        b.addEventListener('click', () => { chartType = b.dataset.mpl; draw(); });
      });
      container.querySelector('#mpl-grid').addEventListener('click', () => { showGrid = !showGrid; draw(); });
      container.querySelector('#mpl-scale').addEventListener('input', (e) => { scale = parseFloat(e.target.value); draw(); });
    }
    draw();
  }

  function renderSklearnDemo(container) {
    let threshold = 50;
    const samples = [
      { x: 18, y: 78, trueCls: 0 }, { x: 26, y: 62, trueCls: 0 }, { x: 35, y: 80, trueCls: 0 },
      { x: 42, y: 50, trueCls: 0 }, { x: 56, y: 38, trueCls: 1 }, { x: 64, y: 65, trueCls: 1 },
      { x: 74, y: 30, trueCls: 1 }, { x: 86, y: 45, trueCls: 1 }
    ];

    function draw() {
      let correct = 0;
      samples.forEach((s) => {
        const pred = s.x >= threshold ? 1 : 0;
        if (pred === s.trueCls) correct += 1;
      });
      const acc = Math.round((correct / samples.length) * 100);
      const bx = 20 + (threshold / 100) * 260;

      container.innerHTML = `
        <div class="flex flex-col gap-2 h-full justify-between animate-pop">
          <div class="flex items-center justify-between gap-2">
            <label class="flex items-center gap-2 text-[11px] font-medium text-slate-700">
              <span>Decision Boundary (x = ${threshold})</span>
              <input id="sk-thresh" type="range" min="20" max="85" value="${threshold}" class="w-28 accent-violet-600">
            </label>
            <span class="px-2 py-0.5 rounded-full text-[11px] font-mono font-bold ${
              acc >= 85 ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
            }">Accuracy: ${acc}%</span>
          </div>
          <div class="bg-white border border-slate-200 rounded-lg p-1.5">
            <svg viewBox="0 0 300 105" class="w-full max-h-[115px]">
              <rect x="20" y="8" width="${bx - 20}" height="82" fill="#ede9fe" opacity="0.55"/>
              <rect x="${bx}" y="8" width="${280 - bx}" height="82" fill="#dbeafe" opacity="0.55"/>
              <line x1="${bx}" y1="8" x2="${bx}" y2="90" stroke="#7c3aed" stroke-width="2" stroke-dasharray="4 3"/>
              ${samples.map((s) => {
                const cx = 20 + (s.x / 100) * 260;
                const cy = 90 - (s.y / 100) * 82;
                const pred = s.x >= threshold ? 1 : 0;
                const ok = pred === s.trueCls;
                return `
                  <circle cx="${cx}" cy="${cy}" r="5" fill="${s.trueCls === 0 ? '#7c3aed' : '#2563eb'}"
                    stroke="${ok ? '#ffffff' : '#ef4444'}" stroke-width="2"/>
                `;
              }).join('')}
              <text x="26" y="20" font-size="9" fill="#6d28d9" font-weight="600">Class A</text>
              <text x="240" y="20" font-size="9" fill="#1d4ed8" font-weight="600">Class B</text>
            </svg>
          </div>
          <div class="text-[11px] font-mono text-slate-500">
            pipe.fit(X_train, y_train) → ${correct}/${samples.length} points classified cleanly
          </div>
        </div>
      `;

      container.querySelector('#sk-thresh').addEventListener('input', (e) => {
        threshold = Number(e.target.value);
        draw();
      });
    }
    draw();
  }

  function renderPytorchDemo(container) {
    let x = 1.5;
    let w = 0.8;
    let b = -0.2;
    let target = 1.0;

    function draw() {
      const z = w * x + b;
      const pred = 1 / (1 + Math.exp(-z));
      const loss = Math.pow(pred - target, 2);
      const gradW = 2 * (pred - target) * pred * (1 - pred) * x;

      container.innerHTML = `
        <div class="flex flex-col gap-2 h-full justify-between animate-pop">
          <div class="grid grid-cols-2 gap-2 text-[11px]">
            <label class="flex flex-col bg-slate-50 p-1.5 rounded border border-slate-200">
              <span class="font-mono text-slate-600">input x = <b>${x.toFixed(1)}</b></span>
              <input id="pt-x" type="range" min="-2" max="3" step="0.1" value="${x}" class="accent-violet-600">
            </label>
            <label class="flex flex-col bg-slate-50 p-1.5 rounded border border-slate-200">
              <span class="font-mono text-slate-600">weight w = <b>${w.toFixed(1)}</b></span>
              <input id="pt-w" type="range" min="-2" max="3" step="0.1" value="${w}" class="accent-violet-600">
            </label>
          </div>
          <div class="bg-slate-900 text-slate-100 rounded-lg p-2.5 font-mono text-[11px] grid grid-cols-3 gap-2 text-center">
            <div class="bg-slate-800 rounded p-1.5">
              <div class="text-[9px] text-slate-400">Forward σ(wx+b)</div>
              <div class="text-sm font-bold text-violet-300">${pred.toFixed(3)}</div>
            </div>
            <div class="bg-slate-800 rounded p-1.5">
              <div class="text-[9px] text-slate-400">MSE Loss</div>
              <div class="text-sm font-bold text-amber-300">${loss.toFixed(3)}</div>
            </div>
            <div class="bg-slate-800 rounded p-1.5">
              <div class="text-[9px] text-slate-400">Autograd ∂L/∂w</div>
              <div class="text-sm font-bold text-emerald-300">${gradW.toFixed(3)}</div>
            </div>
          </div>
          <div class="flex items-center justify-between gap-2">
            <span class="text-[11px] font-mono text-slate-500">Target = 1.0 · Step nudges w opposite ∂L/∂w</span>
            <button id="pt-step" class="px-2.5 py-1 rounded bg-violet-600 hover:bg-violet-700 text-white text-[11px] font-semibold">
              optimizer.step()
            </button>
          </div>
        </div>
      `;

      container.querySelector('#pt-x').addEventListener('input', (e) => { x = parseFloat(e.target.value); draw(); });
      container.querySelector('#pt-w').addEventListener('input', (e) => { w = parseFloat(e.target.value); draw(); });
      container.querySelector('#pt-step').addEventListener('click', () => {
        w = Math.max(-2, Math.min(3, +(w - 0.5 * gradW).toFixed(2)));
        draw();
      });
    }
    draw();
  }

  function renderFlaskDemo(container) {
    let route = '/greet';
    let nameVal = 'Ada';

    function draw() {
      const payload = route === '/greet'
        ? `{\n  "message": "Hello, ${nameVal || 'Developer'}!",\n  "framework": "Flask WSGI"\n}`
        : route === '/api/health'
          ? `{\n  "status": "ok",\n  "worker": "sync-wsgi"\n}`
          : `<html><body><h1>Profile: ${nameVal || 'Guest'}</h1></body></html>`;

      container.innerHTML = `
        <div class="flex flex-col gap-2 h-full justify-between animate-pop">
          <div class="flex flex-wrap items-center gap-1.5">
            ${['/greet', '/api/health', '/profile'].map((r) => `
              <button data-fl-route="${r}" class="px-2 py-1 rounded text-[11px] font-mono border ${
                route === r ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200'
              }">GET ${r}</button>
            `).join('')}
            <input id="fl-name" type="text" value="${nameVal}" placeholder="name param"
              class="px-2 py-1 text-[11px] font-mono border border-slate-300 rounded w-24 focus:outline-none focus:border-emerald-500">
          </div>
          <div class="text-[11px] font-mono bg-emerald-50 border border-emerald-200 text-emerald-800 rounded px-2.5 py-1">
            Werkzeug matched <span class="font-bold">@app.get("${route}")</span> → 200 OK
          </div>
          <pre class="bg-slate-900 text-emerald-300 font-mono text-[11px] rounded-lg p-2.5 overflow-x-auto m-0">${payload.replace(/</g, '&lt;')}</pre>
        </div>
      `;

      container.querySelectorAll('[data-fl-route]').forEach((b) => {
        b.addEventListener('click', () => { route = b.dataset.flRoute; draw(); });
      });
      container.querySelector('#fl-name').addEventListener('input', (e) => {
        nameVal = e.target.value;
        const pre = container.querySelector('pre');
        if (pre) {
          pre.textContent = route === '/greet'
            ? `{\n  "message": "Hello, ${nameVal || 'Developer'}!",\n  "framework": "Flask WSGI"\n}`
            : route === '/api/health'
              ? `{\n  "status": "ok",\n  "worker": "sync-wsgi"\n}`
              : `<html><body><h1>Profile: ${nameVal || 'Guest'}</h1></body></html>`;
        }
      });
    }
    draw();
  }

  function renderDjangoDemo(container) {
    let queryType = 'active';
    const projects = [
      { title: 'Python Map', active: true, stars: 48 },
      { title: 'ML Pipeline', active: true, stars: 92 },
      { title: 'Legacy v1', active: false, stars: 11 }
    ];

    function draw() {
      const list = queryType === 'active'
        ? projects.filter((p) => p.active)
        : queryType === 'top'
          ? [...projects].sort((a, b) => b.stars - a.stars)
          : projects;
      const sql = queryType === 'active'
        ? 'SELECT * FROM project WHERE is_active = TRUE;'
        : queryType === 'top'
          ? 'SELECT * FROM project ORDER BY stars DESC;'
          : 'SELECT * FROM project;';

      container.innerHTML = `
        <div class="flex flex-col gap-2 h-full justify-between animate-pop">
          <div class="flex flex-wrap gap-1">
            <button data-dj="active" class="px-2 py-1 rounded text-[11px] font-mono border ${queryType === 'active' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200'}">.filter(is_active=True)</button>
            <button data-dj="top" class="px-2 py-1 rounded text-[11px] font-mono border ${queryType === 'top' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200'}">.order_by("-stars")</button>
            <button data-dj="all" class="px-2 py-1 rounded text-[11px] font-mono border ${queryType === 'all' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-slate-700 border-slate-200'}">.all()</button>
          </div>
          <div class="bg-slate-900 text-sky-300 font-mono text-[10.5px] rounded px-2.5 py-1.5">
            ORM SQL: ${sql}
          </div>
          <div class="bg-white border border-slate-200 rounded-lg p-2 flex flex-col gap-1">
            <div class="text-[10px] font-bold uppercase text-slate-400">Rendered Template Output</div>
            ${list.map((p) => `
              <div class="flex items-center justify-between text-xs px-2 py-1 rounded bg-slate-50 border border-slate-100">
                <span class="font-medium text-slate-800">${p.title}</span>
                <span class="font-mono text-[11px] text-emerald-700">★ ${p.stars}</span>
              </div>
            `).join('')}
          </div>
        </div>
      `;
      container.querySelectorAll('[data-dj]').forEach((b) => {
        b.addEventListener('click', () => { queryType = b.dataset.dj; draw(); });
      });
    }
    draw();
  }

  function renderFastapiDemo(container) {
    let itemId = '42';
    let price = '19.50';

    function draw() {
      const validId = /^\d+$/.test(itemId.trim());
      const validPrice = !Number.isNaN(parseFloat(price)) && parseFloat(price) > 0;
      const isValid = validId && validPrice;

      const body = isValid
        ? `{\n  "status": "200 OK",\n  "id": ${parseInt(itemId, 10)},\n  "price": ${parseFloat(price).toFixed(2)},\n  "validated_by": "Pydantic v2"\n}`
        : `{\n  "detail": [{\n    "loc": ["${!validId ? 'path.item_id' : 'body.price'}"],\n    "msg": "${!validId ? 'Input should be a valid integer' : 'Price must be > 0'}",\n    "type": "validation_error"\n  }]\n}`;

      container.innerHTML = `
        <div class="flex flex-col gap-2 h-full justify-between animate-pop">
          <div class="grid grid-cols-2 gap-2">
            <label class="text-[11px] font-mono text-slate-600 flex flex-col gap-0.5">
              <span>item_id: int (try "abc")</span>
              <input id="fa-id" type="text" value="${itemId}" class="px-2 py-1 rounded border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-500">
            </label>
            <label class="text-[11px] font-mono text-slate-600 flex flex-col gap-0.5">
              <span>price: float</span>
              <input id="fa-price" type="text" value="${price}" class="px-2 py-1 rounded border border-slate-300 text-xs text-slate-900 focus:outline-none focus:border-emerald-500">
            </label>
          </div>
          <div class="flex items-center justify-between text-[11px] font-mono px-2.5 py-1 rounded ${
            isValid ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-rose-50 text-rose-700 border border-rose-200'
          }">
            <span>POST /items/${itemId || '?'}</span>
            <span class="font-bold">${isValid ? '200 OK · Async ASGI' : '422 Unprocessable Entity'}</span>
          </div>
          <pre class="bg-slate-900 font-mono text-[11px] rounded-lg p-2.5 m-0 ${isValid ? 'text-emerald-300' : 'text-rose-300'}">${body}</pre>
        </div>
      `;

      container.querySelector('#fa-id').addEventListener('input', (e) => { itemId = e.target.value; draw(); const el = container.querySelector('#fa-id'); el.focus(); el.setSelectionRange(itemId.length, itemId.length); });
      container.querySelector('#fa-price').addEventListener('input', (e) => { price = e.target.value; draw(); const el = container.querySelector('#fa-price'); el.focus(); el.setSelectionRange(price.length, price.length); });
    }
    draw();
  }

  function renderRequestsDemo(container) {
    let endpoint = 'github';
    let withAuth = true;

    function draw() {
      const specs = {
        github: { method: 'GET', url: 'https://api.github.com/repos/python/cpython', status: '200 OK', json: '{"name": "cpython", "stars": 64200, "lang": "Python"}' },
        webhook: { method: 'POST', url: 'https://hooks.app/events', status: '201 Created', json: '{"received": true, "event": "day1_push"}' },
        private: { method: 'GET', url: 'https://api.service.dev/admin', status: withAuth ? '200 OK' : '401 Unauthorized', json: withAuth ? '{"access": "granted", "role": "reviewer"}' : '{"error": "Missing Bearer token"}' }
      };
      const cur = specs[endpoint];
      const ok = cur.status.startsWith('2');

      container.innerHTML = `
        <div class="flex flex-col gap-2 h-full justify-between animate-pop">
          <div class="flex flex-wrap items-center justify-between gap-1.5">
            <div class="flex gap-1">
              <button data-req="github" class="px-2 py-1 rounded text-[11px] font-mono border ${endpoint === 'github' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-700 border-slate-200'}">GET Repo</button>
              <button data-req="webhook" class="px-2 py-1 rounded text-[11px] font-mono border ${endpoint === 'webhook' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-700 border-slate-200'}">POST Hook</button>
              <button data-req="private" class="px-2 py-1 rounded text-[11px] font-mono border ${endpoint === 'private' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-slate-700 border-slate-200'}">Auth API</button>
            </div>
            <button id="req-auth" class="px-2 py-1 rounded text-[11px] font-mono border ${withAuth ? 'bg-slate-800 text-white border-slate-800' : 'bg-white text-slate-600 border-slate-200'}">
              Bearer: ${withAuth ? 'ON' : 'OFF'}
            </button>
          </div>
          <div class="flex items-center justify-between text-[11px] font-mono bg-slate-100 rounded px-2.5 py-1">
            <span class="truncate text-slate-700"><b>${cur.method}</b> ${cur.url}</span>
            <span class="font-bold shrink-0 ml-2 ${ok ? 'text-emerald-700' : 'text-rose-600'}">${cur.status}</span>
          </div>
          <pre class="bg-slate-900 text-amber-200 font-mono text-[11px] rounded-lg p-2.5 m-0 overflow-x-auto">${cur.json}</pre>
        </div>
      `;

      container.querySelectorAll('[data-req]').forEach((b) => {
        b.addEventListener('click', () => { endpoint = b.dataset.req; draw(); });
      });
      container.querySelector('#req-auth').addEventListener('click', () => { withAuth = !withAuth; draw(); });
    }
    draw();
  }

  function renderPytestDemo(container) {
    let injectBug = false;

    function draw() {
      const cases = [
        { name: 'test_average_above_85[bonus=0]', pass: !injectBug, detail: injectBug ? 'AssertionError: assert 81.2 >= 85' : 'avg = 91.7 >= 85' },
        { name: 'test_average_above_85[bonus=5]', pass: true, detail: 'avg = 96.7 >= 85' },
        { name: 'test_fixture_cleanup', pass: true, detail: 'Teardown verified' }
      ];
      const allPass = cases.every((c) => c.pass);

      container.innerHTML = `
        <div class="flex flex-col gap-2 h-full justify-between animate-pop">
          <div class="flex items-center justify-between gap-2">
            <button id="pt-bug" class="px-2.5 py-1 rounded text-[11px] font-mono border ${
              injectBug ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-slate-700 border-slate-200'
            }">${injectBug ? 'Bug Injected (score=75)' : 'Simulate Regression Bug'}</button>
            <span class="px-2 py-0.5 rounded font-mono text-[11px] font-bold ${
              allPass ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
            }">${allPass ? '3 passed' : '1 failed, 2 passed'}</span>
          </div>
          <div class="bg-slate-900 rounded-lg p-2.5 font-mono text-[11px] flex flex-col gap-1.5">
            ${cases.map((c) => `
              <div class="flex items-center justify-between gap-2">
                <span class="text-slate-300 truncate">${c.name}</span>
                <span class="font-bold shrink-0 ${c.pass ? 'text-emerald-400' : 'text-rose-400'}">${c.pass ? 'PASSED' : 'FAILED'}</span>
              </div>
              ${!c.pass ? `<div class="text-[10px] text-rose-300 pl-2 border-l-2 border-rose-500">E ${c.detail}</div>` : ''}
            `).join('')}
          </div>
          <div class="text-[11px] font-mono text-slate-500">$ pytest -v · Fixtures + AST Assertion Diff</div>
        </div>
      `;

      container.querySelector('#pt-bug').addEventListener('click', () => { injectBug = !injectBug; draw(); });
    }
    draw();
  }

  return { renderDemo };
})();
