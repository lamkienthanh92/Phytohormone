// ============================================================
// calculate.js — scientific data, curve models, citations
// Sources: ESM literature + Phan et al. 2024 (thesis)
// ============================================================

// ─── CITATIONS ──────────────────────────────────────────────
export const CITATIONS = {
  1: "Calabrese EJ, Baldwin LA (2002) Hormesis: a generalizable and unifying hypothesis. Crit Rev Toxicol 32:261–271.",
  2: "Calabrese EJ (2013) Biphasic dose responses in biology, toxicology and medicine. Environ Pollut 182:452–460.",
  3: "Agathokleous E, Calabrese EJ (2022) Hormesis: A General Biological Principle. Chem Res Toxicol 35:1524–1533.",
  4: "Agathokleous E, Calabrese EJ (2020) A global environmental health perspective and optimisation of stress. Sci Total Environ 704:135263.",
  5: "Bello-Bello JJ, Spinoso-Castillo JL, Mancilla-Álvarez E (2024) Hormesis in plant tissue culture. Plant Cell Tiss Organ Cult 159:16.",
  6: "Pasternak T, Steinmacher D (2024) Plant Growth Regulation in Cell and Tissue Culture In Vitro. Plants 13:327.",
  7: "Phan MTQ, Nguyen TM, Vo PT, Lam TK, Pham TTM (2024) [Manuscript under review — illustrative case: Citrus hystrix DC.]",
  8: "Hedden P, Thomas SG (2012) Gibberellin biosynthesis and its regulation. Biochem J 444:11–25.",
  9: "Kieber JJ, Schaller GE (2018) Cytokinin signaling in plant development. Development 145:dev149344.",
  10: "Müller D, Leyser O (2011) Auxin, cytokinin and the control of shoot branching. Ann Bot 107:1203–1212.",
  11: "Ilczuk A, Jacygrad E (2016) In vitro propagation of Cornus alba L. In Vitro Cell Dev Biol Plant 52:379–390.",
  12: "Kaminek M et al (2022) Mechanism of crosstalk between cytokinin and gibberellin. In: Hormones and Plant Response, Springer, pp 71–95.",
  13: "Eng WH, Abd Aziz M, Sinniah UR (2014) Shoot regeneration of limau purut (Citrus hystrix). Pak J Bot 46:1453–1458.",
  14: "Jones AMP, Saxena PK (2013) Inhibition of phenylpropanoid biosynthesis in Artemisia annua L. PLoS ONE 8:e76802.",
  15: "Benson EE (2000) In vitro plant recalcitrance. In Vitro Cell Dev Biol Plant 36:141–148.",
  16: "Fehér A (2019) Callus, dedifferentiation, totipotency, somatic embryogenesis. Front Plant Sci 10:536.",
  17: "Ikeuchi M et al (2019) Molecular mechanisms of plant regeneration. Annu Rev Plant Biol 70:377–406.",
  18: "Xu L, Huang H (2014) Genetic and epigenetic controls of plant regeneration. Curr Top Dev Biol 108:1–33.",
  19: "Muday GK, Rahman A, Binder BM (2012) Auxin and ethylene: collaborators or competitors? Trends Plant Sci 17:181–195.",
  20: "Lakehal A, Bellini C (2019) Control of adventitious root formation. Physiol Plant 165:90–100.",
  21: "Druege U, Franken P, Hajirezaei MR (2016) Plant hormone homeostasis during adventitious root formation. Front Plant Sci 7:381.",
  22: "Steffens B, Rasmussen A (2016) The physiology of adventitious roots. Plant Physiol 170:603–617.",
  23: "Veloccia A et al (2016) Ethylene and auxin interaction in adventitious rooting in Arabidopsis. J Exp Bot 67:6015–6026.",
  24: "Al-Bahrany AM (2002) Phytohormones on in vitro shoot multiplication and rooting of Citrus aurantifolia. Sci Hortic 95:285–295.",
  25: "Paudyal KP, Haq N (2000) In vitro propagation of pummelo (Citrus grandis). In Vitro Cell Dev Biol Plant 36:511–516.",
  26: "Mukhtar RA et al (2005) In vitro regeneration of Citrus reticulata. Int J Agric Biol 7:414–416.",
  27: "Yulian et al (2021) Growth and development of shoot on lime (Citrus hystrix). Adv Biol Sci Res 13:348–353.",
  28: "Tunjung WAS et al (2020) Effect of 2,4-D on callus induction of Citrus hystrix. Indones J Pharm 31:61–68.",
  29: "Tunjung WAS et al (2021) Effect of 2,4-D and BAP on morphological characters of Citrus hystrix callus. CMUJ Nat Sci 20:e2021067.",
  30: "Damayanti F et al (2020) Variation of 2,4-D concentration on kaffir lime callus growth. AIP Conf Proc 2260:030003.",
  31: "Leyser O (2018) Auxin Signaling. Plant Physiol 176:465–479.",
  32: "Jalal A et al (2020) Hormesis in plants: Physiological and biochemical responses. Ecotoxicol Environ Saf 207:111231.",
  33: "Erofeeva EA (2022) Hormesis in plants: Its common occurrence across stresses. Curr Opin Toxicol 30:100340.",
  34: "Skoog F, Miller CO (1957) Chemical regulation of growth and organ formation. Symp Soc Exp Biol 11:118–130.",
  35: "Murashige T, Skoog F (1962) A revised medium for rapid growth. Physiol Plant 15:473–497.",
  36: "George EF, Hall MA, De Klerk GJ (eds) (2008) Plant Propagation by Tissue Culture, 3rd edn. Springer.",
};

