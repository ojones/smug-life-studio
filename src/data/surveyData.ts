import { ArtStyleCategory, BeautyAesthetic, EnergyMood, PaletteChoice, PrintifyProvider, TextureMedium, VisualHeroSubject, VisualMotif } from '../types';

export interface ArtStyleOption {
  id: ArtStyleCategory;
  title: string;
  badge: string;
  iconName: string;
  gradient: string;
  color: string;
  visualPreview: string;
  tags: string[];
  subtitle?: string;
  prompt: string;
}

export const ART_STYLE_OPTIONS: ArtStyleOption[] = [
  {
    id: 'anime',
    title: 'Anime',
    badge: 'Polished & Contemporary',
    iconName: 'Zap',
    gradient: 'from-indigo-950/50 via-purple-900/30 to-slate-950',
    color: '#6366f1',
    visualPreview: 'bg-gradient-to-tr from-indigo-950/50 via-purple-900/30 to-slate-950',
    tags: ['Contemporary Anime', 'Expressive Eyes', 'Cel Shading & Gradients'],
    prompt: 'Create a polished, contemporary anime character illustration. Use expressive eyes, clean elegant ink contours, restrained cel shading, should be 2-D flat but have subtle tonal gradients.'
  },
  {
    id: 'vector',
    title: 'Vector',
    badge: 'Crisp & Flat Silhouettes',
    iconName: 'Sparkles',
    gradient: 'from-sky-950/50 via-cyan-900/30 to-slate-950',
    color: '#0284c7',
    visualPreview: 'bg-gradient-to-tr from-sky-950/50 via-cyan-900/30 to-slate-950',
    tags: ['Flat Vector', 'Bold Shapes', 'Clean Silhouette'],
    prompt: 'Create a crisp, premium flat vector illustration. Build the character from simple, bold shapes with clean edges, solid color fills, and little to no shading. Use a restrained palette and a clear silhouette that stays readable at thumbnail size.'
  },
  {
    id: 'pencil_sketch',
    title: 'Pencil sketch',
    badge: 'Hand-Drawn Graphite',
    iconName: 'Smile',
    gradient: 'from-stone-900/40 via-amber-950/20 to-stone-950',
    color: '#78716c',
    visualPreview: 'bg-gradient-to-tr from-stone-900/40 via-amber-950/20 to-stone-950',
    tags: ['Graphite Study', 'Warm Ivory Paper', 'Crosshatching'],
    prompt: 'Create a hand-drawn graphite character study on warm ivory paper. Use fine, confident pencil outlines, natural strokes, tonal shading, and controlled crosshatching. Keep the texture of the paper visible and avoid colored pigment or painterly washes.'
  },
  {
    id: 'chinese_watercolor',
    title: 'Chinese watercolor',
    badge: 'Ink Wash on Xuan Paper',
    iconName: 'Droplets',
    gradient: 'from-amber-950/40 via-stone-900/30 to-zinc-950',
    color: '#b45309',
    visualPreview: 'bg-gradient-to-tr from-amber-950/40 via-stone-900/30 to-zinc-950',
    tags: ['Ink & Wash', 'Warm Xuan Paper', 'Mineral Pigment'],
    prompt: 'Create a refined Chinese ink-and-color painting on warm xuan paper. Use expressive brush contours, soft ink washes, subtle paper texture, and restrained mineral-pigment accents. Let negative space contribute to the composition; avoid western-style watercolor splashes or overly decorative details.'
  }
];

export interface SubjectTripletOption {
  id: string;
  words: string;
  adj1: string;
  adj2: string;
  noun: string;
  badge: string;
  iconName: string;
  color: string;
  flavor: string;
}

