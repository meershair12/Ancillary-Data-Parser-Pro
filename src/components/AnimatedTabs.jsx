import { useState, useRef, useEffect } from "react";
import { Paper, Button, Box, useTheme } from "@mui/material";

const tabStyles = {
  ancillary:   { bg: "linear-gradient(135deg,#34d399,#10b981)", shadow: "0 6px 20px rgba(16,185,129,0.45)", border: "rgba(16,185,129,0.7)" },
  surgical:    { bg: "linear-gradient(135deg,#3885f8,#0e66e9)", shadow: "0 6px 20px rgba(56,133,248,0.45)", border: "rgba(14,165,233,0.7)" },
  ultramist:   { bg: "linear-gradient(135deg,#f8ab38,#e9910e)", shadow: "0 6px 20px rgba(248,171,56,0.45)", border: "rgba(248,171,56,0.7)" },
  surveillance:{ bg: "linear-gradient(135deg,#be24fb,#700bf5)", shadow: "0 6px 20px rgba(112,11,245,0.45)", border: "rgba(132,11,245,0.7)" },
};

export default function AnimatedTabs({ tabCounts, activeTab, setActiveTab }) {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";
  const pillRef = useRef(null);
  const btnRefs = useRef({});
  const [sliderStyle, setSliderStyle] = useState({ left: 5, width: 0, opacity: 0 });

  const tabs = [
    { id: "ancillary",    label: `Ancillary (${tabCounts.ancillary.toLocaleString()})`,       value: tabCounts.ancillary },
    { id: "ultramist",   label: `Ultramist (${tabCounts.ultramist.toLocaleString()})`,       value: tabCounts.ultramist },
    { id: "surgical",    label: `Surgical (${tabCounts.surgical.toLocaleString()})`,         value: tabCounts.surgical },
    { id: "surveillance",label: `Surveillance (${tabCounts.surveillance.toLocaleString()})`, value: tabCounts.surveillance },
  ].filter(t => t.value !== 0);

  useEffect(() => {
    const btn = btnRefs.current[activeTab];
    const pill = pillRef.current;
    if (!btn || !pill) return;
    const pillRect = pill.getBoundingClientRect();
    const btnRect  = btn.getBoundingClientRect();
    setSliderStyle({
      left: btnRect.left - pillRect.left - 5,   // 5px = pill padding
      width: btnRect.width,
      opacity: 1,
    });
  }, [activeTab, tabs.length]);

  const currentStyle = tabStyles[activeTab] ?? tabStyles.ancillary;

  return (
    <Paper
      ref={pillRef}
      sx={{
        position: "relative",
        p: "5px",
        background: isLightMode ? "rgba(255,255,255,0.65)" : "rgba(20,20,22,0)",
        borderRadius: 999,
        border: isLightMode
          ? "1px solid rgba(15,23,42,0.14)"
          : "1px solid rgba(255,255,255,0.08)",
        display: "inline-flex",
        gap: 0.5,
        boxShadow: isLightMode ? "0 6px 16px rgba(15,23,42,0.08)" : "none",
      }}
    >
      {/* Sliding background pill */}
      <Box
        sx={{
          position: "absolute",
          top: "5px",
          left: `${sliderStyle.left}px`,
          width: `${sliderStyle.width}px`,
          height: "calc(100% - 10px)",
          borderRadius: 999,
          background: currentStyle.bg,
          boxShadow: currentStyle.shadow,
          opacity: sliderStyle.opacity,
          pointerEvents: "none",
          transition: "left 0.35s cubic-bezier(0.34,1.3,0.64,1), width 0.35s cubic-bezier(0.34,1.3,0.64,1), background 0.25s ease",
          zIndex: 0,
        }}
      />

      {tabs.map((tab) => {
        const isActive = activeTab === tab.id ;
        return (
          <Button
            key={tab.id}
            ref={(el) => { btnRefs.current[tab.id] = el; }}
            onClick={() => setActiveTab(tab.id)}
            sx={{
              position: "relative",
              zIndex: 1,
              borderRadius: 999,
              px: 2.4,
              py: 0.6,
              minHeight: 34,
              fontSize: "0.8rem",
              fontWeight: 700,
              letterSpacing: "0.02em",
              textTransform: "none",
              color: isActive
                ? "#0a0a0a"
                : isLightMode
                  ? "rgba(15,23,42,0.72)"
                  : "rgba(255,255,255,0.65)",
              background: "transparent",
              border: "none",
              transition: "color 0.25s ease",
              "&:hover": {
                background: "transparent",  // slider handles the bg
                color: isActive
                  ? "#0a0a0a"
                  : isLightMode
                    ? "rgba(15,23,42,0.95)"
                    : "rgba(255,255,255,0.9)",
              },
            }}
          >
            {tab.label}
          </Button>
        );
      })}
    </Paper>
  );
}