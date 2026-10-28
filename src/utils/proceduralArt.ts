// High-definition 8.25" x 3.85" (2475 x 1155 px @ 300 DPI) Sublimation Wrap Procedural Generator
// Generates self-contained, guaranteed-to-load SVG panoramic fine art

export function generatePanoramicSublimationSvg(
  artStyle: string = 'watercolor',
  heroSubject: string = 'valiant_animal_hero',
  customColors?: Array<{ hex: string; name?: string }>,
  backgroundOption: 'scenic' | 'transparent' = 'transparent'
): string {
  // Palettes per art style
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
    neo_pop: { bg1: '#7209b7', bg2: '#f72585', accent1: '#4361ee', accent2: '#4cc9f0', ground: '#16001e' }
  };

  const p = defaultPalettes[artStyle] || defaultPalettes.watercolor;
  const c1 = customColors?.[0]?.hex || p.bg1;
  const c2 = customColors?.[1]?.hex || p.bg2;
  const cAccent1 = customColors?.[2]?.hex || p.accent1;
  const cAccent2 = customColors?.[3]?.hex || p.accent2;
  const cGround = p.ground;

  // Render character/hero visual based on heroSubject
  let heroSvg = '';
  const s = (heroSubject || 'valiant_animal_hero').toLowerCase();

  if (s.includes('ghost')) {
    // Adorable guardian ghost holding a warm glowing lantern
    heroSvg = `
      <g transform="translate(1237, 650)">
        <!-- Ghost Glow -->
        <circle cx="0" cy="-100" r="260" fill="url(#heroGlow)" opacity="0.7"/>

        <!-- Ghost Body wavy flowing tails -->
        <path d="M -110 -100 C -110 -250, 110 -250, 110 -100 C 110 50, 130 110, 80 130 C 40 145, 20 110, 0 135 C -20 110, -40 145, -80 130 C -130 110, -110 50, -110 -100 Z" fill="#ffffff" opacity="0.95" filter="url(#softGlow)"/>
        
        <!-- Blushing cheeks -->
        <circle cx="-55" cy="-105" r="14" fill="#f43f5e" opacity="0.5" />
        <circle cx="55" cy="-105" r="14" fill="#f43f5e" opacity="0.5" />

        <!-- Cute sparkling eyes -->
        <ellipse cx="-40" cy="-125" rx="12" ry="16" fill="#09090b" />
        <circle cx="-43" cy="-131" r="5" fill="#ffffff" />
        <ellipse cx="40" cy="-125" rx="12" ry="16" fill="#09090b" />
        <circle cx="37" cy="-131" r="5" fill="#ffffff" />

        <!-- Tiny smile -->
        <path d="M -12 -95 Q 0 -80 12 -95" stroke="#09090b" stroke-width="4" fill="none" stroke-linecap="round"/>

        <!-- Ghost Holding Steaming Hot Cup of Coffee -->
        <g transform="translate(0, 15)">
          <path d="M -8 -45 Q -16 -65 -8 -85 Q 0 -105 -6 -125" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.9"/>
          <path d="M 6 -40 Q 14 -60 6 -80 Q -2 -100 4 -120" stroke="#fef08a" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.85"/>
          <path d="M 18 -35 Q 24 -55 16 -75" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.7"/>
          <path d="M 28 -20 C 46 -20, 46 16, 28 16" stroke="#d97706" stroke-width="6" fill="none" stroke-linecap="round"/>
          <rect x="-30" y="-26" width="58" height="52" rx="9" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
          <path d="M -30 -8 L 28 -8" stroke="#f59e0b" stroke-width="5"/>
          <ellipse cx="-1" cy="-26" rx="26" ry="7" fill="#451a03"/>
          <ellipse cx="-1" cy="-26" rx="22" ry="5" fill="#78350f"/>
          <ellipse cx="-5" cy="-27" rx="8" ry="2.5" fill="#d97706" opacity="0.7"/>
          <ellipse cx="-32" cy="-2" rx="9" ry="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
          <ellipse cx="28" cy="-2" rx="9" ry="12" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
        </g>
      </g>
    `;
  } else if (s.includes('monster') || s.includes('bear')) {
    // Gentle fluffy mountain monster with warm friendly smile holding hot coffee
    heroSvg = `
      <g transform="translate(1237, 730)">
        <circle cx="0" cy="-120" r="280" fill="url(#heroGlow)" opacity="0.5"/>
        
        <!-- Monster Main Body -->
        <path d="M -160 30 C -200 -120, -180 -280, 0 -290 C 180 -280, 200 -120, 160 30 C 120 70, -120 70, -160 30 Z" fill="${cAccent1}" />
        
        <!-- Fluffy belly patch -->
        <ellipse cx="0" cy="-60" rx="95" ry="110" fill="#fef3c7" opacity="0.9"/>

        <!-- Cute curved soft horns -->
        <path d="M -90 -250 C -150 -310, -140 -380, -80 -360 C -90 -320, -70 -290, -50 -265 Z" fill="#f59e0b" />
        <path d="M 90 -250 C 150 -310, 140 -380, 80 -360 C 90 -320, 70 -290, 50 -265 Z" fill="#f59e0b" />

        <!-- Warm eyes -->
        <circle cx="-48" cy="-190" r="16" fill="#18181b" />
        <circle cx="-52" cy="-196" r="6" fill="#ffffff" />
        <circle cx="48" cy="-190" r="16" fill="#18181b" />
        <circle cx="44" cy="-196" r="6" fill="#ffffff" />

        <!-- Cheeks -->
        <circle cx="-75" cy="-160" r="16" fill="#fb7185" opacity="0.6" />
        <circle cx="75" cy="-160" r="16" fill="#fb7185" opacity="0.6" />

        <!-- Friendly Tooth Smile -->
        <path d="M -35 -145 Q 0 -115 35 -145" stroke="#18181b" stroke-width="6" fill="#7f1d1d" stroke-linecap="round"/>
        <polygon points="-12,-145 0,-130 12,-145" fill="#ffffff"/>

        <!-- Monster Holding Steaming Hot Cup of Coffee -->
        <g transform="translate(0, -40)">
          <path d="M -8 -45 Q -16 -65 -8 -85 Q 0 -105 -6 -125" stroke="#ffffff" stroke-width="4" stroke-linecap="round" fill="none" opacity="0.9"/>
          <path d="M 6 -40 Q 14 -60 6 -80 Q -2 -100 4 -120" stroke="#fef08a" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.85"/>
          <path d="M 18 -35 Q 24 -55 16 -75" stroke="#ffffff" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.7"/>
          <path d="M 28 -20 C 46 -20, 46 16, 28 16" stroke="#d97706" stroke-width="6" fill="none" stroke-linecap="round"/>
          <rect x="-30" y="-26" width="58" height="52" rx="9" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
          <path d="M -30 -8 L 28 -8" stroke="#f59e0b" stroke-width="5"/>
          <ellipse cx="-1" cy="-26" rx="26" ry="7" fill="#451a03"/>
          <ellipse cx="-1" cy="-26" rx="22" ry="5" fill="#78350f"/>
          <ellipse cx="-5" cy="-27" rx="8" ry="2.5" fill="#d97706" opacity="0.7"/>
          <ellipse cx="-34" cy="-2" rx="10" ry="13" fill="${cAccent1}" />
          <ellipse cx="30" cy="-2" rx="10" ry="13" fill="${cAccent1}" />
        </g>
      </g>
    `;
  } else {
    // Character / Penguin Mascot holding a cup of hot coffee with rising steam
    heroSvg = `
      <g transform="translate(1237, 720)">
        <circle cx="0" cy="-60" r="220" fill="url(#heroGlow)" opacity="0.6"/>
        <path d="M 60 -30 C 180 -10, 240 -120, 210 -220 C 190 -280, 120 -280, 90 -200 C 60 -120, 80 -60, 40 -30 Z" fill="${cAccent1}" opacity="0.95"/>
        <ellipse cx="0" cy="-40" rx="95" ry="115" fill="${cAccent2}" />
        <ellipse cx="0" cy="-20" rx="65" ry="85" fill="#fff7ed" opacity="0.9" />
        <path d="M -70 -110 Q 0 -80 70 -110 Q 90 -90 70 -70 Q 0 -50 -70 -70 Z" fill="${cAccent1}" />
        <circle cx="0" cy="-170" r="85" fill="${cAccent2}" />
        <polygon points="-65,-210 -80,-310 -15,-240" fill="${cAccent2}" />
        <polygon points="65,-210 80,-310 15,-240" fill="${cAccent2}" />
        <polygon points="-45,-150 0,-115 45,-150" fill="#fff7ed" />
        <circle cx="0" cy="-125" r="10" fill="#18181b" />
        <ellipse cx="-32" cy="-175" rx="14" ry="18" fill="#18181b" />
        <circle cx="-35" cy="-182" r="6" fill="#ffffff" />
        <ellipse cx="32" cy="-175" rx="14" ry="18" fill="#18181b" />
        <circle cx="29" cy="-182" r="6" fill="#ffffff" />
        <ellipse cx="-45" cy="45" rx="28" ry="18" fill="${cAccent2}" />
        <ellipse cx="45" cy="45" rx="28" ry="18" fill="${cAccent2}" />
        
        <!-- Hot Cup of Coffee Held in Paws with Steam -->
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
          <ellipse cx="-34" cy="-2" rx="9" ry="12" fill="${cAccent2}" />
          <ellipse cx="30" cy="-2" rx="9" ry="12" fill="${cAccent2}" />
        </g>
      </g>
    `;
  }

  // Style-specific overlays (textures, halftones, or watercolor pooling)
  let styleOverlay = '';
  if (artStyle === 'comic_book') {
    styleOverlay = `
      <pattern id="halftone" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <circle cx="10" cy="10" r="3.5" fill="#000000" opacity="0.12" />
      </pattern>
      <rect width="2475" height="1155" fill="url(#halftone)" pointer-events="none" />
    `;
  } else if (artStyle === 'watercolor') {
    styleOverlay = `
      <!-- Soft translucent watercolor wash pools -->
      <path d="M 100 100 Q 600 300 1200 150 T 2400 200 L 2475 1155 L 0 1155 Z" fill="${cAccent2}" opacity="0.08"/>
      <circle cx="450" cy="350" r="260" fill="${cAccent1}" opacity="0.07" filter="url(#softGlow)"/>
      <circle cx="2050" cy="400" r="320" fill="${c2}" opacity="0.08" filter="url(#softGlow)"/>
    `;
  } else if (artStyle === 'neo_pop') {
    styleOverlay = `
      <!-- Bold pop geometric stars -->
      <polygon points="300,200 320,240 370,245 330,280 345,330 300,300 255,330 270,280 230,245 280,240" fill="${cAccent2}" opacity="0.4"/>
      <polygon points="2150,220 2165,250 2200,255 2170,280 2180,320 2150,295 2120,320 2130,280 2100,255 2135,250" fill="${cAccent1}" opacity="0.4"/>
    `;
  }

  const isTransparent = backgroundOption === 'transparent';

  const scenicElements = isTransparent ? '' : `
  <!-- Base 8.25" x 3.85" Sky & Cosmic Canvas -->
  <rect width="2475" height="1155" fill="url(#skyGrad)"/>

  <!-- Celestial Stars & Nebula Constellations -->
  <g fill="#ffffff">
    <circle cx="210" cy="180" r="4" opacity="0.8"/>
    <circle cx="380" cy="110" r="2.5" opacity="0.9"/>
    <circle cx="560" cy="240" r="3.5" opacity="0.7"/>
    <circle cx="820" cy="95" r="5" opacity="0.85"/>
    <circle cx="1020" cy="210" r="3" opacity="0.75"/>
    <circle cx="1450" cy="130" r="4.5" opacity="0.85"/>
    <circle cx="1680" cy="230" r="3" opacity="0.7"/>
    <circle cx="1920" cy="90" r="5.5" opacity="0.9"/>
    <circle cx="2140" cy="190" r="3.5" opacity="0.8"/>
    <circle cx="2320" cy="140" r="4" opacity="0.75"/>
    <!-- Crescent Moon / Cosmic Halo -->
    <path d="M 2150 150 A 110 110 0 0 0 2060 310 A 95 95 0 0 1 2150 150 Z" fill="#fef08a" opacity="0.85"/>
    <circle cx="2100" cy="230" r="160" fill="#fef08a" opacity="0.08" filter="url(#softGlow)"/>
  </g>

  <!-- Distant Atmospheric Mountain Ranges (Layer 1) -->
  <path d="M 0 780 Q 320 540 680 660 T 1420 590 T 2120 640 T 2475 610 L 2475 1155 L 0 1155 Z" fill="${c1}" opacity="0.45"/>

  <!-- Midground Misty Ridges (Layer 2) -->
  <path d="M 0 830 Q 420 680 920 760 T 1840 730 T 2475 760 L 2475 1155 L 0 1155 Z" fill="${c2}" opacity="0.55"/>

  <!-- Foreground Scenic Ground Horizon -->
  <path d="M 0 920 Q 520 840 1100 890 T 2020 880 T 2475 910 L 2475 1155 L 0 1155 Z" fill="url(#groundGrad)"/>
  `;

  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 2475 1155" width="2475" height="1155">
  <defs>
    <!-- Background Panorama Gradient -->
    <linearGradient id="skyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${c1}"/>
      <stop offset="50%" stop-color="${c2}"/>
      <stop offset="100%" stop-color="${cGround}"/>
    </linearGradient>

    <!-- Hero Radiant Aura -->
    <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.9"/>
      <stop offset="40%" stop-color="${cAccent1}" stop-opacity="0.5"/>
      <stop offset="80%" stop-color="${cAccent2}" stop-opacity="0.15"/>
      <stop offset="100%" stop-color="${cAccent2}" stop-opacity="0"/>
    </radialGradient>

    <!-- Horizon Ground Gradient -->
    <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="${cGround}" stop-opacity="0.85"/>
      <stop offset="100%" stop-color="#09090b"/>
    </linearGradient>

    <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="25" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  ${scenicElements}

  <!-- Central Heroic Focal Subject -->
  ${heroSvg}

  <!-- Art Style Textural Enhancements -->
  ${styleOverlay}

  <!-- High-Precision Edge Framing (8.25" x 3.85" 300 DPI Sublimation Wrap boundary) -->
  <rect x="15" y="15" width="2445" height="1125" rx="18" fill="none" stroke="${isTransparent ? '#cbd5e1' : '#ffffff'}" stroke-width="2" opacity="${isTransparent ? '0.3' : '0.15'}" stroke-dasharray="16,12"/>
</svg>`;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgContent)}`;
}
