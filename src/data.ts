/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Environment, GrasshopperType, Collectible } from './types';

export const ENVIRONMENTS: Environment[] = [
  {
    id: 'meadow',
    name: 'Meadow',
    emoji: '🌿',
    description: 'A breezy green field where young grasshoppers play under a clear sky.',
    bgGradient: 'from-[#E1EAD9] via-[#EAF2E3] to-[#C5D3B8]',
    cardBg: 'bg-[#EAF2E3]/90 border-[#A7C080]/60',
    primaryColor: 'text-[#2D3A24]',
    accentColor: '#7A9D54', // Natural Tones Olive Green
    textColor: 'text-[#3D4C35]',
    particleType: 'leaf',
    ambientType: 'meadow',
    unlockedAt: 0,
  },
  {
    id: 'mint_garden',
    name: 'Mint Garden',
    emoji: '🍀',
    description: 'A crisp, cooling garden designed around pristine minty neumorphism.',
    bgGradient: 'from-[#EAF2E3] via-[#D1E0C5] to-[#B5C9A4]',
    cardBg: 'bg-[#EAF2E3]/90 border-[#7A9D54]/50',
    primaryColor: 'text-[#2D3A24]',
    accentColor: '#6A8B46', 
    textColor: 'text-[#3D4C35]',
    particleType: 'leaf',
    ambientType: 'meadow',
    unlockedAt: 100,
  },
  {
    id: 'flower_field',
    name: 'Flower Field',
    emoji: '🌼',
    description: 'A vibrant field blooming with wild dandelions and flying petals.',
    bgGradient: 'from-[#fffbeb] via-[#fef3c7] to-[#ecfdf5]',
    cardBg: 'bg-[#fffbeb]/80 border-[#fde68a]',
    primaryColor: 'text-amber-600',
    accentColor: '#f59e0b', // amber-500
    textColor: 'text-amber-950',
    particleType: 'petal',
    ambientType: 'meadow',
    unlockedAt: 250,
  },
  {
    id: 'forest',
    name: 'Forest',
    emoji: '🌳',
    description: 'A dense, ancient woodland alive with the sound of wild birds.',
    bgGradient: 'from-[#f0fdf4] via-[#dcfce7] to-[#ccfbf1]',
    cardBg: 'bg-[#f0fdf4]/80 border-[#bbf7d0]',
    primaryColor: 'text-green-700',
    accentColor: '#15803d', // green-700
    textColor: 'text-green-950',
    particleType: 'leaf',
    ambientType: 'forest',
    unlockedAt: 500,
  },
  {
    id: 'autumn',
    name: 'Autumn Park',
    emoji: '🍂',
    description: 'A scenic park bathed in warm copper sunlight and falling amber leaves.',
    bgGradient: 'from-[#fff7ed] via-[#ffedd5] to-[#fef3c7]',
    cardBg: 'bg-[#fff7ed]/80 border-[#fed7aa]',
    primaryColor: 'text-orange-600',
    accentColor: '#ea580c', // orange-600
    textColor: 'text-orange-950',
    particleType: 'petal',
    ambientType: 'forest',
    unlockedAt: 800,
  },
  {
    id: 'rain',
    name: 'Rain Garden',
    emoji: '🌧',
    description: 'A calming, rain-swept glass greenhouse where droplets rhythmically tap.',
    bgGradient: 'from-[#f1f5f9] via-[#e2e8f0] to-[#f0fdfa]',
    cardBg: 'bg-[#f1f5f9]/80 border-[#cbd5e1]',
    primaryColor: 'text-slate-600',
    accentColor: '#64748b', // slate-500
    textColor: 'text-slate-900',
    particleType: 'droplet',
    ambientType: 'rain',
    unlockedAt: 1200,
  },
  {
    id: 'moonlit',
    name: 'Moonlit Grass',
    emoji: '🌙',
    description: 'A peaceful, deep blue field blanketed in silver moonlight and crickets.',
    bgGradient: 'from-[#0f172a] via-[#1e293b] to-[#0f172a]',
    cardBg: 'bg-[#1e293b]/60 border-[#334155]',
    primaryColor: 'text-indigo-400',
    accentColor: '#818cf8', // indigo-400
    textColor: 'text-indigo-100',
    particleType: 'star',
    ambientType: 'night',
    unlockedAt: 1700,
  },
  {
    id: 'sunrise',
    name: 'Sunrise Meadow',
    emoji: '🌅',
    description: 'Warm peach rays pierce through the morning mist, awaking the meadow.',
    bgGradient: 'from-[#fff5f5] via-[#ffedd5] to-[#f0fdf4]',
    cardBg: 'bg-[#ffedd5]/70 border-[#fecdd3]',
    primaryColor: 'text-rose-500',
    accentColor: '#f43f5e', // rose-500
    textColor: 'text-rose-950',
    particleType: 'sparkle',
    ambientType: 'meadow',
    unlockedAt: 2300,
  },
  {
    id: 'snowy',
    name: 'Snowy Field',
    emoji: '❄',
    description: 'A silent, frozen field where crystalline snowflakes drift gently down.',
    bgGradient: 'from-[#f8fafc] via-[#f1f5f9] to-[#e2e8f0]',
    cardBg: 'bg-[#f8fafc]/80 border-[#e2e8f0]',
    primaryColor: 'text-sky-500',
    accentColor: '#0ea5e9', // sky-500
    textColor: 'text-sky-950',
    particleType: 'snow',
    ambientType: 'rain',
    unlockedAt: 3000,
  },
  {
    id: 'enchanted',
    name: 'Enchanted Field',
    emoji: '✨',
    description: 'A mystical garden glowing with ancient violet spells and stardust.',
    bgGradient: 'from-[#1e1b4b] via-[#311042] to-[#1e1b4b]',
    cardBg: 'bg-[#311042]/50 border-[#4c1d95]',
    primaryColor: 'text-fuchsia-400',
    accentColor: '#d946ef', // fuchsia-500
    textColor: 'text-fuchsia-100',
    particleType: 'sparkle',
    ambientType: 'enchanted',
    unlockedAt: 4000,
  },
];

