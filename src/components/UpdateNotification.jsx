import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STORAGE_KEY = "mediextract_dismissed_v4.8.4";

const updates = [
  {
    title: "Wound Surveillance Visit Parsing",
    desc: "New extraction logic for surveillance orders including automated classification.",
    tag: "Feature",
    tagColor: "text-emerald-400 bg-emerald-400/10",
  },
  {
    title: "Enhanced Dashboard UI",
    desc: "Refined workspace layout with improved data density and navigation.",
    tag: "UI/UX",
    tagColor: "text-blue-400 bg-blue-400/10",
  },
  {
    title: "Performance Optimizations",
    desc: "Reduced parallel file processing latency by 24%.",
    tag: "System",
    tagColor: "text-purple-400 bg-purple-400/10",
  },
];

export default function UpdateNotification() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY);
    if (!dismissed) {
      const timer = setTimeout(() => setVisible(true), 800);
      return () => clearTimeout(timer);
    }
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
          className="fixed bottom-8 right-8 z-50 w-[380px] overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950 shadow-[0_32px_64px_-12px_rgba(0,0,0,0.8)] ring-1 ring-white/10"
        >
          {/* Top Decorative Glow */}
          <div className="absolute -top-24 -left-24 h-48 w-48 bg-emerald-500/10 blur-[80px]" />
          
          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <h3 className="text-[13px] font-bold tracking-tight text-zinc-100 uppercase">
                    System Update
                  </h3>
                </div>
                <p className="text-xl font-semibold text-white">Version 4.8.4</p>
              </div>
              <button
                onClick={dismiss}
                className="rounded-lg p-1 text-zinc-500 hover:bg-white/5 hover:text-white transition-colors"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Timeline Content */}
            <div className="mt-6 space-y-6 relative">
              {/* Vertical line connector */}
              <div className="absolute left-[7px] top-2 bottom-2 w-[1px] bg-zinc-800" />

              {updates.map((item, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: 5 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + (i * 0.1) }}
                  className="relative pl-6"
                >
                  {/* Timeline Dot */}
                  <div className="absolute left-0 top-[6px] h-[14px] w-[14px] rounded-full border-2 border-zinc-950 bg-zinc-800 ring-1 ring-zinc-700" />
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <h4 className="text-[13px] font-medium text-zinc-200">{item.title}</h4>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider ${item.tagColor}`}>
                        {item.tag}
                      </span>
                    </div>
                    <p className="text-[12px] leading-relaxed text-zinc-500">
                      {item.desc}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Action Area */}
            <div className="mt-8 flex items-center justify-between">
              <p className="text-[10px] font-medium text-zinc-600 uppercase tracking-widest">
                Released 11.04.2026
              </p>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ y: 0 }}
                onClick={dismiss}
                className="bg-white px-5 py-2 rounded-full text-[12px] font-bold text-black shadow-lg shadow-white/5 hover:bg-zinc-200 transition-colors"
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