"use client";

import { useState, useEffect, useCallback } from "react";
import Swal from "sweetalert2";

const isIOSDevice = () => {
  if (typeof window === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
};

const isMobileDevice = () => {
  if (typeof window === "undefined") return false;
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
};

const isStandaloneMode = () => {
  if (typeof window === "undefined") return false;
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (window.navigator as any).standalone === true
  );
};

export const usePWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState<boolean>(false);
  const [showInstallButton, setShowInstallButton] = useState<boolean>(false);

  useEffect(() => {
    if (isStandaloneMode()) {
      setIsInstalled(true);
      return;
    }

    if (isMobileDevice()) {
      setShowInstallButton(true);
    }

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
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;

      if (outcome === "accepted") {
        setIsInstalled(true);
        setShowInstallButton(false);
      }

      setDeferredPrompt(null);
      return;
    }

    if (isIOSDevice()) {
      Swal.fire({
        title: "Install App",
        html: `
          <p style="margin-bottom: 12px;">Add Aro Ekdin to your home screen:</p>
          <ol style="text-align: left; padding-left: 20px;">
            <li>Tap the <strong>Share</strong> button in Safari</li>
            <li>Scroll down and tap <strong>Add to Home Screen</strong></li>
            <li>Tap <strong>Add</strong></li>
          </ol>
        `,
        icon: "info",
        confirmButtonColor: "#ea580c",
      });
      return;
    }

    Swal.fire({
      title: "Install App",
      text: "Open your browser menu and tap Install app or Add to Home screen.",
      icon: "info",
      confirmButtonColor: "#ea580c",
    });
  }, [deferredPrompt]);

  return {
    showInstallButton: showInstallButton && !isInstalled,
    installApp,
  };
};

export default usePWAInstall;