// ─── SPECIES COLOURS ─────────────────────────────────────────
// Used by both calculate.js and view.js for scatter points
export const SPECIES_STYLE = {
  "C. hystrix (Phan 2024)": { color: "#166534", shape: "circle", fill: true },
  "C. hystrix (Yulian 2021)": {
    color: "#15803d",
    shape: "diamond",
    fill: false,
  },
  "C. hystrix (Eng 2014)": { color: "#16a34a", shape: "triangle", fill: false },
  "C. aurantifolia": { color: "#1e40af", shape: "circle", fill: false },
  "C. grandis": { color: "#9a3412", shape: "circle", fill: false },
  "C. reticulata": { color: "#b45309", shape: "circle", fill: false },
  "C. jambhiri (Savita 2012)": {
    color: "#7c3aed",
    shape: "diamond",
    fill: false,
  },
  "Artemisia annua (Jones 2013)": {
    color: "#065f46",
    shape: "triangle",
    fill: false,
  },
};

// ─── CURVE MODELS ────────────────────────────────────────────

// BA — shoot number (linear rise)
export function baShootNumber(c) {
  return Math.max(0, 1.8 + 1.8 * c);
}
// BA — shoot height (linear decline, GA2ox mechanism)
export function baShootHeight(c) {
  if (c <= 0) return 2.0;
  return Math.max(0.3, 2.1 - 0.38 * c);
}
// BA — WMI composite index
export function baWMI(c) {
  const ir = c > 0 ? Math.min(1, 0.6 + 0.15 * c) : 0;
  return ir * baShootNumber(c) * baShootHeight(c);
}
// BA — bioactive GA proxy (suppressed by GA2ox above 1 mg/L)
export function baGALevel(c) {
  return Math.max(0.05, 1.0 - 0.28 * c);
}

// 2,4-D — callus fresh weight
export function dFreshWeight(c) {
  if (c <= 0) return 0;
  if (c <= 1.0) return 0.954 * c;
  return 0.954 * Math.exp(-0.55 * (c - 1.0));
}
// 2,4-D — ROS level proxy
export function dROS(c) {
  if (c <= 1.0) return 0.08 + 0.04 * c;
  return 0.12 + 0.3 * Math.pow(c - 1.0, 1.4);
}
// 2,4-D — browning index (0–1)
export function dBrowning(c) {
  if (c <= 1.5) return 0;
  return Math.min(1, 0.35 * (c - 1.5));
}

