# Phytohormone Dose–Response & Cellular Defence Framework

Interactive supplementary tool accompanying the narrative review:

> **Divergent cellular defence strategies underlie distinct dose–response profiles of exogenous phytohormones during plant tissue culture morphogenesis** — with an illustrative case from *Citrus hystrix* DC.

The app visualises how three commonly used plant growth regulators produce three different dose–response geometries in vitro, and links each geometry to a proposed cellular mechanism.

| Hormone | Culture stage | Response geometry | Quality index |
|---|---|---|---|
| **BA** (6-benzylaminopurine) | Shoot proliferation | Linear trade-off (more shoots, shorter shoots) | WMI |
| **2,4-D** | Callus induction | Narrow productive window, then oxidative browning | Fresh weight |
| **NAA** | Adventitious rooting | Bell-shaped (hormetic) | RQI |

## Features

The interface is organised into five tabs:

1. **Framework Overview** — the conceptual model connecting dose–response shape to cellular defence strategy.
2. **Dose-Response** — choose a hormone, move the concentration slider, and see the modelled curves together with experimental data points from *C. hystrix* and other species.
3. **Mechanisms** — proposed pathways for each hormone (e.g. GA2ox-mediated gibberellin suppression under BA, ROS/phenylpropanoid activation under 2,4-D, ethylene induction under NAA).
4. **Cross-species** — comparison of reported optimal concentrations across *Citrus* species and other taxa.
5. **Knowledge Gaps** — open questions with suggested experiments to test them.

A full reference list (36 citations) is shown at the bottom of every tab.

> **Note:** The continuous curves are simplified illustrative models fitted to published data. They are intended to support the review's argument, not to serve as predictive models for protocol design.

## Run locally

Requires [Node.js](https://nodejs.org/) 18 or newer.

```bash
git clone https://github.com/<your-username>/phytohormone-framework.git
cd phytohormone-framework
npm install
npm start
```

The app opens at <http://localhost:3000>.

To create a production build in `build/`:

```bash
npm run build
```

## Deploy to GitHub Pages

The repository includes a workflow (`.github/workflows/deploy.yml`) that builds and publishes the site on every push to `main`.

1. Push the code to a GitHub repository.
2. Go to **Settings → Pages** and set **Source** to **GitHub Actions**.
3. Push to `main` (or run the workflow manually from the **Actions** tab).

The site will be available at `https://<your-username>.github.io/phytohormone-framework/`.

## Project structure

```
phytohormone-framework/
├── .github/workflows/deploy.yml   # GitHub Pages deployment
├── public/
│   └── index.html
├── src/
│   ├── index.js        # React entry point
│   ├── App.js          # Header, tab navigation, layout
│   ├── view.js         # All tab views and charts (Recharts)
│   ├── calculate.js    # Citations, curve models, scatter data, mechanisms, knowledge gaps
│   ├── theme.js        # Colour palette
│   └── styles.css
├── package.json
└── README.md
```

To update the scientific content (data points, citations, mechanism text), edit `src/calculate.js`. The views read everything from there.

## Built with

- [React 18](https://react.dev/)
- [Recharts](https://recharts.org/)
- [Create React App](https://create-react-app.dev/) (`react-scripts`)

## Citation

If you use this tool, please cite the accompanying review (manuscript under review):

Phan MTQ, Nguyen TM, Vo PT, Lam TK, Pham TTM. *Divergent cellular defence strategies underlie distinct dose–response profiles of exogenous phytohormones during plant tissue culture morphogenesis.* (under review)