export const SUBJECT_ADJECTIVES_1 = [
  'Brave', 'Cosmic', 'Electric', 'Golden', 'Sleepy', 'Whimsical', 
  'Radiant', 'Gentle', 'Velvet', 'Neon', 'Sassy', 'Tiny', 
  'Mystic', 'Starlit', 'Bumbling', 'Cheerful', 'Fierce', 'Dapper', 
  'Astral', 'Luminous', 'Snarky', 'Dreamy', 'Mighty', 'Bubbly',
  'Zen', 'Sunny', 'Velvety', 'Heroic'
];

export const SUBJECT_ADJECTIVES_2 = [
  'Fluffy', 'Sleepy', 'Mischievous', 'Whimsical', 'Curious', 'Golden', 
  'Velvet', 'Cozy', 'Chubby', 'Dancing', 'Spunky', 'Snuggly', 
  'Feathery', 'Bubbly', 'Shiny', 'Tiny', 'Winged', 'Sneaky', 
  'Cuddly', 'Playful', 'Jumping', 'Sparkling', 'Gentle', 'Brave',
  'Polka-Dot', 'Bouncing', 'Lovable'
];

export const SUBJECT_NOUNS = [
  { noun: 'Fox', icon: 'Sparkles', color: '#ea580c', badge: 'Forest Hero' },
  { noun: 'Dragon', icon: 'Zap', color: '#8b5cf6', badge: 'Mythic Beast' },
  { noun: 'Robot', icon: 'Smile', color: '#0284c7', badge: 'Cyber Companion' },
  { noun: 'Cat', icon: 'Heart', color: '#ec4899', badge: 'Mischief Maker' },
  { noun: 'Bear', icon: 'Heart', color: '#b45309', badge: 'Gentle Giant' },
  { noun: 'Otter', icon: 'Sparkles', color: '#0d9488', badge: 'Playful Swimmer' },
  { noun: 'Owl', icon: 'Moon', color: '#6366f1', badge: 'Night Watcher' },
  { noun: 'Panda', icon: 'Smile', color: '#10b981', badge: 'Bamboo Dreamer' },
  { noun: 'Ghost', icon: 'Sparkles', color: '#a855f7', badge: 'Friendly Spirit' },
  { noun: 'Monster', icon: 'Smile', color: '#f59e0b', badge: 'Fluffy Giant' },
  { noun: 'Bunny', icon: 'Heart', color: '#f43f5e', badge: 'Hop Champion' },
  { noun: 'Raccoon', icon: 'Sparkles', color: '#64748b', badge: 'Sneaky Bandit' },
  { noun: 'Squirrel', icon: 'Zap', color: '#d97706', badge: 'Acorn Scout' },
  { noun: 'Badger', icon: 'Shield', color: '#475569', badge: 'Bold Defender' },
  { noun: 'Hedgehog', icon: 'Heart', color: '#ca8a04', badge: 'Quill Buddy' },
  { noun: 'Penguin', icon: 'Smile', color: '#0284c7', badge: 'Arctic Waddler' },
  { noun: 'Puppy', icon: 'Heart', color: '#e11d48', badge: 'Loyal Pup' },
  { noun: 'Chameleon', icon: 'Zap', color: '#16a34a', badge: 'Color Shifter' },
  { noun: 'Koala', icon: 'Moon', color: '#059669', badge: 'Canopy Napper' },
  { noun: 'Duckling', icon: 'Sun', color: '#eab308', badge: 'Puddle Explorer' }
];

