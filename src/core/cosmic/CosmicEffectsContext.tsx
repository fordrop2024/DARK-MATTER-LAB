/**
 * DARK MATTER LAB — Cosmic Effects System Context
 * UI/UX Foundation: Visual Configuration & Runtime Environmental Controls
 * 
 * Strict Principle:
 * This context manages UI visual configuration and rendering parameters ONLY.
 * It is completely isolated from business logic and Master Project Context data.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export type CosmicQuality = 'high' | 'medium' | 'low';

export interface CosmicEffectsState {
  cinematicMode: boolean;
  cosmicBackground: boolean;
  starField: boolean;
  milkyWay: boolean;
  asteroidField: boolean;
  blackHole: boolean;
  warpSpeed: boolean;
  reducedMotion: boolean;
  quality: CosmicQuality;
  toggleCinematic: () => void;
  toggleStarField: () => void;
  toggleMilkyWay: () => void;
  toggleAsteroidField: () => void;
  toggleBlackHole: () => void;
  setQuality: (quality: CosmicQuality) => void;
  triggerWarp: (durationMs?: number) => void;
  setWarpSpeed: (active: boolean) => void;
  resetDefaults: () => void;
}

const CosmicEffectsContext = createContext<CosmicEffectsState | null>(null);

export const CosmicEffectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cinematicMode, setCinematicMode] = useState<boolean>(true);
  const [cosmicBackground, setCosmicBackground] = useState<boolean>(true);
  const [starField, setStarField] = useState<boolean>(true);
  const [milkyWay, setMilkyWay] = useState<boolean>(true);
  const [asteroidField, setAsteroidField] = useState<boolean>(true);
  const [blackHole, setBlackHole] = useState<boolean>(true);
  const [warpSpeed, setWarpSpeed] = useState<boolean>(false);
  const [quality, setQuality] = useState<CosmicQuality>('high');
  const [reducedMotion, setReducedMotion] = useState<boolean>(false);

  // Auto-detect system prefers-reduced-motion
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleCinematic = useCallback(() => {
    setCinematicMode((prev) => !prev);
  }, []);

  const toggleStarField = useCallback(() => {
    setStarField((prev) => !prev);
  }, []);

  const toggleMilkyWay = useCallback(() => {
    setMilkyWay((prev) => !prev);
  }, []);

  const toggleAsteroidField = useCallback(() => {
    setAsteroidField((prev) => !prev);
  }, []);

  const toggleBlackHole = useCallback(() => {
    setBlackHole((prev) => !prev);
  }, []);

  const triggerWarp = useCallback((durationMs: number = 3200) => {
    setWarpSpeed(true);
    const timer = setTimeout(() => {
      setWarpSpeed(false);
    }, durationMs);
    return () => clearTimeout(timer);
  }, []);

  const resetDefaults = useCallback(() => {
    setCinematicMode(true);
    setCosmicBackground(true);
    setStarField(true);
    setMilkyWay(true);
    setAsteroidField(true);
    setBlackHole(true);
    setWarpSpeed(false);
    setQuality('high');
  }, []);

  return (
    <CosmicEffectsContext.Provider
      value={{
        cinematicMode,
        cosmicBackground,
        starField,
        milkyWay,
        asteroidField,
        blackHole,
        warpSpeed,
        reducedMotion,
        quality,
        toggleCinematic,
        toggleStarField,
        toggleMilkyWay,
        toggleAsteroidField,
        toggleBlackHole,
        setQuality,
        triggerWarp,
        setWarpSpeed,
        resetDefaults,
      }}
    >
      {children}
    </CosmicEffectsContext.Provider>
  );
};

export const useCosmicEffects = (): CosmicEffectsState => {
  const context = useContext(CosmicEffectsContext);
  if (!context) {
    throw new Error('useCosmicEffects must be used within a CosmicEffectsProvider');
  }
  return context;
};