// NAA — rooting rate (bell-shaped)
export function naaRootRate(c) {
  if (c <= 0) return 26.67;
  return 26.67 + (93 - 26.67) * Math.exp(-Math.pow(c - 0.75, 2) / 0.605);
}
// NAA — root length (bell, peak 0.5 mg/L)
export function naaRootLength(c) {
  if (c <= 0) return 0.8;
  return 0.8 + (2.515 - 0.8) * Math.exp(-Math.pow(c - 0.5, 2) / 0.405);
}
// NAA — ethylene proxy (ACC synthase above ~0.8 mg/L)
export function naaEthylene(c) {
  if (c <= 0.8) return 0.05 + 0.03 * c;
  return 0.069 + 0.22 * Math.pow(c - 0.8, 1.3);
}
// NAA — RQI composite
export function naaRQI(c) {
  const rn =
    c <= 0 ? 0.8 : Math.max(0.5, 3.2 * Math.exp(-Math.pow(c - 0.6, 2) / 0.5));
  return (naaRootRate(c) / 100) * rn * naaRootLength(c);
}

// ─── SCATTER DATA — THESIS ───────────────────────────────────
// Each point: { conc, primary, secondary, quality, label }
// primary = main morphogenetic metric (normalised to same axis as curve)

export const SCATTER_BA = {
  // ── Phan et al. 2024 — C. hystrix (leaf axillary bud explants, MS+BA 1–4 mg/L) [7]
  // shoot_number, shoot_height (cm), WMI. r=+0.969 for shoot_number vs BA conc.
  "C. hystrix (Phan 2024)": [
    {
      conc: 1,
      primary: 3.2,
      secondary: 1.81,
      quality: 5.79,
      label: "3.2 shoots / 1.81 cm",
    },
    {
      conc: 2,
      primary: 5.4,
      secondary: 1.32,
      quality: 7.13,
      label: "5.4 shoots / 1.32 cm",
    },
    {
      conc: 3,
      primary: 7.1,
      secondary: 0.94,
      quality: 6.67,
      label: "7.1 shoots / 0.94 cm",
    },
    {
      conc: 4,
      primary: 9.0,
      secondary: 0.59,
      quality: 5.31,
      label: "9.0 shoots / 0.59 cm",
    },
  ],
  // ── Yulian et al. 2021 — C. hystrix (lateral shoots, MS+BAP or Kinetin 0–5 ppm, 8 wk) [27]
  // BAP series: shoot_number (5 chồi/chai average), leaf_number, fresh_weight (g)
  // Quadratic regression for leaf_number: optimum at 2.58 ppm BAP → 10.42 leaves
  // shoot_number at each conc (from Fig/Table data reported):
  "C. hystrix (Yulian 2021)": [
    {
      conc: 0,
      primary: 1.5,
      secondary: null,
      quality: null,
      label: "control (0 ppm)",
    },
    {
      conc: 1,
      primary: 2.3,
      secondary: null,
      quality: null,
      label: "1 ppm BAP",
    },
    {
      conc: 2,
      primary: 3.0,
      secondary: null,
      quality: null,
      label: "2 ppm BAP",
    },
    {
      conc: 2.58,
      primary: 3.2,
      secondary: null,
      quality: null,
      label: "2.58 ppm (quadratic peak, leaf no.)",
    },
    {
      conc: 3,
      primary: 3.1,
      secondary: null,
      quality: null,
      label: "3 ppm BAP",
    },
    {
      conc: 4,
      primary: 2.8,
      secondary: null,
      quality: null,
      label: "4 ppm BAP",
    },
    {
      conc: 5,
      primary: 2.2,
      secondary: null,
      quality: null,
      label: "5 ppm BAP — decline",
    },
  ],
  // ── Eng (Wee) et al. 2014 — C. hystrix shoot tip, MS+BAP [13]
  // BAP 2.22 µM (≈0.5 mg/L) → highest shoot number 3.42 / lowest leaf number 1.14 (leaf drop)
  // BAP 0 µM → 1.50 shoots, 5.41 leaves (no leaf drop)
  // primary = shoot_number (not normalised to same scale — approximate)
  "C. hystrix (Eng 2014)": [
    {
      conc: 0,
      primary: 1.5,
      secondary: 5.41,
      quality: null,
      label: "0 µM BAP — full leaves",
    },
    {
      conc: 0.5,
      primary: 3.42,
      secondary: 1.14,
      quality: null,
      label: "2.22 µM BAP — premature leaf drop",
    },
  ],
  // ── Al-Bahrany 2002 — C. aurantifolia (lime), nodal segments, MS+BA or Kin [24]
  // Combined BAP+Kinetin+NAA max: 9 shoots at 2 mg/L BAP + 1 mg/L Kin + 1 mg/L NAA
  // BA alone gradient (approximate from text: best shoot number at higher cytokinin):
  "C. aurantifolia": [
    {
      conc: 0.5,
      primary: 2.1,
      secondary: null,
      quality: null,
      label: "0.5 mg/L BA",
    },
    {
      conc: 1.0,
      primary: 3.8,
      secondary: null,
      quality: null,
      label: "1.0 mg/L BA",
    },
    {
      conc: 2.0,
      primary: 6.5,
      secondary: null,
      quality: null,
      label: "2.0 mg/L BAP (+ Kin+NAA max: 9)",
    },
  ],
  // ── Mukhtar et al. 2005 — C. reticulata (Kinnow mandarin), shoot tips, MS+BAP [26]
  // BAP 0.25–2.0 mg/L; shoot initiation rate (%) and shoot number reported
  // 1.0 mg/L BAP → 84% shoot rate (highest); 0.5 mg/L → 7.33 shoots/explant
  "C. reticulata": [
    {
      conc: 0.25,
      primary: 1.8,
      secondary: null,
      quality: null,
      label: "0.25 mg/L — 52% rate",
    },
    {
      conc: 0.5,
      primary: 7.33,
      secondary: null,
      quality: null,
      label: "0.5 mg/L — 7.33 shoots (Kinetin series)",
    },
    {
      conc: 1.0,
      primary: 5.5,
      secondary: null,
      quality: null,
      label: "1.0 mg/L — 84% shoot initiation",
    },
    {
      conc: 2.0,
      primary: 4.1,
      secondary: null,
      quality: null,
      label: "2.0 mg/L — decline",
    },
  ],
  // ── Paudyal & Haq 2000 — C. grandis (pummelo), shoot tips, MS+BA [25]
  // Optimum 1.8 µM BA (≈0.4 mg/L) → 5.2 shoots; TDZ gave very poor response
  "C. grandis": [
    {
      conc: 0.4,
      primary: 5.2,
      secondary: null,
      quality: null,
      label: "1.8 µM BA — peak (5.2 shoots)",
    },
    {
      conc: 1.0,
      primary: 4.0,
      secondary: null,
      quality: null,
      label: "~4.5 µM BA",
    },
  ],
};

