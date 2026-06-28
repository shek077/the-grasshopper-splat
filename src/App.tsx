/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useEffect, useState, useRef, useCallback } from 'react';
import { GameStats, Grasshopper as GrasshopperType, SplatParticle, FloatingText } from './types';
import { ENVIRONMENTS, GRASSHOPPERS } from './data';
import { AudioEngine } from './components/AudioEngine';
import { GardenEnvironment } from './components/GardenEnvironment';
import { Grasshopper } from './components/Grasshopper';
import { SplatParticles } from './components/SplatParticles';
import { GameHUD } from './components/GameHUD';
import { SettingsPanel } from './components/SettingsPanel';
import { TutorialModal } from './components/TutorialModal';

const LOCAL_STORAGE_STATS_KEY = 'the_last_splat_zen_stats';
const LOCAL_STORAGE_ENV_KEY = 'the_last_splat_current_env';

const DEFAULT_STATS: GameStats = {
  zenPoints: 0,
  totalSplats: 0,
  totalHopsSeen: 0,
  goldenHopsTapped: 0,
  timeSpent: 0,
  unlockedEnvironments: ['meadow'],
};

export default function App() {
  // --- STATE ---
  const [stats, setStats] = useState<GameStats>(DEFAULT_STATS);
  const [currentEnvId, setCurrentEnvId] = useState<string>('meadow');
  
  const [grasshoppers, setGrasshoppers] = useState<GrasshopperType[]>([]);
  const [particles, setParticles] = useState<SplatParticle[]>([]);
  const [floatingTexts, setFloatingTexts] = useState<FloatingText[]>([]);
  
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [isMusicMuted, setIsMusicMuted] = useState<boolean>(false);
  
  const [selectorOpen, setSelectorOpen] = useState<boolean>(false);
  const [tutorialOpen, setTutorialOpen] = useState<boolean>(false);

  // Refs for loop management
  const nextHopperIdRef = useRef<number>(1);
  const animationFrameRef = useRef<number | null>(null);
  const particlesRef = useRef<SplatParticle[]>([]);
  const floatingTextsRef = useRef<FloatingText[]>([]);
  const isMutedRef = useRef(isMuted);
  const statsRef = useRef(stats);

  // Sync refs to avoid stale closures in requestAnimationFrame loops
  useEffect(() => {
    isMutedRef.current = isMuted;
  }, [isMuted]);

  useEffect(() => {
    statsRef.current = stats;
  }, [stats]);

  // --- INITIALIZATION ---
  useEffect(() => {
    // 1. Load Stats
    const savedStatsStr = localStorage.getItem(LOCAL_STORAGE_STATS_KEY);
    let loadedStats = DEFAULT_STATS;
    if (savedStatsStr) {
      try {
        const parsed = JSON.parse(savedStatsStr);
        loadedStats = { ...DEFAULT_STATS, ...parsed };
      } catch (e) {
        console.error('Failed to parse saved stats:', e);
      }
    }
    
    // 2. Load Active Environment
    const savedEnv = localStorage.getItem(LOCAL_STORAGE_ENV_KEY);
    const activeEnvId = savedEnv && ENVIRONMENTS.some(e => e.id === savedEnv) ? savedEnv : 'meadow';
    
    // Auto-unlock environments based on current Zen Points
    const unlockedList = ENVIRONMENTS.filter(e => loadedStats.zenPoints >= e.unlockedAt).map(e => e.id);
    const updatedStats = {
      ...loadedStats,
      unlockedEnvironments: Array.from(new Set([...loadedStats.unlockedEnvironments, ...unlockedList, 'meadow'])),
    };

    setStats(updatedStats);
    setCurrentEnvId(activeEnvId);

    // Show tutorial to new users
    const hasSeenTutorial = localStorage.getItem('the_last_splat_tutorial_completed');
    if (!hasSeenTutorial) {
      setTutorialOpen(true);
    }

    // Trigger initial audio ambient startup
    const targetEnv = ENVIRONMENTS.find(e => e.id === activeEnvId) || ENVIRONMENTS[0];
    AudioEngine.startAmbient(targetEnv.ambientType);

    // Increment time spent statistic every second
    const timer = setInterval(() => {
      setStats(prev => {
        const nextStats = { ...prev, timeSpent: prev.timeSpent + 1 };
        localStorage.setItem(LOCAL_STORAGE_STATS_KEY, JSON.stringify(nextStats));
        return nextStats;
      });
    }, 1000);

    return () => {
      clearInterval(timer);
      AudioEngine.stopAmbient();
    };
  }, []);

  // Sync ambient soundscapes on environment transition
  useEffect(() => {
    const targetEnv = ENVIRONMENTS.find(e => e.id === currentEnvId) || ENVIRONMENTS[0];
    AudioEngine.startAmbient(targetEnv.ambientType);
    localStorage.setItem(LOCAL_STORAGE_ENV_KEY, currentEnvId);
  }, [currentEnvId]);

  // Safe gesture unlock for browser audio restrictions
  const handleInteraction = () => {
    AudioEngine.init();
    AudioEngine.resume();
  };

  // --- PARTICLE & FLOATING TEXTS PHYSICS LOOP ---
  useEffect(() => {
    const updatePhysics = () => {
      const activeEnv = ENVIRONMENTS.find(e => e.id === currentEnvId) || ENVIRONMENTS[0];
      const hasWind = ['meadow', 'forest', 'autumn', 'sunrise'].includes(activeEnv.id);
      const windDrift = hasWind ? 0.02 : 0;
      const gravity = activeEnv.id === 'rain' ? 0.04 : 0.035;

      // 1. Update Particles
      const nextParticles = particlesRef.current
        .map((p) => {
          // Add drag
          const vx = p.vx * 0.94 + windDrift;
          const vy = p.vy * 0.94 + gravity;
          
          return {
            ...p,
            vx,
            vy,
            x: p.x + vx,
            y: p.y + vy,
            rotation: p.rotation + vx * 12,
            opacity: p.opacity - 0.016, // Fades completely over ~1.1s
          };
        })
        .filter((p) => p.opacity > 0);

      particlesRef.current = nextParticles;
      setParticles(nextParticles);

      // 2. Update Floating Texts
      const nextFloating = floatingTextsRef.current
        .map((ft) => ({
          ...ft,
          y: ft.y - 0.45,
          opacity: ft.opacity - 0.015,
        }))
        .filter((ft) => ft.opacity > 0);

      floatingTextsRef.current = nextFloating;
      setFloatingTexts(nextFloating);

      animationFrameRef.current = requestAnimationFrame(updatePhysics);
    };

    animationFrameRef.current = requestAnimationFrame(updatePhysics);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [currentEnvId]);

  // --- SPAWNING & HOPPING LIFE CYCLE ---
  const spawnGrasshopper = useCallback(() => {
    const types: ('standard' | 'golden' | 'speedy' | 'sleepy' | 'giant')[] = [
      'standard', 'sleepy', 'speedy', 'giant', 'golden'
    ];
    // Probability distribution
    const roll = Math.random() * 100;
    let selectedType: 'standard' | 'golden' | 'speedy' | 'sleepy' | 'giant' = 'standard';

    if (roll < 4) selectedType = 'golden'; // 4% rare golden
    else if (roll < 10) selectedType = 'giant'; // 6% giant
    else if (roll < 18) selectedType = 'speedy'; // 8% speedy
    else if (roll < 30) selectedType = 'sleepy'; // 12% sleepy
    else selectedType = 'standard'; // 70% standard

    const meta = GRASSHOPPERS[selectedType];
    const sideSpawn = Math.random() < 0.5;
    
    // Random placement (safe within the middle of viewport)
    const initialX = sideSpawn ? (Math.random() < 0.5 ? -10 : 110) : (10 + Math.random() * 80);
    const initialY = sideSpawn ? (30 + Math.random() * 40) : (Math.random() < 0.5 ? -10 : 110);
    
    const targetX = 15 + Math.random() * 70;
    const targetY = 30 + Math.random() * 50;

    const newHopper: GrasshopperType = {
      id: `${nextHopperIdRef.current++}`,
      type: selectedType,
      x: initialX,
      y: initialY,
      targetX,
      targetY,
      hopProgress: 0,
      hopDuration: Math.round((700 + Math.random() * 400) / meta.speedMultiplier),
      isFacingRight: targetX > initialX,
      scale: meta.scale,
      rotation: 0,
      bounceOffset: 0,
      idleTime: 100, // Trigger initial hop quickly to enter screen
      state: 'hopping',
      points: meta.points,
    };

    setGrasshoppers(prev => [...prev, newHopper]);
    setStats(prev => ({ ...prev, totalHopsSeen: prev.totalHopsSeen + 1 }));

    // Auto trigger the initial jump sound and move inside container
    setTimeout(() => {
      if (!isMutedRef.current) AudioEngine.playHop();
    }, 50);
  }, []);

  // Manage spawner loop
  useEffect(() => {
    // Spawn initial grasshoppers
    if (grasshoppers.length === 0) {
      for (let i = 0; i < 3; i++) {
        setTimeout(spawnGrasshopper, i * 400);
      }
    }

    const spawner = setInterval(() => {
      // Calm, non-stressful volume of grasshoppers: keep between 2 and 4
      if (grasshoppers.length < 4) {
        spawnGrasshopper();
      }
    }, 3200);

    return () => clearInterval(spawner);
  }, [grasshoppers.length, spawnGrasshopper]);

  // Periodic Hopper Decision making (Idle -> Hopping)
  useEffect(() => {
    const aiInterval = setInterval(() => {
      setGrasshoppers(prev =>
        prev.map(gh => {
          if (gh.state !== 'idle') return gh;

          // Decrement idle decision timer
          const nextIdleTime = gh.idleTime - 200;
          if (nextIdleTime > 0) {
            return { ...gh, idleTime: nextIdleTime };
          }

          // Idle time expired! Choose new jump location
          const meta = GRASSHOPPERS[gh.type];
          
          // Chance to hop completely off-screen if it has hopped a few times
          const leaveRoll = Math.random() < 0.18;
          let targetX = gh.x + (Math.random() * 40 - 20);
          let targetY = gh.y + (Math.random() * 24 - 12);

          if (leaveRoll) {
            // Hop away
            const left = Math.random() < 0.5;
            targetX = left ? -15 : 115;
            targetY = gh.y + (Math.random() * 10 - 5);
          } else {
            // Keep bounds
            targetX = Math.max(12, Math.min(88, targetX));
            targetY = Math.max(28, Math.min(82, targetY));
          }

          const isFacingRight = targetX > gh.x;
          const hopDuration = Math.round((700 + Math.random() * 400) / meta.speedMultiplier);

          // Play audio hop sound
          if (!isMutedRef.current) {
            AudioEngine.playHop();
          }

          // Trigger state transition
          return {
            ...gh,
            state: leaveRoll ? 'leaving' : 'hopping',
            targetX,
            targetY,
            isFacingRight,
            hopDuration,
            idleTime: Math.max(meta.hopInterval[0], Math.round(Math.random() * meta.hopInterval[1])),
          };
        })
      );
    }, 200);

    return () => clearInterval(aiInterval);
  }, []);

  // Update hopper coordinate positions upon completing their hop transition
  useEffect(() => {
    grasshoppers.forEach((gh) => {
      if (gh.state !== 'hopping' && gh.state !== 'leaving') return;

      const timer = setTimeout(() => {
        setGrasshoppers(prev => {
          const found = prev.find(p => p.id === gh.id);
          if (!found) return prev;

          if (found.state === 'leaving') {
            // Filter off-screen departed hoppers
            return prev.filter(p => p.id !== gh.id);
          }

          // Complete jump successfully, return to peaceful idle
          return prev.map(p => {
            if (p.id === gh.id) {
              return {
                ...p,
                state: 'idle',
                x: p.targetX,
                y: p.targetY,
              };
            }
            return p;
          });
        });
      }, gh.hopDuration);

      return () => clearTimeout(timer);
    });
  }, [grasshoppers]);

  // --- CLICK TAP LOGIC ---
  const handleTapGrasshopper = useCallback((id: string, x: number, y: number) => {
    setGrasshoppers(prev => {
      const target = prev.find(p => p.id === id);
      if (!target) return prev;

      const activeEnv = ENVIRONMENTS.find(e => e.id === currentEnvId) || ENVIRONMENTS[0];
      const meta = GRASSHOPPERS[target.type];

      // 1. Play Splat/Release puff audio
      AudioEngine.playSplat(activeEnv.particleType);

      // Trigger achievement chime if golden or giant
      if (target.type === 'golden') {
        AudioEngine.playChime();
      }

      // 2. Generate Splat Particle Burst
      const particleColor = target.type === 'golden' 
        ? '#fbbf24' // Aurum particles
        : target.type === 'speedy'
          ? '#2dd4bf'
          : activeEnv.accentColor;

      const newParticles: SplatParticle[] = [];
      const burstCount = target.type === 'giant' ? 24 : target.type === 'golden' ? 20 : 14;

      for (let i = 0; i < burstCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        // Explosive outward speed
        const speed = 0.5 + Math.random() * 2.2;
        newParticles.push({
          id: `p-${id}-${i}-${Date.now()}`,
          type: activeEnv.particleType,
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 0.5, // slightly upward bias
          scale: 0.5 + Math.random() * 0.9,
          rotation: Math.random() * 360,
          opacity: 1.0,
          color: particleColor,
        });
      }

      particlesRef.current = [...particlesRef.current, ...newParticles];
      setParticles(particlesRef.current);

      // 3. Create Floating Score text
      const isGolden = target.type === 'golden';
      const pointsEarned = target.points;
      
      const textItem: FloatingText = {
        id: `ft-${id}-${Date.now()}`,
        x,
        y,
        text: isGolden ? `+${pointsEarned} AURUM GOLD!` : `+${pointsEarned} Zen`,
        color: isGolden ? '#f59e0b' : target.type === 'giant' ? '#047857' : '#059669',
        opacity: 1.0,
      };

      floatingTextsRef.current = [...floatingTextsRef.current, textItem];
      setFloatingTexts(floatingTextsRef.current);

      // 4. Update Stats & Unlock progress
      setStats(current => {
        const nextPoints = current.zenPoints + pointsEarned;
        
        // Find if any environment is newly unlocked
        const newlyUnlocked = ENVIRONMENTS.filter(e => nextPoints >= e.unlockedAt).map(e => e.id);
        const prevUnlockedCount = current.unlockedEnvironments.length;
        const currentUnlockedList = Array.from(new Set([...current.unlockedEnvironments, ...newlyUnlocked, 'meadow']));

        // Play positive chime on newly unlocked realms
        if (currentUnlockedList.length > prevUnlockedCount) {
          setTimeout(() => {
            AudioEngine.playChime();
          }, 400);
        }

        const updated = {
          ...current,
          zenPoints: nextPoints,
          totalSplats: current.totalSplats + 1,
          goldenHopsTapped: current.goldenHopsTapped + (target.type === 'golden' ? 1 : 0),
          unlockedEnvironments: currentUnlockedList,
        };

        localStorage.setItem(LOCAL_STORAGE_STATS_KEY, JSON.stringify(updated));
        return updated;
      });

      // 5. Instantly filter tapped grasshopper from screen and request respawn
      return prev.filter(p => p.id !== id);
    });
  }, [currentEnvId]);

  // --- GENERAL INTERFACE HANDLERS ---
  const toggleMute = () => {
    setIsMuted(prev => {
      const next = !prev;
      AudioEngine.setMute(next);
      return next;
    });
  };

  const toggleMusicMute = () => {
    setIsMusicMuted(prev => {
      const next = !prev;
      AudioEngine.setMusicMute(next);
      return next;
    });
  };

  const handleSelectEnvironment = (id: string) => {
    setCurrentEnvId(id);
    AudioEngine.playHop(); // small chime feedback
    setSelectorOpen(false);
  };

  const activeEnvironment = ENVIRONMENTS.find(e => e.id === currentEnvId) || ENVIRONMENTS[0];

  return (
    <main
      onClick={handleInteraction}
      onTouchStart={handleInteraction}
      className="relative w-full h-screen overflow-hidden flex flex-col font-sans select-none bg-[#E1EAD9]/10"
    >
      {/* 1. Immersive Garden Sanctum Background with Wind & Particles */}
      <GardenEnvironment environment={activeEnvironment} />

      {/* 2. Interactive Grasshopper Stage Layer */}
      <div className="absolute inset-0 z-20 overflow-hidden select-none touch-none">
        {grasshoppers.map((gh) => (
          <Grasshopper
            key={gh.id}
            hopper={gh}
            onTap={handleTapGrasshopper}
          />
        ))}
      </div>

      {/* 3. Physics Burst Particles Overlay */}
      <SplatParticles particles={particles} />

      {/* 4. Glass-Themed Head-up Display Panel */}
      <GameHUD
        stats={stats}
        floatingTexts={floatingTexts}
        currentEnvId={currentEnvId}
        isMuted={isMuted}
        isMusicMuted={isMusicMuted}
        onToggleMute={toggleMute}
        onToggleMusicMute={toggleMusicMute}
        onOpenSelector={() => setSelectorOpen(true)}
        onOpenTutorial={() => setTutorialOpen(true)}
      />

      {/* 5. Custom Sanctum Selector & Stats Modal Overlay */}
      <SettingsPanel
        stats={stats}
        currentEnvId={currentEnvId}
        isOpen={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSelectEnvironment={handleSelectEnvironment}
      />

      {/* 6. Friendly Introductory Zen Tutorial Popup */}
      <TutorialModal
        isOpen={tutorialOpen}
        onClose={() => {
          localStorage.setItem('the_last_splat_tutorial_completed', 'true');
          setTutorialOpen(false);
          // Auto-resume sound upon dismissed tutorial
          AudioEngine.init();
          AudioEngine.resume();
        }}
      />
    </main>
  );
}
