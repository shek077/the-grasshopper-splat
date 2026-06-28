/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { SplatParticle } from '../types';

interface SplatParticlesProps {
  particles: SplatParticle[];
}

export const SplatParticles: React.FC<SplatParticlesProps> = ({ particles }) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {particles.map((p) => {
        return (
          <div
            key={p.id}
            className="absolute transition-transform duration-75 ease-out"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: `translate(-50%, -50%) scale(${p.scale}) rotate(${p.rotation}deg)`,
              opacity: p.opacity,
            }}
          >
            {renderParticleIcon(p.type, p.color)}
          </div>
        );
      })}
    </div>
  );
};

function renderParticleIcon(type: string, color: string): React.JSX.Element {
  switch (type) {
    case 'leaf':
      return (
        <svg width="20" height="20" viewBox="0 0 24 24" fill={color} opacity="0.9">
          <path d="M12 2C6.48 2 2 6.48 2 12c0 .34.02.67.06 1 .37-1.12 1.13-2.07 2.1-2.67.43-.27.91-.45 1.41-.53 2.1-.34 4.14.7 4.93 2.65.25.6.3 1.25.18 1.88-.34 1.77-1.74 3.11-3.48 3.32-.42.05-.84.05-1.25 0 .28.47.66.86 1.11 1.15.9.58 1.95.89 3.03.89 3.31 0 6-2.69 6-6 0-3.31-2.69-6-6-6z" />
          <path d="M12 2c5.52 0 10 4.48 10 10s-4.48 10-10 10S2 17.52 2 12 6.48 2 12 2z" fill="none" />
        </svg>
      );
    case 'petal':
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={color} opacity="0.85">
          <path d="M12 22C17.5 22 21 17.5 21 12C21 6.5 16.5 2 12 2C7.5 2 3 6.5 3 12C3 17.5 6.5 22 12 22Z" />
          <path d="M12 18C15 18 17 15 17 12C17 9 14.5 5 12 5C9.5 5 7 9 7 12C7 15 9 18 12 18Z" fill="#ffffff" opacity="0.25" />
        </svg>
      );
    case 'droplet':
      return (
        <svg width="14" height="20" viewBox="0 0 14 20" fill={color} opacity="0.9">
          <path d="M7 0C7 0 0 7.8 0 12.3C0 16.6 3.1 19.7 7 19.7C10.9 19.7 14 16.6 14 12.3C14 7.8 7 0 7 0Z" />
        </svg>
      );
    case 'snow':
      return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="2" x2="12" y2="22" />
          <line x1="2" y1="12" x2="22" y2="12" />
          <line x1="5" y1="5" x2="19" y2="19" />
          <line x1="5" y1="19" x2="19" y2="5" />
          <circle cx="12" cy="12" r="2" fill={color} />
        </svg>
      );
    case 'star':
    case 'sparkle':
    default:
      return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill={color} opacity="0.95">
          <path d="M12 0L15.3 8.7L24 12L15.3 15.3L12 24L8.7 15.3L0 12L8.7 8.7L12 0Z" />
        </svg>
      );
  }
}
