/**
 * DARK MATTER LAB — CosmicBackground Master Layered System
 * Section 4: Global Space Environment Layering Architecture
 * 
 * Layer Hierarchy:
 * Layer 1: Deep-space base (#030508 to #080c14)
 * Layer 2: Subtle multi-depth stars (StarField)
 * Layer 3: Distant star clusters & cosmic dust
 * Layer 4: Milky Way / galactic dust structure (CosmicFlowEngine)
 * Layer 5: Subtle nebula atmospheric clouds
 * Layer 6: Procedural orbital asteroid streams (AsteroidField)
 * Layer 7: Workspace-specific phenomena
 * Layer 8: Frosted spacecraft UI panels
 */

import React from 'react';
import { StarField } from './StarField.tsx';
import { CosmicFlowEngine } from './CosmicFlowEngine.tsx';
import { AsteroidField } from './AsteroidField.tsx';
import { useCosmicEffects } from '../../core/cosmic/CosmicEffectsContext.tsx';
import { WorkspaceId } from '../../types/domain.ts';

interface CosmicBackgroundProps {
  children: React.ReactNode;
  activeWorkspace?: WorkspaceId;
}

export const CosmicBackground: React.FC<CosmicBackgroundProps> = ({
  children,
  activeWorkspace,
}) => {
  const { cosmicBackground, cinematicMode, asteroidField } = useCosmicEffects();

  // Certain workspaces have contextual cosmic phenomena
  const showAsteroids =
    asteroidField &&
    (activeWorkspace === 'scene_plan' ||
      activeWorkspace === 'video' ||
      activeWorkspace === 'movie' ||
      activeWorkspace === 'first_cut');

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-[#030508] text-zinc-100 font-sans">
      {cosmicBackground && (
        <>
          {/* LAYER 1: Deep-Space Base Radial Canvas */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background:
                'radial-gradient(ellipse 80% 60% at 50% 10%, #0c1220 0%, #05070d 50%, #030508 100%)',
            }}
          />

          {/* LAYER 2: Star Field Canvas Engine */}
          <StarField />

          {/* LAYER 3: Distant Star Clusters & Chromatic Glow */}
          {cinematicMode && (
            <div className="absolute inset-0 pointer-events-none z-0 opacity-40 mix-blend-screen">
              <div className="absolute top-1/4 left-1/5 w-96 h-96 rounded-full bg-cyan-600/10 blur-[120px]" />
              <div className="absolute bottom-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-600/10 blur-[140px]" />
              <div className="absolute top-1/2 right-1/6 w-80 h-80 rounded-full bg-purple-600/10 blur-[100px]" />
            </div>
          )}

          {/* LAYER 4: Milky Way / Galactic Dust Structure */}
          <CosmicFlowEngine />

          {/* LAYER 5: Subtle Interstellar Nebula Fog */}
          {cinematicMode && (
            <div
              className="absolute inset-0 pointer-events-none z-0 opacity-20 mix-blend-color-dodge"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 70% 30%, rgba(14, 165, 233, 0.15) 0%, transparent 45%), radial-gradient(circle at 25% 75%, rgba(168, 85, 247, 0.12) 0%, transparent 50%)',
              }}
            />
          )}

          {/* LAYER 6: Contextual Asteroid Field */}
          {showAsteroids && <AsteroidField count={20} />}

          {/* LAYER 7: Subtle Cosmic Vignette & Horizon Grid */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              boxShadow: 'inset 0 0 160px rgba(3, 5, 8, 0.95)',
            }}
          />
        </>
      )}

      {/* LAYER 8: Application Operating System UI */}
      <div className="relative z-10 w-full h-full flex flex-col">{children}</div>
    </div>
  );
};
