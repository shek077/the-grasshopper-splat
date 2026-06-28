/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, Play, Volume2, Sparkles, HelpCircle, Leaf, Compass } from 'lucide-react';

interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TutorialModal: React.FC<TutorialModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4 bg-[#2D3A24]/30 backdrop-blur-md overflow-hidden">
      
      {/* Neumorphic Glass Tutorial Modal */}
      <div 
        id="tutorial-modal-card"
        className="w-full max-w-lg bg-[#fbfdfc] border border-white/70 rounded-3xl shadow-[0_20px_50px_rgba(45,58,36,0.2),inset_0_1px_0_rgba(255,255,255,0.8)] flex flex-col overflow-hidden animate-bounce-in"
      >
        
        {/* Header decoration */}
        <div className="relative h-28 bg-gradient-to-r from-[#E1EAD9] to-[#C5D3B8] flex items-center justify-center overflow-hidden">
          {/* Decorative floating leaves inside header */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.5),rgba(0,0,0,0))]" />
          <div className="absolute top-2 left-6 text-[#7A9D54] animate-pulse"><Leaf className="w-8 h-8 fill-[#7A9D54]/20" /></div>
          <div className="absolute bottom-2 right-8 text-[#6A8B46] animate-bounce-slow"><Compass className="w-10 h-10" /></div>
          
          <div className="text-center z-10">
            <span className="text-xs font-bold text-[#3D4C35]/80 uppercase tracking-widest flex items-center justify-center gap-1.5 mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Stress Relief Sanctum
            </span>
            <h1 className="text-2xl font-black text-[#2D3A24] font-sans tracking-tight">THE LAST SPLAT</h1>
          </div>
        </div>

        {/* Content body */}
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <p className="text-xs text-[#3D4C35]/75 font-semibold text-center leading-relaxed">
            Welcome to a tranquil nature-themed stress-relief experience. Every gentle tap on our playful hopping grasshoppers releases a satisfying burst of leaves and sparkles, helping your mind unwind.
          </p>

          <div className="space-y-4">
            
            {/* Rule 1 */}
            <div className="flex items-start gap-3">
              <div className="bg-[#A7C080]/20 p-2 rounded-xl text-[#3D4C35] font-bold text-xs flex items-center justify-center w-8 h-8 shrink-0">
                🌿
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#2D3A24] leading-tight">Release Leaf Energy</h4>
                <p className="text-xs text-[#3D4C35]/65 mt-0.5 leading-relaxed font-medium">
                  Tapping grasshoppers doesn't hurt them! It gently unleashes beautiful bursts of leaves, petals, or stardust that drift away, rewarding you with Zen Energy.
                </p>
              </div>
            </div>

            {/* Rule 2 */}
            <div className="flex items-start gap-3">
              <div className="bg-[#A7C080]/20 p-2 rounded-xl text-[#3D4C35] font-bold text-xs flex items-center justify-center w-8 h-8 shrink-0">
                🔊
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#2D3A24] leading-tight">Immersive Synthesizer</h4>
                <p className="text-xs text-[#3D4C35]/65 mt-0.5 leading-relaxed font-medium">
                  We recommend headphones! Let continuous wind breeze, rain, crickets, and ambient melodies calm your senses in real-time.
                </p>
              </div>
            </div>

            {/* Rule 3 */}
            <div className="flex items-start gap-3">
              <div className="bg-[#A7C080]/20 p-2 rounded-xl text-[#3D4C35] font-bold text-xs flex items-center justify-center w-8 h-8 shrink-0">
                🦗
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#2D3A24] leading-tight">Discover Species</h4>
                <p className="text-xs text-[#3D4C35]/65 mt-0.5 leading-relaxed font-medium">
                  Observe standard Sage Hoppers, super fast Mint Streaks, giant Moss Monarchs, and rare glowing Aurum Hoppers worth 5x points!
                </p>
              </div>
            </div>

            {/* Rule 4 */}
            <div className="flex items-start gap-3">
              <div className="bg-[#A7C080]/20 p-2 rounded-xl text-[#3D4C35] font-bold text-xs flex items-center justify-center w-8 h-8 shrink-0">
                ✨
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#2D3A24] leading-tight">Unlock Gardens</h4>
                <p className="text-xs text-[#3D4C35]/65 mt-0.5 leading-relaxed font-medium">
                  Accumulate Zen Points to unlock up to 10 gorgeous seasonal environments, including Flower Fields, Rain Gardens, and Enchanted Fields.
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Enter game action */}
        <div className="p-6 bg-[#EAF2E3]/20 border-t border-[#2D3A24]/5 text-center flex flex-col gap-2">
          <button
            id="tutorial-enter-btn"
            onClick={onClose}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-[#A7C080] to-[#7A9D54] text-white font-bold py-3 px-6 rounded-2xl shadow-[0_4px_12px_rgba(122,157,84,0.25)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer text-sm"
          >
            <Play className="w-4 h-4 fill-white" />
            Enter Garden Sanctum
          </button>
          <span className="text-[10px] text-[#3D4C35]/40 font-medium">
            (The synthesizer will resume automatically upon entering)
          </span>
        </div>

      </div>

      <style>{`
        .animate-bounce-in {
          animation: bounceIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        @keyframes bounceIn {
          from { transform: scale(0.85); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