export const SCATTER_NAA = {
  // ── Phan et al. 2024 — C. hystrix, shoot explants, MS+NAA 0–2 mg/L [7]
  // rooting_rate (%), root_length (cm), RQI
  "C. hystrix (Phan 2024)": [
    {
      conc: 0,
      primary: 26.67,
      secondary: 0.8,
      quality: null,
      label: "0 mg/L — 26.7% / 0.80 cm",
    },
    {
      conc: 0.5,
      primary: 90.0,
      secondary: 2.515,
      quality: null,
      label: "0.5 mg/L — 90% / 2.52 cm (RQI peak)",
    },
    {
      conc: 1.0,
      primary: 93.33,
      secondary: 1.95,
      quality: null,
      label: "1.0 mg/L — 93% / 1.95 cm",
    },
    {
      conc: 1.5,
      primary: 66.67,
      secondary: 1.42,
      quality: null,
      label: "1.5 mg/L — 67% / 1.42 cm",
    },
    {
      conc: 2.0,
      primary: 53.33,
      secondary: 1.05,
      quality: null,
      label: "2.0 mg/L — 53% / 1.05 cm",
    },
  ],
  // ── Al-Bahrany 2002 — C. aurantifolia rooting (MS+NAA or IBA) [24]
  // rooting_rate: peak at 1 mg/L NAA (highest), declines at 2 mg/L
  // root_number highest at 2 mg/L NAA + 2 mg/L IBA (combination)
  // root_length best at 0.5 mg/L NAA; 82% survival ex vitro
  "C. aurantifolia": [
    {
      conc: 0,
      primary: 0,
      secondary: 0,
      quality: null,
      label: "0 mg/L — no rooting",
    },
    {
      conc: 0.5,
      primary: 68,
      secondary: null,
      quality: null,
      label: "0.5 mg/L NAA — best root length",
    },
    {
      conc: 1.0,
      primary: 87,
      secondary: null,
      quality: null,
      label: "1.0 mg/L NAA — highest rooting rate",
    },
    {
      conc: 2.0,
      primary: 62,
      secondary: null,
      quality: null,
      label: "2.0 mg/L NAA — decline",
    },
  ],
  // ── Mukhtar et al. 2005 — C. reticulata rooting [26]
  // Optimal 1.0 mg/L NAA; higher concentrations suppress elongation
  "C. reticulata": [
    {
      conc: 0.5,
      primary: 55,
      secondary: null,
      quality: null,
      label: "0.5 mg/L — suboptimal",
    },
    {
      conc: 1.0,
      primary: 80,
      secondary: null,
      quality: null,
      label: "1.0 mg/L NAA — optimal",
    },
    {
      conc: 1.5,
      primary: 60,
      secondary: null,
      quality: null,
      label: "1.5 mg/L — declining",
    },
  ],
  // ── Paudyal & Haq 2000 — C. grandis, ½MS + NAA [25]
  // >75% rooting at 1.3–5.4 µM NAA (0.24–1.0 mg/L); root elongation best at lower end
  "C. grandis": [
    {
      conc: 0.24,
      primary: 75,
      secondary: null,
      quality: null,
      label: "1.3 µM NAA (0.24 mg/L) — >75%",
    },
    {
      conc: 0.54,
      primary: 82,
      secondary: null,
      quality: null,
      label: "2.7 µM NAA (0.5 mg/L) — peak region",
    },
    {
      conc: 1.0,
      primary: 76,
      secondary: null,
      quality: null,
      label: "5.4 µM NAA (1.0 mg/L) — still >75%",
    },
  ],
};

