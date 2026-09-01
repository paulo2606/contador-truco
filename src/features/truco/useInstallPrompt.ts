"use client";

import { useCallback, useEffect, useState } from "react";

export interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
  prompt(): Promise<void>;
}

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
    appinstalled: Event;
  }
}

const DISMISSED_KEY = "truco-install-prompt-dismissed";

function isInstalled(): boolean {
  const standaloneIOS = (window.navigator as Navigator & { standalone?: boolean }).standalone;
  return window.matchMedia("(display-mode: standalone)").matches || standaloneIOS === true;
}

export function useInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [visible, setVisible] = useState(false);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    if (isInstalled() || window.localStorage.getItem(DISMISSED_KEY) === "1") return;

    function handleBeforeInstallPrompt(event: BeforeInstallPromptEvent) {
      event.preventDefault();
      setDeferredPrompt(event);
      setVisible(true);
    }

    function handleAppInstalled() {
      window.localStorage.setItem(DISMISSED_KEY, "1");
      setVisible(false);
      setDeferredPrompt(null);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const dismiss = useCallback(() => {
    setDontShowAgain((persist) => {
      if (persist) window.localStorage.setItem(DISMISSED_KEY, "1");
      return persist;
    });
    setVisible(false);
  }, []);

  const install = useCallback(async () => {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const choice = await deferredPrompt.userChoice;
    setDontShowAgain((persist) => {
      if (choice.outcome === "accepted" || persist) window.localStorage.setItem(DISMISSED_KEY, "1");
      return persist;
    });
    setDeferredPrompt(null);
    setVisible(false);
  }, [deferredPrompt]);

  return { visible, dontShowAgain, setDontShowAgain, dismiss, install };
}
