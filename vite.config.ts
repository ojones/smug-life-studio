import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { GoogleGenAI, Type } from '@google/genai';

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
  const artStyle = survey?.artStyle || survey?.aesthetic || 'classic_hand_drawn';
  const heroSubject = survey?.heroSubject || survey?.subjectWords || 'Brave Fluffy Fox';

  const styleNames: Record<string, string> = {
    classic_hand_drawn: 'Classic Hand-Drawn Animation Style (expressive fluid linework, rubber-hose charm, vintage Disney / Looney Tunes nostalgic feel)',
    anime_inspired: 'Anime-Inspired Animation Style (bold expressions, dramatic poses, stylized luminous eyes, dynamic anime aesthetic)',
    '3d_animated': '3D Animated Film Style (rounded forms, dimensional lighting, polished lifelike Pixar / Illumination CGI feel)',
    cutout_flat_2d: 'Cutout / Flat 2D Animation Style (simple geometric shapes, clean bold outlines, limited shading, Powerpuff Girls / South Park feel)',
    watercolor: 'Classic Hand-Drawn Animation Style',
    anime: 'Anime-Inspired Animation Style',
    comic_book: 'Cutout / Flat 2D Animation Style',
    surreal: '3D Animated Film Style',
    impressionist_storybook: 'Classic Hand-Drawn Animation Style',
    neo_pop: 'Cutout / Flat 2D Animation Style'
  };

  const styleLabel = styleNames[artStyle] || 'Classic Hand-Drawn Animation Style';
  const userMantra = survey?.customMantra?.trim() || 'Living with superior tranquility.';

  return {
    title: `The ${heroSubject}`,
    tagline: `Heroic cartoon companion in ${styleLabel}`,
    narrative: `A bespoke cartoon animation panorama featuring ${heroSubject} rendered in ${styleLabel}. Perfectly balanced for 8.25" × 3.85" ceramic sublimation wrap with zero typography.`,
    smugMantra: userMantra,
    artStylePrompt: `A flat 2D cartoon panoramic illustration (2475x1155 px @ 300 DPI) depicting ${heroSubject}, rendered in ${styleLabel}. Expressive character animation aesthetic, clean vibrant colors, pure pictorial artwork, no text, no words, no 3D objects.`,
    vibeKeywords: ['Heroic', 'Expressive', 'Vibrant', 'Nostalgic', 'Harmonic'],
    colorPalette: [
      { name: 'Animated Ochre', hex: '#d97706', description: 'Fluid vibrant accent' },
      { name: 'Vintage Cream', hex: '#fef3c7', description: 'Nostalgic parchment tone' },
      { name: 'Celestial Indigo', hex: '#4338ca', description: 'Dynamic contrast shade' },
      { name: 'Ink Noir', hex: '#18181b', description: 'Bold contour foundation' }
    ],
    moodDimensions: [
      { label: 'Character Charm', score: 98 },
      { label: 'Animation Fluidity', score: 95 },
      { label: 'Sublimation Balance', score: 96 },
      { label: 'Visual Joy', score: 94 }
    ]
  };
}