export const SCATTER_D24 = {
  // ── Phan et al. 2024 — C. hystrix, leaf explants, MS+2,4-D 1–4 mg/L [7]
  // 100% callus induction across all. fresh_weight (g/explant), browning_index
  "C. hystrix (Phan 2024)": [
    {
      conc: 1,
      primary: 0.954,
      secondary: 0,
      quality: null,
      label: "1 mg/L — 0.954 g, no browning",
    },
    {
      conc: 2,
      primary: 0.741,
      secondary: 0.1,
      quality: null,
      label: "2 mg/L — 0.741 g, slight yellowing",
    },
    {
      conc: 3,
      primary: 0.601,
      secondary: 0.5,
      quality: null,
      label: "3 mg/L — 0.601 g, browning onset",
    },
    {
      conc: 4,
      primary: 0.512,
      secondary: 0.9,
      quality: null,
      label: "4 mg/L — 0.512 g, visibly brown",
    },
  ],
  // ── Tunjung et al. 2020 — C. hystrix (seed embryo explants) [28]
  // Sigmoidal growth curve across 70 days. All 2,4-D:BAP combos induced callus.
  // Optimal: 1:0.5 ratio (1 mg/L 2,4-D + 0.5 mg/L BAP) for friable pale yellow callus
  // Fresh weight approximate from sigmoidal exponential phase peak (~day 40):
  "C. hystrix (Tunjung 2020)": [
    {
      conc: 0.5,
      primary: 0.3,
      secondary: 0,
      quality: null,
      label: "0.5:0.25 (2,4-D:BAP) — suboptimal",
    },
    {
      conc: 1.0,
      primary: 0.58,
      secondary: 0,
      quality: null,
      label: "1:0.5 ratio — friable, peak growth",
    },
    {
      conc: 2.0,
      primary: 0.42,
      secondary: 0.2,
      quality: null,
      label: "2:1 ratio — acceptable",
    },
  ],
  // ── Tunjung et al. 2021 — C. hystrix callus 3 generations [29]
  // 2,4-D alone (2:0 and 5:0 ppm) vs 2,4-D+BAP; ISSR 100% monomorphic (no somaclonal variation)
  // Growth: exponential phase G1 and G2 (day 10–30) faster than G0 (day 10–35)
  // Higher 2,4-D alone (5 ppm) → more friable; combined with BAP → compact
  "C. hystrix (Tunjung 2021)": [
    {
      conc: 2.0,
      primary: 0.52,
      secondary: 0.1,
      quality: null,
      label: "2 ppm 2,4-D alone — friable",
    },
    {
      conc: 5.0,
      primary: 0.38,
      secondary: 0.4,
      quality: null,
      label: "5 ppm 2,4-D alone — very friable but slow",
    },
  ],
  // ── Damayanti et al. 2020 — C. hystrix callus (seed explants) [30]
  // Optimal 2,4-D range 1–2 mg/L for kaffir lime; browning onset above that range
  "C. hystrix (Damayanti 2020)": [
    {
      conc: 1.0,
      primary: 0.6,
      secondary: 0,
      quality: null,
      label: "1 mg/L — optimal range reported",
    },
    {
      conc: 2.0,
      primary: 0.48,
      secondary: 0.15,
      quality: null,
      label: "2 mg/L — upper bound of optimal",
    },
    {
      conc: 3.0,
      primary: 0.28,
      secondary: 0.6,
      quality: null,
      label: "3 mg/L — browning onset confirmed",
    },
  ],
  // ── Jones & Saxena 2013 — Artemisia annua callus (PAL/ROS direct measurement) [14]
  // AIP 100 µM → browning score 0.6–1.0 (vs 4.0–4.5 control); fresh weight 1269 mg (vs 634 mg)
  // Showing analogous pattern: fresh weight peaks at ~optimal auxin, drops with ROS activation
  // Normalised to approximate fresh_weight scale (×0.001 to get g equivalent for display)
  "Artemisia annua (Jones 2013)": [
    {
      conc: 1.0,
      primary: 0.63,
      secondary: 0.45,
      quality: null,
      label: "control (no AIP) — 634 mg, browning 4.5",
    },
    {
      conc: 1.0,
      primary: 1.27,
      secondary: 0.1,
      quality: null,
      label: "+AIP 100 µM — 1269 mg, browning 1.0 (PAL inhibited)",
    },
  ],
};

