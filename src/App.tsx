/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MasterProjectContextProvider } from './core/context/MasterProjectContext.tsx';
import { CosmicEffectsProvider } from './core/cosmic/CosmicEffectsContext.tsx';
import { AppShell } from './components/shell/AppShell.tsx';

export default function App() {
  return (
    <MasterProjectContextProvider>
      <CosmicEffectsProvider>
        <AppShell />
      </CosmicEffectsProvider>
    </MasterProjectContextProvider>
  );
}
