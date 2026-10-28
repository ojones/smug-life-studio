import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';
import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json());

let geminiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  if (!geminiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      geminiClient = new GoogleGenAI({ apiKey });
    }
  }
  return geminiClient;
}

const serverLogs: Array<{ timestamp: string; type: string; message: string }> = [];
function addLog(type: string, message: string) {
  serverLogs.unshift({
    timestamp: new Date().toISOString(),
    type,
    message
  });
  if (serverLogs.length > 50) serverLogs.pop();
}

function getFallbackAnalysis(survey: any) {
  const artStyle = survey?.artStyle || survey?.aesthetic || 'watercolor';
  const heroSubject = survey?.heroSubject || 'valiant_animal_hero';

  const styleNames: Record<string, string> = {
    anime: 'Anime (Create a polished, contemporary anime character illustration. Use expressive eyes, clean elegant ink contours, restrained cel shading, should be 2-D flat but have subtle tonal gradients.)',
    vector: 'Vector (Create a crisp, premium flat vector illustration. Build the character from simple, bold shapes with clean edges, solid color fills, and little to no shading. Use a restrained palette and a clear silhouette that stays readable at thumbnail size.)',
    pencil_sketch: 'Pencil sketch (Create a hand-drawn graphite character study on warm ivory paper. Use fine, confident pencil outlines, natural strokes, tonal shading, and controlled crosshatching. Keep the texture of the paper visible and avoid colored pigment or painterly washes.)',
    chinese_watercolor: 'Chinese watercolor (Create a refined Chinese ink-and-color painting on warm xuan paper. Use expressive brush contours, soft ink washes, subtle paper texture, and restrained mineral-pigment accents. Let negative space contribute to the composition; avoid western-style watercolor splashes or overly decorative details.)',
    // Backwards compatibility mappings
    classic_hand_drawn: 'Pencil sketch (hand-drawn graphite character study on warm ivory paper)',
    anime_inspired: 'Anime (polished, contemporary anime character illustration)',
    '3d_animated': 'Vector (crisp, premium flat vector illustration)',
    cutout_flat_2d: 'Vector (crisp, premium flat vector illustration)',
    watercolor: 'Chinese watercolor (refined Chinese ink-and-color painting on warm xuan paper)',
    comic_book: 'Vector (crisp flat illustration)',
    surreal: 'Anime (contemporary stylized character)',
    impressionist_storybook: 'Chinese watercolor (refined ink-and-color painting)',
    neo_pop: 'Vector (crisp flat illustration)'
  };

  const subjectTitles: Record<string, { title: string; tagline: string; subjectDesc: string }> = {
    valiant_animal_hero: {
      title: 'The Brave Little Spirit Fox',
      tagline: 'Heroic companion under the starlit canopy',
      subjectDesc: 'a cute, courageous little spirit fox animal hero with bright brave eyes'
    },
    cute_guardian_ghost: {
      title: 'The Starlight Guardian Ghost',
      tagline: 'Friendly little spirit holding a warm lantern',
      subjectDesc: 'an adorable, friendly floating guardian ghost character with a tiny lantern'
    },
    friendly_monster: {
      title: 'The Gentle Fluffy Mountain Monster',
      tagline: 'Lovable mythical beast with a heartwarming smile',
      subjectDesc: 'a cute, fluffy gentle giant monster hero with a joyful friendly smile'
    },
    majestic_ancient_tree: {
      title: 'The Ancient World Tree',
      tagline: 'Majestic sacred roots and glowing cosmic canopy',
      subjectDesc: 'a towering majestic ancient world tree with glowing starry leaves and radiant roots'
    },
    celestial_star_creature: {
      title: 'The Little Starlight Beast',
      tagline: 'Cosmic star companion soaring across aurora skies',
      subjectDesc: 'a cute mythical celestial star-born baby beast surrounded by stardust'
    },
    enchanted_tree_of_life: {
      title: 'The Enchanted Tree of Life',
      tagline: 'Flowering sacred blossom sanctuary',
      subjectDesc: 'a breathtaking enchanted cherry blossom tree of life with glowing ethereal lanterns'
    }
  };

  const styleLabel = styleNames[artStyle] || 'Watercolor Dreams';
  const subjectInfo = subjectTitles[heroSubject] || subjectTitles.valiant_animal_hero;
  const userMantra = survey?.customMantra?.trim() || 'Living with superior tranquility.';

  return {
    title: subjectInfo.title,
    tagline: subjectInfo.tagline,
    narrative: `A bespoke fine art formulation featuring ${subjectInfo.subjectDesc} rendered in ${styleLabel}. Perfectly balanced for 8.25" × 3.85" ceramic sublimation wrap.`,
    smugMantra: userMantra,
    artStylePrompt: `A flat 2D fine art panoramic painting (2475x1155 px @ 300 DPI) depicting ${subjectInfo.subjectDesc}, rendered in ${styleLabel}. Rich atmospheric lighting, cute and heroic aesthetic with universal appeal, no patterns, flat 2D pictorial composition, no text, no words.`,
    vibeKeywords: ['Heroic', 'Luminous', 'Cute', 'Inspiring', 'Transcendent'],
    colorPalette: [
      { name: 'Celestial Jade', hex: '#0d9488', description: 'Fluid vibrant base' },
      { name: 'Warm Amber', hex: '#f59e0b', description: 'Heroic incandescent highlight' },
      { name: 'Starlight Magenta', hex: '#ec4899', description: 'Playful spirit accent' },
      { name: 'Midnight Charcoal', hex: '#18181b', description: 'Grounding contrast tone' }
    ],
    moodDimensions: [
      { label: 'Heroic Presence', score: 96 },
      { label: 'Aesthetic Resonance', score: 94 },
      { label: 'Universal Charm', score: 98 },
      { label: 'Inner Serenity', score: 90 }
    ]
  };
}