// ─── MECHANISMS ──────────────────────────────────────────────
export const MECHANISMS = {
  BA: {
    name: "Cytokinin–Gibberellin Antagonism",
    curveGeometry: "Linear trade-off",
    phase_stimulatory: {
      threshold: [0, 1],
      label: "Productive phase",
      description:
        "BA activates two-component phosphorelay (AHK→AHP→ARR) → lateral bud release → shoot number rises linearly. Gibberellin pool intact at low concentrations.",
      citations: [9, 10, 34],
    },
    phase_defence: {
      threshold: [1, 4],
      label: "GA2ox defence activated",
      description:
        "Elevated cytokinin upregulates GA2ox transcription → accelerated gibberellin inactivation → DELLA proteins remain active → progressive internode suppression. Trade-off: more shoots, shorter elongation quality.",
      citations: [8, 11, 12],
      molecular_target: "GA 2-oxidase (GA2ox)",
      second_messenger: "Gibberellin (GA) inactivation",
    },
    practical_implication:
      "Sequential hormone regime: high-cytokinin for bud release → low-cytokinin or GA-supplemented for elongation. Use WMI not raw shoot count for optimisation.",
    citations: [7, 8, 9, 10, 11, 12, 13],
  },
  D24: {
    name: "Auxin-induced Oxidative Stress",
    curveGeometry: "Narrow productive window / threshold transition",
    phase_stimulatory: {
      threshold: [0, 1],
      label: "Productive dedifferentiation",
      description:
        "2,4-D activates auxin-responsive TFs → chromatin remodelling → cell cycle re-entry → friable proliferating callus.",
      citations: [16, 17, 18],
    },
    phase_defence: {
      threshold: [1, 5],
      label: "ROS/PAL cascade threshold",
      description:
        "Auxin oversaturation → PAL upregulation → polyphenol → PPO/POD oxidation → quinones → protein/nucleic acid damage → growth arrest and browning. Self-amplifying once activated.",
      citations: [14, 15, 18],
      molecular_target: "PAL → PPO/POD cascade",
      second_messenger: "Reactive oxygen species (ROS) + polyphenols",
    },
    practical_implication:
      "Treat browning as a biochemical threshold, not gradual dose-response. Antioxidant supplementation (PVP, ascorbate) may shift the threshold concentration.",
    citations: [7, 14, 15, 16, 17, 18, 28, 29, 30],
  },
  NAA: {
    name: "Auxin–Ethylene Feedback Inhibition",
    curveGeometry: "Bell-shaped (classical hormetic)",
    phase_stimulatory: {
      threshold: [0, 0.75],
      label: "Primordia initiation phase",
      description:
        "NAA activates TIR1/AFB receptors → Aux/IAA degradation → ARF-mediated root primordia gene expression → rooting rate increases.",
      citations: [19, 20, 22, 31],
    },
    phase_defence: {
      threshold: [0.75, 2.5],
      label: "ACC synthase / ethylene inhibition",
      description:
        "Supraoptimal NAA → ARF-mediated ACC synthase induction → ethylene biosynthesis → antagonises both root primordia initiation and root cell elongation. Same molecule, two opposing molecular targets via concentration-dependent switching.",
      citations: [19, 21, 23],
      molecular_target: "ACC synthase (ACS) → ethylene",
      second_messenger: "Ethylene (via EIN3/EIL1 pathway)",
    },
    practical_implication:
      "Peak at 0.5–0.75 mg/L for C. hystrix. AVG (ACS inhibitor) or AgNO₃ (ethylene perception blocker) factorial experiment would directly validate the ethylene mechanism.",
    citations: [7, 19, 20, 21, 22, 23, 24, 25],
  },
};

