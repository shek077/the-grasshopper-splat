/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type ParticleType = 'leaf' | 'sparkle' | 'petal' | 'droplet' | 'snow' | 'star';
export type AmbientSoundType = 'meadow' | 'forest' | 'rain' | 'night' | 'enchanted';

export interface Environment {
  id: string;
  name: string;
  emoji: string;
  description: string;
  bgGradient: string;
  cardBg: string;
  primaryColor: string;
  accentColor: string;
  textColor: string;
  particleType: ParticleType;
  ambientType: AmbientSoundType;
  unlockedAt: number;
}

export type GrasshopperType = 'standard' | 'golden' | 'speedy' | 'sleepy' | 'giant';

export interface Grasshopper {
  id: string;
  type: GrasshopperType;
  x: number; // percentage (0 - 100)
  y: number; // percentage (0 - 100)
  targetX: number;
  targetY: number;
  hopProgress: number; // 0 to 1
  hopDuration: number; // ms
  isFacingRight: boolean;
  scale: number;
  rotation: number;
  bounceOffset: number; // for idle breath
  idleTime: number; // ms until next hop
  state: 'idle' | 'hopping' | 'leaving';
  points: number;
}

export interface SplatParticle {
  id: string;
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  vx: number; // velocity x
  vy: number; // velocity y
  scale: number;
  rotation: number;
  opacity: number;
  color: string;
  type: ParticleType;
}

export interface FloatingText {
  id: string;
  x: number;
  y: number;
  text: string;
  color: string;
  opacity: number;
}

export interface GameStats {
  zenPoints: number;
  totalSplats: number;
  totalHopsSeen: number;
  goldenHopsTapped: number;
  timeSpent: number; // seconds
  unlockedEnvironments: string[]; // IDs
}
