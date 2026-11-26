/**
 * Python Ecosystem Explainer - Structured Dataset
 * Defines nodes, directed dependency edges, working-process stages,
 * annotated code examples, advantages/limitations, comparisons, and quiz data.
 */
window.PyExplainer = window.PyExplainer || {};

window.PyExplainer.CATEGORIES = {
  all: { id: 'all', label: 'All Layers', color: '#334155', bg: '#f1f5f9', border: '#cbd5e1' },
  core: { id: 'core', label: 'Core', color: '#475569', bg: '#f1f5f9', border: '#94a3b8' },
  data: { id: 'data', label: 'Data & Viz', color: '#2563eb', bg: '#eff6ff', border: '#93c5fd' },
  ml: { id: 'ml', label: 'AI & ML', color: '#7c3aed', bg: '#f5f3ff', border: '#c4b5fd' },
  web: { id: 'web', label: 'Web & APIs', color: '#059669', bg: '#ecfdf5', border: '#6ee7b7' },
  qa: { id: 'qa', label: 'HTTP & Testing', color: '#d97706', bg: '#fffbeb', border: '#fcd34d' }
};

window.PyExplainer.COLUMNS = [
  { id: 0, title: 'Layer 0 · Runtime', subtitle: 'Language Core' },
  { id: 1, title: 'Layer 1 · Primitives', subtitle: 'Arrays, HTTP & WSGI' },
  { id: 2, title: 'Layer 2 · Frameworks', subtitle: 'Tables, Plots & Apps' },
  { id: 3, title: 'Layer 3 · ML & QA', subtitle: 'Models & Testing' }
];

window.PyExplainer.EDGES = [
  { from: 'python', to: 'numpy', label: 'C-API' },
  { from: 'python', to: 'requests', label: 'urllib3' },
  { from: 'python', to: 'flask', label: 'WSGI' },
  { from: 'python', to: 'django', label: 'ORM/MVT' },
  { from: 'numpy', to: 'pandas', label: 'ndarrays' },
  { from: 'numpy', to: 'matplotlib', label: 'vectors' },
  { from: 'numpy', to: 'scikit-learn', label: 'matrices' },
  { from: 'numpy', to: 'pytorch', label: 'tensor bridge' },
  { from: 'flask', to: 'fastapi', label: 'API evolution' },
  { from: 'pandas', to: 'matplotlib', label: 'plot()' },
  { from: 'pandas', to: 'scikit-learn', label: 'features' },
  { from: 'requests', to: 'pytest', label: 'API tests' },
  { from: 'fastapi', to: 'pytest', label: 'TestClient' }
];