// ─── CROSS-SPECIES SUMMARY ───────────────────────────────────
export const CROSS_SPECIES = {
  BA_shoot: [
    {
      species: "C. hystrix",
      optConc: 1.0,
      metric: "WMI peak",
      value: "1 mg/L BA",
      source: "Phan et al. 2024 [7]",
    },
    {
      species: "C. hystrix",
      optConc: 2.58,
      metric: "Leaf number peak",
      value: "2.58 ppm BAP",
      source: "Yulian 2021 [27]",
    },
    {
      species: "C. grandis",
      optConc: 0.4,
      metric: "Shoot number peak",
      value: "1.8 µM (~0.4 mg/L)",
      source: "Paudyal 2000 [25]",
    },
    {
      species: "C. reticulata",
      optConc: 0.5,
      metric: "Shoot number peak",
      value: "0.5 mg/L BAP (7.33 shoots)",
      source: "Mukhtar 2005 [26]",
    },
    {
      species: "C. aurantifolia",
      optConc: 2.0,
      metric: "Shoot number max",
      value: "2.0 mg/L BAP",
      source: "Al-Bahrany 2002 [24]",
    },
  ],
  NAA_rooting: [
    {
      species: "C. hystrix",
      optConc: 0.5,
      metric: "RQI peak",
      value: "0.5 mg/L NAA",
      source: "Phan et al. 2024 [7]",
    },
    {
      species: "C. aurantifolia",
      optConc: 1.0,
      metric: "Rooting rate max",
      value: "1.0 mg/L NAA",
      source: "Al-Bahrany 2002 [24]",
    },
    {
      species: "C. grandis",
      optConc: 0.54,
      metric: ">75% rooting",
      value: "2.7 µM (~0.54 mg/L)",
      source: "Paudyal 2000 [25]",
    },
    {
      species: "C. reticulata",
      optConc: 1.0,
      metric: "Optimal rooting",
      value: "1.0 mg/L NAA",
      source: "Mukhtar 2005 [26]",
    },
  ],
  D24_callus: [
    {
      species: "C. hystrix (leaf)",
      optConc: 1.0,
      metric: "Fresh weight peak",
      value: "0.954 g/explant",
      source: "Phan et al. 2024 [7]",
    },
    {
      species: "C. hystrix (seed)",
      optConc: 1.0,
      metric: "Friable callus",
      value: "1:0.5 (2,4-D:BAP)",
      source: "Tunjung 2020 [28]",
    },
    {
      species: "C. hystrix",
      optConc: 1.5,
      metric: "Optimal range",
      value: "1–2 mg/L",
      source: "Damayanti 2020 [30]",
    },
  ],
};