export interface GrasshopperMeta {
  type: GrasshopperType;
  name: string;
  points: number;
  scale: number;
  speedMultiplier: number;
  hopInterval: [number, number]; // min, max ms
  gradient: string;
  shadowColor: string;
  glow: boolean;
  description: string;
}

export const GRASSHOPPERS: Record<GrasshopperType, GrasshopperMeta> = {
  standard: {
    type: 'standard',
    name: 'Sage Hopper',
    points: 10,
    scale: 1.0,
    speedMultiplier: 1.0,
    hopInterval: [1500, 3000],
    gradient: 'from-[#34d399] to-[#059669]', // emerald
    shadowColor: 'rgba(16, 185, 129, 0.3)',
    glow: false,
    description: 'A happy, bouncy little hopper that enjoys warm sunrays.',
  },
  golden: {
    type: 'golden',
    name: 'Aurum Hopper',
    points: 50,
    scale: 1.1,
    speedMultiplier: 1.4,
    hopInterval: [1200, 2400],
    gradient: 'from-[#fbbf24] to-[#d97706]', // golden yellow
    shadowColor: 'rgba(245, 158, 11, 0.6)',
    glow: true,
    description: 'An extremely rare, shimmering golden hopper that spreads magical light.',
  },
  speedy: {
    type: 'speedy',
    name: 'Mint Streak',
    points: 20,
    scale: 0.8,
    speedMultiplier: 1.8,
    hopInterval: [800, 1600],
    gradient: 'from-[#2dd4bf] to-[#0d9488]', // teal
    shadowColor: 'rgba(20, 184, 166, 0.4)',
    glow: false,
    description: 'Tiny and incredibly fast! It is always in a hurry to reach the next mint leaf.',
  },
  sleepy: {
    type: 'sleepy',
    name: 'Drowsy Moss',
    points: 15,
    scale: 1.2,
    speedMultiplier: 0.6,
    hopInterval: [2500, 4500],
    gradient: 'from-[#a3e635] to-[#65a30d]', // lime
    shadowColor: 'rgba(132, 204, 22, 0.2)',
    glow: false,
    description: 'A round, slow-moving hopper that likes to take long naps on warm moss.',
  },
  giant: {
    type: 'giant',
    name: 'Moss Monarch',
    points: 30,
    scale: 1.4,
    speedMultiplier: 0.7,
    hopInterval: [2000, 3500],
    gradient: 'from-[#10b981] to-[#064e3b]', // deep emerald/green
    shadowColor: 'rgba(16, 185, 129, 0.4)',
    glow: true,
    description: 'A large, majestic grasshopper wearing a tiny leaf crown. He moves with regal grace.',
  },
};

