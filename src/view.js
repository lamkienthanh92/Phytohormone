// ============================================================
// view.js — Botanical/journal UI, all tabs
// ============================================================
import React, { useMemo, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Legend,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { T } from "./theme";
import {
  HORMONES,
  MECHANISMS,
  CITATIONS,
  CROSS_SPECIES,
  KNOWLEDGE_GAPS,
  generateCurveData,
  getMechanismStatus,
  SCATTER_BA,
  SCATTER_NAA,
  SCATTER_D24,
  SPECIES_STYLE,
  normaliseScatter,
} from "./calculate";

// ─── SHARED STYLES ──────────────────────────────────────────
const S = {
  card: {
    background: T.card,
    border: `1px solid ${T.border}`,
    borderRadius: 8,
    padding: "18px 20px",
    marginBottom: 18,
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  sectionLabel: {
    fontSize: 9,
    letterSpacing: "2px",
    textTransform: "uppercase",
    color: T.muted,
    fontFamily: "'Inter','Segoe UI',sans-serif",
    fontWeight: 700,
    marginBottom: 10,
  },
  h2: {
    fontSize: 15,
    fontWeight: 700,
    color: T.text,
    marginBottom: 8,
    lineHeight: 1.35,
  },
  body: {
    fontSize: 13,
    color: T.textMd,
    lineHeight: 1.75,
    fontFamily: "'Georgia','Times New Roman',serif",
  },
  mono: {
    fontFamily: "'Inter','Segoe UI',sans-serif",
    fontSize: 12,
    color: T.textMd,
  },
  grid2: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 },
  grid3: { display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 14 },
  pill: (color, pale) => ({
    display: "inline-block",
    padding: "2px 9px",
    borderRadius: 12,
    fontSize: 10,
    fontWeight: 700,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    background: pale,
    color: color,
    fontFamily: "'Inter','Segoe UI',sans-serif",
  }),
  stat: {
    background: T.bg,
    border: `1px solid ${T.border}`,
    borderRadius: 6,
    padding: "10px 14px",
    textAlign: "center",
  },
  statVal: { fontSize: 20, fontWeight: 700, color: T.accent, lineHeight: 1.2 },
  statLbl: {
    fontSize: 10,
    color: T.muted,
    marginTop: 3,
    fontFamily: "'Inter','Segoe UI',sans-serif",
  },
  divider: { borderTop: `1px solid ${T.rule}`, margin: "16px 0" },
};

// ─── CITE ───────────────────────────────────────────────────
function Cite({ nums }) {
  if (!nums || nums.length === 0) return null;
  return (
    <sup
      style={{
        fontFamily: "'Inter','Segoe UI',sans-serif",
        fontSize: 9,
        color: T.amber,
        marginLeft: 2,
      }}
    >
      [{nums.join(",")}]
    </sup>
  );
}

// ─── HORMONE COLOURS ────────────────────────────────────────
const HC = {
  BA: {
    main: T.green,
    pale: T.greenPale,
    label: "BA",
    full: "Benzylaminopurine",
  },
  D24: {
    main: T.orange,
    pale: T.orangePale,
    label: "2,4-D",
    full: "Dichlorophenoxyacetic acid",
  },
  NAA: {
    main: T.blue,
    pale: T.bluePale,
    label: "NAA",
    full: "Naphthaleneacetic acid",
  },
};

// ─── CUSTOM CHART TOOLTIP ───────────────────────────────────
function ChartTip({ active, payload, label, unit, rawData }) {
  if (!active || !payload?.length) return null;
  const raw = rawData?.find((d) => Math.abs(d.conc - label) < 0.015);
  return (
    <div
      style={{
        background: T.card,
        border: `1px solid ${T.borderDk}`,
        borderRadius: 6,
        padding: "10px 14px",
        fontSize: 11,
        fontFamily: "'Inter','Segoe UI',sans-serif",
        boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      }}
    >
      <div style={{ color: T.muted, marginBottom: 5, fontWeight: 600 }}>
        {Number(label).toFixed(2)} {unit}
      </div>
      {raw &&
        payload.map((p) => (
          <div key={p.dataKey} style={{ color: p.color, marginBottom: 2 }}>
            {p.name}:{" "}
            <strong>
              {typeof p.value === "number" ? p.value.toFixed(3) : p.value}
            </strong>
          </div>
        ))}
    </div>
  );
}

// ============================================================
// TAB 1 — FRAMEWORK OVERVIEW
// ============================================================
export function FrameworkOverview() {
  const profiles = [
    {
      h: "BA",
      color: T.green,
      pale: T.greenPale,
      stage: "Shoot Proliferation",
      geometry: "Linear trade-off",
      defence: "GA2ox upregulation",
      messenger: "Gibberellin inactivation",
      desc: "Shoot number rises linearly with BA (r = +0.969); elongation quality declines continuously via GA2ox-mediated gibberellin suppression. Composite index (WMI) reveals quality peak at 1 mg/L despite count rising to 4 mg/L.",
      cites: [7, 8, 9, 11, 12],
    },
    {
      h: "2,4-D",
      color: T.orange,
      pale: T.orangePale,
      stage: "Callus Induction",
      geometry: "Threshold transition",
      defence: "PAL/ROS cascade",
      messenger: "Reactive oxygen species + polyphenols",
      desc: "Narrow productive window near 1 mg/L. Above oxidative threshold, PAL upregulation drives self-amplifying polyphenol oxidation → quinone accumulation → growth arrest and browning. Sharper transition than BA due to ROS bistability.",
      cites: [7, 14, 15, 16, 17],
    },
    {
      h: "NAA",
      color: T.blue,
      pale: T.bluePale,
      stage: "Adventitious Rooting",
      geometry: "Bell-shaped (hormetic)",
      defence: "ACC synthase induction",
      messenger: "Ethylene feedback inhibition",
      desc: "Classical biphasic profile. TIR1/AFB activation drives primordia initiation on the ascending limb; supraoptimal NAA induces ACC synthase → ethylene accumulation → antagonises the same rooting process. Same molecule, two opposing molecular targets.",
      cites: [7, 19, 20, 21, 23],
    },
  ];

  return (
    <div>
      {/* Central proposition */}
      <div style={{ ...S.card, borderLeft: `4px solid ${T.accent}` }}>
        <div style={S.sectionLabel}>Central framework proposition</div>
        <p style={{ ...S.body, margin: 0 }}>
          The three canonical dose–response profiles observed during
          cytokinin-mediated shoot proliferation, auxin-mediated callus
          induction, and auxin-mediated adventitious rooting reflect{" "}
          <strong>divergent cellular defence mechanisms</strong> — each engaging
          a distinct molecular second messenger — rather than independent
          empirical phenomena. Curve geometry is determined by the{" "}
          <em>kinetic properties of the counter-regulatory mechanism</em>, not
          the hormone class.
          <Cite nums={[1, 2, 3, 6, 7]} />
        </p>
      </div>

      {/* Three profiles */}
      <div style={S.grid3}>
        {profiles.map((p) => (
          <div
            key={p.h}
            style={{
              ...S.card,
              borderTop: `3px solid ${p.color}`,
              marginBottom: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                marginBottom: 10,
              }}
            >
              <div>
                <span style={S.pill(p.color, p.pale)}>{p.h}</span>
                <div
                  style={{
                    fontSize: 12,
                    color: T.muted,
                    marginTop: 5,
                    fontFamily: "'Inter','Segoe UI',sans-serif",
                  }}
                >
                  {p.stage}
                </div>
              </div>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  color: p.color,
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                  fontWeight: 700,
                  textAlign: "right",
                  maxWidth: 90,
                }}
              >
                {p.geometry}
              </div>
            </div>

            <div style={{ ...S.divider, margin: "10px 0" }} />

            <div style={{ marginBottom: 8 }}>
              <div
                style={{
                  fontSize: 10,
                  color: T.muted,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                  marginBottom: 3,
                }}
              >
                Defence mechanism
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: p.color,
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                }}
              >
                {p.defence}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: T.muted,
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                }}
              >
                via {p.messenger}
              </div>
            </div>

            <p style={{ ...S.body, fontSize: 12, margin: 0 }}>
              {p.desc}
              <Cite nums={p.cites} />
            </p>
          </div>
        ))}
      </div>

      {/* Key numbers */}
      <div style={{ ...S.card, marginTop: 18 }}>
        <div style={S.sectionLabel}>
          Key quantitative anchors — <em>Citrus hystrix</em> illustrative case
          <Cite nums={[7]} />
        </div>
        <div style={S.grid3}>
          {[
            {
              val: "r = +0.969",
              sub: "BA vs. shoot number (p = 0.007)",
              note: "Linear trade-off confirmed",
            },
            {
              val: "0.954 g",
              sub: "2,4-D at 1 mg/L — peak callus fresh weight",
              note: "vs. 0.512 g at 4 mg/L",
            },
            {
              val: "RQI ×1.56",
              sub: "Rooting quality at 0.5 vs 1.0 mg/L NAA",
              note: "Bell-shape quality gap",
            },
          ].map((s) => (
            <div key={s.val} style={S.stat}>
              <div style={S.statVal}>{s.val}</div>
              <div
                style={{
                  ...S.statLbl,
                  color: T.textMd,
                  fontSize: 11,
                  marginTop: 4,
                }}
              >
                {s.sub}
              </div>
              <div style={S.statLbl}>{s.note}</div>
            </div>
          ))}
        </div>
        <div
          style={{
            fontSize: 11,
            color: T.muted,
            marginTop: 10,
            fontStyle: "italic",
            fontFamily: "'Inter','Segoe UI',sans-serif",
          }}
        >
          Note: illustrative case data provide morphological grounding for the
          framework, not primary mechanistic evidence. Mechanistic claims are
          supported by the broader literature cited.
        </div>
      </div>

      {/* Hormesis constants */}
      <div style={S.card}>
        <div style={S.sectionLabel}>
          Hormesis framework — theoretical basis <Cite nums={[1, 2, 3]} />
        </div>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}
        >
          {[
            {
              k: "Stimulation cap",
              v: "30–60% above control (Calabrese 2013)",
              c: [2],
            },
            {
              k: "Threshold concept",
              v: "Narrow concentration-specific transition from benefit to defence",
              c: [1, 3],
            },
            {
              k: "Curve divergence",
              v: "Same concept; different second-messenger kinetics produce different geometries",
              c: [2, 6],
            },
            {
              k: "Practical implication",
              v: "Stage-specific hormone management; composite quality indices over single-parameter optimisation",
              c: [7, 36],
            },
          ].map((r) => (
            <div
              key={r.k}
              style={{
                background: T.accentPale,
                borderRadius: 6,
                padding: "10px 14px",
                border: `1px solid ${T.border}`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: T.accent,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  marginBottom: 4,
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                }}
              >
                {r.k}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: T.text,
                  lineHeight: 1.5,
                  fontFamily: "'Georgia','Times New Roman',serif",
                }}
              >
                {r.v}
                <Cite nums={r.c} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB 2 — INTERACTIVE DOSE-RESPONSE (with scatter overlay)
// ============================================================

// Custom dot renderer for scatter points on LineChart
function ScatterDot({ cx, cy, fill, stroke, payload, speciesKey }) {
  if (!cx || !cy) return null;
  const style = SPECIES_STYLE[speciesKey] || {};
  const r = 5;
  const isFill = style.fill;
  return (
    <circle
      cx={cx}
      cy={cy}
      r={r}
      fill={isFill ? style.color : "white"}
      stroke={style.color}
      strokeWidth={2}
      opacity={0.85}
    />
  );
}

export function InteractiveDoseResponse({
  hormone,
  setHormone,
  sliderVal,
  setSliderVal,
}) {
  const h = HORMONES[hormone];
  const hc = HC[hormone];

  // All species available for this hormone
  const allScatter =
    hormone === "BA"
      ? SCATTER_BA
      : hormone === "D24"
      ? SCATTER_D24
      : SCATTER_NAA;
  const speciesKeys = Object.keys(allScatter);

  // Species toggle state (all on by default)
  const [activeSpecies, setActiveSpecies] = useState(() =>
    Object.fromEntries(speciesKeys.map((k) => [k, true]))
  );
  // Reset when hormone changes
  const toggleSpecies = (k) =>
    setActiveSpecies((prev) => ({ ...prev, [k]: !prev[k] }));
  const resetSpecies = () =>
    setActiveSpecies(Object.fromEntries(speciesKeys.map((k) => [k, true])));

  const curveData = useMemo(() => generateCurveData(hormone), [hormone]);
  const status = useMemo(
    () => getMechanismStatus(hormone, sliderVal),
    [hormone, sliderVal]
  );

  // Curves are null outside the tested C. hystrix range (no extrapolation)
  const maxOf = (k) =>
    Math.max(...curveData.map((d) => d[k]).filter((v) => v != null));
  const norm = (v, m) => (v == null || !(m > 0) ? null : (v / m) * 100);
  const maxP = maxOf("primary");
  const maxS = maxOf("secondary");

  // Normalised curve for % display
  const chartData = useMemo(
    () =>
      curveData.map((d) => ({
        conc: d.conc,
        pN: norm(d.primary, maxP),
        sN: norm(d.secondary, maxS),
        qN: norm(d.quality, maxOf("quality")),
        mN: norm(d.mechanism, maxOf("mechanism")),
      })),
    [curveData, maxP, maxS]
  );

  // Normalised scatter per active species
  const scatterSeries = useMemo(
    () =>
      speciesKeys
        .filter((k) => activeSpecies[k])
        .map((k) => ({
          key: k,
          style: SPECIES_STYLE[k] || { color: T.muted },
          pts: normaliseScatter(allScatter[k], maxP, maxS),
        })),
    [activeSpecies, hormone, maxP, maxS]
  );

  const lineCfg = {
    BA: {
      p: { color: T.green, name: "Shoot number (C. hystrix, interpolated model)" },
      s: { color: T.amberLt, name: "Shoot height (C. hystrix, interpolated model)" },
      q: { color: T.accent, name: "WMI quality index" },
      m: { color: T.red, name: "GA suppression proxy" },
    },
    D24: {
      p: { color: T.orange, name: "Callus fresh weight (C. hystrix, interpolated model)" },
      s: { color: T.red, name: "Browning index (conceptual model)" },
      q: { color: T.orange, name: "Fresh Weight" },
      m: { color: T.red, name: "ROS level proxy" },
    },
    NAA: {
      p: { color: T.blue, name: "Rooting rate (C. hystrix, interpolated model)" },
      s: { color: T.green, name: "Root length (C. hystrix, interpolated model)" },
      q: { color: T.accent, name: "RQI quality index" },
      m: { color: T.red, name: "Ethylene proxy" },
    },
  }[hormone];

  const threshold = hormone === "BA" ? 1.0 : hormone === "D24" ? 1.0 : 0.75;
  const isDefence = sliderVal > threshold;

  // Tooltip that shows both curve and scatter info
  const ComboTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div
        style={{
          background: T.card,
          border: `1px solid ${T.borderDk}`,
          borderRadius: 6,
          padding: "10px 14px",
          fontSize: 11,
          maxWidth: 220,
          fontFamily: "'Inter','Segoe UI',sans-serif",
          boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
        }}
      >
        <div style={{ color: T.muted, fontWeight: 600, marginBottom: 5 }}>
          {Number(label).toFixed(2)} {h.unit}
        </div>
        {payload.map((p, i) => (
          <div key={i} style={{ color: p.color || T.textMd, marginBottom: 2 }}>
            {p.name}:{" "}
            <strong>
              {typeof p.value === "number" ? p.value.toFixed(1) : p.value}
            </strong>
            {p.name?.includes("model") ? "" : " %"}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      {/* Hormone selector */}
      <div style={{ ...S.card, padding: "14px 20px" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexWrap: "wrap",
          }}
        >
          <div style={{ ...S.sectionLabel, margin: 0, marginRight: 6 }}>
            Select hormone:
          </div>
          {Object.values(HORMONES).map((hm) => {
            const c = HC[hm.key];
            const active = hormone === hm.key;
            return (
              <button
                key={hm.key}
                onClick={() => {
                  setHormone(hm.key);
                  setSliderVal(hm.defaultVal);
                  // reset species toggles for new hormone
                  setTimeout(() => {}, 0);
                }}
                style={{
                  padding: "7px 14px",
                  borderRadius: 6,
                  cursor: "pointer",
                  border: `1.5px solid ${active ? c.main : T.border}`,
                  background: active ? c.pale : T.bg,
                  color: active ? c.main : T.muted,
                  fontWeight: active ? 700 : 400,
                  fontSize: 12,
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                  transition: "all 0.15s",
                }}
              >
                <strong>{c.label}</strong>
                <span
                  style={{
                    fontSize: 10,
                    marginLeft: 4,
                    color: active ? c.main : T.muted,
                  }}
                >
                  — {hm.stage}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Species toggle */}
      <div style={{ ...S.card, padding: "12px 20px", marginBottom: 14 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexWrap: "wrap",
          }}
        >
          <div style={{ ...S.sectionLabel, margin: 0, marginRight: 4 }}>
            Overlay literature data:
          </div>
          {speciesKeys.map((k) => {
            const st = SPECIES_STYLE[k] || { color: T.muted };
            const on = activeSpecies[k];
            return (
              <button
                key={k}
                onClick={() => toggleSpecies(k)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 10px",
                  borderRadius: 20,
                  cursor: "pointer",
                  border: `1.5px solid ${on ? st.color : T.border}`,
                  background: on ? st.color + "18" : T.bg,
                  color: on ? st.color : T.muted,
                  fontSize: 11,
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                  fontWeight: on ? 600 : 400,
                  transition: "all 0.12s",
                }}
              >
                {/* dot indicator */}
                <svg width="10" height="10" viewBox="0 0 10 10">
                  <circle
                    cx="5"
                    cy="5"
                    r="4"
                    fill={
                      on ? (SPECIES_STYLE[k]?.fill ? st.color : "white") : T.bg
                    }
                    stroke={on ? st.color : T.muted}
                    strokeWidth="1.5"
                  />
                </svg>
                <em>{k}</em>
              </button>
            );
          })}
          <button
            onClick={resetSpecies}
            style={{
              padding: "4px 10px",
              borderRadius: 20,
              cursor: "pointer",
              border: `1px solid ${T.border}`,
              background: T.bg,
              color: T.muted,
              fontSize: 10,
              fontFamily: "'Inter','Segoe UI',sans-serif",
            }}
          >
            all on
          </button>
        </div>
        <div
          style={{
            fontSize: 10,
            color: T.muted,
            marginTop: 6,
            fontFamily: "'Inter','Segoe UI',sans-serif",
            fontStyle: "italic",
          }}
        >
          Filled circle = C. hystrix illustrative case (Phan 2024, thesis{" "}
          <a href="https://doi.org/10.5281/zenodo.23227695" target="_blank" rel="noreferrer" style={{ color: T.accent }}>doi:10.5281/zenodo.23227695</a>).
          Open symbols = literature. Solid curves interpolate the C. hystrix means
          within the tested range; proxy curves are conceptual. All values
          normalised to % of the curve maximum.
        </div>
      </div>

      <div style={S.grid2}>
        {/* ── Left: chart + slider ── */}
        <div style={S.card}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <div>
              <div style={S.sectionLabel}>
                {h.stage} — {hc.geometry}
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: T.muted,
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                }}
              >
                Model curve + empirical scatter ({scatterSeries.length} series
                shown)
              </div>
            </div>
            <span style={S.pill(hc.main, hc.pale)}>{hc.label}</span>
          </div>

          <ResponsiveContainer width="100%" height={280}>
            <LineChart margin={{ top: 6, right: 10, left: -16, bottom: 22 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={T.rule} />
              <XAxis
                dataKey="conc"
                type="number"
                domain={[h.min, h.max]}
                allowDuplicatedCategory={false}
                stroke={T.muted}
                tick={{
                  fontSize: 10,
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                }}
                label={{
                  value: `Concentration (${h.unit})`,
                  position: "insideBottom",
                  offset: -12,
                  fill: T.muted,
                  fontSize: 10,
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                }}
              />
              <YAxis
                stroke={T.muted}
                domain={[0, 105]}
                tick={{
                  fontSize: 10,
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                }}
                label={{
                  value: "% of max",
                  angle: -90,
                  position: "insideLeft",
                  fill: T.muted,
                  fontSize: 10,
                  dx: 14,
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                }}
              />
              <Tooltip content={<ComboTooltip />} />

              {/* Threshold reference */}
              <ReferenceLine
                x={threshold}
                stroke={T.amber}
                strokeWidth={1.2}
                strokeDasharray="5 3"
                label={{
                  value: "defence threshold",
                  fill: T.amber,
                  fontSize: 9,
                  position: "insideTopRight",
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                }}
              />
              {/* Slider cursor */}
              <ReferenceLine
                x={sliderVal}
                stroke="#555"
                strokeWidth={1.5}
                strokeDasharray="3 2"
                label={{
                  value: `▼${sliderVal}`,
                  fill: T.text,
                  fontSize: 9,
                  position: "top",
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                }}
              />

              {/* Model curves (from continuous data) */}
              <Line
                data={chartData}
                type="monotone"
                dataKey="pN"
                stroke={lineCfg.p.color}
                dot={false}
                strokeWidth={2.5}
                name={lineCfg.p.name}
              />
              <Line
                data={chartData}
                type="monotone"
                dataKey="sN"
                stroke={lineCfg.s.color}
                dot={false}
                strokeWidth={2}
                strokeDasharray="6 3"
                name={lineCfg.s.name}
              />
              <Line
                data={chartData}
                type="monotone"
                dataKey="qN"
                stroke={T.accent}
                dot={false}
                strokeWidth={1.5}
                strokeDasharray="3 4"
                name="Quality index (WMI/RQI)"
              />

              {/* Scatter series — one Line per species (dots only, no connecting line) */}
              {scatterSeries.map(({ key, style, pts }) => (
                <Line
                  key={key}
                  data={pts}
                  dataKey="pN"
                  type="linear"
                  stroke={style.color}
                  strokeWidth={0}
                  dot={(dotProps) => {
                    const { cx, cy } = dotProps;
                    if (!cx || !cy) return null;
                    return (
                      <circle
                        key={`${key}-${dotProps.index}`}
                        cx={cx}
                        cy={cy}
                        r={5.5}
                        fill={style.fill ? style.color : "white"}
                        stroke={style.color}
                        strokeWidth={2}
                        opacity={0.9}
                      />
                    );
                  }}
                  activeDot={{
                    r: 7,
                    stroke: style.color,
                    fill: style.fill ? style.color : "white",
                  }}
                  name={key}
                  connectNulls={false}
                  isAnimationActive={false}
                />
              ))}

              <Legend
                wrapperStyle={{
                  fontSize: 10,
                  paddingTop: 6,
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                }}
              />
            </LineChart>
          </ResponsiveContainer>

          {/* Slider */}
          <div
            style={{
              marginTop: 10,
              borderTop: `1px solid ${T.rule}`,
              paddingTop: 12,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: 4,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  color: T.muted,
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                }}
              >
                Explore concentration
              </span>
              <span
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: hc.main,
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                }}
              >
                {sliderVal} {h.unit}
              </span>
            </div>
            <input
              type="range"
              min={h.min}
              max={h.max}
              step={h.step}
              value={sliderVal}
              onChange={(e) => setSliderVal(parseFloat(e.target.value))}
              style={{ width: "100%", accentColor: hc.main, cursor: "pointer" }}
            />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span
                style={{
                  fontSize: 10,
                  color: T.muted,
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                }}
              >
                {h.min} {h.unit}
              </span>
              <span
                style={{
                  fontSize: 10,
                  color: T.muted,
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                }}
              >
                {h.max} {h.unit}
              </span>
            </div>
          </div>
        </div>

        {/* ── Right: mechanism + scatter table ── */}
        <div>
          <div style={S.card}>
            <div style={S.sectionLabel}>
              Mechanism at {sliderVal} {h.unit}
            </div>
            <div
              style={{
                background: isDefence ? "#fef2f2" : T.accentPale,
                border: `1px solid ${isDefence ? "#fecaca" : "#bbf7d0"}`,
                borderRadius: 7,
                padding: "12px 16px",
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "1.2px",
                  textTransform: "uppercase",
                  color: isDefence ? T.red : T.accent,
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                  marginBottom: 6,
                }}
              >
                {isDefence
                  ? "⚠ Defence phase activated"
                  : "▲ Stimulatory phase"}
              </div>
              <p style={{ ...S.body, fontSize: 12, margin: 0 }}>
                {status.description}
                <Cite nums={status.citations || []} />
              </p>
              {status.molecular_target && (
                <div
                  style={{
                    marginTop: 8,
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 6,
                  }}
                >
                  {[
                    ["Molecular target", status.molecular_target],
                    ["Second messenger", status.second_messenger],
                  ].map(([k, v]) =>
                    v ? (
                      <div
                        key={k}
                        style={{
                          background: "rgba(255,255,255,0.6)",
                          borderRadius: 4,
                          padding: "6px 8px",
                        }}
                      >
                        <div
                          style={{
                            fontSize: 9,
                            color: T.muted,
                            textTransform: "uppercase",
                            letterSpacing: "0.8px",
                            fontFamily: "'Inter','Segoe UI',sans-serif",
                          }}
                        >
                          {k}
                        </div>
                        <div
                          style={{
                            fontSize: 11,
                            fontWeight: 600,
                            color: T.text,
                            fontFamily: "'Inter','Segoe UI',sans-serif",
                          }}
                        >
                          {v}
                        </div>
                      </div>
                    ) : null
                  )}
                </div>
              )}
            </div>
            <div
              style={{
                background: T.amberPale,
                border: `1px solid #fde68a`,
                borderRadius: 6,
                padding: "10px 12px",
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  color: T.amber,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  marginBottom: 4,
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                }}
              >
                Practical implication
              </div>
              <div
                style={{
                  fontSize: 12,
                  color: T.text,
                  lineHeight: 1.5,
                  fontFamily: "'Georgia','Times New Roman',serif",
                }}
              >
                {MECHANISMS[hormone].practical_implication}
              </div>
            </div>
          </div>

          {/* Literature data table */}
          <div style={S.card}>
            <div style={S.sectionLabel}>Active scatter data points</div>
            <div style={{ maxHeight: 260, overflowY: "auto" }}>
              {scatterSeries.map(({ key, style, pts }) => (
                <div key={key} style={{ marginBottom: 10 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 5,
                    }}
                  >
                    <svg width="10" height="10">
                      <circle
                        cx="5"
                        cy="5"
                        r="4"
                        fill={style.fill ? style.color : "white"}
                        stroke={style.color}
                        strokeWidth="1.5"
                      />
                    </svg>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        color: style.color,
                        fontFamily: "'Inter','Segoe UI',sans-serif",
                        fontStyle: "italic",
                      }}
                    >
                      {key}
                    </span>
                  </div>
                  {pts.map((pt, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: "4px 6px",
                        fontSize: 11,
                        background: i % 2 === 0 ? T.bg : T.card,
                        borderRadius: 3,
                        fontFamily: "'Inter','Segoe UI',sans-serif",
                      }}
                    >
                      <span style={{ color: T.muted }}>
                        {pt.conc} {h.unit}
                      </span>
                      <span
                        style={{
                          color: T.textMd,
                          maxWidth: 160,
                          textAlign: "right",
                        }}
                      >
                        {pt.label}
                      </span>
                    </div>
                  ))}
                </div>
              ))}
              {scatterSeries.length === 0 && (
                <div
                  style={{
                    color: T.muted,
                    fontSize: 12,
                    fontStyle: "italic",
                    fontFamily: "'Inter','Segoe UI',sans-serif",
                  }}
                >
                  All species hidden — toggle above to show data.
                </div>
              )}
            </div>
            <div
              style={{
                fontSize: 10,
                color: T.muted,
                marginTop: 8,
                fontStyle: "italic",
                fontFamily: "'Inter','Segoe UI',sans-serif",
              }}
            >
              Scatter points show primary metric only (normalised). Literature
              values reconstructed from reported text — see citations for
              original tables.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ============================================================
// TAB 3 — MECHANISM EXPLORER
// ============================================================
export function MechanismExplorer() {
  const detail = [
    {
      key: "BA",
      color: T.green,
      pale: T.greenPale,
      title: "GA2ox-mediated Gibberellin Inactivation",
      sub: "Cytokinin overdrive → graded quantity–quality trade-off",
      kinetics:
        "Graded enzymatic process running in parallel with cytokinin receptor activation. Unlike ROS cascades, GA inactivation is reversible and proportional — producing a continuous linear inverse relationship, not a bistable threshold.",
      note: "WMI peaked at 1 mg/L BA (11.8) and was 1.6-fold lower at 4 mg/L (7.2) despite shoot count rising to 12.2. Premature leaf abscission observed at 4 mg/L — consistent with cytokinin-induced disruption of source–sink relationships.",
      steps: [
        {
          t: "BA activates two-component phosphorelay (AHK → AHP → ARR) → lateral bud release → shoot number rises linearly.",
          c: [9, 10],
        },
        {
          t: "Elevated cytokinin signalling upregulates GA2ox transcription.",
          c: [8, 11, 12],
        },
        {
          t: "GA2ox accelerates inactivation of bioactive GA (GA₁, GA₄) — DELLA proteins remain active.",
          c: [8],
        },
        {
          t: "Bioactive GA pool depleted → DELLA-mediated internode elongation suppressed progressively.",
          c: [8, 12],
        },
        {
          t: "Net: continuous shoot-number gain vs. progressive elongation loss (linear trade-off curve).",
          c: [7, 10, 13],
        },
      ],
      cites: [7, 8, 9, 10, 11, 12, 13],
    },
    {
      key: "D24",
      color: T.orange,
      pale: T.orangePale,
      title: "PAL/PPO Cascade — Oxidative Growth Arrest",
      sub: "2,4-D oversaturation → self-amplifying polyphenol oxidation",
      kinetics:
        "Threshold-dependent and self-amplifying. Once PAL is activated, polyphenol → quinone cascades accelerate, creating a positive-feedback browning loop. This bistability explains the sharp (not graded) transition from productive callus to arrested tissue.",
      note: "All 2,4-D media also contained 1 mg/L BA. Callus induction was 100% at 1–4 mg/L vs 6.67% on hormone-free medium, so an auxin–cytokinin interaction cannot be excluded. Fresh weight 0.954 g at 1 mg/L → 0.512 g at 4 mg/L. Compact, dry, visibly brown morphology at 3–4 mg/L.",
      steps: [
        {
          t: "2,4-D activates auxin-responsive TFs → chromatin remodelling → cell cycle re-entry → callus proliferation.",
          c: [16, 17, 18],
        },
        {
          t: "Above oxidative threshold: PAL (phenylalanine ammonia-lyase) upregulated — first committed step in phenylpropanoid biosynthesis.",
          c: [14],
        },
        {
          t: "Polyphenolic compounds accumulate and are oxidised by PPO and POD → quinones formed.",
          c: [14],
        },
        {
          t: "Quinones bind cellular proteins and nucleic acids — active wound/stress defence response (not simple cytotoxicity).",
          c: [14, 15],
        },
        {
          t: "Self-amplifying cascade: ROS production accelerates PAL further → abrupt growth arrest and browning.",
          c: [14, 15, 18],
        },
      ],
      cites: [7, 14, 15, 16, 17, 18, 28, 29, 30],
    },
    {
      key: "NAA",
      color: T.blue,
      pale: T.bluePale,
      title: "ACC Synthase Induction — Auxin–Ethylene Feedback",
      sub: "Concentration-dependent receptor switching generates bell-shaped curve",
      kinetics:
        "More symmetrical bell-shape than 2,4-D threshold because ACC synthase induction is gradual (not self-amplifying). Ethylene receptor saturation dynamics further smooth the descending limb, producing the classical hormetic geometry.",
      note: "Rooting rate 26.67% (0 mg/L) → 90.00% (0.5) → 93.33% (1.0) → 66.67% (1.5) → 53.33% (2.0). RQI 1.56× higher at 0.5 vs 1.0 mg/L. AVG or AgNO₃ experiments would directly validate the ethylene mechanism.",
      steps: [
        {
          t: "Low-moderate NAA → TIR1/AFB receptor activation → Aux/IAA degradation → ARF-mediated root primordia gene expression.",
          c: [19, 20, 31],
        },
        {
          t: "Supraoptimal NAA → ARF-mediated ACC synthase (ACS) transcriptional induction — rate-limiting step in ethylene biosynthesis.",
          c: [19, 21],
        },
        {
          t: "Ethylene accumulates in sealed culture vessels → EIN3/EIL1 pathway activated.",
          c: [21, 22],
        },
        {
          t: "Ethylene antagonises both root primordia initiation and root cell elongation.",
          c: [19, 23],
        },
        {
          t: "Same hormone (NAA) promotes via TIR1/AFB [ascending] and suppresses via ACS→ethylene [descending] — concentration-dependent target switch.",
          c: [19, 23, 31],
        },
      ],
      cites: [7, 19, 20, 21, 22, 23, 24, 25],
    },
  ];

  return (
    <div>
      <div style={{ ...S.card, borderLeft: `4px solid ${T.amber}` }}>
        <div style={S.sectionLabel}>Why do curve shapes differ?</div>
        <p style={{ ...S.body, margin: 0 }}>
          Curve geometry is determined by the{" "}
          <strong>
            kinetic properties of the counter-regulatory mechanism
          </strong>
          : GA inactivation is graded and reversible (linear trade-off); ROS
          cascades are threshold-dependent and self-amplifying (sharp
          transition); ethylene feedback is concentration-responsive with
          receptor saturation dynamics (bell-shape).
          <Cite nums={[1, 2, 8, 14, 19]} />
        </p>
      </div>

      {detail.map((m) => (
        <div
          key={m.key}
          style={{ ...S.card, borderLeft: `4px solid ${m.color}` }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              marginBottom: 14,
            }}
          >
            <div>
              <span style={S.pill(m.color, m.pale)}>
                {m.key === "D24" ? "2,4-D" : m.key}
              </span>
              <div
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: T.text,
                  marginTop: 8,
                  lineHeight: 1.3,
                }}
              >
                {m.title}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: T.muted,
                  marginTop: 3,
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                }}
              >
                {m.sub}
              </div>
            </div>
          </div>

          {/* Steps */}
          <div style={{ marginBottom: 14 }}>
            {m.steps.map((s, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  gap: 12,
                  marginBottom: 8,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    minWidth: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: m.pale,
                    border: `1.5px solid ${m.color}`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 10,
                    fontWeight: 700,
                    color: m.color,
                    flexShrink: 0,
                  }}
                >
                  {i + 1}
                </div>
                <div
                  style={{ ...S.body, fontSize: 12, paddingTop: 1, margin: 0 }}
                >
                  {s.t}
                  <Cite nums={s.c} />
                </div>
              </div>
            ))}
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}
          >
            <div
              style={{
                background: T.bg,
                borderRadius: 6,
                padding: "10px 14px",
                border: `1px solid ${T.border}`,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: T.amber,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                  marginBottom: 5,
                }}
              >
                Kinetic rationale
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: T.textMd,
                  lineHeight: 1.55,
                  fontFamily: "'Georgia','Times New Roman',serif",
                }}
              >
                {m.kinetics}
              </div>
            </div>
            <div
              style={{
                background: m.pale,
                borderRadius: 6,
                padding: "10px 14px",
                border: `1px solid ${m.color}44`,
              }}
            >
              <div
                style={{
                  fontSize: 9,
                  color: m.color,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "1px",
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                  marginBottom: 5,
                }}
              >
                C. hystrix grounding <Cite nums={[7]} />
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: T.textMd,
                  lineHeight: 1.55,
                  fontFamily: "'Georgia','Times New Roman',serif",
                }}
              >
                {m.note}
              </div>
            </div>
          </div>

          <div
            style={{
              fontSize: 10,
              color: T.muted,
              marginTop: 10,
              fontFamily: "'Inter','Segoe UI',sans-serif",
            }}
          >
            References: <Cite nums={m.cites} />
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// TAB 4 — CROSS-SPECIES
// ============================================================
export function CrossSpeciesComparison() {
  const spColor = {
    "C. hystrix": T.green,
    "C. hystrix (leaf)": T.green,
    "C. hystrix (seed)": "#4ade80",
    "C. aurantifolia": T.blue,
    "C. grandis": T.orange,
    "C. reticulata": T.amber,
  };

  const sections = [
    {
      key: "BA_shoot",
      color: T.green,
      title: "BA — Optimal concentration for shoot quality (mg/L)",
      data: CROSS_SPECIES.BA_shoot,
    },
    {
      key: "NAA_rooting",
      color: T.blue,
      title: "NAA — Optimal concentration for rooting (mg/L)",
      data: CROSS_SPECIES.NAA_rooting,
    },
    {
      key: "D24_callus",
      color: T.orange,
      title: "2,4-D — Optimal concentration for callus (mg/L)",
      data: CROSS_SPECIES.D24_callus,
    },
  ];

  return (
    <div>
      <div style={{ ...S.card, borderLeft: `4px solid ${T.accentLt}` }}>
        <div style={S.sectionLabel}>Cross-species pattern</div>
        <p style={{ ...S.body, margin: 0 }}>
          Optimal hormone concentrations cluster within consistent narrow ranges
          across Citrus species, compatible with a{" "}
          <strong>shared PAL/ROS, GA2ox, and ACC synthase mechanism</strong>.
          Inter-species variation in inflection points likely reflects
          quantitative modulation (antioxidant capacity, ethylene sensitivity,
          receptor expression levels) rather than qualitatively distinct
          pathways.
          <Cite nums={[7, 24, 25, 26, 27, 28, 29, 30]} />
        </p>
      </div>

      {sections.map((sec) => (
        <div key={sec.key} style={S.card}>
          <div style={S.sectionLabel}>{sec.title}</div>
          <div style={{ marginBottom: 14 }}>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart
                data={sec.data}
                margin={{ top: 4, right: 10, left: -16, bottom: 4 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke={T.rule} />
                <XAxis
                  dataKey="species"
                  stroke={T.muted}
                  tick={{
                    fontSize: 10,
                    fontFamily: "'Inter','Segoe UI',sans-serif",
                  }}
                />
                <YAxis
                  stroke={T.muted}
                  tick={{
                    fontSize: 10,
                    fontFamily: "'Inter','Segoe UI',sans-serif",
                  }}
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const d = payload[0]?.payload;
                    return (
                      <div
                        style={{
                          background: T.card,
                          border: `1px solid ${T.borderDk}`,
                          borderRadius: 6,
                          padding: "10px 14px",
                          fontSize: 11,
                          fontFamily: "'Inter','Segoe UI',sans-serif",
                        }}
                      >
                        <div
                          style={{
                            fontWeight: 700,
                            color: T.text,
                            marginBottom: 4,
                          }}
                        >
                          <em>{d?.species}</em>
                        </div>
                        <div style={{ color: T.muted }}>{d?.metric}</div>
                        <div style={{ color: sec.color, fontWeight: 700 }}>
                          {d?.value}
                        </div>
                        <div
                          style={{ color: T.muted, fontSize: 10, marginTop: 4 }}
                        >
                          {d?.source}
                        </div>
                        {d?.note && (
                          <div
                            style={{
                              color: T.muted,
                              fontStyle: "italic",
                              fontSize: 10,
                            }}
                          >
                            {d?.note}
                          </div>
                        )}
                      </div>
                    );
                  }}
                />
                <Bar dataKey="optConc" radius={[4, 4, 0, 0]}>
                  {sec.data.map((entry, i) => (
                    <Cell
                      key={i}
                      fill={spColor[entry.species] || sec.color}
                      fillOpacity={0.82}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: 11,
              fontFamily: "'Inter','Segoe UI',sans-serif",
            }}
          >
            <thead>
              <tr style={{ borderBottom: `2px solid ${T.border}` }}>
                {["Species", "Metric", "Value", "Source"].map((h) => (
                  <th
                    key={h}
                    style={{
                      padding: "4px 8px",
                      color: T.muted,
                      fontWeight: 700,
                      textAlign: "left",
                      fontSize: 9,
                      textTransform: "uppercase",
                      letterSpacing: "0.8px",
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sec.data.map((d, i) => (
                <tr
                  key={i}
                  style={{
                    borderBottom: `1px solid ${T.border}`,
                    background: i % 2 === 0 ? T.bg : T.card,
                  }}
                >
                  <td
                    style={{
                      padding: "5px 8px",
                      color: spColor[d.species] || sec.color,
                      fontWeight: 600,
                      fontStyle: "italic",
                    }}
                  >
                    {d.species}
                  </td>
                  <td style={{ padding: "5px 8px", color: T.textMd }}>
                    {d.metric}
                  </td>
                  <td
                    style={{
                      padding: "5px 8px",
                      color: T.text,
                      fontWeight: 600,
                    }}
                  >
                    {d.value}
                  </td>
                  <td
                    style={{ padding: "5px 8px", color: T.muted, fontSize: 10 }}
                  >
                    {d.source}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}

// ============================================================
// TAB 5 — KNOWLEDGE GAPS
// ============================================================
export function KnowledgeGapsView() {
  const gapColor = {
    BA: T.green,
    "2,4-D": T.orange,
    NAA: T.blue,
    All: T.amber,
  };
  const gapPale = {
    BA: T.greenPale,
    "2,4-D": T.orangePale,
    NAA: T.bluePale,
    All: T.amberPale,
  };

  return (
    <div>
      <div style={{ ...S.card, borderLeft: `4px solid ${T.red}` }}>
        <div style={S.sectionLabel}>Central unvalidated claim</div>
        <p style={{ ...S.body, margin: 0 }}>
          The three dose–response profiles reflect{" "}
          <em>divergent cellular defence mechanisms</em> rather than unrelated
          empirical phenomena — but this has{" "}
          <strong>
            not been directly tested in a single experimental system
          </strong>
          . The <em>C. hystrix</em> case provides morphological grounding;
          molecular endpoint studies are required to attribute the transitions
          to their proposed mechanistic causes.
          <Cite nums={[7, 8, 14, 19]} />
        </p>
      </div>

      {KNOWLEDGE_GAPS.map((gap) => {
        const c = gapColor[gap.hormone] || T.amber;
        const p = gapPale[gap.hormone] || T.amberPale;
        return (
          <div key={gap.id} style={{ ...S.card, borderLeft: `4px solid ${c}` }}>
            <div style={{ display: "flex", gap: 14, alignItems: "flex-start" }}>
              <div
                style={{
                  minWidth: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: p,
                  border: `2px solid ${c}`,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 13,
                  fontWeight: 700,
                  color: c,
                  flexShrink: 0,
                }}
              >
                {gap.id}
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    marginBottom: 8,
                    flexWrap: "wrap",
                  }}
                >
                  <span style={S.pill(c, p)}>{gap.hormone}</span>
                  <span
                    style={{ fontSize: 13, fontWeight: 700, color: T.text }}
                  >
                    {gap.gap}
                  </span>
                </div>
                <div
                  style={{
                    background: T.bg,
                    borderRadius: 6,
                    padding: "10px 14px",
                    marginBottom: 8,
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: T.amber,
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      marginBottom: 5,
                      fontFamily: "'Inter','Segoe UI',sans-serif",
                    }}
                  >
                    Proposed critical experiment
                  </div>
                  <p style={{ ...S.body, fontSize: 12, margin: 0 }}>
                    {gap.experiment}
                  </p>
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: T.muted,
                    fontFamily: "'Inter','Segoe UI',sans-serif",
                  }}
                >
                  References: <Cite nums={gap.citations} />
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Validation roadmap */}
      <div style={S.card}>
        <div style={S.sectionLabel}>Framework validation roadmap</div>
        <div style={S.grid3}>
          {[
            {
              step: "Step 1 — BA/GA",
              color: T.green,
              pale: T.greenPale,
              text: "GA2ox & GA20ox expression profiling (qRT-PCR) across 1–4 mg/L BA gradient; paclobutrazol inhibition to phenocopy elongation loss.",
              cites: [8, 11, 12],
            },
            {
              step: "Step 2 — 2,4-D/ROS",
              color: T.orange,
              pale: T.orangePale,
              text: "PAL activity, H₂O₂, total phenolics, PPO/POD activity across 0.5–5 mg/L 2,4-D; PVP/ascorbate intervention to test threshold shift.",
              cites: [14, 15],
            },
            {
              step: "Step 3 — NAA/Ethylene",
              color: T.blue,
              pale: T.bluePale,
              text: "Fully factorial NAA (0–2.0 mg/L) × AVG (ACS inhibitor) / AgNO₃ (ethylene blocker); headspace ethylene quantification in sealed culture vessels.",
              cites: [19, 21, 23],
            },
          ].map((s) => (
            <div
              key={s.step}
              style={{
                background: s.pale,
                borderRadius: 8,
                padding: 14,
                border: `1px solid ${s.color}44`,
                borderTop: `3px solid ${s.color}`,
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: s.color,
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                  marginBottom: 7,
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                }}
              >
                {s.step}
              </div>
              <p style={{ ...S.body, fontSize: 12, margin: 0 }}>
                {s.text}
                <Cite nums={s.cites} />
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// FOOTNOTES
// ============================================================
// Render https:// URLs inside a citation string as links
function linkify(text) {
  return text.split(/(https?:\/\/[^\s]+)/g).map((part, i) =>
    /^https?:\/\//.test(part) ? (
      <a key={i} href={part} target="_blank" rel="noreferrer" style={{ color: T.accent }}>
        {part}
      </a>
    ) : (
      part
    )
  );
}

export function Footnotes({ usedCitations }) {
  const sorted = [...new Set(usedCitations)].sort((a, b) => a - b);
  return (
    <div
      style={{
        borderTop: `2px solid ${T.rule}`,
        marginTop: 40,
        paddingTop: 20,
      }}
    >
      <div style={{ ...S.sectionLabel, marginBottom: 14 }}>References</div>
      <div
        style={{
          columns: 2,
          columnGap: 24,
          fontFamily: "'Inter','Segoe UI',sans-serif",
        }}
      >
        {sorted.map(
          (n) =>
            CITATIONS[n] && (
              <div
                key={n}
                style={{
                  fontSize: 10,
                  color: T.muted,
                  lineHeight: 1.6,
                  marginBottom: 5,
                  breakInside: "avoid",
                  paddingLeft: 4,
                }}
              >
                <span style={{ color: T.amber, fontWeight: 700 }}>[{n}]</span>{" "}
                {linkify(CITATIONS[n])}
              </div>
            )
        )}
      </div>
      <div
        style={{
          fontSize: 10,
          color: T.muted,
          marginTop: 14,
          fontStyle: "italic",
          borderTop: `1px solid ${T.rule}`,
          paddingTop: 10,
          fontFamily: "'Inter','Segoe UI',sans-serif",
        }}
      >
        [7] Phan 2024 (undergraduate thesis, openly available on Zenodo) serves as an illustrative case grounding the
        framework in observable tissue culture outcomes — not as primary
        mechanistic evidence. All mechanistic claims are supported by the
        broader literature cited above.
      </div>
    </div>
  );
}
