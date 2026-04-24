import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  THEME_MODES,
  getResolvedThemeMode,
  subscribeToThemeChanges,
} from "./appConfig";

const STORAGE_KEY = "mediextract_dismissed_v4.8.7";
const PREVIOUS_STORAGE_KEYS = [
  "mediextract_dismissed_v4.8.6"
];

const updates = [
  {
    title: "In-person & Surveillance Logic Fix",
    desc: "In-person and surveillance order parsing logic has been improved for more accurate classification.",
    tag: "Fix",
    tagColor: "text-emerald-400 bg-emerald-400/10",
  },
  {
    title: "Theme Preference Support",
    desc: "Light theme is now fully aligned with user preference and app-wide theme selection.",
    tag: "Theme",
    tagColor: "text-blue-400 bg-blue-400/10",
  },
  {
    title: "Bug Fixes & Improvements",
    desc: "General bug fixes and performance improvements across parsing and UI behavior.",
    tag: "System",
    tagColor: "text-blue-400 bg-blue-400/10",
  },
];

export default function UpdateNotification() {
  const [visible, setVisible] = useState(false);
  const [resolvedThemeMode, setResolvedThemeMode] = useState(getResolvedThemeMode());
  const isLightMode = resolvedThemeMode === THEME_MODES.LIGHT;

  useEffect(() => {
    PREVIOUS_STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));

    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
  }, []);

  useEffect(() => {
    const unsubscribeTheme = subscribeToThemeChanges((nextResolvedMode) => {
      setResolvedThemeMode(nextResolvedMode);
    });

    return () => {
      unsubscribeTheme();
    };
  }, []);

  const dismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          className={`fixed bottom-8 right-8 z-50 w-[380px] overflow-hidden rounded-2xl border shadow-[0_32px_64px_-12px_rgba(0,0,0,0.25)] ${
            isLightMode
              ? "border-slate-200 bg-white ring-1 ring-slate-100"
              : "border-zinc-800 bg-zinc-950 ring-1 ring-white/10"
          }`}
        >
          {/* Top Decorative Glow */}
          <div
            className={`absolute -top-24 -left-24 h-48 w-48 blur-[80px] ${
              isLightMode ? "bg-emerald-500/20" : "bg-emerald-500/10"
            }`}
          />
          
          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  
                  <h3 className={`text-[13px] font-bold tracking-tight uppercase ${isLightMode ? "text-slate-700" : "text-zinc-100"}`}>
                    System Update
                  </h3>
                </div>
                <p className={`text-xl font-semibold ${isLightMode ? "text-slate-900" : "text-white"}`}>Version 4.8.7</p>
              </div>
              <button
                onClick={dismiss}
                className={`rounded-lg p-1 transition-colors ${
                  isLightMode
                    ? "text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                    : "text-zinc-500 hover:bg-white/5 hover:text-white"
                }`}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Timeline Content */}
            <div className="mt-6 space-y-6 relative">
              {/* Vertical line connector */}
              <div className={`absolute left-[7px] top-2 bottom-2 w-[1px] ${isLightMode ? "bg-slate-200" : "bg-zinc-800"}`} />

              {updates.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="relative pl-6"
                >
                  {/* Timeline Dot */}
                  <div
                    className={`absolute left-0 top-[6px] h-[14px] w-[14px] rounded-full border-2 ring-1 ${
                      isLightMode
                        ? "border-white bg-slate-300 ring-slate-300"
                        : "border-zinc-950 bg-zinc-800 ring-zinc-700"
                    }`}
                  />
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h4 className={`text-[13px] font-medium ${isLightMode ? "text-slate-800" : "text-zinc-200"}`}>{item.title}</h4>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${item.tagColor}`}>
                        {item.tag}
                      </span>
                    </div>
                    <p className={`text-[12px] leading-relaxed ${isLightMode ? "text-slate-500" : "text-zinc-500"}`}>
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Area */}
            <div className="mt-8 flex items-center justify-between">
              <p className={`text-[10px] font-medium uppercase tracking-widest ${isLightMode ? "text-slate-500" : "text-zinc-600"}`}>
                Released Apr 24, 2026
              </p>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                onClick={dismiss}
                className={`px-5 py-2 rounded-full text-[12px] font-bold transition-colors ${
                  isLightMode
                    ? "bg-slate-900 text-white shadow-lg shadow-slate-900/15 hover:bg-slate-700"
                    : "bg-white text-black shadow-lg shadow-white/5 hover:bg-zinc-200"
                }`}
              >
                Dismiss
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}