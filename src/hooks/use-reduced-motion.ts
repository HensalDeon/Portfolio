"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";
const STORAGE_KEY = "motion";

const listeners = new Set<() => void>();

function readPaused(): boolean {
  try {
    return window.localStorage.getItem(STORAGE_KEY) === "off";
  } catch {
    return false;
  }
}

/** Mirrors the user's choice onto <html> so CSS-only motion (the marquee) can follow it. */
export function syncMotionAttribute() {
  document.documentElement.toggleAttribute("data-motion-paused", readPaused());
}

/**
 * Pauses or resumes ambient motion site-wide: looping videos, the particle
 * field and the marquee. Persisted per browser. This is the pause mechanism
 * for content that moves on its own for longer than five seconds.
 */
export function setMotionPaused(paused: boolean) {
  try {
    if (paused) window.localStorage.setItem(STORAGE_KEY, "off");
    else window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Storage can be unavailable (private mode); the choice then lasts for this page only.
  }
  syncMotionAttribute();
  listeners.forEach((listener) => listener());
}

function subscribe(onChange: () => void) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  listeners.add(onChange);
  return () => {
    media.removeEventListener("change", onChange);
    listeners.delete(onChange);
  };
}

/** True when the user has paused motion with the site toggle. False on the server. */
export function useMotionPaused(): boolean {
  return useSyncExternalStore(subscribe, readPaused, () => false);
}

/**
 * True when the user prefers reduced motion, either through the operating
 * system setting or the site's pause toggle. False during server render and
 * hydration.
 */
export function useReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches || readPaused(),
    () => false,
  );
}