export function generateRandomSubjectOptions(count: number = 4): SubjectTripletOption[] {
  // Shuffle nouns and pick unique ones
  const shuffledNouns = [...SUBJECT_NOUNS].sort(() => 0.5 - Math.random()).slice(0, count);

  return shuffledNouns.map((item, index) => {
    // Pick 2 distinct adjectives
    const randAdj1 = SUBJECT_ADJECTIVES_1[Math.floor(Math.random() * SUBJECT_ADJECTIVES_1.length)];
    let randAdj2 = SUBJECT_ADJECTIVES_2[Math.floor(Math.random() * SUBJECT_ADJECTIVES_2.length)];
    while (randAdj2.toLowerCase() === randAdj1.toLowerCase()) {
      randAdj2 = SUBJECT_ADJECTIVES_2[Math.floor(Math.random() * SUBJECT_ADJECTIVES_2.length)];
    }

    const words = `${randAdj1} ${randAdj2} ${item.noun}`;
    return {
      id: `opt-${index}-${words.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
      words,
      adj1: randAdj1,
      adj2: randAdj2,
      noun: item.noun,
      badge: item.badge,
      iconName: item.icon,
      color: item.color,
      flavor: `A ${randAdj1.toLowerCase()} and ${randAdj2.toLowerCase()} ${item.noun.toLowerCase()}`
    };
  });
}

export interface HeroSubjectOption {
  id: VisualHeroSubject;
  title: string;
  subtitle: string;
  badge: string;
  iconName: string;
  characterType: 'animal' | 'character' | 'tree';
  description: string;
}

export const HERO_SUBJECT_OPTIONS: HeroSubjectOption[] = [
  {
    id: 'valiant_animal_hero',
    title: 'Valiant Little Animal',
    subtitle: 'Cute heroic companion — a brave red panda, otter, fox, or lion cub',
    badge: 'Brave & Cute Animal',
    iconName: 'Heart',
    characterType: 'animal',
    description: 'An adorable animal hero with bright courageous eyes and a gentle heroic presence.'
  },
  {
    id: 'cute_guardian_ghost',
    title: 'Cute Guardian Ghost',
    subtitle: 'Friendly, floating spirit wearing a tiny lantern or heroic cape',
    badge: 'Friendly Spirit',
    iconName: 'Sparkles',
    characterType: 'character',
    description: 'A charming, lovable cute ghost / spirit radiating warm comforting light.'
  },
  {
    id: 'friendly_monster',
    title: 'Friendly Mountain Monster',
    subtitle: 'Heartwarming, fluffy gentle giant creature with a sweet smile',
    badge: 'Gentle Creature',
    iconName: 'Smile',
    characterType: 'character',
    description: 'A non-scary, huggable fantasy monster hero with universal charm.'
  },
  {
    id: 'majestic_ancient_tree',
    title: 'Majestic Ancient Tree',
    subtitle: 'Sprawling mystical ancient oak with a starlit glowing canopy and roots',
    badge: 'Enchanted Nature',
    iconName: 'TreePine',
    characterType: 'tree',
    description: 'A grand, ancient world tree alive with glowing lanterns and gentle cosmic motes.'
  },
  {
    id: 'celestial_star_creature',
    title: 'Celestial Star Beast',
    subtitle: 'Cute baby cosmic dragon, starry whale, or glowing mini-phoenix',
    badge: 'Mythical & Heroic',
    iconName: 'Moon',
    characterType: 'animal',
    description: 'A magical star-born creature with stardust trails and a brave heartwarming gaze.'
  },
  {
    id: 'enchanted_tree_of_life',
    title: 'Enchanted Tree of Life',
    subtitle: 'Towering blossom tree with radiant floral branches and peaceful aura',
    badge: 'Blossom Sanctuary',
    iconName: 'Flower2',
    characterType: 'tree',
    description: 'A breathtaking flowering sacred tree full of life, warmth, and serene wonder.'
  }
];

// Backwards compatibility mappings for older components
export const MOOD_OPTIONS = ART_STYLE_OPTIONS;
export const AESTHETIC_OPTIONS = ART_STYLE_OPTIONS;

export interface MotifOption {
  id: VisualMotif;
  title: string;
  description: string;
  iconName: string;
}

export const MOTIF_OPTIONS: MotifOption[] = [
  { id: 'botanicals', title: 'Deep Flora & Botanicals', description: 'Rare orchids, night ivy, ferns', iconName: 'Leaf' },
  { id: 'celestial', title: 'Cosmic & Celestial Stardust', description: 'Nebulae, moon orbits, solar halos', iconName: 'Moon' },
  { id: 'geometry', title: 'Sacred Architecture & Geometry', description: 'Golden ratios, crisp arches, portals', iconName: 'Compass' },
  { id: 'coastal', title: 'Oceanic Horizon & Waves', description: 'Deep abyss, sea foam, twilight tides', iconName: 'Waves' },
  { id: 'architectural', title: 'Modernist Sanctuary', description: 'Brutalist arches, stone steps, shadows', iconName: 'Building2' },
  { id: 'mythological', title: 'Mythic Beast & Spirit Fauna', description: 'Golden stags, phoenix feathers', iconName: 'Sparkles' },
  { id: 'mineral_crystals', title: 'Raw Mineral & Gem Veins', description: 'Geodes, obsidian shards, pyrite glow', iconName: 'Gem' },
  { id: 'whimsical_fauna', title: 'Playful Companions', description: 'Discerning cats, curious owls, foxes', iconName: 'Smile' }
];

export interface PaletteOption {
  id: PaletteChoice;
  name: string;
  colors: string[];
  vibe: string;
}

export const PALETTE_OPTIONS: PaletteOption[] = [
  { id: 'midnight_gold', name: 'Midnight Obsidian & Gold Leaf', colors: ['#0f172a', '#1e293b', '#d97706', '#fbbf24', '#fef08a'], vibe: 'Opulent, deep, high contrast' },
  { id: 'warm_terracotta', name: 'Desert Terracotta & Clay', colors: ['#7c2d12', '#9a3412', '#c2410c', '#fb923c', '#ffedd5'], vibe: 'Warm, tactile, earthy luxury' },
  { id: 'emerald_sage', name: 'Imperial Jade & Misty Sage', colors: ['#064e3b', '#065f46', '#047857', '#34d399', '#ecfdf5'], vibe: 'Restorative, botanical serenity' },
  { id: 'electric_neon', name: 'Tokyo Ultraviolet & Cyber Teal', colors: ['#4c1d95', '#701a75', '#ec4899', '#06b6d4', '#22d3ee'], vibe: 'Pulsing, futuristic brilliance' },
  { id: 'pastel_blush', name: 'Ethereal Blush & Morning Mist', colors: ['#831843', '#be185d', '#f472b6', '#fbcfe8', '#fff1f2'], vibe: 'Delicate, tender, luminous' },
  { id: 'monochrome_slate', name: 'Archival Charcoal & Clean White', colors: ['#09090b', '#27272a', '#52525b', '#a1a1aa', '#fafafa'], vibe: 'Timeless, museum-grade minimalism' }
];

export interface TextureOption {
  id: TextureMedium;
  name: string;
  tactileDescription: string;
  printFeel: string;
}

export const TEXTURE_OPTIONS: TextureOption[] = [
  { id: 'fine_watercolor', name: 'Archival Cold-Press Watercolor', tactileDescription: 'Organic pigment pooling, paper grain bleed', printFeel: 'Matte, textured, soft museum feel' },
  { id: 'oil_impasto', name: 'Textured Oil & Palette Knife', tactileDescription: 'Thick tactile brush strokes, directional light', printFeel: 'High-definition depth and gloss' },
  { id: 'ceramic_glaze', name: 'Kiln Mineral Glaze & Crackle', tactileDescription: 'Crystalline depth, high-gloss vitrified shine', printFeel: 'Glossy, vibrant, ceramic-native' },
  { id: 'gold_leaf_kintsugi', name: 'Kintsugi Fractures & Gold Veins', tactileDescription: 'Metaphysical repair lines with lustrous accents', printFeel: 'Luminous metallic visual accent' },
  { id: 'matte_lithograph', name: 'Vintage Modernist Lithograph', tactileDescription: 'Crisp linework with subtle vintage halftones', printFeel: 'Silky smooth, museum print finish' },
  { id: '3d_claymorphic', name: 'Soft Studio Clay & Ambient Occlusion', tactileDescription: 'Velvety smooth, tactile 3D curved shadows', printFeel: 'Clean, modern, touchable volume' }
];

export const PRINTIFY_PROVIDERS: PrintifyProvider[] = [
  {
    id: 'spod_usa',
    name: 'SPOD Premium Ceramics (Express)',
    location: 'California & Florida, USA',
    rating: 4.9,
    avgProductionTimeDays: 1.8,
    basePrice: 9.50,
    shippingPrice: 5.49,
    expressShippingPrice: 11.99,
    features: [
      'Sub-48h automated printing & dispatch',
      'Ultra-hardened dishwasher safe coating',
      'Fade-proof sublimation pigment',
      'Recyclable molded gift-ready packaging'
    ]
  },
  {
    id: 'district_photo',
    name: 'District Photo (Global Dispatch)',
    location: 'Maryland, USA & Germany',
    rating: 4.8,
    avgProductionTimeDays: 2.1,
    basePrice: 9.50,
    shippingPrice: 4.99,
    expressShippingPrice: 10.50,
    features: [
      'High-gloss ceramic with edge-to-edge sublimation',
      'Lead & BPA free certified food-grade',
      'Microwave and dishwasher tested to 1,500+ cycles'
    ]
  },
  {
    id: 'my_lkr_craft',
    name: 'Monster Digital (Museum Finish)',
    location: 'Georgia, USA',
    rating: 4.85,
    avgProductionTimeDays: 2.3,
    basePrice: 9.50,
    shippingPrice: 5.80,
    expressShippingPrice: 12.50,
    features: [
      'Vivid color saturation with crisp micro-contrast',
      'Heavyweight 11oz high-durability ceramic body',
      'Rigid drop-tested protective shipping crate'
    ]
  }
];

export const MOCK_CURATED_DESIGNS: Array<{
  id: string;
  title: string;
  tagline: string;
  mantra: string;
  aestheticName: string;
  artStyle: ArtStyleCategory;
  heroSubject: VisualHeroSubject;
  imageUrl: string;
  colors: string[];
  vibeScore: number;
}> = [
  {
    id: 'curated-1',
    title: 'The Starlight Anime Fox',
    tagline: 'Polished contemporary anime hero with expressive eyes',
    mantra: 'Living with superior tranquility.',
    aestheticName: 'Anime',
    artStyle: 'anime',
    heroSubject: 'valiant_animal_hero',
    imageUrl: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
    colors: ['#6366f1', '#f43f5e', '#38bdf8', '#0f172a'],
    vibeScore: 98
  },
  {
    id: 'curated-2',
    title: 'The Crisp Vector Companion',
    tagline: 'Clean bold silhouettes and solid color fills',
    mantra: 'Holding the universe in quiet contemplation.',
    aestheticName: 'Vector',
    artStyle: 'vector',
    heroSubject: 'cute_guardian_ghost',
    imageUrl: 'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
    colors: ['#0284c7', '#38bdf8', '#fb923c', '#0f172a'],
    vibeScore: 96
  },
  {
    id: 'curated-3',
    title: 'Graphite Study on Warm Ivory',
    tagline: 'Fine confident pencil outlines and controlled crosshatching',
    mantra: 'Too elevated for lukewarm energy.',
    aestheticName: 'Pencil sketch',
    artStyle: 'pencil_sketch',
    heroSubject: 'friendly_monster',
    imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80',
    colors: ['#292524', '#78716c', '#d6d3d1', '#fafaf9'],
    vibeScore: 95
  },
  {
    id: 'curated-4',
    title: 'Refined Chinese Ink & Wash Pine',
    tagline: 'Soft ink washes and mineral-pigment accents on warm xuan paper',
    mantra: 'Serenity found in harmonious balance.',
    aestheticName: 'Chinese watercolor',
    artStyle: 'chinese_watercolor',
    heroSubject: 'majestic_ancient_tree',
    imageUrl: 'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=1200&q=80',
    colors: ['#1c1917', '#991b1b', '#047857', '#fef3c7'],
    vibeScore: 99
  }
];
