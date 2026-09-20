/**
 * DARK MATTER LAB — Storage / Asset Registry Abstraction
 * Section 9: Asset Registry Foundation
 * 
 * Strict Principle:
 * Asset references are stored as metadata pointers (id, mimeType, byteSize, storageKey).
 * Raw binary data, video streams, and audio buffers must NEVER be loaded into memory or React state.
 */

import { AssetReference, StorageProvider } from '../../src/types/domain.ts';

export interface IStorageAdapter {
  registerAsset(projectId: string, data: {
    label: string;
    mimeType: string;
    byteSize: number;
    duration?: number;
    resolution?: string;
    storageProvider?: StorageProvider;
    storageKey: string;
    proxyReferences?: Record<string, string>;
  }): AssetReference;
  getAsset(id: string): AssetReference | null;
  listProjectAssets(projectId: string): AssetReference[];
  resolveUrl(asset: AssetReference): string;
}

export class LocalStorageAdapter implements IStorageAdapter {
  private assets: Map<string, AssetReference> = new Map();

  constructor() {
    this.seedSampleAsset();
  }

  private seedSampleAsset() {
    const defaultProjectId = 'proj_dark_matter_core';
    const sampleAsset: AssetReference = {
      id: 'asset_radio_signal_01',
      projectId: defaultProjectId,
      label: 'Raw Audio: Wow Signal Archival Telemetry',
      mimeType: 'audio/wav',
      byteSize: 14285700,
      duration: 184,
      storageProvider: 'local',
      storageKey: '/assets/raw/wow_signal_1977.wav',
      createdAt: new Date().toISOString(),
      proxyReferences: {
        audio_preview: '/assets/proxies/wow_signal_128k.mp3',
      },
    };
    this.assets.set(sampleAsset.id, sampleAsset);
  }

  registerAsset(projectId: string, data: {
    label: string;
    mimeType: string;
    byteSize: number;
    duration?: number;
    resolution?: string;
    storageProvider?: StorageProvider;
    storageKey: string;
    proxyReferences?: Record<string, string>;
  }): AssetReference {
    const id = `asset_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
    const asset: AssetReference = {
      id,
      projectId,
      label: data.label.trim(),
      mimeType: data.mimeType,
      byteSize: data.byteSize,
      duration: data.duration,
      resolution: data.resolution,
      storageProvider: data.storageProvider || 'local',
      storageKey: data.storageKey,
      createdAt: new Date().toISOString(),
      proxyReferences: data.proxyReferences || {},
    };

    this.assets.set(id, asset);
    return asset;
  }

  getAsset(id: string): AssetReference | null {
    return this.assets.get(id) || null;
  }

  listProjectAssets(projectId: string): AssetReference[] {
    return Array.from(this.assets.values()).filter((a) => a.projectId === projectId);
  }

  resolveUrl(asset: AssetReference): string {
    // In local dev, maps storageKey to served asset endpoint.
    // In production, will resolve signed Cloud Storage / S3 / Drive URL.
    return `/api/assets/${asset.id}/stream`;
  }
}