function getAestheticArtSvg(aesthetic?: string, heroSubject?: string): string {
  const defaultPalettes: Record<string, { bg1: string; bg2: string; accent1: string; accent2: string; ground: string }> = {
    classic_hand_drawn: { bg1: '#292524', bg2: '#e7e0d3', accent1: '#d97706', accent2: '#1c1917', ground: '#1c1917' },
    anime_inspired: { bg1: '#1e1b4b', bg2: '#4338ca', accent1: '#f43f5e', accent2: '#38bdf8', ground: '#0f172a' },
    '3d_animated': { bg1: '#075985', bg2: '#38bdf8', accent1: '#fb923c', accent2: '#0284c7', ground: '#0c4a6e' },
    cutout_flat_2d: { bg1: '#ffedd5', bg2: '#fed7aa', accent1: '#fb7185', accent2: '#06b6d4', ground: '#18181b' },
    watercolor: { bg1: '#292524', bg2: '#e7e0d3', accent1: '#d97706', accent2: '#1c1917', ground: '#1c1917' },
    anime: { bg1: '#1e1b4b', bg2: '#4338ca', accent1: '#f43f5e', accent2: '#38bdf8', ground: '#0f172a' },
    comic_book: { bg1: '#d90429', bg2: '#ef233c', accent1: '#ffb703', accent2: '#fb8500', ground: '#14213d' },
    surreal: { bg1: '#075985', bg2: '#38bdf8', accent1: '#fb923c', accent2: '#0284c7', ground: '#0c4a6e' },
    impressionist_storybook: { bg1: '#264653', bg2: '#2a9d8f', accent1: '#e9c46a', accent2: '#f4a261', ground: '#1d3557' },
    neo_pop: { bg1: '#ffedd5', bg2: '#fed7aa', accent1: '#fb7185', accent2: '#06b6d4', ground: '#18181b' }
  };

  const p = defaultPalettes[aesthetic || 'classic_hand_drawn'] || defaultPalettes.classic_hand_drawn;
  const subj = (heroSubject || 'valiant_animal_hero').toLowerCase();

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
        <path d="M 80 -80 Q 140 -50 150 -10" stroke="#ffffff" stroke-width="20" stroke-linecap="round" fill="none"/>
        <line x1="150" y1="-10" x2="150" y2="40" stroke="#fbbf24" stroke-width="4"/>
        <polygon points="125,40 175,40 165,95 135,95" fill="#d97706" />
        <circle cx="150" cy="65" r="50" fill="url(#heroGlow)" />
        <circle cx="150" cy="65" r="12" fill="#ffffff" />
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
      </g>`;
  } else if (subj.includes('tree')) {
    heroSvg = `
      <g transform="translate(1237, 850)">
        <ellipse cx="0" cy="-450" rx="420" ry="290" fill="url(#heroGlow)" opacity="0.85"/>
        <path d="M -110 20 C -90 -200, -180 -320, -220 -440 C -120 -360, -60 -260, -30 -220 C -20 -340, -100 -460, -130 -560 C -40 -460, 0 -360, 0 -260 C 0 -360, 40 -460, 130 -560 C 100 -460, 20 -340, 30 -220 C 60 -260, 120 -360, 220 -440 C 180 -320, 90 -200, 110 20 Z" fill="#1c1917" />
        <circle cx="-160" cy="-480" r="170" fill="${p.accent1}" opacity="0.88" />
        <circle cx="160" cy="-480" r="170" fill="${p.accent1}" opacity="0.88" />
        <circle cx="0" cy="-560" r="210" fill="${p.accent2}" opacity="0.92" />
        <circle cx="0" cy="-380" r="18" fill="#fef08a" />
      </g>`;
  } else {
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
      </g>`;
  }

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
    <rect width="2475" height="1155" fill="url(#skyGrad)"/>
    <g fill="#ffffff" opacity="0.8">
      <circle cx="210" cy="180" r="4"/><circle cx="560" cy="240" r="3"/><circle cx="820" cy="95" r="5"/><circle cx="1450" cy="130" r="4"/><circle cx="1920" cy="90" r="5"/>
      <path d="M 2150 150 A 110 110 0 0 0 2060 310 A 95 95 0 0 1 2150 150 Z" fill="#fef08a"/>
    </g>
    <path d="M 0 780 Q 320 540 680 660 T 1420 590 T 2120 640 T 2475 610 L 2475 1155 L 0 1155 Z" fill="${p.bg1}" opacity="0.45"/>
    <path d="M 0 830 Q 420 680 920 760 T 1840 730 T 2475 760 L 2475 1155 L 0 1155 Z" fill="${p.bg2}" opacity="0.55"/>
    <path d="M 0 920 Q 520 840 1100 890 T 2020 880 T 2475 910 L 2475 1155 L 0 1155 Z" fill="url(#groundGrad)"/>
    ${heroSvg}
    <rect x="15" y="15" width="2445" height="1125" rx="18" fill="none" stroke="#ffffff" stroke-width="2" opacity="0.15" stroke-dasharray="16,12"/>
  </svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
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

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'api-server-routes',
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (!req.url?.startsWith('/api/')) {
            return next();
          }

          res.setHeader('Content-Type', 'application/json');

          // Helper to parse JSON body
          const readJsonBody = async () => {
            return new Promise<any>((resolve) => {
              let body = '';
              req.on('data', (chunk) => { body += chunk; });
              req.on('end', () => {
                try { resolve(JSON.parse(body || '{}')); }
                catch { resolve({}); }
              });
            });
          };

          // 1. /api/art/analyze
          if (req.url === '/api/art/analyze' && req.method === 'POST') {
            try {
              const body = await readJsonBody();
              const survey = body.survey || {};
              const ai = getGeminiClient();

              if (!ai) {
                addLog('ai', `Synthesizing fine art formula for ${survey.artStyle} style (Instant Fallback Mode)`);
                return res.end(JSON.stringify(getFallbackAnalysis(survey)));
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
4. ART STYLE: Render the artwork strictly adhering to the chosen style (watercolor, anime, comic_book, surreal, impressionist_storybook, neo_pop).
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
                return res.end(JSON.stringify(parsed));
              }
              return res.end(JSON.stringify(getFallbackAnalysis(survey)));
            } catch (err: any) {
              addLog('error', `AI Analyze error: ${err.message}`);
              return res.end(JSON.stringify(getFallbackAnalysis({})));
            }
          }

          // 2. /api/art/generate
          if (req.url === '/api/art/generate' && req.method === 'POST') {
            try {
              const body = await readJsonBody();
              const { prompt, aesthetic, heroSubject, subjectWords, artStyle } = body || {};
              let artworkUrl = '';
              let generationError: string | null = null;
              let source = 'vector';

              const styleKey = artStyle || aesthetic || 'classic_hand_drawn';
              const subjectKey = subjectWords || heroSubject || 'Brave Fluffy Fox';

              const ai = getGeminiClient();
              if (ai) {
                try {
                  addLog('ai', `Synthesizing AI artwork via Gemini for ${styleKey} with ${subjectKey}...`);
                  const imagePrompt = prompt || `A flat 2D cartoon panoramic illustration of a ${subjectKey} in ${styleKey} animation style, horizontal panoramic 2.14:1 composition, pure pictorial artwork, no text, no words, no 3D objects, no mugs.`;
                  
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
                        artworkUrl = `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
                        source = 'ai';
                        addLog('ai', `Successfully synthesized image via Gemini!`);
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
                artworkUrl = getAestheticArtSvg(styleKey, subjectKey);
                addLog('ai', `Delivered guaranteed high-definition 300 DPI flat artwork preview`);
              }

              return res.end(JSON.stringify({
                success: source === 'ai',
                artworkUrl,
                error: generationError,
                source,
                dimensions: '8.25" × 3.85" (2475 × 1155 px @ 300 DPI)'
              }));
            } catch (err: any) {
              return res.end(JSON.stringify({
                success: false,
                artworkUrl: getAestheticArtSvg(),
                error: err.message,
                source: 'vector',
                dimensions: '8.25" × 3.85" (2475 × 1155 px @ 300 DPI)'
              }));
            }
          }

          // 3. /api/shopify/checkout
          if (req.url === '/api/shopify/checkout' && req.method === 'POST') {
            try {
              const body = await readJsonBody();
              addLog('shopify', `Shopify Checkout initialized for "${body.title}" (${body.quantity}x @ $9.50)`);
              
              const storeDomain = process.env.SHOPIFY_STORE_DOMAIN || 'smuglife-studio.myshopify.com';
              const checkoutUrl = `https://${storeDomain}/cart`;

              return res.end(JSON.stringify({
                success: true,
                checkoutUrl,
                checkoutId: `chk_${Date.now()}`
              }));
            } catch (err: any) {
              return res.end(JSON.stringify({ success: false, error: err.message }));
            }
          }

          // 4. /api/shopify/status & /api/shopify/logs
          if (req.url === '/api/shopify/status') {
            return res.end(JSON.stringify({
              shopifyConfigured: Boolean(process.env.SHOPIFY_STORE_DOMAIN),
              storeDomain: process.env.SHOPIFY_STORE_DOMAIN || 'Demo Mode (Instant Checkout Ready)',
              printifyConfigured: Boolean(process.env.PRINTIFY_API_KEY)
            }));
          }

          if (req.url === '/api/shopify/logs') {
            return res.end(JSON.stringify({ logs: serverLogs }));
          }

          // 5. /api/shopify/webhook/orders-create
          if (req.url === '/api/shopify/webhook/orders-create' && req.method === 'POST') {
            const body = await readJsonBody();
            addLog('shopify', `Received Shopify Webhook orders/create: Order #${body.id || 'N/A'}`);
            return res.end(JSON.stringify({ received: true, printifyDispatched: true }));
          }

          // 6. /api/printify/orders
          if (req.url === '/api/printify/orders' && req.method === 'POST') {
            const body = await readJsonBody();
            addLog('info', `Printify order queued for ${body.customerName || 'Customer'} - 11oz Ceramic Mug ($9.50)`);
            return res.end(JSON.stringify({
              orderId: `SL-${Math.floor(100000 + Math.random() * 900000)}`,
              status: 'production_queued',
              estimatedDelivery: '3-5 Business Days'
            }));
          }

          next();
        });
      }
    }
  ],
  server: {
    port: 3000,
    host: '0.0.0.0'
  }
});
