/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { Grasshopper as GrasshopperType } from '../types';
import { GRASSHOPPERS } from '../data';

interface GrasshopperProps {
  hopper: GrasshopperType;
  onTap: (id: string, x: number, y: number) => void;
}

export const Grasshopper: React.FC<GrasshopperProps> = ({ hopper, onTap }) => {
  const meta = GRASSHOPPERS[hopper.type];
  const [isHovered, setIsHovered] = useState(false);
  const [breathPhase, setBreathPhase] = useState(Math.random() * Math.PI * 2);

  // Slow idle breathing animation when not hopping
  useEffect(() => {
    if (hopper.state !== 'idle') return;
    
    let animId: number;
    let lastTime = performance.now();
    
    const updateBreath = (now: number) => {
      const delta = (now - lastTime) / 1000;
      lastTime = now;
      setBreathPhase(prev => (prev + delta * 3) % (Math.PI * 2));
      animId = requestAnimationFrame(updateBreath);
    };
    
    animId = requestAnimationFrame(updateBreath);
    return () => cancelAnimationFrame(animId);
  }, [hopper.state]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.stopPropagation();
    onTap(hopper.id, hopper.x, hopper.y);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    e.stopPropagation();
    if (e.touches && e.touches[0]) {
      onTap(hopper.id, hopper.x, hopper.y);
    }
  };

  // Breathing offset for cute idle state
  const idleYOffset = hopper.state === 'idle' ? Math.sin(breathPhase) * 2.5 : 0;
  const idleScaleY = hopper.state === 'idle' ? 1 + Math.sin(breathPhase) * 0.02 : 1;
  const idleScaleX = hopper.state === 'idle' ? 1 - Math.sin(breathPhase) * 0.015 : 1;

  // Rotation adjustments
  const finalRotation = hopper.rotation + (hopper.state === 'hopping' ? (hopper.isFacingRight ? 15 : -15) : 0);

  return (
    <div
      id={`hopper-${hopper.id}`}
      className="absolute cursor-pointer select-none touch-none z-30"
      style={{
        left: `${hopper.x}%`,
        top: `${hopper.y}%`,
        transform: `translate(-50%, -50%) scale(${hopper.scale * (hopper.state === 'leaving' ? 0.3 : 1)})`,
        opacity: hopper.state === 'leaving' ? 0 : 1,
        transition: `
          left ${hopper.hopDuration}ms linear,
          top ${hopper.hopDuration}ms linear,
          transform 300s ease-out,
          opacity 250ms ease-out
        `,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
    >
      {/* Target circle indicator for accessibility/interactivity */}
      <div
        className={`absolute inset-0 -m-8 rounded-full border-2 transition-all duration-300 pointer-events-none ${
          isHovered 
            ? 'scale-105 opacity-60 border-emerald-400 bg-emerald-500/10' 
            : 'scale-90 opacity-0 border-transparent'
        }`}
        style={{
          boxShadow: meta.glow ? `0 0 15px ${meta.shadowColor}` : 'none'
        }}
      />

      {/* Internal visual wrapper for squashing/stretching animations */}
      <div
        className="relative"
        style={{
          transform: `scaleX(${hopper.isFacingRight ? 1 : -1}) rotate(${finalRotation}deg)`,
          transition: 'transform 200ms ease-out',
        }}
      >
        <div
          className={`relative transition-all`}
          style={{
            animation: hopper.state === 'hopping' ? `grasshopper-hop ${hopper.hopDuration}ms ease-in-out infinite` : 'none',
            transform: hopper.state === 'idle' ? `translateY(${idleYOffset}px) scaleY(${idleScaleY}) scaleX(${idleScaleX})` : 'none',
          }}
        >
          {/* Custom Stylized Grasshopper SVG */}
          <svg
            width="80"
            height="65"
            viewBox="0 0 80 65"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="filter drop-shadow-[0_4px_6px_rgba(0,0,0,0.12)]"
          >
            <defs>
              <linearGradient id={`grad-${hopper.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" className={`${meta.gradient.split(' ')[0].replace('from-[', 'text-[').replace(']', '')} color-stop-1`} style={{ stopColor: hopper.type === 'golden' ? '#fbbf24' : hopper.type === 'speedy' ? '#2dd4bf' : hopper.type === 'sleepy' ? '#a3e635' : hopper.type === 'giant' ? '#10b981' : '#34d399' }} />
                <stop offset="100%" className={`${meta.gradient.split(' ')[1].replace('to-[', 'text-[').replace(']', '')} color-stop-2`} style={{ stopColor: hopper.type === 'golden' ? '#d97706' : hopper.type === 'speedy' ? '#0d9488' : hopper.type === 'sleepy' ? '#65a30d' : hopper.type === 'giant' ? '#064e3b' : '#059669' }} />
              </linearGradient>
              
              <linearGradient id={`wing-grad-${hopper.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#ccfbf1" stopOpacity="0.3" />
              </linearGradient>

              <filter id={`glow-${hopper.id}`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="3" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* Glowing Aura for Premium Grasshoppers */}
            {meta.glow && (
              <circle
                cx="42"
                cy="32"
                r="22"
                fill={hopper.type === 'golden' ? '#fbbf24' : '#10b981'}
                opacity="0.25"
                filter={`url(#glow-${hopper.id})`}
              />
            )}

            {/* Back Leg (Left Leg from perspective, bent backwards) */}
            <path
              d="M 24 38 L 12 20 L 8 42 L 18 42"
              stroke={`url(#grad-${hopper.id})`}
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity="0.8"
            />

            {/* Front Leg (Left Leg) */}
            <path
              d="M 48 40 L 44 52 L 40 52"
              stroke={`url(#grad-${hopper.id})`}
              strokeWidth="3.5"
              strokeLinecap="round"
              opacity="0.75"
            />

            {/* Rounded chubby main body */}
            <rect
              x="22"
              y="22"
              width="36"
              height="20"
              rx="10"
              fill={`url(#grad-${hopper.id})`}
            />

            {/* Antennas */}
            <path
              d="M 54 22 C 58 12, 64 8, 68 6"
              stroke={`url(#grad-${hopper.id})`}
              strokeWidth="2.5"
              strokeLinecap="round"
              fill="none"
              className={hopper.state === 'hopping' ? 'animate-pulse' : ''}
            />
            <path
              d="M 52 20 C 56 10, 60 5, 63 3"
              stroke={`url(#grad-${hopper.id})`}
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
              opacity="0.8"
            />

            {/* Head (integrated overlay) */}
            <circle
              cx="52"
              cy="28"
              r="12"
              fill={`url(#grad-${hopper.id})`}
            />

            {/* Big Expressive Eye */}
            <circle cx="56" cy="24" r="4.5" fill="#1e293b" />
            {/* Glossy Eye Reflections */}
            <circle cx="57.5" cy="22.5" r="1.5" fill="white" />
            <circle cx="54.5" cy="25" r="0.7" fill="white" />

            {/* Small Cute Smile */}
            <path
              d="M 53 32 Q 55 35 57 32"
              stroke="#1e293b"
              strokeWidth="2"
              strokeLinecap="round"
              fill="none"
            />

            {/* Cute Rosy Cheek (blush) */}
            <circle
              cx="50"
              cy="30"
              r="2.2"
              fill={hopper.type === 'golden' ? '#f43f5e' : '#f43f5e'}
              opacity="0.5"
            />

            {/* Front Leg (Right Leg) */}
            <path
              d="M 50 38 L 48 54 L 54 54"
              stroke={`url(#grad-${hopper.id})`}
              strokeWidth="4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Back Leg (Right Leg, closer, strongly bent for power jumping) */}
            <path
              d="M 28 36 L 14 14 L 8 44 L 16 44"
              stroke={`url(#grad-${hopper.id})`}
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Tiny Animated Translucent Wings */}
            <g
              style={{
                transform: hopper.state === 'hopping' ? 'rotate(-15deg)' : 'none',
                transformOrigin: '28px 24px',
                transition: 'transform 100ms ease',
              }}
            >
              <ellipse
                cx="34"
                cy="23"
                rx="14"
                ry="4.5"
                fill={`url(#wing-grad-${hopper.id})`}
                stroke={`url(#grad-${hopper.id})`}
                strokeWidth="1.2"
                opacity="0.95"
                style={{
                  animation: hopper.state === 'hopping' ? 'grasshopper-wing-flutter 70ms linear infinite' : 'none'
                }}
              />
            </g>

            {/* Decorative leaf spots or stripes on back */}
            <path
              d="M 26 30 Q 30 28 34 30"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.3"
            />
            <path
              d="M 28 34 Q 31 32 35 34"
              stroke="white"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.3"
            />
          </svg>
        </div>
      </div>

      {/* CSS Styling Injection for Parabolic Jump and Fluttering Wings */}
      <style>{`
        @keyframes grasshopper-hop {
          0% {
            transform: translateY(0px) scaleY(1) scaleX(1);
          }
          8% {
            transform: translateY(4px) scaleY(0.7) scaleX(1.2);
          }
          28% {
            transform: translateY(-48px) scaleY(1.3) scaleX(0.85);
          }
          50% {
            transform: translateY(-62px) scaleY(1.05) scaleX(0.95);
          }
          72% {
            transform: translateY(-38px) scaleY(1.1) scaleX(0.9);
          }
          90% {
            transform: translateY(-4px) scaleY(0.85) scaleX(1.15);
          }
          100% {
            transform: translateY(0px) scaleY(1) scaleX(1);
          }
        }

        @keyframes grasshopper-wing-flutter {
          0% { transform: rotate(0deg) scaleY(1); }
          50% { transform: rotate(-35deg) scaleY(0.6); }
          100% { transform: rotate(0deg) scaleY(1); }
        }
      `}</style>
    </div>
  );
};
