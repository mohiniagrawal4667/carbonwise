# CarbonWise - Personal Carbon Footprint Tracker & Recycler

CarbonWise is a professionally engineered, responsive client-side application designed to help individuals calculate, assess, track, and systematically reduce their personal carbon footprint.

Built using React, Vite, Tailwind CSS, Recharts, React Hook Form, and validated strictly using Zod, CarbonWise features gamified daily sustainable challenges, customized advice, and robust historical trend monitoring.

---

## 🌟 Key Features

1. **Carbon Calculator Wizard**
   * Predefined, verified carbon emission mapping models based on standard EPA factors.
   * Tracks transit details (Car modes, Rail, Bus, Cycling, Walking) and fuel types (Petrol, Diesel, Hybrid, EV).
   * Maps electricity consumption alongside custom food and waste habits.

2. **Visual Analytics Dashboard**
   * Renders beautiful category breakdowns (Donut Charts) and target benchmarks (Bar charts).
   * Displays immediate status updates and comparisons against country individual baselines (650 kg CO2e).
   * Automatically computes a dynamic Eco Score (10 to 100) based on ecological performance.

3. **Rule-Based Recommendations Engine**
   * Generates highly targeted habits advice mapped specifically to high-emitting categories.
   * Tracks Committed offsets as users click "Commit to this Action" to gauge potential monthly footprint relief.

4. **Gamified Eco-Challenges & Badges**
   * Daily sustainable actions checklist (reloading dynamically).
   * Keeps track of calendar-based consecutive streak counts.
   * Dynamic Badge unlocked notifications with particle celebrations.

5. **Historical Logs & PDF Report Exports**
   * Traces monthly trial records using Recharts dynamic lines.
   * Fully printable formatted sheets that can be downloaded/saved as clean PDF documents.
   * Single-click warning-protected total record purges.

---

## 📂 Folder Structure

The application prioritizes a modular, decoupled layout:

```text
/
├── tests/                     # Unit test suites (Vitest)
│   ├── calculator.test.ts
│   ├── recommendations.test.ts
│   └── validation.test.ts
├── src/
│   ├── components/            # Extracted UI Views and components
│   │   ├── Layout.tsx         # Unified frame & dark/light theme toggle
│   │   ├── Home.tsx           # Landing hero, features, and benchmarks
│   │   ├── Calculator.tsx     # Wizard validation forms
│   │   ├── Dashboard.tsx      # Main dashboard stats cards
│   │   ├── DashboardCharts.tsx# Lazy loaded Recharts definitions
│   │   ├── Recommendations.tsx# Rule-based suggestions checklist
│   │   ├── Challenges.tsx     # Daily tasks & Credentials grid
│   │   └── History.tsx        # Trend analysis charts & print outs
│   ├── hooks/
│   │   └── useCarbonWise.ts   # Core business logic coordinate & LocalStorage state
│   ├── lib/
│   │   └── validation.ts      # Strict Zod Validator Schemas
│   ├── utils/
│   │   ├── calculator.ts      # Emission factors coefficients matrices
│   │   └── recommendations.ts # Suggestion filters logic
│   ├── types.ts               # Shared TypeScript schemas
│   ├── index.css              # Custom font bindings and tailwind layers
│   └── App.tsx                # Context router & master app shell
├── index.html                 # Main entry base
├── package.json               # Package manifests and scripts
└── tsconfig.json              # TypeScript configuration
```

---

## 🛠️ Installation Steps

1. **Clone the repository** (or extract files) in your workspace directory.
2. **Install node dependencies**:
   ```bash
   npm install
   ```
3. **Boot the local development server**:
   ```bash
   npm run dev
   ```
4. **Inspect the client**: Open the browser on `http://localhost:3000` to interact with CarbonWise.

---

## 🧪 Testing Instructions

Test suites are powered by **Vitest**:

* Run all unit tests:
  ```bash
  npx vitest run
  ```
* Conduct real-time hot-reloading tests:
  ```bash
  npx vitest
  ```

Test coverage focuses specifically on:
1. Carbon footprint computation correctness under multiple habits coordinates.
2. Input sanitizations or negative default parameter corrections.
3. Proper activation rules in the recommendation generator.
4. Correct Zod form checks and schema blockings on malformed inputs.

---

## 🧱 Build Instructions

Compile standalone static assets for production deployment:

```bash
npm run build
```

The compiled SPA bundle will assemble neatly located under the `/dist` directory.

---

## 🚀 Deployment Instructions for Vercel

Vercel detects Vite applications natively:

1. **Deploying via Vercel CLI**:
   ```bash
   npm i -g vercel
   vercel
   ```
2. **Deploying via GitHub (Recommended)**:
   * Push your project to a GitHub repository.
   * Access the Vercel Dashboard, select **Add New Project**, and authorize GitHub access.
   * Choose this repository.
   * **Framework Preset**: Choose **Vite**.
   * **Output Directory**: `dist` (default computed).
   * Click **Deploy**. Vercel will host your client-side CarbonWise app immediately on a global CDN.