window.PyExplainer.LIBRARIES = [
  {
    id: 'python',
    name: 'Python Core',
    kind: 'Runtime & Standard Library',
    shortTag: 'CPython 3.12',
    category: 'core',
    column: 0,
    row: 1,
    pipInstall: 'Built-in Standard Library',
    tagline: 'Interpreted runtime, dynamic typing & rich standard library.',
    explanation:
      'Python Core compiles human-readable source files into stack-based bytecode executed by the CPython Virtual Machine. Its C-API lets scientific and networking packages run compiled C/C++ or Rust kernels while exposing clean Python syntax.',
    purpose:
      'Serves as the execution foundation, object memory manager, and built-in toolkit (json, pathlib, asyncio) that every third-party library relies on.',
    useCases: ['Scripting & Automation', 'Backend Services', 'Data Pipelines', 'Glue for C/C++ Kernels'],
    advantages: [
      'Readable syntax lowers onboarding time for collaborative teams.',
      'Rich standard library handles files, JSON, regex, and async I/O without extra installs.',
      'Seamless C/C++/Rust extension API powers high-performance scientific libraries.'
    ],
    limitations: [
      'Pure Python loops are slower than compiled languages like C++ or Rust.',
      'The Global Interpreter Lock (GIL) limits CPU-bound multithreading in standard CPython.',
      'Dynamic typing can hide runtime type mismatches without type hints or linters.'
    ],
    process: [
      { title: 'Lex & Parse', badge: 'AST', detail: 'Source text is tokenized and parsed into an Abstract Syntax Tree (AST) representing expressions and blocks.', lines: [1, 2] },
      { title: 'Bytecode', badge: '.pyc', detail: 'The compiler translates the AST into compact stack-based bytecode instructions.', lines: [4, 5] },
      { title: 'CPython VM', badge: 'Eval Loop', detail: 'The evaluation loop executes bytecode opcodes and manages reference-counted objects in memory.', lines: [6, 7] },
      { title: 'Native C-API', badge: 'Extensions', detail: 'Heavy loops delegate to compiled C/Rust extensions (like NumPy) for near-native throughput.', lines: [9] }
    ],
    code: [
      'from pathlib import Path',
      'import json',
      '',
      'def load_metrics(folder: str) -> dict:',
      '    files = sorted(Path(folder).glob("*.json"))',
      '    totals = {f.stem: len(json.loads(f.read_text())) for f in files}',
      '    return totals',
      '',
      'summary = load_metrics("./reports")'
    ],
    codeAnnotations: [
      { lines: '1-2', text: 'Imports built-in pathlib and json modules—zero external dependencies required.' },
      { lines: '4-5', text: 'Uses type annotations and Path.glob() to discover and sort JSON report files safely.' },
      { lines: '6-7', text: 'Dictionary comprehension parses each file in memory and returns a clean summary mapping.' }
    ],
    compare: {
      bestFor: 'General-purpose orchestration, rapid prototyping, and standard-library tooling.',
      versus: [{ name: 'Standard Library vs PyPI', note: 'Use stdlib (json, pathlib, asyncio) first before adding third-party packages.' }]
    }
  },
  {
    id: 'numpy',
    name: 'NumPy',
    kind: 'Library',
    shortTag: 'N-D Arrays',
    category: 'data',
    column: 1,
    row: 0,
    pipInstall: 'pip install numpy',
    tagline: 'Contiguous C-backed multi-dimensional arrays & vectorized math.',
    explanation:
      'NumPy replaces fragmented Python object lists with homogeneous, fixed-type ndarray buffers stored in contiguous RAM. Vectorized universal functions (ufuncs) apply math across millions of elements inside compiled C/SIMD loops.',
    purpose:
      'Provides the universal numerical array memory layout shared across Pandas, Matplotlib, Scikit-learn, and PyTorch.',
    useCases: ['Matrix Linear Algebra', 'Image & Signal Buffers', 'Scientific Simulation', 'Vectorized Preprocessing'],
    advantages: [
      'Up to 50x faster than native Python loops on large numeric arrays via C vectorization.',
      'Zero-copy stride views make slicing, transposing, and reshaping nearly instantaneous.',
      'Standardized buffer protocol enables effortless sharing with Pandas and PyTorch.'
    ],
    limitations: [
      'Requires homogeneous data types—cannot mix strings and numbers efficiently in one numeric array.',
      'Runs exclusively on CPU (unlike PyTorch or CuPy which support GPU acceleration).',
      'Lacks built-in row/column labels or SQL-style joins (where Pandas excels).'
    ],
    process: [
      { title: 'Contiguous RAM', badge: 'ndarray', detail: 'Allocates one packed C buffer of uniform dtype (e.g., float64) instead of scattered Python pointers.', lines: [1, 3] },
      { title: 'Shape & Strides', badge: 'Metadata', detail: 'Reshaping or transposing changes stride metadata in O(1) time without copying underlying bytes.', lines: [5, 6] },
      { title: 'Broadcasting', badge: 'Auto-Align', detail: 'Smaller arrays virtually stretch across matching axes so scalars or vectors add cleanly to matrices.', lines: [8] },
      { title: 'C-Loop ufunc', badge: 'SIMD', detail: 'Universal functions execute tight SIMD-accelerated loops in C, bypassing Python per-item overhead.', lines: [9, 10] }
    ],
    code: [
      'import numpy as np',
      '',
      'grid = np.array([[2, 4, 6], [8, 10, 12]])',
      '',
      'transposed = grid.T          # (2, 3) -> (3, 2) view',
      'reshaped = grid.reshape(3, 2)',
      '',
      'boosted = grid + 10          # Scalar broadcasting',
      'col_means = boosted.mean(axis=0)',
      'print(col_means)'
    ],
    codeAnnotations: [
      { lines: '3', text: 'Creates a contiguous 2x3 integer matrix backed by a single C memory buffer.' },
      { lines: '5-6', text: 'Reinterprets array shape and strides in O(1) without duplicating underlying numbers.' },
      { lines: '8-9', text: 'Broadcasts +10 to all cells and computes column averages in compiled C.' }
    ],
    compare: {
      bestFor: 'Fast numerical computing, linear algebra, and homogeneous multi-dimensional arrays.',
      versus: [
        { name: 'NumPy vs Python list', note: 'Up to 50x faster on numeric math due to contiguous memory and C vectorization.' },
        { name: 'NumPy vs PyTorch', note: 'NumPy runs on CPU; PyTorch adds GPU acceleration and automatic differentiation.' }
      ]
    }
  },
  {
    id: 'requests',
    name: 'Requests',
    kind: 'Library',
    shortTag: 'HTTP Client',
    category: 'qa',
    column: 1,
    row: 1,
    pipInstall: 'pip install requests',
    tagline: 'Human-friendly synchronous HTTP requests, sessions & JSON handling.',
    explanation:
      'Requests wraps Python’s lower-level urllib3 socket pools behind an intuitive, readable API. It automatically manages connection keep-alive pooling, TLS verification, cookies, headers, redirects, and JSON decoding.',
    purpose:
      'Makes consuming external REST APIs, webhooks, and authenticated web endpoints concise and reliable.',
    useCases: ['REST API Integration', 'Webhook Dispatching', 'Web Scraping Clients', 'Automated API Checks'],
    advantages: [
      'Clean, self-documenting syntax for GET, POST, headers, timeouts, and JSON bodies.',
      'Session objects reuse TCP/TLS connections for substantially faster repeated calls.',
      'Battle-tested HTTP semantics and automatic character-encoding detection.'
    ],
    limitations: [
      'Synchronous/blocking only—does not natively support async/await concurrency.',
      'No built-in HTTP/2 multiplexing (use httpx when async or HTTP/2 is required).',
      'Forgetting timeout= can cause scripts to hang indefinitely on unresponsive servers.'
    ],
    process: [
      { title: 'Build Request', badge: 'Headers', detail: 'Serializes query params, auth headers, and JSON payloads into a prepared HTTP message.', lines: [1, 3, 4] },
      { title: 'Pool & TLS', badge: 'urllib3', detail: 'Reuses persistent TCP/TLS connections via Session pooling to avoid repeated handshakes.', lines: [6] },
      { title: 'Receive Stream', badge: 'Status', detail: 'Reads HTTP status code, response headers, and decodes compressed response bytes.', lines: [7] },
      { title: 'Parse & Guard', badge: '.json()', detail: 'raise_for_status() catches 4xx/5xx failures before .json() converts body text into dicts.', lines: [8, 9] }
    ],
    code: [
      'import requests',
      '',
      'url = "https://api.github.com/repos/python/cpython"',
      'headers = {"Accept": "application/vnd.github+json"}',
      '',
      'resp = requests.get(url, headers=headers, timeout=5)',
      'resp.raise_for_status()',
      'data = resp.json()',
      'print(data["stargazers_count"])'
    ],
    codeAnnotations: [
      { lines: '3-4', text: 'Defines the target REST endpoint and standard GitHub API content-negotiation header.' },
      { lines: '6-7', text: 'Dispatches GET with a 5-second timeout guard and raises an exception on 4xx/5xx errors.' },
      { lines: '8-9', text: 'Decodes the UTF-8 JSON payload directly into a Python dictionary.' }
    ],
    compare: {
      bestFor: 'Clean synchronous HTTP client calls in scripts, CLIs, and backend integrations.',
      versus: [{ name: 'Requests vs httpx', note: 'Requests is sync-only; choose httpx if you need async/await or HTTP/2.' }]
    }
  },
  {
    id: 'flask',
    name: 'Flask',
    kind: 'Microframework',
    shortTag: 'Micro WSGI',
    category: 'web',
    column: 1,
    row: 2,
    pipInstall: 'pip install flask',
    tagline: 'Minimalist WSGI web framework built on Werkzeug & Jinja2.',
    explanation:
      'Flask is an unopinionated microframework: it handles URL routing decorators, request/session context proxies, and Jinja2 HTML rendering while letting your team choose its own database ORM, authentication, and validation tools.',
    purpose:
      'Enables rapid creation of lightweight web services, internal dashboards, and custom microservices without rigid conventions.',
    useCases: ['Small-to-Medium Web Apps', 'Internal Dashboards', 'ML Model Wrapper APIs', 'Custom Microservices'],
    advantages: [
      'Minimal boilerplate—an entire working web endpoint fits in under 10 lines.',
      'Complete architectural freedom to pick SQLAlchemy, custom auth, or any extension.',
      'Gentle learning curve makes WSGI routing and HTTP fundamentals transparent.'
    ],
    limitations: [
      'No built-in ORM, admin dashboard, or schema validation—must wire third-party plugins.',
      'Traditional WSGI core is synchronous by default (less suited for heavy async streaming).',
      'Large teams must enforce their own folder structure to prevent messy codebases.'
    ],
    process: [
      { title: 'WSGI Entry', badge: 'Werkzeug', detail: 'WSGI server forwards each HTTP request into Flask’s Werkzeug dispatcher.', lines: [1, 3] },
      { title: 'Route Match', badge: '@app.get', detail: 'Matches the URL path and HTTP method against registered Python function decorators.', lines: [5] },
      { title: 'Context Local', badge: 'request', detail: 'Pushes request/session proxies so the view function can safely read query params or payloads.', lines: [6, 7] },
      { title: 'Render / JSON', badge: 'Jinja2', detail: 'Returns either a rendered Jinja2 HTML template or a serialized JSON response.', lines: [8] }
    ],
    code: [
      'from flask import Flask, request, jsonify',
      '',
      'app = Flask(__name__)',
      '',
      '@app.get("/greet")',
      'def greet_user():',
      '    name = request.args.get("name", "Developer")',
      '    return jsonify({"message": f"Hello, {name}!"})'
    ],
    codeAnnotations: [
      { lines: '3', text: 'Instantiates the Flask WSGI application object that owns routes and configuration.' },
      { lines: '5-6', text: 'Decorator registers greet_user() with Flask’s URL routing table for HTTP GET.' },
      { lines: '7-8', text: 'Reads ?name= from request context and serializes a JSON HTTP 200 response.' }
    ],
    compare: {
      bestFor: 'Simple services, learning web backends, and projects where you want full library freedom.',
      versus: [
        { name: 'Flask vs Django', note: 'Flask is minimal and modular; Django includes ORM, admin, and auth out of the box.' },
        { name: 'Flask vs FastAPI', note: 'Flask is sync WSGI; FastAPI is async ASGI with automatic OpenAPI & Pydantic types.' }
      ]
    }
  },
  {
    id: 'pandas',
    name: 'Pandas',
    kind: 'Library',
    shortTag: 'DataFrames',
    category: 'data',
    column: 2,
    row: 0,
    pipInstall: 'pip install pandas',
    tagline: 'Labeled tabular DataFrames for cleaning, joining & aggregating.',
    explanation:
      'Pandas wraps NumPy column buffers inside a labeled 2D DataFrame with named columns and row indexes. It turns raw CSV, Excel, JSON, and SQL tables into expressive vectorized transformation pipelines.',
    purpose:
      'Serves as the everyday workbench for Exploratory Data Analysis (EDA), data cleaning, feature engineering, and reporting.',
    useCases: ['CSV / Excel / SQL ETL', 'Time-Series Resampling', 'Missing-Data Cleaning', 'GroupBy Business Metrics'],
    advantages: [
      'Expressive SQL-like filtering, merging, pivoting, and groupby aggregations in concise code.',
      'Handles heterogeneous columns (dates, strings, floats, missing NaNs) cleanly.',
      'Native readers/writers for CSV, Parquet, Excel, JSON, and SQL databases.'
    ],
    limitations: [
      'High memory overhead—typically needs 3x–5x RAM relative to raw CSV file size.',
      'Single-threaded execution struggles on multi-gigabyte tables (where Polars or DuckDB shine).',
      'Chained indexing assignments can trigger subtle SettingWithCopy warnings.'
    ],
    process: [
      { title: 'Ingest & Align', badge: 'Index', detail: 'Loads CSV/SQL/dicts into typed Series columns aligned by a shared row Index.', lines: [1, 3] },
      { title: 'Boolean Mask', badge: 'Filter', detail: 'Evaluates vectorized column predicates (df["score"] >= 85) without Python for-loops.', lines: [5] },
      { title: 'Split-Apply', badge: 'groupby()', detail: 'Splits rows by category key, applies fast Cython aggregations, and combines results.', lines: [6, 7] },
      { title: 'Export Ready', badge: 'to_numpy()', detail: 'Outputs clean tables to Parquet, CSV, Matplotlib plots, or Scikit-learn feature matrices.', lines: [8] }
    ],
    code: [
      'import pandas as pd',
      '',
      'df = pd.read_csv("learners.csv")',
      '',
      'top = df[df["score"] >= 85].sort_values("score", ascending=False)',
      'summary = top.groupby("track")["score"].mean()',
      'summary = summary.round(1)',
      'print(summary)'
    ],
    codeAnnotations: [
      { lines: '3', text: 'Parses CSV columns into typed Pandas Series aligned by an automatic row Index.' },
      { lines: '5', text: 'Applies a vectorized boolean mask and sorts qualifying records descending.' },
      { lines: '6-7', text: 'Runs split-apply-combine aggregation per track and rounds mean scores.' }
    ],
    compare: {
      bestFor: 'Tabular data wrangling, mixed data types (strings + timestamps + floats), and quick analytics.',
      versus: [{ name: 'Pandas vs NumPy', note: 'Pandas adds column names, missing-value tools, and SQL-like joins on top of NumPy.' }]
    }
  },
  {
    id: 'matplotlib',
    name: 'Matplotlib',
    kind: 'Library',
    shortTag: '2D Plotting',
    category: 'data',
    column: 2,
    row: 1,
    pipInstall: 'pip install matplotlib',
    tagline: 'Object-oriented Figure & Axes engine for publication-grade charts.',
    explanation:
      'Matplotlib separates the outer canvas (Figure) from coordinate planes (Axes) and visual primitives (Artists). Higher-level libraries like Seaborn and Pandas .plot() build directly on top of this engine.',
    purpose:
      'Visualizes data distributions, model training curves, and analytical insights with complete pixel-level control.',
    useCases: ['Training Loss Curves', 'Statistical Distributions', 'Multi-Panel Reports', 'Scientific Publication Figures'],
    advantages: [
      'Fine-grained control over every tick, font, spine, annotation, and subplot layout.',
      'Exports crisp vector formats (SVG, PDF) and high-DPI PNGs for reports and papers.',
      'Massive ecosystem compatibility—Seaborn, Pandas, and Scikit-learn plotting utilities use it.'
    ],
    limitations: [
      'Object-oriented API can feel verbose for quick multi-series charts compared to Seaborn/Plotly.',
      'Default figures are static rather than web-interactive zoom/hover dashboards.',
      'Dual stateful (pyplot) vs object-oriented (fig, ax) styles sometimes confuse beginners.'
    ],
    process: [
      { title: 'Figure Canvas', badge: 'fig, ax', detail: 'Creates a top-level Figure container and one or more coordinate Axes objects.', lines: [1, 3] },
      { title: 'Map Artists', badge: 'ax.plot', detail: 'Converts numeric arrays into Line2D, Bar, or PathCollection visual artists.', lines: [4, 5, 6] },
      { title: 'Scale & Ticks', badge: 'Labels', detail: 'Computes axis limits, tick intervals, legends, and gridlines automatically.', lines: [7, 8] },
      { title: 'Render Output', badge: 'PNG / SVG', detail: 'Rasterizes or serializes the figure to interactive GUI windows, SVG, or high-DPI PNG.', lines: [9] }
    ],
    code: [
      'import matplotlib.pyplot as plt',
      '',
      'fig, ax = plt.subplots(figsize=(6, 3.5))',
      'epochs = [1, 2, 3, 4, 5]',
      'accuracy = [0.62, 0.74, 0.83, 0.89, 0.94]',
      'ax.plot(epochs, accuracy, marker="o", color="#2563eb")',
      'ax.set_title("Validation Accuracy")',
      'ax.grid(alpha=0.3)',
      'plt.savefig("accuracy.svg")'
    ],
    codeAnnotations: [
      { lines: '3', text: 'Initializes the Figure container and Axes coordinate system explicitly.' },
      { lines: '4-6', text: 'Maps epoch and accuracy vectors onto a styled Line2D artist with point markers.' },
      { lines: '7-9', text: 'Adds title, subtle gridlines, and saves a resolution-independent SVG graphic.' }
    ],
    compare: {
      bestFor: 'Fine-grained static and publication plots in notebooks, scripts, and PDF/SVG exports.',
      versus: [{ name: 'Matplotlib vs Plotly', note: 'Matplotlib excels at crisp static/academic plots; Plotly shines for browser-native zoomable dashboards.' }]
    }
  },
  {
    id: 'django',
    name: 'Django',
    kind: 'Framework',
    shortTag: 'Batteries MVT',
    category: 'web',
    column: 2,
    row: 2,
    pipInstall: 'pip install django',
    tagline: 'Full-stack MVT framework with ORM, migrations, auth & admin panel.',
    explanation:
      'Django follows the Model–View–Template (MVT) pattern with "batteries included": an ORM, schema migrations, authentication, an auto-generated admin dashboard, and built-in CSRF/XSS/SQLi defenses.',
    purpose:
      'Accelerates production database-driven web applications where security, structure, and rapid feature delivery matter.',
    useCases: ['SaaS Platforms & Portals', 'E-Commerce Backends', 'CMS & Editorial Systems', 'Enterprise CRUD Apps'],
    advantages: [
      'Built-in ORM, migrations, auth, and admin interface eliminate weeks of setup.',
      'Strong security defaults protect against CSRF, SQL injection, and clickjacking.',
      'Clear project conventions make multi-developer GitHub collaboration predictable.'
    ],
    limitations: [
      'Heavier architecture can feel over-engineered for tiny single-endpoint microservices.',
      'Tight coupling to Django ORM/conventions makes swapping core layers harder.',
      'Async support exists but third-party ecosystem historically favors synchronous patterns.'
    ],
    process: [
      { title: 'URL Dispatcher', badge: 'urls.py', detail: 'Matches incoming URL patterns and routes the HttpRequest to the designated View.', lines: [1, 2] },
      { title: 'ORM Query', badge: 'models.py', detail: 'View queries the database via Pythonic QuerySets compiled safely into parameterized SQL.', lines: [5, 6] },
      { title: 'View Logic', badge: 'views.py', detail: 'Enforces permissions, business rules, and builds the template context dictionary.', lines: [7] },
      { title: 'Template Render', badge: 'HTML', detail: 'Merges context into auto-escaped HTML templates and returns an HttpResponse.', lines: [8] }
    ],
    code: [
      'from django.shortcuts import render',
      'from .models import Project',
      '',
      'def project_list(request):',
      '    active = Project.objects.filter(is_active=True)',
      '    ordered = active.order_by("-created_at")',
      '    context = {"projects": ordered}',
      '    return render(request, "projects/list.html", context)'
    ],
    codeAnnotations: [
      { lines: '1-2', text: 'Imports Django’s template renderer and the database-backed Project model.' },
      { lines: '5-6', text: 'Builds a lazy QuerySet compiled into parameterized SQL only when evaluated.' },
      { lines: '7-8', text: 'Passes queried records into an auto-escaped HTML template response.' }
    ],
    compare: {
      bestFor: 'Full-featured database-driven web apps with strict structure and built-in admin.',
      versus: [{ name: 'Django vs FastAPI', note: 'Django shines for full-stack apps + ORM/Admin; FastAPI excels at high-speed async JSON APIs.' }]
    }
  },
  {
    id: 'fastapi',
    name: 'FastAPI',
    kind: 'Framework',
    shortTag: 'Async ASGI',
    category: 'web',
    column: 2,
    row: 3,
    pipInstall: 'pip install fastapi uvicorn',
    tagline: 'High-performance async APIs with Pydantic type validation & OpenAPI.',
    explanation:
      'FastAPI combines Starlette’s asynchronous ASGI engine with Pydantic v2 type validation. Standard Python type hints automatically validate incoming JSON, coerce types, and generate live interactive Swagger (/docs) documentation.',
    purpose:
      'Powers modern REST microservices, concurrent async backends, and production ML/LLM inference APIs.',
    useCases: ['ML & LLM Serving APIs', 'Async Microservices', 'Typed Backend Contracts', 'Auto-Documented APIs'],
    advantages: [
      'Automatic request/response validation and clear 422 error messages via Pydantic.',
      'Native async/await ASGI performance rivals Node.js and Go for I/O-bound workloads.',
      'Zero-effort interactive OpenAPI (/docs) and ReDoc documentation.'
    ],
    limitations: [
      'Does not include a built-in ORM or admin UI (must pair with SQLAlchemy/SQLModel).',
      'Mixing blocking synchronous calls inside async def routes can stall the event loop.',
      'Requires an ASGI server such as Uvicorn or Hypercorn in production.'
    ],
    process: [
      { title: 'ASGI Receive', badge: 'Starlette', detail: 'Uvicorn receives the connection over async ASGI without blocking worker threads.', lines: [1, 4] },
      { title: 'Type Validate', badge: 'Pydantic', detail: 'Inspects Python type hints (int, str, BaseModel) and rejects invalid input with 422 JSON.', lines: [6, 7, 8] },
      { title: 'Async Handler', badge: 'async def', detail: 'Runs your endpoint coroutine concurrently while awaiting DB or external model calls.', lines: [10, 11] },
      { title: 'OpenAPI + JSON', badge: '200 OK', detail: 'Serializes output to fast JSON and auto-updates /docs interactive Swagger schema.', lines: [12] }
    ],
    code: [
      'from fastapi import FastAPI',
      'from pydantic import BaseModel',
      '',
      'app = FastAPI()',
      '',
      'class Item(BaseModel):',
      '    name: str',
      '    price: float',
      '',
      '@app.post("/items/{item_id}")',
      'async def create_item(item_id: int, item: Item):',
      '    return {"id": item_id, "item": item}'
    ],
    codeAnnotations: [
      { lines: '6-8', text: 'Defines a Pydantic schema that validates JSON fields and coerces types at runtime.' },
      { lines: '10-11', text: 'Path parameter item_id: int is validated before the async coroutine executes.' },
      { lines: '12', text: 'Returned dict is automatically serialized to JSON and documented in OpenAPI.' }
    ],
    compare: {
      bestFor: 'Modern typed JSON APIs, async I/O workloads, and serving ML models.',
      versus: [{ name: 'FastAPI vs Flask', note: 'FastAPI gives built-in data validation, async ASGI speed, and automatic OpenAPI docs.' }]
    }
  },
  {
    id: 'scikit-learn',
    name: 'Scikit-learn',
    kind: 'Library',
    shortTag: 'Classical ML',
    category: 'ml',
    column: 3,
    row: 0,
    pipInstall: 'pip install scikit-learn',
    tagline: 'Unified fit/predict API for regression, classification & pipelines.',
    explanation:
      'Scikit-learn standardizes dozens of classical machine learning algorithms behind one consistent Estimator interface: .fit(), .transform(), and .predict(). Pipelines chain scalers and models cleanly to prevent data leakage.',
    purpose:
      'Solves tabular classification, regression, clustering, and preprocessing tasks reliably without deep-learning complexity.',
    useCases: ['Churn & Risk Scoring', 'Customer Segmentation', 'Baseline ML Benchmarks', 'Feature Scaling Pipelines'],
    advantages: [
      'Uniform API lets you swap LogisticRegression for RandomForest in one line.',
      'Built-in Pipeline and cross-validation utilities prevent subtle train/test leakage.',
      'Fast CPU training and interpretable models for structured tabular datasets.'
    ],
    limitations: [
      'Not designed for deep neural networks, transformers, or GPU training.',
      'Assumes datasets fit comfortably in local system RAM.',
      'Less suited for unstructured raw images, audio, or long-form text without embeddings.'
    ],
    process: [
      { title: 'Split Data', badge: 'Train/Test', detail: 'Partitions features X and targets y to evaluate generalization on unseen records.', lines: [1, 6] },
      { title: 'Preprocess', badge: 'Pipeline', detail: 'StandardScaler learns mean/std solely on training data inside a leak-free Pipeline.', lines: [2, 3, 7] },
      { title: 'Model .fit()', badge: 'Learn', detail: 'Optimizes decision boundaries or tree splits across the training feature matrix.', lines: [8] },
      { title: '.predict()', badge: 'Evaluate', detail: 'Applies identical scaling + learned parameters to output predictions and accuracy.', lines: [9] }
    ],
    code: [
      'from sklearn.model_selection import train_test_split',
      'from sklearn.pipeline import make_pipeline',
      'from sklearn.preprocessing import StandardScaler',
      'from sklearn.linear_model import LogisticRegression',
      '',
      'X_tr, X_te, y_tr, y_te = train_test_split(X, y, test_size=0.2)',
      'pipe = make_pipeline(StandardScaler(), LogisticRegression())',
      'pipe.fit(X_tr, y_tr)',
      'preds = pipe.predict(X_te)'
    ],
    codeAnnotations: [
      { lines: '6', text: 'Splits 80% training and 20% unseen test data to measure true generalization.' },
      { lines: '7', text: 'Chains StandardScaler + LogisticRegression so scaling statistics never leak from X_te.' },
      { lines: '8-9', text: 'Fits parameters on X_tr/y_tr and outputs predictions on unseen test records.' }
    ],
    compare: {
      bestFor: 'Tabular datasets, interpretable models, and rapid classical ML experimentation.',
      versus: [{ name: 'Scikit-learn vs PyTorch', note: 'Use Scikit-learn for structured tabular data; use PyTorch for vision, text, and custom neural nets.' }]
    }
  },
  {
    id: 'pytorch',
    name: 'PyTorch',
    kind: 'Framework',
    shortTag: 'Deep Learning',
    category: 'ml',
    column: 3,
    row: 1,
    pipInstall: 'pip install torch',
    tagline: 'GPU-accelerated tensors, dynamic compute graphs & autograd.',
    explanation:
      'PyTorch executes neural networks using dynamic eager computation graphs. As tensors flow forward through layers, the Autograd engine tracks operations so .backward() computes exact chain-rule gradients automatically.',
    purpose:
      'Powers modern deep learning research, Transformers & LLMs, computer vision, and custom differentiable architectures.',
    useCases: ['Transformers & LLMs', 'Computer Vision (CNNs)', 'Custom Neural Architectures', 'GPU Tensor Computing'],
    advantages: [
      'Pythonic dynamic graphs make debugging layers with standard print/breakpoints effortless.',
      'Automatic differentiation (Autograd) and seamless CUDA GPU acceleration.',
      'Dominant ecosystem for LLMs, Hugging Face models, and academic AI research.'
    ],
    limitations: [
      'Requires more training boilerplate (loops, optimizers, devices) than Scikit-learn.',
      'Heavy package footprint and steep hardware/VRAM demands for large models.',
      'Overkill for simple tabular regression/classification problems.'
    ],
    process: [
      { title: 'Tensor Input', badge: 'CUDA/CPU', detail: 'Wraps arrays in torch.Tensor with requires_grad=True to track differentiable operations.', lines: [1, 4, 5] },
      { title: 'Forward Pass', badge: 'Compute Graph', detail: 'Applies linear weights and nonlinear activations while dynamically recording the graph.', lines: [6] },
      { title: 'Loss & Backward', badge: 'Autograd', detail: 'loss.backward() walks the graph in reverse using chain rule to populate .grad tensors.', lines: [7, 8] },
      { title: 'Optimizer Step', badge: 'Update w', detail: 'optimizer.step() nudges weights opposite to gradients to reduce prediction error.', lines: [9] }
    ],
    code: [
      'import torch',
      'import torch.nn as nn',
      '',
      'x = torch.tensor([[1.5, -0.5]])',
      'layer = nn.Linear(2, 1)',
      'pred = torch.sigmoid(layer(x))',
      'loss = (pred - 1.0).pow(2)',
      'loss.backward()        # Compute gradients',
      '# optimizer.step() updates layer.weight'
    ],
    codeAnnotations: [
      { lines: '4-5', text: 'Initializes input tensor and a learnable linear layer with weights and bias.' },
      { lines: '6-7', text: 'Computes forward prediction through sigmoid and evaluates squared error loss.' },
      { lines: '8-9', text: 'Autograd differentiates the dynamic graph backward to update layer weights.' }
    ],
    compare: {
      bestFor: 'Deep neural networks, LLMs, custom loss functions, and GPU training.',
      versus: [{ name: 'PyTorch vs NumPy', note: 'PyTorch mirrors NumPy syntax while adding GPU acceleration and automatic differentiation.' }]
    }
  },
  {
    id: 'pytest',
    name: 'Pytest',
    kind: 'Framework',
    shortTag: 'Test Runner',
    category: 'qa',
    column: 3,
    row: 2,
    pipInstall: 'pip install pytest',
    tagline: 'Zero-boilerplate assertions, reusable fixtures & parametrized suites.',
    explanation:
      'Pytest automatically discovers test_*.py files and rewrites Python’s plain assert statements via AST introspection to print detailed variable diffs on failure. Dependency-injected fixtures keep test setup modular and clean.',
    purpose:
      'Verifies libraries, APIs, and data pipelines automatically so collaborative GitHub pull requests stay reliable.',
    useCases: ['Unit & Integration Tests', 'FastAPI / Django API Suites', 'Parametrized Edge Cases', 'GitHub Actions CI'],
    advantages: [
      'Plain assert statements eliminate verbose unittest boilerplate methods.',
      'Composable @pytest.fixture and @pytest.mark.parametrize scale cleanly across large suites.',
      'Rich plugin ecosystem (pytest-cov, pytest-asyncio, FastAPI TestClient).'
    ],
    limitations: [
      'Implicit fixture name matching can feel "magical" to newcomers on huge test suites.',
      'Overly complex fixture dependency chains can slow down or obscure test setup.',
      'Requires disciplined test isolation so tests do not leak shared global state.'
    ],
    process: [
      { title: 'Discover', badge: 'test_*.py', detail: 'Scans repository files for test_ functions and collects parametrized test cases.', lines: [1, 7] },
      { title: 'Inject Fixture', badge: '@fixture', detail: 'Builds fresh isolated state (temp DB, mock client) and passes it as a function argument.', lines: [3, 4, 5] },
      { title: 'Assert Diff', badge: 'AST Rewrite', detail: 'Executes plain assert checks and introspects failing expressions with exact values.', lines: [8, 9] },
      { title: 'CI Report', badge: 'PASS/FAIL', detail: 'Tears down fixtures cleanly and outputs exit code 0 (green) or 1 (red) for GitHub CI.', lines: [10] }
    ],
    code: [
      'import pytest',
      '',
      '@pytest.fixture',
      'def sample_scores():',
      '    return [88, 92, 95]',
      '',
      '@pytest.mark.parametrize("bonus", [0, 5])',
      'def test_average_above_85(sample_scores, bonus):',
      '    avg = sum(s + bonus for s in sample_scores) / len(sample_scores)',
      '    assert avg >= 85'
    ],
    codeAnnotations: [
      { lines: '3-5', text: 'Fixture provides a fresh, isolated score list for every test invocation.' },
      { lines: '7-8', text: 'Parametrize runs the test twice—once with bonus=0 and once with bonus=5.' },
      { lines: '9-10', text: 'Plain assert produces an exact value diff automatically if the condition fails.' }
    ],
    compare: {
      bestFor: 'All Python projects—from tiny utility scripts to large collaborative web & ML repositories.',
      versus: [{ name: 'Pytest vs unittest', note: 'Pytest needs far less boilerplate (plain assert vs self.assertEqual) and scales better via fixtures.' }]
    }
  }
];

