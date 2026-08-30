"use client";

import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";

const isIOSDevice = () => {
  if (typeof window === "undefined") return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
  );
};

const isStandaloneMode = () => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true ||
    document.referrer.includes("android-app://")
  );
};

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showInstallButton, setShowInstallButton] = useState<boolean>(true);

  useEffect(() => {
    // 1. Register Service Worker for PWA
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("Aro Ekdin PWA ServiceWorker registered:", reg.scope);
        })
        .catch((err) => {
          console.warn("PWA ServiceWorker registration notice:", err);
        });
    }

    // 2. Check if already installed
    if (isStandaloneMode()) {
      setIsInstalled(true);
      setShowInstallButton(false);
      return;
    }

    // 3. Listen for native browser install prompt
    const handleBeforeInstallPrompt = (event: Event) => {
      event.preventDefault();
      setDeferredPrompt(event);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setShowInstallButton(false);
      setDeferredPrompt(null);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const installApp = useCallback(async () => {
    // Native Prompt available (Chrome / Edge / Android)
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setIsInstalled(true);
          setShowInstallButton(false);
        }
        setDeferredPrompt(null);
        return;
      } catch (err) {
        console.warn("deferredPrompt error:", err);
      }
    }

    // Apple iOS Safari instructions
    if (isIOSDevice()) {
      Swal.fire({
        title: "Install Aro Ekdin on iOS",
        html: `
          <div style="text-align: left; font-size: 13px; line-height: 1.6; color: #cbd5e1; padding: 4px;">
            <p style="margin-bottom: 12px; color: #fff; font-weight: bold;">Follow these simple steps in Safari:</p>
            <ol style="padding-left: 20px; margin: 0; space-y: 8px;">
              <li>Tap the <strong style="color: #38bdf8;">Share</strong> button (box with upward arrow at the bottom).</li>
              <li>Scroll down and tap <strong style="color: #38bdf8;">Add to Home Screen</strong>.</li>
              <li>Tap <strong style="color: #38bdf8;">Add</strong> at top-right to install the app.</li>
            </ol>
          </div>
        `,
        icon: "info",
        background: "#0f172a",
        color: "#ffffff",
        confirmButtonColor: "#06b6d4",
        confirmButtonText: "Got It",
      });
      return;
    }

    // Android / Desktop fallback instructions
    Swal.fire({
      title: "Install Aro Ekdin App",
      html: `
        <div style="text-align: left; font-size: 13px; line-height: 1.6; color: #cbd5e1; padding: 4px;">
          <p style="margin-bottom: 12px; color: #fff; font-weight: bold;">To install the app directly on your device:</p>
          <ol style="padding-left: 20px; margin: 0; space-y: 8px;">
            <li>Tap the <strong>three dots menu (⋮)</strong> at the top-right of your browser.</li>
            <li>Select <strong style="color: #38bdf8;">"Install app"</strong> or <strong style="color: #38bdf8;">"Add to Home screen"</strong>.</li>
            <li>Confirm to download and install on your home screen.</li>
          </ol>
        </div>
      `,
      icon: "info",
      background: "#0f172a",
      color: "#ffffff",
      confirmButtonColor: "#06b6d4",
      confirmButtonText: "Got It",
    });
  }, [deferredPrompt]);

  return {
    showInstallButton: showInstallButton && !isInstalled,
    isInstalled,
    installApp,
  };
};

export default usePWAInstall;
