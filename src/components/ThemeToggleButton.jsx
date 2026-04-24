import { useState } from "react";
import { ToggleButton, ToggleButtonGroup, Tooltip, useTheme } from "@mui/material";
import { Monitor, Moon, Sun } from "lucide-react";
import { THEME_MODES, getStoredThemeMode, setThemeMode } from "./appConfig";

export function ThemeModeSelector() {
  const theme = useTheme();
  const isLightMode = theme.palette.mode === "light";
  const [mode, setMode] = useState(getStoredThemeMode());

  const onModeChange = (_event, nextMode) => {
    if (!nextMode) {
      return;
    }
    setMode(nextMode);
    setThemeMode(nextMode);
  };

  const options = [
    {
      value: THEME_MODES.SYSTEM,
      label: "System",
      title: "Follow System Theme",
      icon: <Monitor size={14} />,
    },
    {
      value: THEME_MODES.LIGHT,
      label: "Light",
      title: "Use Light Theme",
      icon: <Sun size={14} />,
    },
    {
      value: THEME_MODES.DARK,
      label: "Dark",
      title: "Use Dark Theme",
      icon: <Moon size={14} />,
    },
  ];

  return (
    <ToggleButtonGroup
      size="small"
      exclusive
      value={mode}
      onChange={onModeChange}
      sx={{
        borderRadius: 999,
        overflow: "hidden",
        background: isLightMode
          ? "rgba(255,255,255,0.78)"
          : "rgba(15, 23, 42, 0.38)",
        border: isLightMode
          ? "1px solid rgba(15, 23, 42, 0.14)"
          : "1px solid rgba(255,255,255,0.16)",
        boxShadow: isLightMode
          ? "0 6px 16px rgba(15, 23, 42, 0.08)"
          : "0 8px 18px rgba(0,0,0,0.28)",
        "& .MuiToggleButton-root": {
          border: "none",
          px: 1.4,
          py: 0.55,
          minHeight: 34,
          gap: 0.7,
          textTransform: "none",
          fontSize: "0.75rem",
          fontWeight: 700,
          letterSpacing: "0.01em",
          color: isLightMode ? "#475569" : "#cbd5e1",
          transition: "all 160ms ease",
          "&:hover": {
            background: isLightMode
              ? "rgba(59, 130, 246, 0.08)"
              : "rgba(255,255,255,0.1)",
            color: isLightMode ? "#0f172a" : "#f1f5f9",
          },
          "&.Mui-selected": {
            color: "#03110d",
            background: "linear-gradient(135deg, #84cc8f 0%, #74B87B 100%)",
            boxShadow: "0 6px 14px rgba(16, 185, 129, 0.28)",
          },
          "&.Mui-selected:hover": {
            background: "linear-gradient(135deg, #79bf84 0%, #66ab70 100%)",
          },
        },
      }}
      aria-label="theme mode"
    >
      {options.map((option) => (
        <Tooltip key={option.value} title={option.title}>
          <ToggleButton value={option.value} aria-label={`${option.label.toLowerCase()} theme`}>
            {option.icon}
            <span>{option.label}</span>
          </ToggleButton>
        </Tooltip>
      ))}
    </ToggleButtonGroup>
  );
}

// Backward-compatible export for existing imports.
export const IOSSwitch = ThemeModeSelector;