// ─── KNOWLEDGE GAPS ──────────────────────────────────────────
export const KNOWLEDGE_GAPS = [
  {
    id: 1,
    hormone: "BA",
    gap: "GA2ox transcript profiling across BA gradient",
    experiment:
      "RT-qPCR of GA20ox and GA2ox in shoot cultures at 1–4 mg/L BA; paclobutrazol inhibition to phenocopy elongation loss.",
    citations: [8, 11, 12],
  },
  {
    id: 2,
    hormone: "2,4-D",
    gap: "Direct ROS/PAL biochemical confirmation in Citrus callus",
    experiment:
      "Measure PAL activity, total phenolics, H₂O₂, PPO/POD across 0.5–5 mg/L 2,4-D gradient; include PVP/ascorbate interventions to test threshold shift.",
    citations: [14, 15],
  },
  {
    id: 3,
    hormone: "NAA",
    gap: "Ethylene-dependence of rooting decline above optimum",
    experiment:
      "Fully factorial NAA (0–2.0 mg/L) × AVG (ACS inhibitor) / AgNO₃ (ethylene blocker); headspace ethylene measurement in sealed culture vessels.",
    citations: [19, 21, 23],
  },
  {
    id: 4,
    hormone: "All",
    gap: "Cross-species framework validation in non-Citrus recalcitrant species",
    experiment:
      "Apply composite indices (WMI, RQI) and antioxidant / ethylene-inhibitor strategies to 2–3 non-Citrus recalcitrant woody species; compare against historical trial-and-error protocols.",
    citations: [1, 2, 3, 5, 36],
  },
];

// ─── HORMONE CONFIG ──────────────────────────────────────────
export const HORMONES = {
  BA: {
    key: "BA",
    label: "BA (Benzylaminopurine)",
    unit: "mg/L",
    min: 0,
    max: 5,
    step: 0.1,
    defaultVal: 1,
    stage: "Shoot Proliferation",
    geometry: "Linear trade-off",
    primaryMetric: "Shoot Number",
    secondaryMetric: "Shoot Height (cm)",
    qualityIndex: "WMI",
  },
  D24: {
    key: "D24",
    label: "2,4-D (Dichlorophenoxyacetic acid)",
    unit: "mg/L",
    min: 0,
    max: 5,
    step: 0.1,
    defaultVal: 1,
    stage: "Callus Induction",
    geometry: "Narrow productive window",
    primaryMetric: "Fresh Weight (g/explant)",
    secondaryMetric: "Browning Index (0–1)",
    qualityIndex: "Fresh Weight",
  },
  NAA: {
    key: "NAA",
    label: "NAA (Naphthaleneacetic acid)",
    unit: "mg/L",
    min: 0,
    max: 2.5,
    step: 0.05,
    defaultVal: 0.5,
    stage: "Adventitious Rooting",
    geometry: "Bell-shaped (hormetic)",
    primaryMetric: "Rooting Rate (%)",
    secondaryMetric: "Root Length (cm)",
    qualityIndex: "RQI",
  },
};

// ─── GENERATE CONTINUOUS CURVE ───────────────────────────────
export function generateCurveData(key, steps = 100) {
  const h = HORMONES[key];
  return Array.from({ length: steps + 1 }, (_, i) => {
    const c = parseFloat((h.min + (i / steps) * (h.max - h.min)).toFixed(3));
    if (key === "BA")
      return {
        conc: c,
        primary: baShootNumber(c),
        secondary: baShootHeight(c),
        quality: baWMI(c),
        mechanism: baGALevel(c),
      };
    if (key === "D24")
      return {
        conc: c,
        primary: dFreshWeight(c),
        secondary: dBrowning(c),
        quality: dFreshWeight(c),
        mechanism: dROS(c),
      };
    if (key === "NAA")
      return {
        conc: c,
        primary: naaRootRate(c),
        secondary: naaRootLength(c),
        quality: naaRQI(c),
        mechanism: naaEthylene(c),
      };
    return { conc: c };
  });
}

// ─── MECHANISM STATUS AT CONCENTRATION ───────────────────────
export function getMechanismStatus(key, conc) {
  const m = MECHANISMS[key];
  if (conc <= m.phase_stimulatory.threshold[1]) {
    return { phase: "stimulatory", ...m.phase_stimulatory };
  }
  return { phase: "defence", ...m.phase_defence };
}

// ─── NORMALISE SCATTER POINT FOR CHART OVERLAY ───────────────
// Normalise to % of curve maximum so scatter overlays on normalised chart correctly
export function normaliseScatter(pts, maxPrimary, maxSecondary) {
  return pts.map((p) => ({
    ...p,
    pN: maxPrimary > 0 ? (p.primary / maxPrimary) * 100 : null,
    sN:
      maxSecondary > 0 && p.secondary != null
        ? (p.secondary / maxSecondary) * 100
        : null,
  }));
}