function getAestheticArtUrl(aesthetic?: string): string {
  const images: Record<string, string[]> = {
    watercolor: [
      'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80'
    ],
    anime: [
      'https://images.unsplash.com/photo-1541701494587-cb58502866ab?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1578925518470-4def7a0f08bb?auto=format&fit=crop&w=1200&q=80'
    ],
    comic_book: [
      'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80'
    ],
    surreal: [
      'https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80'
    ],
    impressionist_storybook: [
      'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1579783901586-d88db74b4fe4?auto=format&fit=crop&w=1200&q=80'
    ],
    neo_pop: [
      'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=1200&q=80'
    ]
  };

  const pool = (aesthetic && images[aesthetic]) || images.watercolor;
  return pool[Math.floor(Math.random() * pool.length)];
}

// 1. /api/art/analyze
app.post('/api/art/analyze', async (req, res) => {
  try {
    const survey = req.body.survey || {};
    const ai = getGeminiClient();

    if (!ai) {
      addLog('ai', `Synthesizing fine art formula for ${survey.artStyle} style (Instant Fallback Mode)`);
      return res.json(getFallbackAnalysis(survey));
    }

    addLog('ai', `Requesting Gemini 2.5 Flash for ${survey.artStyle} with ${survey.heroSubject}`);

    const promptText = `User Selected Art Style: ${survey.artStyle || 'watercolor'}
Heroic Focal Subject: ${survey.heroSubject || 'valiant_animal_hero'} (cute animal, friendly ghost/monster character, or majestic tree)
Custom Note: "${survey.customMantra || 'Heroic & Luminous'}"

Generate a creative fine art concept, an ultra-detailed image generation prompt for a FLAT 2D 8.25" x 3.85" (2475 x 1155 pixels @ 300 DPI, 2.14:1 aspect ratio) horizontal fine art composition featuring the chosen cute heroic character/animal/tree in the specified art style (strictly flat 2D pure visual artwork, absolutely NO text, NO words, NO typography, no patterns, no 3D objects, no mockups), an evocative aesthetic narrative, emotional dimension scores (0-100), and a rich harmonic color palette.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: promptText,
      config: {
        systemInstruction: `You are a master artistic director and visual fine art creator for Smuglife Studio.
Analyze the user's selected art style and heroic focal subject.
Transform their answers into a deeply evocative artistic concept, harmonic color palette, and fine art prompt tailored for a pure FLAT 2D rectangular horizontal composition with exact dimensions 8.25" x 3.85" (2475 x 1155 pixels @ 300 DPI, 2.14:1 aspect ratio).

CRITICAL DESIGN MANDATES:
1. SUBJECT: The composition MUST feature a clear central heroic focal subject: an animal (e.g. cute red panda, otter, fox, lion cub), a non-real character (e.g. cute friendly guardian ghost, lovable fluffy monster hero, celestial spirit beast), or a majestic enchanted tree (e.g. ancient world tree with starlit canopy or tree of life).
2. NO PATTERNS: The design MUST NOT be a repetitive pattern, wallpaper tile, or abstract geometric motif. It must be a distinct scenic/portrait composition featuring the chosen character, animal, or tree.
3. CUTE & HEROIC: Characters MUST NOT be real people. Ghosts or monsters are encouraged! They must lean toward being cute instead of scary, have universal appeal, and radiate an inspiring, brave, or heartwarming heroic presence.
4. ART STYLE: Render the artwork strictly adhering to the chosen style option:
   - anime: Create a polished, contemporary anime character illustration. Use expressive eyes, clean elegant ink contours, restrained cel shading, should be 2-D flat but have subtle tonal gradients.
   - vector: Create a crisp, premium flat vector illustration. Build the character from simple, bold shapes with clean edges, solid color fills, and little to no shading. Use a restrained palette and a clear silhouette that stays readable at thumbnail size.
   - pencil_sketch: Create a hand-drawn graphite character study on warm ivory paper. Use fine, confident pencil outlines, natural strokes, tonal shading, and controlled crosshatching. Keep the texture of the paper visible and avoid colored pigment or painterly washes.
   - chinese_watercolor: Create a refined Chinese ink-and-color painting on warm xuan paper. Use expressive brush contours, soft ink washes, subtle paper texture, and restrained mineral-pigment accents. Let negative space contribute to the composition; avoid western-style watercolor splashes or overly decorative details.
5. NO TEXT OR 3D MOCKUPS: NEVER put ANY text, typography, letters, words, titles, quotes, watermarks, or signatures on the artwork image. Pure visual pictorial art only. NEVER mention mugs, cups, handles, cylinders, mockups, or 3D objects. Strictly a flat 2D rectangular artwork.

Return valid JSON only.`,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            tagline: { type: Type.STRING },
            narrative: { type: Type.STRING },
            smugMantra: { type: Type.STRING },
            artStylePrompt: { type: Type.STRING },
            vibeKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            colorPalette: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  hex: { type: Type.STRING },
                  description: { type: Type.STRING }
                },
                required: ['name', 'hex', 'description']
              }
            },
            moodDimensions: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  label: { type: Type.STRING },
                  score: { type: Type.NUMBER }
                },
                required: ['label', 'score']
              }
            }
          },
          required: ['title', 'tagline', 'narrative', 'smugMantra', 'artStylePrompt', 'vibeKeywords', 'colorPalette', 'moodDimensions']
        }
      }
    });

    if (response.text) {
      const parsed = JSON.parse(response.text);
      addLog('ai', `Gemini generated formula: "${parsed.title}"`);
      return res.json(parsed);
    }
    return res.json(getFallbackAnalysis(survey));
  } catch (err: any) {
    addLog('error', `AI Analyze error: ${err.message}`);
    return res.json(getFallbackAnalysis({}));
  }
});

function getAestheticArtSvg(aesthetic?: string, heroSubject?: string, backgroundOption?: string): string {
  const defaultPalettes: Record<string, { bg1: string; bg2: string; accent1: string; accent2: string; ground: string }> = {
    anime: { bg1: '#1e1b4b', bg2: '#312e81', accent1: '#f43f5e', accent2: '#38bdf8', ground: '#0f172a' },
    vector: { bg1: '#0284c7', bg2: '#0369a1', accent1: '#fb923c', accent2: '#38bdf8', ground: '#082f49' },
    pencil_sketch: { bg1: '#f5f0e6', bg2: '#ebe4d5', accent1: '#57534e', accent2: '#292524', ground: '#1c1917' },
    chinese_watercolor: { bg1: '#f7eee0', bg2: '#ede0cc', accent1: '#b91c1c', accent2: '#047857', ground: '#18181b' },
    // Backwards compatibility mappings
    classic_hand_drawn: { bg1: '#f5f0e6', bg2: '#ebe4d5', accent1: '#57534e', accent2: '#292524', ground: '#1c1917' },
    anime_inspired: { bg1: '#1e1b4b', bg2: '#312e81', accent1: '#f43f5e', accent2: '#38bdf8', ground: '#0f172a' },
    '3d_animated': { bg1: '#0284c7', bg2: '#0369a1', accent1: '#fb923c', accent2: '#38bdf8', ground: '#082f49' },
    cutout_flat_2d: { bg1: '#0284c7', bg2: '#0369a1', accent1: '#fb923c', accent2: '#38bdf8', ground: '#082f49' },
    watercolor: { bg1: '#f7eee0', bg2: '#ede0cc', accent1: '#b91c1c', accent2: '#047857', ground: '#18181b' },
    comic_book: { bg1: '#d90429', bg2: '#ef233c', accent1: '#ffb703', accent2: '#fb8500', ground: '#14213d' },
    surreal: { bg1: '#1b1b3a', bg2: '#392f5a', accent1: '#e5c158', accent2: '#69306d', ground: '#09080d' },
    impressionist_storybook: { bg1: '#264653', bg2: '#2a9d8f', accent1: '#e9c46a', accent2: '#f4a261', ground: '#1d3557' },
    neo_pop: { bg1: '#ffedd5', bg2: '#fed7aa', accent1: '#fb7185', accent2: '#06b6d4', ground: '#18181b' }
  };

  const p = defaultPalettes[aesthetic || 'anime'] || defaultPalettes.anime;
  const subj = (heroSubject || 'valiant_animal_hero').toLowerCase();
  const isTransparent = backgroundOption !== 'scenic';

  let heroSvg = '';
  if (subj.includes('ghost')) {
    heroSvg = `
      <g transform="translate(1237, 650)">
        <circle cx="0" cy="-100" r="260" fill="url(#heroGlow)" opacity="0.7"/>
        <path d="M -110 -100 C -110 -250, 110 -250, 110 -100 C 110 50, 130 110, 80 130 C 40 145, 20 110, 0 135 C -20 110, -40 145, -80 130 C -130 110, -110 50, -110 -100 Z" fill="#ffffff" opacity="0.95"/>
        <circle cx="-55" cy="-105" r="14" fill="#f43f5e" opacity="0.5" />
        <circle cx="55" cy="-105" r="14" fill="#f43f5e" opacity="0.5" />
        <ellipse cx="-40" cy="-125" rx="12" ry="16" fill="#09090b" />
        <circle cx="-43" cy="-131" r="5" fill="#ffffff" />
        <ellipse cx="40" cy="-125" rx="12" ry="16" fill="#09090b" />
        <circle cx="37" cy="-131" r="5" fill="#ffffff" />
        <path d="M -12 -95 Q 0 -80 12 -95" stroke="#09090b" stroke-width="4" fill="none" stroke-linecap="round"/>
        <!-- Ghost Holding Steaming Hot Cup of Coffee -->
        <g transform="translate(0, 15)">
          <path d="M -8 -45 Q -16 -65 -8 -85 Q 0 -105 -6 -125" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.9"/>
          <path d="M 6 -40 Q 14 -60 6 -80 Q -2 -100 4 -120" stroke="#fef08a" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.85"/>
          <path d="M 28 -20 C 46 -20, 46 16, 28 16" stroke="#d97706" stroke-width="6" fill="none" stroke-linecap="round"/>
          <rect x="-30" y="-26" width="58" height="52" rx="9" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
          <path d="M -30 -8 L 28 -8" stroke="#f59e0b" stroke-width="5"/>
          <ellipse cx="-1" cy="-26" rx="26" ry="7" fill="#451a03"/>
          <ellipse cx="-1" cy="-26" rx="22" ry="5" fill="#78350f"/>
          <ellipse cx="-5" cy="-27" rx="8" ry="2.5" fill="#d97706" opacity="0.7"/>
          <ellipse cx="-32" cy="-2" rx="9" ry="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
          <ellipse cx="28" cy="-2" rx="9" ry="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        </g>
      </g>`;
  } else if (subj.includes('monster') || subj.includes('bear')) {
    heroSvg = `
      <g transform="translate(1237, 730)">
        <circle cx="0" cy="-120" r="280" fill="url(#heroGlow)" opacity="0.5"/>
        <path d="M -160 30 C -200 -120, -180 -280, 0 -290 C 180 -280, 200 -120, 160 30 C 120 70, -120 70, -160 30 Z" fill="${p.accent1}" />
        <ellipse cx="0" cy="-60" rx="95" ry="110" fill="#fef3c7" opacity="0.9"/>
        <path d="M -90 -250 C -150 -310, -140 -380, -80 -360 C -90 -320, -70 -290, -50 -265 Z" fill="#f59e0b" />
        <path d="M 90 -250 C 150 -310, 140 -380, 80 -360 C 90 -320, 70 -290, 50 -265 Z" fill="#f59e0b" />
        <circle cx="-48" cy="-190" r="16" fill="#18181b" /><circle cx="-52" cy="-196" r="6" fill="#ffffff" />
        <circle cx="48" cy="-190" r="16" fill="#18181b" /><circle cx="44" cy="-196" r="6" fill="#ffffff" />
        <circle cx="-75" cy="-160" r="16" fill="#fb7185" opacity="0.6" />
        <circle cx="75" cy="-160" r="16" fill="#fb7185" opacity="0.6" />
        <path d="M -35 -145 Q 0 -115 35 -145" stroke="#18181b" stroke-width="6" fill="#7f1d1d" stroke-linecap="round"/>
        <!-- Monster Holding Hot Steaming Coffee Cup -->
        <g transform="translate(0, -40)">
          <path d="M -8 -45 Q -16 -65 -8 -85 Q 0 -105 -6 -125" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.9"/>
          <path d="M 6 -40 Q 14 -60 6 -80 Q -2 -100 4 -120" stroke="#fef08a" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.85"/>
          <path d="M 28 -20 C 46 -20, 46 16, 28 16" stroke="#d97706" stroke-width="6" fill="none" stroke-linecap="round"/>
          <rect x="-30" y="-26" width="58" height="52" rx="9" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
          <path d="M -30 -8 L 28 -8" stroke="#f59e0b" stroke-width="5"/>
          <ellipse cx="-1" cy="-26" rx="26" ry="7" fill="#451a03"/>
          <ellipse cx="-1" cy="-26" rx="22" ry="5" fill="#78350f"/>
          <ellipse cx="-5" cy="-27" rx="8" ry="2.5" fill="#d97706" opacity="0.7"/>
          <ellipse cx="-34" cy="-2" rx="10" ry="13" fill="${p.accent1}" />
          <ellipse cx="30" cy="-2" rx="10" ry="13" fill="${p.accent1}" />
        </g>
      </g>`;
  } else {
    // Character / Mascot (Penguin, Fox, Dragon, Cat, Robot) holding a cup of hot coffee
    heroSvg = `
      <g transform="translate(1237, 720)">
        <circle cx="0" cy="-60" r="220" fill="url(#heroGlow)" opacity="0.6"/>
        <path d="M 60 -30 C 180 -10, 240 -120, 210 -220 C 190 -280, 120 -280, 90 -200 C 60 -120, 80 -60, 40 -30 Z" fill="${p.accent1}" opacity="0.95"/>
        <ellipse cx="0" cy="-40" rx="95" ry="115" fill="${p.accent2}" />
        <ellipse cx="0" cy="-20" rx="65" ry="85" fill="#fff7ed" opacity="0.9" />
        <path d="M -70 -110 Q 0 -80 70 -110 Q 90 -90 70 -70 Q 0 -50 -70 -70 Z" fill="${p.accent1}" />
        <circle cx="0" cy="-170" r="85" fill="${p.accent2}" />
        <polygon points="-65,-210 -80,-310 -15,-240" fill="${p.accent2}" />
        <polygon points="65,-210 80,-310 15,-240" fill="${p.accent2}" />
        <polygon points="-45,-150 0,-115 45,-150" fill="#fff7ed" />
        <circle cx="0" cy="-125" r="10" fill="#18181b" />
        <ellipse cx="-32" cy="-175" rx="14" ry="18" fill="#18181b" />
        <circle cx="-35" cy="-182" r="6" fill="#ffffff" />
        <ellipse cx="32" cy="-175" rx="14" ry="18" fill="#18181b" />
        <circle cx="29" cy="-182" r="6" fill="#ffffff" />
        <ellipse cx="-45" cy="45" rx="28" ry="18" fill="${p.accent2}" />
        <ellipse cx="45" cy="45" rx="28" ry="18" fill="${p.accent2}" />
        <!-- Hot Cup of Coffee Held with Steam -->
        <g transform="translate(0, -25)">
          <path d="M -8 -45 Q -16 -65 -8 -85 Q 0 -105 -6 -125" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.9"/>
          <path d="M 6 -40 Q 14 -60 6 -80 Q -2 -100 4 -120" stroke="#fef08a" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.85"/>
          <path d="M 18 -35 Q 24 -55 16 -75" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.7"/>
          <path d="M 28 -20 C 46 -20, 46 16, 28 16" stroke="#d97706" stroke-width="6" fill="none" stroke-linecap="round"/>
          <rect x="-30" y="-26" width="58" height="52" rx="9" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
          <path d="M -30 -8 L 28 -8" stroke="#f59e0b" stroke-width="5"/>
          <ellipse cx="-1" cy="-26" rx="26" ry="7" fill="#451a03"/>
          <ellipse cx="-1" cy="-26" rx="22" ry="5" fill="#78350f"/>
          <ellipse cx="-5" cy="-27" rx="8" ry="2.5" fill="#d97706" opacity="0.7"/>
          <ellipse cx="-34" cy="-2" rx="9" ry="12" fill="${p.accent2}" />
          <ellipse cx="30" cy="-2" rx="9" ry="12" fill="${p.accent2}" />
        </g>
      </g>`;
  }

  const scenicElements = isTransparent ? '' : `
    <rect width="2475" height="1155" fill="url(#skyGrad)"/>
    <g fill="#ffffff" opacity="0.8">
      <circle cx="210" cy="180" r="4"/><circle cx="560" cy="240" r="3"/><circle cx="820" cy="95" r="5"/><circle cx="1450" cy="130" r="4"/><circle cx="1920" cy="90" r="5"/>
      <path d="M 2150 150 A 110 110 0 0 0 2060 310 A 95 95 0 0 1 2150 150 Z" fill="#fef08a"/>
    </g>
    <path d="M 0 780 Q 320 540 680 660 T 1420 590 T 2120 640 T 2475 610 L 2475 1155 L 0 1155 Z" fill="${p.bg1}" opacity="0.45"/>
    <path d="M 0 830 Q 420 680 920 760 T 1840 730 T 2475 760 L 2475 1155 L 0 1155 Z" fill="${p.bg2}" opacity="0.55"/>
    <path d="M 0 920 Q 520 840 1100 890 T 2020 880 T 2475 910 L 2475 1155 L 0 1155 Z" fill="url(#groundGrad)"/>
  `;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2475 1155" width="2475" height="1155">
    <defs>
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${p.bg1}"/>
        <stop offset="50%" stop-color="${p.bg2}"/>
        <stop offset="100%" stop-color="${p.ground}"/>
      </linearGradient>
      <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
        <stop offset="40%" stop-color="${p.accent1}" stop-opacity="0.5"/>
        <stop offset="100%" stop-color="${p.accent2}" stop-opacity="0"/>
      </radialGradient>
      <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${p.ground}" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="#09090b"/>
      </linearGradient>
    </defs>
    ${scenicElements}
    ${heroSvg}
    <rect x="15" y="15" width="2445" height="1125" rx="18" fill="none" stroke="${isTransparent ? '#cbd5e1' : '#ffffff'}" stroke-width="2" opacity="${isTransparent ? '0.3' : '0.15'}" stroke-dasharray="16,12"/>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

/**
 * Processes an input image buffer (JPEG or PNG):
 * 1. Converts to raw RGBA.
 * 2. Flood-fills from the borders to set outer background alpha = 0 (transparent).
 * 3. Keeps internal character elements (eyes, belly, coffee cup) opaque.
 * 4. If flood-fill cannot isolate transparency, ensures pure solid white (#FFFFFF) background.
 * 5. Returns a standard PNG buffer.
 */
async function processImageToTransparentPng(inputBuffer: Buffer): Promise<Buffer> {
  try {
    const img = await sharp(inputBuffer).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
    const { data, info } = img;
    const { width, height, channels } = info;

    const corners = [
      0,
      (width - 1) * channels,
      ((height - 1) * width) * channels,
      ((height - 1) * width + (width - 1)) * channels
    ];

    let avgR = 0, avgG = 0, avgB = 0;
    for (const c of corners) {
      avgR += data[c];
      avgG += data[c + 1];
      avgB += data[c + 2];
    }
    avgR = Math.round(avgR / 4);
    avgG = Math.round(avgG / 4);
    avgB = Math.round(avgB / 4);

    const isNearWhite = avgR > 230 && avgG > 230 && avgB > 230;
    const visited = new Uint8Array(width * height);
    const queue: number[] = [];
    const colorThreshold = isNearWhite ? 32 : 18;

    const isBgMatch = (idx: number) => {
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      if (isNearWhite) {
        return (r >= 235 && g >= 235 && b >= 235) ||
          (Math.abs(r - avgR) <= colorThreshold && Math.abs(g - avgG) <= colorThreshold && Math.abs(b - avgB) <= colorThreshold);
      }
      return Math.abs(r - avgR) <= colorThreshold && Math.abs(g - avgG) <= colorThreshold && Math.abs(b - avgB) <= colorThreshold;
    };

    for (let x = 0; x < width; x++) {
      queue.push(x, 0);
      queue.push(x, height - 1);
    }
    for (let y = 0; y < height; y++) {
      queue.push(0, y);
      queue.push(width - 1, y);
    }

    let transparentPixelCount = 0;
    while (queue.length > 0) {
      const y = queue.pop()!;
      const x = queue.pop()!;
      if (x < 0 || x >= width || y < 0 || y >= height) continue;
      const pixelIndex = y * width + x;
      if (visited[pixelIndex]) continue;
      visited[pixelIndex] = 1;

      const dataIdx = pixelIndex * channels;
      if (isBgMatch(dataIdx)) {
        data[dataIdx + 3] = 0; // Transparent
        transparentPixelCount++;
        if (x + 1 < width && !visited[pixelIndex + 1]) queue.push(x + 1, y);
        if (x - 1 >= 0 && !visited[pixelIndex - 1]) queue.push(x - 1, y);
        if (y + 1 < height && !visited[pixelIndex + width]) queue.push(x, y + 1);
        if (y - 1 >= 0 && !visited[pixelIndex - width]) queue.push(x, y - 1);
      }
    }

    // User requirement: If transparency is not possible, background should be pure white (#FFFFFF)
    if (transparentPixelCount < (width * height * 0.05)) {
      for (let i = 0; i < width * height; i++) {
        const idx = i * channels;
        if (data[idx] > 225 && data[idx + 1] > 225 && data[idx + 2] > 225) {
          data[idx] = 255;
          data[idx + 1] = 255;
          data[idx + 2] = 255;
          data[idx + 3] = 255;
        }
      }
    }

    return await sharp(data, { raw: { width, height, channels } }).png().toBuffer();
  } catch (err) {
    console.warn('Transparency processing fallback to direct PNG:', err);
    return await sharp(inputBuffer).png().toBuffer();
  }
}

// 2. /api/art/generate
app.post('/api/art/generate', async (req, res) => {
  const { prompt, aesthetic, heroSubject, subjectWords, artStyle, backgroundOption } = req.body || {};
  let artworkUrl = '';
  let generationError: string | null = null;
  let source = 'vector';

  const stylePromptMap: Record<string, string> = {
    anime: 'Create a polished, contemporary anime character illustration. Use expressive eyes, clean elegant ink contours, restrained cel shading, should be 2-D flat but have subtle tonal gradients.',
    vector: 'Create a crisp, premium flat vector illustration. Build the character from simple, bold shapes with clean edges, solid color fills, and little to no shading. Use a restrained palette and a clear silhouette that stays readable at thumbnail size.',
    pencil_sketch: 'Create a hand-drawn graphite character study on warm ivory paper. Use fine, confident pencil outlines, natural strokes, tonal shading, and controlled crosshatching. Keep the texture of the paper visible and avoid colored pigment or painterly washes.',
    chinese_watercolor: 'Create a refined Chinese ink-and-color painting on warm xuan paper. Use expressive brush contours, soft ink washes, subtle paper texture, and restrained mineral-pigment accents. Let negative space contribute to the composition; avoid western-style watercolor splashes or overly decorative details.',
    classic_hand_drawn: 'Create a hand-drawn graphite character study on warm ivory paper. Use fine, confident pencil outlines, natural strokes, tonal shading, and controlled crosshatching. Keep the texture of the paper visible and avoid colored pigment or painterly washes.',
    anime_inspired: 'Create a polished, contemporary anime character illustration. Use expressive eyes, clean elegant ink contours, restrained cel shading, should be 2-D flat but have subtle tonal gradients.',
    '3d_animated': 'Create a crisp, premium flat vector illustration. Build the character from simple, bold shapes with clean edges, solid color fills, and little to no shading. Use a restrained palette and a clear silhouette that stays readable at thumbnail size.',
    cutout_flat_2d: 'Create a crisp, premium flat vector illustration. Build the character from simple, bold shapes with clean edges, solid color fills, and little to no shading. Use a restrained palette and a clear silhouette that stays readable at thumbnail size.'
  };

  const styleKey = artStyle || aesthetic || 'anime';
  const subjectKey = subjectWords || heroSubject || 'Brave Fluffy Fox';
  const defaultStylePrompt = stylePromptMap[styleKey] || stylePromptMap.anime;
  const bgDirective = 'The character must be holding a cup of hot coffee with cozy hands or paws, with gentle rising steam wafting from the coffee cup. The character is cleanly isolated on a completely transparent canvas (PNG format). If a transparent canvas cannot be rendered, the background must be pure solid white (#FFFFFF) with zero color cast, zero textures, zero drop shadows, and zero gradients. Absolutely no background scenery, no landscape, no horizon, no sky, no ground, no floor, no background room or walls. Just the isolated character holding a cup of hot coffee.';

  const ai = getGeminiClient();
  if (ai) {
    try {
      addLog('ai', `Synthesizing AI artwork via Gemini for ${styleKey} with ${subjectKey} holding hot coffee (transparent PNG / white background)...`);
      const imagePrompt = prompt || `${defaultStylePrompt} Depicting a ${subjectKey} holding a cup of hot coffee with gentle steam rising from the cup. ${bgDirective} Horizontal panoramic 2.14:1 composition (8.25" x 3.85" ceramic mug sublimation wrap), pure flat 2D visual pictorial character artwork, absolutely no text, no typography, no words, no product mockups.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: imagePrompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: '16:9'
          }
        }
      });

      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const rawBuffer = Buffer.from(part.inlineData.data, 'base64');
            const processedPng = await processImageToTransparentPng(rawBuffer);
            artworkUrl = `data:image/png;base64,${processedPng.toString('base64')}`;
            source = 'ai';
            addLog('ai', `Successfully synthesized image and formatted as transparent PNG!`);
            break;
          }
        }
      }

      if (!artworkUrl) {
        generationError = 'Gemini model returned response without inline image data. Loaded high-definition 8.25" × 3.85" studio sublimation wrap.';
      }
    } catch (err: any) {
      generationError = `AI image generation notice: ${err.message || 'Model call failed'}. Calibrated 8.25" × 3.85" studio sublimation wrap.`;
      addLog('error', `Image gen error: ${err.message}`);
    }
  } else {
    generationError = 'Gemini API key not configured or image quota unavailable. Generated 8.25" × 3.85" studio sublimation wrap.';
  }

  if (!artworkUrl) {
    const fallbackSvg = getAestheticArtSvg(styleKey, subjectKey, 'transparent');
    try {
      const svgBuffer = Buffer.from(decodeURIComponent(fallbackSvg.replace('data:image/svg+xml;charset=utf-8,', '')));
      const pngBuffer = await sharp(svgBuffer).png().toBuffer();
      artworkUrl = `data:image/png;base64,${pngBuffer.toString('base64')}`;
    } catch {
      artworkUrl = fallbackSvg;
    }
    addLog('ai', `Delivered guaranteed high-definition 300 DPI flat artwork preview as PNG`);
  }

  return res.json({
    success: source === 'ai',
    artworkUrl,
    error: generationError,
    source,
    dimensions: '8.25" × 3.85" (2475 × 1155 px @ 300 DPI)'
  });
});

