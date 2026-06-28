/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameStats, Environment } from '../types';
import { ENVIRONMENTS } from '../data';
import { X, Lock, Play, Compass, Hourglass, Trophy, Sparkles, Heart } from 'lucide-react';

interface SettingsPanelProps {
  stats: GameStats;
  currentEnvId: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectEnvironment: (id: string) => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  stats,
  currentEnvId,
  isOpen,
  onClose,
  onSelectEnvironment,
}) => {
  if (!isOpen) return null;

  // Format playtime
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3A24]/20 backdrop-blur-md overflow-hidden">
      
      {/* Neumorphic Dialog Card */}
      <div 
        id="settings-dialog-card"
        className="w-full max-w-4xl max-h-[90vh] bg-[#fbfdfc] border border-white/60 rounded-3xl shadow-[12px_12px_30px_rgba(45,58,36,0.15),-12px_-12px_30px_rgba(255,255,255,0.8)] flex flex-col overflow-hidden animate-slide-up"
      >
        
        {/* --- DIALOG HEADER --- */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2D3A24]/5 bg-[#EAF2E3]/20">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#7A9D54]" />
            <h2 className="text-lg font-bold text-[#2D3A24] font-sans tracking-tight">Garden Sanctums & Zen Stats</h2>
          </div>
          <button
            id="settings-close-btn"
            onClick={onClose}
            className="p-2 hover:bg-[#EAF2E3]/50 rounded-full text-[#3D4C35]/60 hover:text-[#2D3A24] transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* --- SCROLLABLE DIALOG CONTENT --- */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          
          {/* --- BENTO GRID STATS --- */}
          <div>
            <h3 className="text-xs uppercase font-extrabold text-[#3D4C35]/60 tracking-wider mb-3">Your Zen Journey</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              
              {/* Stat Card 1 */}
              <div className="bg-white border border-[#A7C080]/30 rounded-2xl p-4 shadow-[2px_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                <Trophy className="w-5 h-5 text-amber-500 mb-2" />
                <div>
                  <div className="text-xl font-bold text-[#2D3A24]">{stats.zenPoints}</div>
                  <div className="text-[11px] text-[#3D4C35]/60 font-medium">Zen Energy</div>
                </div>
              </div>

              {/* Stat Card 2 */}
              <div className="bg-white border border-[#A7C080]/30 rounded-2xl p-4 shadow-[2px_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                <Heart className="w-5 h-5 text-[#7A9D54] mb-2" />
                <div>
                  <div className="text-xl font-bold text-[#2D3A24]">{stats.totalSplats}</div>
                  <div className="text-[11px] text-[#3D4C35]/60 font-medium">Hoppers Freed</div>
                </div>
              </div>

              {/* Stat Card 3 */}
              <div className="bg-white border border-[#A7C080]/30 rounded-2xl p-4 shadow-[2px_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                <Sparkles className="w-5 h-5 text-amber-500 mb-2" />
                <div>
                  <div className="text-xl font-bold text-[#2D3A24]">{stats.goldenHopsTapped}</div>
                  <div className="text-[11px] text-[#3D4C35]/60 font-medium">Golden Aurums</div>
                </div>
              </div>

              {/* Stat Card 4 */}
              <div className="bg-white border border-[#A7C080]/30 rounded-2xl p-4 shadow-[2px_2px_8px_rgba(0,0,0,0.02)] flex flex-col justify-between">
                <Hourglass className="w-5 h-5 text-teal-500 mb-2" />
                <div>
                  <div className="text-xl font-bold text-[#2D3A24]">{formatTime(stats.timeSpent)}</div>
                  <div className="text-[11px] text-[#3D4C35]/60 font-medium">Meditation Time</div>
                </div>
              </div>

            </div>
          </div>

          {/* --- ENVIRONMENT SANCTUMS GRID --- */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
              <h3 className="text-xs uppercase font-extrabold text-[#3D4C35]/60 tracking-wider">Sanctum Realms</h3>
              <p className="text-xs text-[#3D4C35]/60 font-medium">Unlock environments by collecting Zen Energy from grasshoppers.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
              {ENVIRONMENTS.map((env) => {
                const isUnlocked = stats.unlockedEnvironments.includes(env.id) || stats.zenPoints >= env.unlockedAt;
                const isActive = env.id === currentEnvId;
                
                return (
                  <div
                    key={env.id}
                    className={`relative rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between h-44 overflow-hidden shadow-sm ${
                      isActive 
                        ? 'bg-[#7A9D54]/10 border-[#7A9D54] scale-[1.02] shadow-[0_4px_12px_rgba(122,157,84,0.15)]'
                        : isUnlocked
                          ? 'bg-white hover:bg-[#EAF2E3]/40 border-[#A7C080]/20 cursor-pointer hover:border-[#A7C080]'
                          : 'bg-slate-50 border-slate-200 opacity-65'
                    }`}
                    onClick={() => {
                      if (isUnlocked) {
                        onSelectEnvironment(env.id);
                      }
                    }}
                  >
                    {/* Corner emoji */}
                    <div className="absolute top-2 right-2 text-3xl opacity-20 pointer-events-none">
                      {env.emoji}
                    </div>

                    <div className="flex flex-col">
                      <span className="text-2xl mb-1">{env.emoji}</span>
                      <h4 className="font-bold text-[#2D3A24] text-sm leading-tight">{env.name}</h4>
                      <p className="text-[10px] text-[#3D4C35]/60 line-clamp-3 mt-1 leading-normal font-medium">
                        {env.description}
                      </p>
                    </div>

                    <div className="mt-2 w-full pt-2 border-t border-[#A7C080]/20 flex items-center justify-between text-[11px] font-bold">
                      {isActive ? (
                        <span className="text-[#3D4C35] flex items-center gap-1 bg-[#A7C080]/40 px-2 py-0.5 rounded-md">
                          <Play className="w-3 h-3 fill-[#7A9D54]" /> Active
                        </span>
                      ) : isUnlocked ? (
                        <span className="text-[#7A9D54] bg-[#EAF2E3]/50 px-2 py-0.5 rounded-md hover:bg-[#A7C080]/30">
                          Visit Sanctum
                        </span>
                      ) : (
                        <span className="text-slate-500 flex items-center gap-1 bg-slate-200/50 px-2 py-0.5 rounded-md font-medium">
                          <Lock className="w-2.5 h-2.5" /> {env.unlockedAt} Zen
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* --- DIALOG FOOTER --- */}
        <div className="px-6 py-4 border-t border-[#2D3A24]/5 bg-[#EAF2E3]/20 text-center">
          <p className="text-xs font-semibold text-[#3D4C35]/50">
            🌿 Relax, let the grasshoppers hop, and listen to the soothing nature sounds to soothe your mind.
          </p>
        </div>

      </div>

      <style>{`
        .animate-slide-up {
          animation: slideUp 0.35s cubic-bezier(0.16, 1, 0.3, 1);
        }
        @keyframes slideUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
