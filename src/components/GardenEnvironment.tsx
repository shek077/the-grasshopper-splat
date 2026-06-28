/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState, useMemo } from 'react';
import { Environment } from '../types';

interface GardenEnvironmentProps {
  environment: Environment;
}

interface AmbientItem {
  id: number;
  type: 'leaf' | 'flower' | 'sparkle' | 'bubble' | 'snow';
  left: number; // percentage
  top: number; // percentage
  scale: number;
  speed: number; // seconds
  delay: number; // seconds
  swayWidth: number; // px
}

export const GardenEnvironment: React.FC<GardenEnvironmentProps> = ({ environment }) => {
  const [butterflyActive, setButterflyActive] = useState(true);
  const [butterflyKey, setButterflyKey] = useState(0);

  // Re-trigger butterfly flight after it flies off screen
  useEffect(() => {
    const interval = setInterval(() => {
      setButterflyActive(false);
      setTimeout(() => {
        setButterflyKey(prev => prev + 1);
        setButterflyActive(true);
      }, 3000 + Math.random() * 5000);
    }, 18000);

    return () => clearInterval(interval);
  }, []);

  // Generate a stable set of background ambient drifting particles
  const ambientParticles = useMemo<AmbientItem[]>(() => {
    const items: AmbientItem[] = [];
    const count = environment.id === 'rain' || environment.id === 'snowy' ? 30 : 15;
    
    for (let i = 0; i < count; i++) {
      items.push({
        id: i,
        type: environment.id === 'snowy' 
          ? 'snow' 
          : environment.id === 'rain' 
            ? 'bubble'
            : environment.id === 'flower_field' 
              ? 'flower' 
              : environment.id === 'enchanted'
                ? 'sparkle'
                : 'leaf',
        left: Math.random() * 100,
        top: Math.random() * 80 + 10,
        scale: 0.5 + Math.random() * 0.8,
        speed: 12 + Math.random() * 20, // duration of the drift
        delay: Math.random() * -15, // negative delay so they are pre-spawned
        swayWidth: 20 + Math.random() * 40,
      });
    }
    return items;
  }, [environment.id]);

  return (
    <div className={`absolute inset-0 bg-gradient-to-b ${environment.bgGradient} overflow-hidden transition-colors duration-1000 select-none pointer-events-none`}>
      
      {/* 1. Subtle Radial Vignette for Depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.15),rgba(0,0,0,0.03))]" />

      {/* Natural Tones Glowing Ambient Blobs */}
      <div className="absolute inset-0 opacity-45 pointer-events-none">
        <div className="absolute top-[10%] left-[5%] w-32 h-32 bg-[#A7C080]/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-[20%] right-[10%] w-64 h-64 bg-[#C2D6A7]/40 rounded-full blur-3xl"></div>
        <div className="absolute top-[40%] right-[30%] w-48 h-48 bg-[#EAF2E3]/50 rounded-full blur-2xl"></div>
      </div>

      {/* Natural Tones Geometric/Architectural Dashed Circles */}
      <div className="absolute top-24 left-24 w-36 h-36 border-2 border-dashed border-[#7A9D54]/20 rounded-full pointer-events-none"></div>
      <div className="absolute bottom-36 right-24 w-52 h-52 border border-[#7A9D54]/15 rounded-full flex items-center justify-center pointer-events-none">
        <div className="w-44 h-44 border border-[#7A9D54]/8 rounded-full"></div>
      </div>

      {/* Natural Tones Centered Relax Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
         <div className="text-center">
           <div className="text-[#7A9D54]/8 text-8xl md:text-[11rem] font-black uppercase tracking-tighter select-none">RELAX</div>
         </div>
      </div>

      {/* 2. Sun Rays / Light Beam Overlay (Meandow, Sunrise, Mint Garden, Flower Field, Enchanted) */}
      {['meadow', 'sunrise', 'flower_field', 'mint_garden', 'enchanted'].includes(environment.id) && (
        <div className="absolute top-0 right-0 w-full h-full opacity-35 md:opacity-50 mix-blend-overlay pointer-events-none overflow-hidden">
          <svg className="absolute -top-10 -right-10 w-[120%] h-[120%] origin-top-right animate-[spin_120s_linear_infinite]" viewBox="0 0 100 100">
            <path d="M0 0 L15 100 L30 100 Z" fill={environment.id === 'enchanted' ? '#c084fc' : '#fef08a'} opacity="0.15" />
            <path d="M0 0 L45 100 L60 100 Z" fill={environment.id === 'enchanted' ? '#c084fc' : '#fef08a'} opacity="0.1" />
            <path d="M0 0 L75 100 L90 100 Z" fill={environment.id === 'enchanted' ? '#e9d5ff' : '#fffbeb'} opacity="0.18" />
            <path d="M0 0 L110 100 L130 100 Z" fill={environment.id === 'enchanted' ? '#f5d0fe' : '#fffbeb'} opacity="0.08" />
          </svg>
        </div>
      )}

      {/* 3. Rain Drops (Rain Garden) */}
      {environment.id === 'rain' && (
        <div className="absolute inset-0 opacity-40">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0),rgba(255,255,255,0))]">
            {/* Simple CSS-animated repeating raindrop lines */}
            <div className="rain-container" />
          </div>
        </div>
      )}

      {/* 4. Ambient Drifting Particles in Background (Leaves, Petals, Snow, Sparkles) */}
      {ambientParticles.map((p) => (
        <div
          key={p.id}
          className="absolute opacity-0 animate-drift pointer-events-none"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            animationDuration: `${p.speed}s`,
            animationDelay: `${p.delay}s`,
            animationIterationCount: 'infinite',
            transform: `scale(${p.scale})`,
            '--sway-w': `${p.swayWidth}px`,
          } as React.CSSProperties}
        >
          {p.type === 'leaf' && (
            <svg width="22" height="22" viewBox="0 0 24 24" fill={environment.accentColor} className="opacity-25 rotate-[45deg]">
              <path d="M17.5 2C13.5 2 11 5.5 11 8.5C11 11.5 13.5 14 17.5 14C21.5 14 23 10.5 23 8.5C23 5.5 21.5 2 17.5 2Z" />
              <path d="M12.5 11C8.5 11 6 14.5 6 17.5C6 20.5 8.5 23 12.5 23C16.5 23 18 19.5 18 17.5C18 14.5 16.5 11 12.5 11Z" opacity="0.5" />
            </svg>
          )}
          {p.type === 'flower' && (
            <svg width="18" height="18" viewBox="0 0 24 24" fill={environment.accentColor} className="opacity-30 animate-[spin_10s_linear_infinite]">
              <circle cx="12" cy="12" r="4" fill="#fef08a" />
              <ellipse cx="12" cy="5" rx="3" ry="5" />
              <ellipse cx="12" cy="19" rx="3" ry="5" />
              <ellipse cx="5" cy="12" rx="5" ry="3" />
              <ellipse cx="19" cy="12" rx="5" ry="3" />
            </svg>
          )}
          {p.type === 'bubble' && (
            <div 
              className="rounded-full border border-slate-300/40 bg-slate-200/10 opacity-30"
              style={{ width: '8px', height: '8px', boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.8)' }}
            />
          )}
          {p.type === 'snow' && (
            <div className="rounded-full bg-white opacity-60 filter blur-[0.5px]" style={{ width: '6px', height: '6px' }} />
          )}
          {p.type === 'sparkle' && (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#f5d0fe" className="opacity-40 animate-pulse">
              <path d="M12 0L15 9L24 12L15 15L12 24L9 15L0 12L9 9Z" />
            </svg>
          )}
        </div>
      ))}

      {/* 5. A Playful Wandering Butterfly (Occasional) */}
      {butterflyActive && (
        <div
          key={`butterfly-${butterflyKey}`}
          className="absolute z-10 pointer-events-none"
          style={{
            animation: 'butterfly-flight-path 16s cubic-bezier(0.4, 0, 0.6, 1) forwards',
            left: '-10%',
            top: '40%',
          }}
        >
          <div className="animate-[butterfly-wobble_1.5s_ease-in-out_infinite] scale-[0.65] md:scale-95">
            {/* SVG Fluttering Butterfly */}
            <svg width="35" height="30" viewBox="0 0 35 30" fill="none">
              <g className="origin-[17.5px_15px]">
                {/* Left wing */}
                <path
                  d="M17.5 15 C10 5, 0 8, 4 20 C6 25, 12 24, 17.5 15 Z"
                  fill={environment.id === 'moonlit' ? '#f472b6' : environment.id === 'autumn' ? '#fbbf24' : '#60a5fa'}
                  opacity="0.85"
                  className="origin-[17.5px_15px] animate-[wing-flap-left_0.12s_linear_infinite]"
                />
                {/* Right wing */}
                <path
                  d="M17.5 15 C25 5, 35 8, 31 20 C29 25, 23 24, 17.5 15 Z"
                  fill={environment.id === 'moonlit' ? '#f472b6' : environment.id === 'autumn' ? '#fbbf24' : '#60a5fa'}
                  opacity="0.85"
                  className="origin-[17.5px_15px] animate-[wing-flap-right_0.12s_linear_infinite]"
                />
                {/* Body */}
                <ellipse cx="17.5" cy="15" rx="1.5" ry="8" fill="#1e293b" />
                {/* Antennas */}
                <path d="M17 7 C15 3, 12 2, 10 2" stroke="#1e293b" strokeWidth="0.8" fill="none" />
                <path d="M18 7 C20 3, 23 2, 25 2" stroke="#1e293b" strokeWidth="0.8" fill="none" />
              </g>
            </svg>
          </div>
        </div>
      )}

      {/* 6. A Little Ladybug Wandering Around Bottom Edge */}
      <div 
        className="absolute bottom-[3%] z-10 pointer-events-none"
        style={{
          animation: 'ladybug-crawl-path 35s linear infinite',
          left: '-5%',
        }}
      >
        <div className="flex items-center gap-1">
          {/* SVG Cute Ladybug */}
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="9" r="6" fill="#ef4444" />
            <path d="M 8 3 L 8 15" stroke="#1e293b" strokeWidth="1.2" />
            {/* Spots */}
            <circle cx="5" cy="7" r="1.1" fill="#1e293b" />
            <circle cx="11" cy="7" r="1.1" fill="#1e293b" />
            <circle cx="4" cy="11" r="1.1" fill="#1e293b" />
            <circle cx="12" cy="11" r="1.1" fill="#1e293b" />
            {/* Head */}
            <circle cx="8" cy="3.5" r="2.5" fill="#1e293b" />
            {/* Antennas */}
            <path d="M 7 1.5 C 6 0.8, 5 1, 5 1" stroke="#1e293b" strokeWidth="0.6" />
            <path d="M 9 1.5 C 10 0.8, 11 1, 11 1" stroke="#1e293b" strokeWidth="0.6" />
          </svg>
        </div>
      </div>

      {/* 7. Beautiful Swaying Flora Silhouettes (Meadow, Mint, Flower, Forest, Autumn, Sunrise) */}
      {environment.id !== 'rain' && environment.id !== 'snowy' && (
        <div className="absolute bottom-0 left-0 w-full h-[15%] pointer-events-none opacity-40 md:opacity-55 flex items-end justify-between px-2">
          {/* Render 8 swaying grass clumps of different heights */}
          {[...Array(12)].map((_, idx) => {
            const h = 40 + (idx % 3) * 20 + Math.sin(idx) * 10;
            const swayDuration = 4 + (idx % 4) * 1.5;
            const delay = idx * -1.2;
            const flip = idx % 2 === 0 ? 'scaleX(-1)' : '';
            return (
              <svg
                key={idx}
                width="35"
                height={h}
                viewBox="0 0 40 100"
                fill="none"
                preserveAspectRatio="none"
                style={{
                  transform: `${flip} origin-bottom`,
                  animation: `sway-grass ${swayDuration}s ease-in-out infinite alternate`,
                  animationDelay: `${delay}s`,
                }}
              >
                <path
                  d="M10 100 C 15 50, 5 20, 20 0 C 12 30, 22 60, 25 100 Z"
                  fill={environment.accentColor}
                />
                <path
                  d="M25 100 C 28 60, 20 40, 35 15 C 28 45, 33 75, 32 100 Z"
                  fill={environment.accentColor}
                  opacity="0.7"
                />
              </svg>
            );
          })}
        </div>
      )}

      {/* Ambient background CSS style rules */}
      <style>{`
        /* Rain overlay simulation */
        .rain-container {
          position: absolute;
          width: 100%;
          height: 100%;
          background-image: radial-gradient(circle, rgba(255,255,255,0) 90%, rgba(255,255,255,0) 100%),
                            linear-gradient(110deg, transparent 48%, rgba(148,163,184,0.18) 49%, rgba(148,163,184,0.18) 51%, transparent 52%);
          background-size: 80px 140px;
          animation: rain-fall 0.8s linear infinite;
        }

        @keyframes rain-fall {
          0% { background-position: 0px 0px; }
          100% { background-position: -60px 400px; }
        }

        /* Grass Sway Animation */
        @keyframes sway-grass {
          0% { transform: rotate(-4deg); }
          100% { transform: rotate(5deg); }
        }

        /* Drifting particle physics simulation on GPU */
        @keyframes drift {
          0% {
            transform: translate3d(0, 0, 0) rotate(0deg);
            opacity: 0;
          }
          10% {
            opacity: 0.45;
          }
          90% {
            opacity: 0.45;
          }
          100% {
            transform: translate3d(var(--sway-w), -450px, 0) rotate(220deg);
            opacity: 0;
          }
        }

        /* Butterfly flying pattern path */
        @keyframes butterfly-flight-path {
          0% {
            transform: translate3d(-10vw, 45vh, 0) rotate(15deg);
          }
          20% {
            transform: translate3d(20vw, 25vh, 0) rotate(-10deg);
          }
          40% {
            transform: translate3d(45vw, 55vh, 0) rotate(25deg);
          }
          65% {
            transform: translate3d(70vw, 15vh, 0) rotate(-20deg);
          }
          85% {
            transform: translate3d(95vw, 40vh, 0) rotate(5deg);
          }
          100% {
            transform: translate3d(115vw, 25vh, 0) rotate(15deg);
          }
        }

        @keyframes butterfly-wobble {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }

        @keyframes wing-flap-left {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.1); }
        }

        @keyframes wing-flap-right {
          0%, 100% { transform: scaleX(1); }
          50% { transform: scaleX(0.1); }
        }

        /* Ladybug crawling path */
        @keyframes ladybug-crawl-path {
          0% {
            transform: translate3d(-5vw, 0, 0) rotate(90deg);
          }
          48% {
            transform: translate3d(48vw, -15px, 0) rotate(88deg);
          }
          50% {
            transform: translate3d(50vw, -15px, 0) rotate(92deg);
          }
          100% {
            transform: translate3d(110vw, 0, 0) rotate(90deg);
          }
        }
      `}</style>
    </div>
  );
};
