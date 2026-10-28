export type ArtStyleCategory = 
  | 'anime'
  | 'vector'
  | 'pencil_sketch'
  | 'chinese_watercolor'
  | 'classic_hand_drawn'
  | 'anime_inspired'
  | '3d_animated'
  | 'cutout_flat_2d'
  | 'watercolor' 
  | 'comic_book' 
  | 'surreal' 
  | 'impressionist_storybook' 
  | 'neo_pop';

export type VisualHeroSubject =
  | 'valiant_animal_hero'
  | 'cute_guardian_ghost'
  | 'friendly_monster'
  | 'majestic_ancient_tree'
  | 'celestial_star_creature'
  | 'enchanted_tree_of_life';

// Backwards compatibility aliases
export type EnergyMood = ArtStyleCategory | string;
export type BeautyAesthetic = ArtStyleCategory | string;

export type VisualMotif = 
  | 'botanicals' 
  | 'celestial' 
  | 'geometry' 
  | 'coastal' 
  | 'architectural' 
  | 'mythological' 
  | 'mineral_crystals' 
  | 'whimsical_fauna';

export type PaletteChoice = 
  | 'midnight_gold' 
  | 'warm_terracotta' 
  | 'emerald_sage' 
  | 'electric_neon' 
  | 'pastel_blush' 
  | 'monochrome_slate' 
  | 'custom';

export type TextureMedium = 
  | 'fine_watercolor' 
  | 'oil_impasto' 
  | 'ceramic_glaze' 
  | 'gold_leaf_kintsugi' 
  | 'matte_lithograph' 
  | '3d_claymorphic';

export interface SurveyAnswers {
  artStyle: ArtStyleCategory;
  subjectWords: string; // e.g. "Brave Fluffy Fox"
  subjectDetails?: {
    adj1: string;
    adj2: string;
    noun: string;
  };
  heroSubject?: VisualHeroSubject | string;
  backgroundOption?: 'scenic' | 'transparent';
  // Compatibility fields
  energyMood?: EnergyMood;
  intensity?: number;
  aesthetic?: BeautyAesthetic;
  motifs?: VisualMotif[];
  palette?: PaletteChoice;
  customPaletteColors?: string[];
  texture?: TextureMedium;
  smugMantraOption?: 'ai_curated' | 'custom' | 'none';
  customMantra?: string;
  userVibeNote?: string;
}

export interface ColorSwatch {
  name: string;
  hex: string;
  description: string;
}

export interface MoodDimension {
  label: string;
  score: number; // 0-100
}

export interface ArtAnalysis {
  title: string;
  tagline: string;
  narrative: string;
  smugMantra: string;
  artStylePrompt: string;
  vibeKeywords: string[];
  colorPalette: ColorSwatch[];
  moodDimensions: MoodDimension[];
}

export interface CuratedDesign {
  id: string;
  createdAt: string;
  surveyAnswers: SurveyAnswers;
  analysis: ArtAnalysis;
  artworkUrl: string;
  renderedMugMockupUrl?: string;
  favorite?: boolean;
  generationError?: string | null;
  artSource?: 'ai' | 'vector' | 'fallback' | 'upload';
}

export interface PrintifyProvider {
  id: string;
  name: string;
  location: string;
  rating: number;
  avgProductionTimeDays: number;
  basePrice: number;
  shippingPrice: number;
  expressShippingPrice: number;
  features: string[];
}

export interface OrderDetails {
  designId: string;
  quantity: number;
  providerId: string;
  customerName: string;
  email: string;
  shippingAddress: {
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  customGiftNote?: string;
  includeGiftBox: boolean;
  includeCertificate: boolean;
  totalPrice: number;
}
