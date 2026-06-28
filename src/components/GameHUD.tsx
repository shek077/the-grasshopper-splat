/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameStats, FloatingText, Environment } from '../types';
import { ENVIRONMENTS } from '../data';
import { Leaf, Award, Compass, Volume2, VolumeX, Music, HelpCircle, Trophy } from 'lucide-react';

interface GameHUDProps {
  stats: GameStats;
  floatingTexts: FloatingText[];
  currentEnvId: string;
  isMuted: boolean;
  isMusicMuted: boolean;
  onToggleMute: () => void;
  onToggleMusicMute: () => void;
  onOpenSelector: () => void;
  onOpenTutorial: () => void;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  stats,
  floatingTexts,
  currentEnvId,
  isMuted,
  isMusicMuted,
  onToggleMute,
  onToggleMusicMute,
  onOpenSelector,
  onOpenTutorial,
}) => {
  const currentEnv = ENVIRONMENTS.find(e => e.id === currentEnvId) || ENVIRONMENTS[0];

  // Calculate progress to next unlock
  const nextLockedEnv = ENVIRONMENTS.find(
    e => e.unlockedAt > stats.zenPoints && !stats.unlockedEnvironments.includes(e.id)
  );

  const prevEnvUnlockPoints = (() => {
    const unlocked = ENVIRONMENTS.filter(e => stats.zenPoints >= e.unlockedAt);
    if (unlocked.length <= 1) return 0;
    return unlocked[unlocked.length - 1].unlockedAt;
  })();

  const progressPercent = (() => {
    if (!nextLockedEnv) return 100;
    const range = nextLockedEnv.unlockedAt - prevEnvUnlockPoints;
    const currentProgress = stats.zenPoints - prevEnvUnlockPoints;
    return Math.min(100, Math.max(0, (currentProgress / range) * 100));
  })();

  return (
    <div className="absolute inset-0 pointer-events-none z-40 select-none flex flex-col justify-between p-4 md:p-6">
      
      {/* --- TOP BAR --- */}
      <div className="w-full flex items-start justify-between gap-4 pointer-events-auto">
        
        {/* Zen Point Counter - Neumorphic Glass */}
        <div className="flex items-center gap-3 bg-white/55 backdrop-blur-lg border border-white/40 shadow-[4px_4px_16px_rgba(122,157,84,0.1),-4px_-4px_16px_rgba(255,255,255,0.7)] px-4 py-2.5 rounded-2xl transition-all duration-300 hover:scale-[1.02]">
          <div className="bg-[#7A9D54]/10 p-2 rounded-xl text-[#7A9D54] animate-pulse">
            <Leaf className="w-5 h-5 fill-[#7A9D54]" />
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-semibold text-[#3D4C35]/60 tracking-wider">Zen Energy</span>
            <span className="text-xl md:text-2xl font-bold text-[#2D3A24] font-sans tracking-tight">
              {stats.zenPoints.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* Sound FX Toggle */}
          <button
            id="hud-toggle-sfx"
            onClick={onToggleMute}
            className={`p-2.5 rounded-xl transition-all duration-300 shadow-sm border border-white/50 flex items-center justify-center ${
              isMuted
                ? 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                : 'bg-white/70 text-[#7A9D54] hover:bg-[#EAF2E3]/70 hover:text-[#2D3A24]'
            }`}
            title={isMuted ? "Unmute Sound Effects" : "Mute Sound Effects"}
          >
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>

          {/* Music Toggle */}
          <button
            id="hud-toggle-music"
            onClick={onToggleMusicMute}
            className={`p-2.5 rounded-xl transition-all duration-300 shadow-sm border border-white/50 flex items-center justify-center ${
              isMusicMuted
                ? 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                : 'bg-white/70 text-[#7A9D54] hover:bg-[#EAF2E3]/70 hover:text-[#2D3A24]'
            }`}
            title={isMusicMuted ? "Unmute Ambient Music" : "Mute Ambient Music"}
          >
            <Music className={`w-5 h-5 ${isMusicMuted ? 'text-slate-400' : 'text-[#7A9D54] animate-spin-slow'}`} />
          </button>

          {/* Garden Switcher */}
          <button
            id="hud-open-environments"
            onClick={onOpenSelector}
            className="flex items-center gap-2 bg-white/75 hover:bg-[#EAF2E3]/80 hover:text-[#2D3A24] border border-white/50 px-4 py-2.5 rounded-xl font-medium text-[#3D4C35] shadow-sm transition-all duration-300 hover:scale-[1.02]"
          >
            <Compass className="w-5 h-5 text-[#7A9D54] animate-bounce-slow" />
            <span className="text-sm hidden sm:inline">Change Garden</span>
          </button>

          {/* Tutorial Button */}
          <button
            id="hud-open-help"
            onClick={onOpenTutorial}
            className="p-2.5 bg-white/70 hover:bg-[#EAF2E3]/70 text-[#7A9D54] border border-white/50 rounded-xl shadow-sm transition-all duration-300 hover:scale-[1.02]"
            title="How to Play"
          >
            <HelpCircle className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* --- FLOATING SCORE EFFECTS --- */}
      {floatingTexts.map((ft) => (
        <div
          key={ft.id}
          className="absolute font-bold text-lg md:text-xl pointer-events-none drop-shadow-sm select-none"
          style={{
            left: `${ft.x}%`,
            top: `${ft.y}%`,
            color: ft.color,
            opacity: ft.opacity,
            transform: `translate(-50%, -100%) translateY(${(1 - ft.opacity) * -60}px)`,
            transition: 'opacity 800ms ease-out, transform 800ms ease-out',
          }}
        >
          {ft.text}
        </div>
      ))}

      {/* --- BOTTOM HUD BAR --- */}
      <div className="w-full flex flex-col sm:flex-row sm:items-end justify-between gap-4 pointer-events-auto">
        
        {/* Environment Name Display */}
        <div className="flex items-center gap-3 bg-white/45 backdrop-blur-md border border-white/30 p-3 rounded-2xl shadow-sm max-w-sm">
          <span className="text-3xl">{currentEnv.emoji}</span>
          <div className="flex flex-col">
            <span className="text-[10px] uppercase font-bold text-[#3D4C35]/60 tracking-wider">Current Sanctum</span>
            <h2 className="text-sm font-semibold text-[#2D3A24]">{currentEnv.name}</h2>
            <p className="text-[11px] text-[#3D4C35]/75 line-clamp-1">{currentEnv.description}</p>
          </div>
        </div>

        {/* Neumorphic Progression Bar to Next Garden */}
        {nextLockedEnv ? (
          <div className="flex flex-col w-full sm:max-w-xs md:max-w-sm bg-white/55 backdrop-blur-md border border-white/40 p-3.5 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-1 text-[11px] font-medium text-[#3D4C35]">
              <span className="flex items-center gap-1">
                <Trophy className="w-3.5 h-3.5 text-amber-500" />
                Next: {nextLockedEnv.emoji} {nextLockedEnv.name}
              </span>
              <span>{stats.zenPoints} / {nextLockedEnv.unlockedAt} Zen</span>
            </div>
            {/* Custom Neumorphic Slider Track */}
            <div className="w-full h-3.5 bg-[#2D3A24]/5 rounded-full overflow-hidden p-[2px] shadow-[inset_1px_1px_3px_rgba(0,0,0,0.06)] border border-white/20">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#A7C080] to-[#7A9D54] transition-all duration-1000 ease-out shadow-[0_1px_3px_rgba(122,157,84,0.3)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-gradient-to-r from-yellow-50/80 to-amber-50/80 border border-yellow-200/50 p-3 rounded-2xl shadow-sm">
            <Award className="w-5 h-5 text-amber-500 animate-bounce-slow" />
            <div className="flex flex-col">
              <span className="text-[9px] uppercase font-extrabold text-amber-800 tracking-wider">Ascended State</span>
              <span className="text-xs font-bold text-amber-950">All Garden Realms Unlocked!</span>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .animate-spin-slow {
          animation: spin 8s linear infinite;
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};
