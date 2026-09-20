/**
 * DARK MATTER LAB — Asset Client
 * Section 9: Client Asset Registry Abstraction
 */

import { AssetReference } from '../../types/domain.ts';

export async function fetchProjectAssets(projectId: string): Promise<AssetReference[]> {
  try {
    const res = await fetch(`/api/projects/${projectId}/assets`);
    if (!res.ok) return [];
    const json = await res.json();
    return json.data || [];
  } catch (err) {
    console.error(`[AssetClient] Failed to fetch assets for project ${projectId}:`, err);
    return [];
  }
}

export async function registerProjectAsset(
  projectId: string,
  data: {
    label: string;
    mimeType: string;
    byteSize: number;
    duration?: number;
    resolution?: string;
    storageKey: string;
  }
): Promise<AssetReference | null> {
  try {
    const res = await fetch(`/api/projects/${projectId}/assets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) return null;
    const json = await res.json();
    return json.data || null;
  } catch (err) {
    console.error('[AssetClient] Failed to register asset:', err);
    return null;
  }
}
