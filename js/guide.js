/**
 * Python Ecosystem Explainer - Scrollable Educational Guide & Knowledge Check
 * Renders deep-dive sections (explanation, purpose, internal process,
 * use cases, code walkthrough, advantages/limitations) and interactive quiz.
 */
window.PyExplainer = window.PyExplainer || {};

window.PyExplainer.Guide = (function () {
  const { CATEGORIES, LIBRARIES, QUIZ_QUESTIONS, Diagram } = window.PyExplainer;

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

  function renderLibraryGuides(containerEl, onFocusVisualizer) {
    containerEl.innerHTML = '';

    LIBRARIES.forEach((lib) => {
      const cat = CATEGORIES[lib.category];
      const article = document.createElement('article');
      article.id = `guide-${lib.id}`;
      article.dataset.guideId = lib.id;
      article.className = 'scroll-mt-16 bg-white border border-slate-200 rounded-2xl shadow-sm p-5 sm:p-7 flex flex-col gap-5 transition';

      const buildCodeLinesHtml = (activeLines = []) => {
        const hi = new Set(activeLines);
        return lib.code
          .map((line, i) => {
            const lineNum = i + 1;
            return `
              <div class="code-line ${hi.has(lineNum) ? 'is-highlighted' : ''}" data-code-line="${lineNum}">
                <span class="code-linenum">${lineNum}</span>
                <span class="whitespace-pre">${highlightPythonLine(line)}</span>
              </div>
            `;
          })
          .join('');
      };

      article.innerHTML = `
        <!-- Header -->
        <div class="flex flex-wrap items-start justify-between gap-3 pb-4 border-b border-slate-100">
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-xl border flex items-center justify-center shrink-0 mt-0.5"
              style="background:${cat.bg}; color:${cat.color}; border-color:${cat.border};">
              ${Diagram.ICONS[lib.id] || ''}
            </div>
            <div>
              <div class="flex flex-wrap items-center gap-2">
                <h3 class="text-xl font-bold text-slate-900">${lib.name}</h3>
                <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full" style="background:${cat.bg}; color:${cat.color};">${cat.label}</span>
                <span class="text-[11px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">${lib.kind}</span>
              </div>
              <p class="text-sm text-slate-500 mt-0.5">${lib.tagline}</p>
            </div>
          </div>

          <div class="flex items-center gap-2 shrink-0">
            <code class="text-xs px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-slate-700">${lib.pipInstall}</code>
            <button type="button" data-focus-viz="${lib.id}"
              class="px-3 py-1.5 rounded-lg text-xs font-semibold border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 transition">
              Focus in Visualizer ↑
            </button>
          </div>
        </div>

        <!-- Explanation & Purpose -->
        <div class="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div class="md:col-span-7">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">What It Is & Explanation</h4>
            <p class="text-[14.5px] leading-relaxed text-slate-700">${lib.explanation}</p>
          </div>
          <div class="md:col-span-5 bg-slate-50 border border-slate-200/80 rounded-xl p-3.5 flex flex-col justify-between gap-3">
            <div>
              <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">Core Purpose</h4>
              <p class="text-sm leading-relaxed text-slate-700">${lib.purpose}</p>
            </div>
            <div>
              <h4 class="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">Real-World Use Cases</h4>
              <div class="flex flex-wrap gap-1.5">
                ${lib.useCases.map((u) => `<span class="text-xs px-2.5 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">${u}</span>`).join('')}
              </div>
            </div>
          </div>
        </div>

        <!-- How It Works Internally -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">How ${lib.name} Works Internally (Click a Stage to Highlight Code)</h4>
            <span class="text-[11px] text-slate-400">${lib.process.length}-Stage Execution Pipeline</span>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            ${lib.process
              .map(
                (st, idx) => `
              <button type="button" data-guide-stage="${idx}"
                class="text-left p-3 rounded-xl border transition ${
                  idx === 0 ? 'bg-blue-50/60 border-blue-300 shadow-sm' : 'bg-slate-50/70 border-slate-200 hover:bg-white'
                }">
                <div class="flex items-center justify-between gap-1 mb-1">
                  <span class="text-[10px] font-bold px-1.5 py-0.5 rounded" style="background:${cat.bg}; color:${cat.color};">Step ${idx + 1}</span>
                  <span class="text-[10px] font-mono font-semibold text-slate-500">${st.badge}</span>
                </div>
                <div class="text-xs font-bold text-slate-900 mb-1">${st.title}</div>
                <p class="text-xs text-slate-600 leading-snug">${st.detail}</p>
              </button>
            `
              )
              .join('')}
          </div>
        </div>

        <!-- Code Example + Line-by-Line Explanation -->
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
          <div class="lg:col-span-7 flex flex-col bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
            <div class="px-3.5 py-2 bg-slate-800/80 border-b border-slate-700 flex items-center justify-between">
              <span class="text-xs font-mono text-slate-300">${lib.id}_example.py</span>
              <button type="button" data-copy-guide="${lib.id}"
                class="px-2.5 py-0.5 rounded text-[11px] font-medium bg-slate-700 hover:bg-slate-600 text-slate-100 transition">
                Copy Code
              </button>
            </div>
            <div class="p-3 overflow-x-auto font-mono text-xs leading-relaxed text-slate-100" data-guide-code>
              ${buildCodeLinesHtml(lib.process[0].lines)}
            </div>
          </div>

          <div class="lg:col-span-5 bg-slate-50 border border-slate-200 rounded-xl p-3.5 flex flex-col gap-2.5">
            <h4 class="text-xs font-bold uppercase tracking-wider text-slate-400">Code Walkthrough</h4>
            <div class="flex flex-col gap-2">
              ${lib.codeAnnotations
                .map(
                  (ann) => `
                <div class="bg-white border border-slate-200 rounded-lg p-2.5">
                  <span class="inline-block text-[10px] font-mono font-bold px-1.5 py-0.5 rounded mb-1" style="background:${cat.bg}; color:${cat.color};">
                    Lines ${ann.lines}
                  </span>
                  <p class="text-xs text-slate-700 leading-relaxed">${ann.text}</p>
                </div>
              `
                )
                .join('')}
            </div>
          </div>
        </div>

        <!-- Advantages & Limitations -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          <div class="rounded-xl border border-emerald-200 bg-emerald-50/50 p-3.5">
            <h4 class="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-2">Key Advantages</h4>
            <ul class="space-y-1.5 text-xs text-slate-700 list-disc pl-4">
              ${lib.advantages.map((a) => `<li>${a}</li>`).join('')}
            </ul>
          </div>
          <div class="rounded-xl border border-amber-200 bg-amber-50/50 p-3.5">
            <h4 class="text-xs font-bold uppercase tracking-wider text-amber-800 mb-2">Limitations & Trade-offs</h4>
            <ul class="space-y-1.5 text-xs text-slate-700 list-disc pl-4">
              ${lib.limitations.map((l) => `<li>${l}</li>`).join('')}
            </ul>
          </div>
        </div>
      `;

      // Stage click highlights code lines inside this article
      const stageBtns = article.querySelectorAll('[data-guide-stage]');
      const codeContainer = article.querySelector('[data-guide-code]');
      stageBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
          const idx = Number(btn.dataset.guideStage);
          stageBtns.forEach((b, i) => {
            if (i === idx) {
              b.className = 'text-left p-3 rounded-xl border transition bg-blue-50/60 border-blue-300 shadow-sm';
            } else {
              b.className = 'text-left p-3 rounded-xl border transition bg-slate-50/70 border-slate-200 hover:bg-white';
            }
          });
          codeContainer.innerHTML = buildCodeLinesHtml(lib.process[idx].lines);
        });
      });

      // Focus in Visualizer CTA
      article.querySelector('[data-focus-viz]').addEventListener('click', () => {
        onFocusVisualizer(lib.id);
      });

      // Copy code button
      const copyBtn = article.querySelector('[data-copy-guide]');
      copyBtn.addEventListener('click', () => {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(lib.code.join('\n')).catch(() => {});
        }
        copyBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyBtn.textContent = 'Copy Code';
        }, 1100);
      });

      containerEl.appendChild(article);
    });
  }

  function renderQuiz(containerEl) {
    const answers = new Array(QUIZ_QUESTIONS.length).fill(null);

    function draw() {
      const answeredCount = answers.filter((a) => a !== null).length;
      const score = answers.reduce((acc, a, i) => acc + (a === QUIZ_QUESTIONS[i].correct ? 1 : 0), 0);

      containerEl.innerHTML = `
        <div class="flex flex-col gap-4">
          <div class="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-200">
            <div>
              <h3 class="text-base font-bold text-slate-900">Knowledge Check (${QUIZ_QUESTIONS.length} Questions)</h3>
              <p class="text-xs text-slate-500">Test your understanding of Python libraries, frameworks, and internal execution.</p>
            </div>
            <div class="flex items-center gap-2">
              <span class="px-3 py-1 rounded-full text-xs font-mono font-bold ${
                answeredCount === QUIZ_QUESTIONS.length
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-slate-100 text-slate-700'
              }">Score: ${score} / ${QUIZ_QUESTIONS.length}</span>
              <button id="quiz-reset-btn" type="button" class="px-2.5 py-1 rounded-lg text-xs font-semibold border border-slate-300 bg-white hover:bg-slate-50 text-slate-700">
                Reset
              </button>
            </div>
          </div>

          <div class="flex flex-col gap-4">
            ${QUIZ_QUESTIONS.map((q, qIdx) => {
              const chosen = answers[qIdx];
              const isDone = chosen !== null;
              return `
                <div class="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div class="text-sm font-semibold text-slate-900 mb-2.5">${qIdx + 1}. ${q.question}</div>
                  <div class="flex flex-col gap-1.5">
                    ${q.options
                      .map((opt, oIdx) => {
                        let cls = 'bg-white border-slate-200 text-slate-700 hover:border-blue-400';
                        if (isDone) {
                          if (oIdx === q.correct) {
                            cls = 'bg-emerald-50 border-emerald-500 text-emerald-900 font-semibold';
                          } else if (oIdx === chosen) {
                            cls = 'bg-rose-50 border-rose-400 text-rose-900';
                          } else {
                            cls = 'bg-white border-slate-200 text-slate-400';
                          }
                        }
                        return `
                          <button type="button" data-q="${qIdx}" data-o="${oIdx}"
                            class="text-left px-3 py-2 rounded-lg border text-xs sm:text-[13px] transition ${cls}">
                            ${opt}
                          </button>
                        `;
                      })
                      .join('')}
                  </div>
                  ${
                    isDone
                      ? `<div class="mt-2.5 text-xs px-3 py-2 rounded-lg ${
                          chosen === q.correct ? 'bg-emerald-100/70 text-emerald-900' : 'bg-amber-50 text-amber-900 border border-amber-200'
                        }">
                          <strong>${chosen === q.correct ? 'Correct:' : 'Explanation:'}</strong> ${q.explanation}
                        </div>`
                      : ''
                  }
                </div>
              `;
            }).join('')}
          </div>
        </div>
      `;

      containerEl.querySelectorAll('[data-q]').forEach((btn) => {
        btn.addEventListener('click', () => {
          const qi = Number(btn.dataset.q);
          const oi = Number(btn.dataset.o);
          answers[qi] = oi;
          draw();
        });
      });

      containerEl.querySelector('#quiz-reset-btn').addEventListener('click', () => {
        answers.fill(null);
        draw();
      });
    }

    draw();
  }

  return {
    renderLibraryGuides,
    renderQuiz
  };
})();