window.PyExplainer.QUIZ_QUESTIONS = [
  {
    question: 'What is the core architectural difference between a Python Library (e.g., NumPy) and a Framework (e.g., Django)?',
    options: [
      'Libraries are only for data science, while frameworks are only for websites.',
      'Your code calls a library directly; a framework owns the control flow and calls your code (Inversion of Control).',
      'Libraries do not require pip installation, while frameworks always do.'
    ],
    correct: 1,
    explanation: 'Libraries act as callable toolkits where your script stays in charge. Frameworks enforce lifecycle hooks (routing, request dispatch, test discovery) and invoke your functions.'
  },
  {
    question: 'Why is NumPy dramatically faster than Python lists for numerical matrix arithmetic?',
    options: [
      'NumPy stores homogeneous fixed-type values in contiguous RAM and runs vectorized loops in compiled C.',
      'NumPy automatically uploads every array to the GPU by default.',
      'NumPy converts all numbers into JSON strings before multiplying them.'
    ],
    correct: 0,
    explanation: 'Python lists store scattered pointers to boxed PyObjects, whereas NumPy ndarrays pack uniform types contiguously so C/SIMD loops process data without interpreter overhead.'
  },
  {
    question: 'Which web framework automatically validates request payloads using Python type hints and generates Swagger (/docs)?',
    options: [
      'Requests',
      'Flask',
      'FastAPI'
    ],
    correct: 2,
    explanation: 'FastAPI pairs Starlette (ASGI) with Pydantic type annotations to validate JSON/path types at runtime and auto-generate OpenAPI documentation.'
  },
  {
    question: 'In PyTorch, what happens when you call loss.backward() after a forward pass?',
    options: [
      'It deletes the neural network weights to free GPU memory.',
      'Autograd traverses the dynamic computation graph in reverse to compute gradients (∂L/∂w).',
      'It exports the model directly into a Pandas DataFrame.'
    ],
    correct: 1,
    explanation: 'PyTorch’s Autograd engine records forward tensor operations and applies the reverse-mode chain rule during .backward() so optimizers can update weights.'
  },
  {
    question: 'In a collaborative GitHub repo, why are Scikit-learn Pipelines and Pytest fixtures important?',
    options: [
      'Pipelines prevent train/test data leakage, and Pytest fixtures isolate repeatable test setup for CI checks.',
      'They replace the need for Python Core bytecode compilation.',
      'They automatically push commits to GitHub branches.'
    ],
    correct: 0,
    explanation: 'make_pipeline ensures scalers fit only on training splits, while @pytest.fixture guarantees clean, reproducible test states before every test function.'
  }
];
