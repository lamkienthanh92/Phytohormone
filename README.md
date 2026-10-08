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

## Data

The *Citrus hystrix* values (filled circles and solid curves) come from the source undergraduate thesis, openly available on Zenodo:

> Phan TQM (2024) *Khảo sát ảnh hưởng của phytohormone đến hiệu quả vi nhân giống cây chanh chúc (Citrus hystrix)* [Effects of phytohormones on the micropropagation efficiency of kaffir lime]. Undergraduate thesis, Ho Chi Minh City University of Technology, VNU-HCM. https://doi.org/10.5281/zenodo.23227695

- Solid curves interpolate the thesis means (Tables 3.2–3.4) within the tested range only; nothing is extrapolated beyond 4 mg/L BA, 4 mg/L 2,4-D or 2 mg/L NAA.
- WMI = induction rate × shoot number × shoot height; RQI = rooting rate × root number × root length.
- In the callus experiment every 2,4-D medium also contained 1 mg/L BA; the control contained no growth regulator.
- Mechanism proxies (GA level, ROS, browning index, ethylene) are conceptual curves that illustrate the proposed mechanisms; they are not measurements.
- Literature points for other species are taken from the cited papers and normalised to the *C. hystrix* curve maximum for visual comparison only.

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

## Deploy to Netlify

The repository includes a `netlify.toml`, so Netlify picks up the correct settings automatically when you import the repo:

- Build command: `npm run build`
- Publish directory: `build`

Do not drag the source folder into Netlify Drop: it contains no built site, so Netlify serves a 404. Either connect the GitHub repo, or run `npm run build` locally and drop the resulting `build/` folder.

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
├── netlify.toml                 # Netlify build settings
├── package.json
└── README.md
```

To update the scientific content, edit `src/calculate.js`: `HYSTRIX_DATA` holds the *C. hystrix* means, `SCATTER_*` the literature points, and `CITATIONS`, `MECHANISMS` and `KNOWLEDGE_GAPS` the text. The views read everything from there.

## Built with

- [React 18](https://react.dev/)
- [Recharts](https://recharts.org/)
- [Create React App](https://create-react-app.dev/) (`react-scripts`)

## Citation

If you use this tool, please cite the accompanying review (manuscript under review):

Phan MTQ, Nguyen TM, Vo PT, Lam TK, Pham TTM. *Divergent cellular defence strategies underlie distinct dose–response profiles of exogenous phytohormones during plant tissue culture morphogenesis.* (under review)
