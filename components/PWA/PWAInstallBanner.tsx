"use client";

import React, { useState, useEffect } from "react";
import { Download, X, Sparkles, Smartphone } from "lucide-react";
import { usePWAInstall } from "../../hooks/usePWAInstall";

export const PWAInstallBanner = () => {
  const { showInstallButton, isInstalled, installApp } = usePWAInstall();
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    // Check if dismissed in this session
    if (typeof window !== "undefined") {
      const isDismissed = sessionStorage.getItem("pwa_prompt_dismissed");
      if (!isDismissed && showInstallButton && !isInstalled) {
        // Show after 3 seconds on page
        const timer = setTimeout(() => {
          setDismissed(false);
        }, 3000);
        return () => clearTimeout(timer);
      }
    }
  }, [showInstallButton, isInstalled]);

  if (dismissed || !showInstallButton || isInstalled) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("pwa_prompt_dismissed", "true");
    }
  };

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[92%] sm:w-auto sm:max-w-md z-50 animate-in fade-in slide-in-from-top-4 duration-500">
      <div className="p-3 sm:p-4 rounded-2xl bg-[#091124]/95 border border-cyan-500/40 shadow-[0_10px_35px_rgba(6,182,212,0.35)] backdrop-blur-2xl text-white flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-10 h-10 rounded-xl overflow-hidden bg-black border border-cyan-400/60 p-0.5 shrink-0">
            <img
              src="/logo.png"
              alt="Aro Ekdin Logo"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-white truncate">
                Install Aro Ekdin App
              </span>
              <span className="px-1.5 py-0.2 rounded bg-cyan-500/20 text-cyan-300 font-mono text-[9px] font-bold uppercase">
                PWA
              </span>
            </div>
            <p className="text-[11px] text-slate-300 truncate">
              Fast offline access & 3D Court on your home screen
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => {
              installApp();
              handleDismiss();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs uppercase tracking-wider shadow-md transition-all cursor-pointer active:scale-95"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Install</span>
          </button>

          <button
            onClick={handleDismiss}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PWAInstallBanner;