export const COLLECTIBLES: Collectible[] = [
  {
    id: 'red_rose',
    name: 'Ruby Rose',
    emoji: '🌹',
    category: 'flower',
    milestoneType: 'totalSplats',
    milestoneValue: 5,
    description: 'A beautiful crimson rose that adds a loving touch to the garden.',
    color: '#ef4444',
  },
  {
    id: 'sunflower',
    name: 'Helios Sunflower',
    emoji: '🌻',
    category: 'flower',
    milestoneType: 'zenPoints',
    milestoneValue: 150,
    description: 'A cheerful blossom that always turns its face towards the sun rays.',
    color: '#eab308',
  },
  {
    id: 'lavender',
    name: 'Cozy Lavender',
    emoji: '🪻',
    category: 'flower',
    milestoneType: 'totalSplats',
    milestoneValue: 15,
    description: 'Soothes the mind with a subtle purple hue and sweet scent.',
    color: '#a855f7',
  },
  {
    id: 'cute_mushroom',
    name: 'Dotted Shroom',
    emoji: '🍄',
    category: 'shrub',
    milestoneType: 'totalSplats',
    milestoneValue: 25,
    description: 'A little forest dwelling mushroom that likes growing in moist grass.',
    color: '#f43f5e',
  },
  {
    id: 'lucky_clover',
    name: 'Lucky Four-Leaf',
    emoji: '🍀',
    category: 'shrub',
    milestoneType: 'zenPoints',
    milestoneValue: 500,
    description: 'Brings positive energy and serendipity to all visiting hoppers.',
    color: '#10b981',
  },
  {
    id: 'glowing_lantern',
    name: 'Pristine Lantern',
    emoji: '🏮',
    category: 'light',
    milestoneType: 'goldenHops',
    milestoneValue: 1,
    description: 'A hanging warm paper lantern that casts a gentle golden light.',
    color: '#f97316',
  },
  {
    id: 'zen_pebble',
    name: 'Stacked Pebbles',
    emoji: '🪨',
    category: 'stone',
    milestoneType: 'totalSplats',
    milestoneValue: 10,
    description: 'Carefully balanced river pebbles representing ultimate mindfulness.',
    color: '#64748b',
  },
  {
    id: 'bonsai',
    name: 'Ancient Bonsai',
    emoji: '🪴',
    category: 'decor',
    milestoneType: 'totalSplats',
    milestoneValue: 50,
    description: 'A miniature trimmed tree that exudes timeless aesthetic grace.',
    color: '#15803d',
  },
  {
    id: 'magic_crystal',
    name: 'Ether Crystal',
    emoji: '🔮',
    category: 'light',
    milestoneType: 'zenPoints',
    milestoneValue: 1200,
    description: 'A rare violet geode refracting soft magical dust into the air.',
    color: '#c084fc',
  },
  {
    id: 'water_lily',
    name: 'Zen Lily',
    emoji: '🪷',
    category: 'flower',
    milestoneType: 'zenPoints',
    milestoneValue: 2000,
    description: 'Floating elegantly, it symbolizes pure peace and floating calmness.',
    color: '#ec4899',
  },
  {
    id: 'golden_sprout',
    name: 'Aurum Seedling',
    emoji: '🌱',
    category: 'shrub',
    milestoneType: 'goldenHops',
    milestoneValue: 3,
    description: 'An extremely rare sprout growing golden leaves under enchanted care.',
    color: '#fbbf24',
  }
];
