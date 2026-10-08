// ============================================================
// App.js — Botanical/journal theme, responsive layout
// ============================================================
import React, { useState } from "react";
import { T } from "./theme";
import { HORMONES } from "./calculate";
import {
  FrameworkOverview,
  InteractiveDoseResponse,
  MechanismExplorer,
  CrossSpeciesComparison,
  KnowledgeGapsView,
  Footnotes,
} from "./view";

const TABS = [
  { id: "framework", label: "Framework Overview" },
  { id: "interactive", label: "Dose-Response" },
  { id: "mechanisms", label: "Mechanisms" },
  { id: "crossspecies", label: "Cross-species" },
  { id: "gaps", label: "Knowledge Gaps" },
];

const ALL_CITATIONS = Array.from({ length: 36 }, (_, i) => i + 1);

// ── Botanical palette (exported so view.js can import) ──────
export default function App() {
  const [activeTab, setActiveTab] = useState("framework");
  const [hormone, setHormone] = useState("BA");
  const [sliderVal, setSliderVal] = useState(HORMONES.BA.defaultVal);

  return (
    <div
      style={{
        minHeight: "100vh",
        background: T.bg,
        color: T.text,
        fontFamily: "'Georgia','Times New Roman',serif",
      }}
    >
      {/* ── Header ── */}
      <div style={{ background: T.header, color: "#fff", padding: "0" }}>
        {/* top strip */}
        <div
          style={{
            padding: "16px 24px 12px",
            borderBottom: "1px solid #2d5c42",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: "#86efac",
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                  marginBottom: 6,
                  fontWeight: 600,
                }}
              >
                Supplementary Interactive Tool
              </div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 700,
                  color: "#f0fdf4",
                  lineHeight: 1.35,
                  letterSpacing: "-0.2px",
                }}
              >
                Phytohormone Dose–Response &amp; Cellular Defence Framework
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#86efac",
                  marginTop: 5,
                  fontFamily: "'Inter','Segoe UI',sans-serif",
                  lineHeight: 1.5,
                }}
              >
                Companion to:{" "}
                <em style={{ color: "#bbf7d0" }}>
                  Divergent cellular defence strategies underlie distinct
                  dose–response profiles of exogenous phytohormones during plant
                  tissue culture morphogenesis
                </em>{" "}
                — narrative review with illustrative case from{" "}
                <em style={{ color: "#bbf7d0" }}>Citrus hystrix</em> DC.
              </div>
            </div>
            {/* decorative leaf mark */}
            <div
              style={{
                fontSize: 32,
                opacity: 0.25,
                flexShrink: 0,
                lineHeight: 1,
              }}
            >
              🌿
            </div>
          </div>
        </div>

        {/* Tab bar */}
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            padding: "0 24px",
            gap: 0,
            scrollbarWidth: "none",
          }}
        >
          {TABS.map((tab, i) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "10px 16px",
                fontSize: 12,
                whiteSpace: "nowrap",
                fontFamily: "'Inter','Segoe UI',sans-serif",
                fontWeight: activeTab === tab.id ? 700 : 400,
                color: activeTab === tab.id ? "#f0fdf4" : "#86efac",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                borderBottom:
                  activeTab === tab.id
                    ? "3px solid #4ade80"
                    : "3px solid transparent",
                transition: "all 0.15s",
              }}
            >
              <span style={{ color: "#4ade80", marginRight: 5, fontSize: 10 }}>
                {i + 1}·
              </span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content ── */}
      <div
        style={{
          padding: "24px 20px 40px",
          maxWidth: 1100,
          margin: "0 auto",
          width: "100%",
          boxSizing: "border-box",
        }}
      >
        {activeTab === "framework" && <FrameworkOverview />}
        {activeTab === "interactive" && (
          <InteractiveDoseResponse
            hormone={hormone}
            setHormone={(h) => {
              setHormone(h);
              setSliderVal(HORMONES[h].defaultVal);
            }}
            sliderVal={sliderVal}
            setSliderVal={setSliderVal}
          />
        )}
        {activeTab === "mechanisms" && <MechanismExplorer />}
        {activeTab === "crossspecies" && <CrossSpeciesComparison />}
        {activeTab === "gaps" && <KnowledgeGapsView />}

        <Footnotes usedCitations={ALL_CITATIONS} />
      </div>
    </div>
  );
}