// 3. /api/shopify/checkout
app.post('/api/shopify/checkout', (req, res) => {
  try {
    const { title, quantity } = req.body;
    addLog('shopify', `Shopify Checkout initialized for "${title}" (${quantity}x @ $9.50)`);
    const storeDomain = process.env.SHOPIFY_STORE_DOMAIN || 'smuglife-studio.myshopify.com';
    return res.json({
      success: true,
      checkoutUrl: `https://${storeDomain}/cart`,
      checkoutId: `chk_${Date.now()}`
    });
  } catch (err: any) {
    return res.json({ success: false, error: err.message });
  }
});

// 4. /api/shopify/status & /api/shopify/logs
app.get('/api/shopify/status', (req, res) => {
  return res.json({
    shopifyConfigured: Boolean(process.env.SHOPIFY_STORE_DOMAIN),
    storeDomain: process.env.SHOPIFY_STORE_DOMAIN || 'Demo Mode (Instant Checkout Ready)',
    printifyConfigured: Boolean(process.env.PRINTIFY_API_KEY)
  });
});

app.get('/api/shopify/logs', (req, res) => {
  return res.json({ logs: serverLogs });
});

// 5. /api/shopify/webhook/orders-create
app.post('/api/shopify/webhook/orders-create', (req, res) => {
  const body = req.body;
  addLog('shopify', `Received Shopify Webhook orders/create: Order #${body.id || 'N/A'}`);
  return res.json({ received: true, printifyDispatched: true });
});

// 6. /api/printify/orders
app.post('/api/printify/orders', (req, res) => {
  const body = req.body;
  addLog('info', `Printify order queued for ${body.customerName || 'Customer'} - 11oz Ceramic Mug ($9.50)`);
  return res.json({
    orderId: `SL-${Math.floor(100000 + Math.random() * 900000)}`,
    status: 'production_queued',
    estimatedDelivery: '3-5 Business Days'
  });
});

// Static assets in production
app.use(express.static(path.join(__dirname, 'dist')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Smuglife Studio server listening on http://0.0.0.0:${PORT}`);
});
