import React, { useState, useEffect } from 'react';
import { CuratedDesign, SurveyAnswers } from './types';
import { Navbar } from './components/Navigation/Navbar';
import { MoodSurvey } from './components/Survey/MoodSurvey';
import { ArtGenerationProgress } from './components/Generator/ArtGenerationProgress';
import { DesignEditor } from './components/Studio/DesignEditor';
import { InspirationGallery } from './components/Gallery/InspirationGallery';
import { PrintifyOrderModal } from './components/Printify/PrintifyOrderModal';
import { ServerLogsModal } from './components/Navigation/ServerLogsModal';
import { UserProfileModal } from './components/Profile/UserProfileModal';
import { MOCK_CURATED_DESIGNS } from './data/surveyData';
import { Sparkles, Heart, Coffee, Layers, RefreshCw } from 'lucide-react';
import { playSelectChime, playSoftClick } from './utils/audio';
import { generatePanoramicSublimationSvg } from './utils/proceduralArt';

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quiz' | 'studio' | 'gallery'>('quiz');
  const [isGenerating, setIsGenerating] = useState(false);
  const [currentAnswers, setCurrentAnswers] = useState<SurveyAnswers | null>(null);
  const [currentDesign, setCurrentDesign] = useState<CuratedDesign | null>(null);
  const [savedDesigns, setSavedDesigns] = useState<CuratedDesign[]>([]);

  // Modals
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
  const [isLogsModalOpen, setIsLogsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // Initialize initial sample design
  useEffect(() => {
    const mockItem = MOCK_CURATED_DESIGNS[0];
    const initialVector = generatePanoramicSublimationSvg('anime', 'Brave Fluffy Fox', undefined, 'transparent');
    const initial: CuratedDesign = {
      id: 'init-1',
      createdAt: new Date().toISOString(),
      surveyAnswers: {
        artStyle: 'anime',
        subjectWords: 'Brave Fluffy Fox',
        subjectDetails: {
          adj1: 'Brave',
          adj2: 'Fluffy',
          noun: 'Fox'
        },
        heroSubject: 'Brave Fluffy Fox',
        backgroundOption: 'transparent',
        energyMood: 'anime',
        intensity: 9,
        aesthetic: 'anime',
        motifs: ['celestial'],
        palette: 'midnight_gold',
        texture: 'fine_watercolor',
        smugMantraOption: 'custom',
        customMantra: mockItem.mantra
      },
      analysis: {
        title: 'The Brave Fluffy Fox',
        tagline: 'Anime Character • Transparent Canvas (Zero Background)',
        narrative: 'A polished, contemporary anime character illustration featuring a Brave Fluffy Fox with expressive eyes, clean elegant ink contours, and subtle tonal gradients, isolated on a transparent canvas.',
        smugMantra: mockItem.mantra,
        artStylePrompt: 'Create a polished, contemporary anime character illustration. Use expressive eyes, clean elegant ink contours, restrained cel shading, should be 2-D flat but have subtle tonal gradients. Depicting a Brave Fluffy Fox. Single character cleanly isolated on a completely transparent canvas with zero background. Rectangular 2.14:1 aspect ratio panoramic composition (8.25" x 3.85" ceramic mug sublimation wrap, 2475 x 1155 px @ 300 DPI), pure flat 2D pictorial artwork, absolutely no text, no typography, no words, no mugs, no cups, no mockups.',
        vibeKeywords: ['Brave', 'Fluffy', 'Fox', 'Anime', 'Sublimation Wrap'],
        colorPalette: [
          { name: 'Tokyo Ultraviolet', hex: '#6366f1', description: 'Luminous anime aura' },
          { name: 'Starlight Magenta', hex: '#f43f5e', description: 'Vibrant highlight' },
          { name: 'Cyber Teal', hex: '#38bdf8', description: 'Dynamic eye sparkle' },
          { name: 'Abyss Navy', hex: '#0f172a', description: 'Dramatic contrast' }
        ],
        moodDimensions: [
          { label: 'Character Charm', score: 98 },
          { label: 'Contour Elegance', score: 96 },
          { label: 'Sublimation Balance', score: 95 },
          { label: 'Visual Joy', score: 97 }
        ]
      },
      artworkUrl: initialVector,
      artSource: 'vector',
      favorite: true
    };

    setCurrentDesign(initial);
    setSavedDesigns([initial]);
  }, []);

  // Handle Survey Completion -> Synthesize Artwork Directly (1-Step Generation)
  const handleSurveyComplete = async (answers: SurveyAnswers) => {
    setCurrentAnswers(answers);
    setIsGenerating(true);

    const stylePromptDescriptions: Record<string, string> = {
      anime: 'Create a polished, contemporary anime character illustration. Use expressive eyes, clean elegant ink contours, restrained cel shading, should be 2-D flat but have subtle tonal gradients.',
      vector: 'Create a crisp, premium flat vector illustration. Build the character from simple, bold shapes with clean edges, solid color fills, and little to no shading. Use a restrained palette and a clear silhouette that stays readable at thumbnail size.',
      pencil_sketch: 'Create a hand-drawn graphite character study on warm ivory paper. Use fine, confident pencil outlines, natural strokes, tonal shading, and controlled crosshatching. Keep the texture of the paper visible and avoid colored pigment or painterly washes.',
      chinese_watercolor: 'Create a refined Chinese ink-and-color painting on warm xuan paper. Use expressive brush contours, soft ink washes, subtle paper texture, and restrained mineral-pigment accents. Let negative space contribute to the composition; avoid western-style watercolor splashes or overly decorative details.',
      // Backwards compatibility mappings:
      anime_inspired: 'Create a polished, contemporary anime character illustration. Use expressive eyes, clean elegant ink contours, restrained cel shading, should be 2-D flat but have subtle tonal gradients.',
      cutout_flat_2d: 'Create a crisp, premium flat vector illustration. Build the character from simple, bold shapes with clean edges, solid color fills, and little to no shading. Use a restrained palette and a clear silhouette that stays readable at thumbnail size.',
      classic_hand_drawn: 'Create a hand-drawn graphite character study on warm ivory paper. Use fine, confident pencil outlines, natural strokes, tonal shading, and controlled crosshatching. Keep the texture of the paper visible and avoid colored pigment or painterly washes.',
      '3d_animated': 'Create a crisp, premium flat vector illustration. Build the character from simple, bold shapes with clean edges, solid color fills, and little to no shading. Use a restrained palette and a clear silhouette that stays readable at thumbnail size.'
    };

    const styleTitles: Record<string, string> = {
      anime: 'Anime',
      vector: 'Vector',
      pencil_sketch: 'Pencil sketch',
      chinese_watercolor: 'Chinese watercolor',
      anime_inspired: 'Anime',
      cutout_flat_2d: 'Vector',
      classic_hand_drawn: 'Pencil sketch',
      '3d_animated': 'Vector'
    };

    const chosenStyleDesc = stylePromptDescriptions[answers.artStyle] || stylePromptDescriptions.anime;
    const styleTitle = styleTitles[answers.artStyle] || 'Anime';
    const subjectWords = answers.subjectWords || 'Brave Fluffy Fox';

    // Character holding hot coffee on transparent background (PNG format with white fallback)
    const backgroundDirective = 'The character must be holding a cup of hot coffee with cozy hands or paws, with gentle rising steam wafting from the coffee cup. The character is cleanly isolated on a completely transparent canvas (PNG format). If a transparent canvas cannot be rendered, the background must be pure solid white (#FFFFFF) with zero color cast, zero textures, zero drop shadows, and zero gradients. Absolutely no background scenery, no landscape, no horizon, no sky, no ground, no floor, no background room or walls. Just the isolated character holding a cup of hot coffee.';

    // Direct 1-Step Prompt: Formulated directly from the chosen style prompt, 3 random words, character holding hot coffee & transparent PNG directive
    const directPrompt = `${chosenStyleDesc} Depicting a ${subjectWords} holding a cup of hot coffee with gentle steam rising from the cup. ${backgroundDirective} Horizontal panoramic 2.14:1 aspect ratio composition (8.25" x 3.85" ceramic mug sublimation wrap, 2475 x 1155 px @ 300 DPI), pure flat 2D visual pictorial character artwork, absolutely no text, no typography, no words, no product mockups.`;

    const paletteMap: Record<string, Array<{ name: string; hex: string; description: string }>> = {
      anime: [
        { name: 'Tokyo Ultraviolet', hex: '#6366f1', description: 'Luminous anime aura' },
        { name: 'Starlight Magenta', hex: '#f43f5e', description: 'Vibrant highlight' },
        { name: 'Cyber Teal', hex: '#38bdf8', description: 'Dynamic eye sparkle' },
        { name: 'Abyss Navy', hex: '#0f172a', description: 'Dramatic contrast' }
      ],
      vector: [
        { name: 'Bold Azure', hex: '#0284c7', description: 'Clean primary fill' },
        { name: 'Warm Tangerine', hex: '#fb923c', description: 'Bold shape accent' },
        { name: 'Electric Cyan', hex: '#38bdf8', description: 'Silhouette highlight' },
        { name: 'Deep Midnight', hex: '#0f172a', description: 'Crisp outline edge' }
      ],
      pencil_sketch: [
        { name: 'Warm Ivory Paper', hex: '#faf7f0', description: 'Ivory paper base' },
        { name: 'Graphite Medium', hex: '#78716c', description: 'Natural pencil stroke' },
        { name: 'Charcoal Noir', hex: '#292524', description: 'Confident dark contour' },
        { name: 'Soft Silver Lead', hex: '#d6d3d1', description: 'Tonal crosshatch value' }
      ],
      chinese_watercolor: [
        { name: 'Xuan Paper Cream', hex: '#fbf5eb', description: 'Warm fibrous paper tint' },
        { name: 'Carbon Black Ink', hex: '#1c1917', description: 'Expressive brush contour' },
        { name: 'Cinnabar Vermilion', hex: '#b91c1c', description: 'Traditional seal pigment' },
        { name: 'Imperial Jade Wash', hex: '#047857', description: 'Restrained mineral accent' }
      ],
      classic_hand_drawn: [
        { name: 'Warm Ivory Paper', hex: '#faf7f0', description: 'Ivory paper base' },
        { name: 'Graphite Medium', hex: '#78716c', description: 'Natural pencil stroke' },
        { name: 'Charcoal Noir', hex: '#292524', description: 'Confident dark contour' },
        { name: 'Soft Silver Lead', hex: '#d6d3d1', description: 'Tonal crosshatch value' }
      ],
      anime_inspired: [
        { name: 'Tokyo Ultraviolet', hex: '#6366f1', description: 'Luminous anime aura' },
        { name: 'Starlight Magenta', hex: '#f43f5e', description: 'Vibrant highlight' },
        { name: 'Cyber Teal', hex: '#38bdf8', description: 'Dynamic eye sparkle' },
        { name: 'Abyss Navy', hex: '#0f172a', description: 'Dramatic contrast' }
      ],
      '3d_animated': [
        { name: 'Bold Azure', hex: '#0284c7', description: 'Clean primary fill' },
        { name: 'Warm Tangerine', hex: '#fb923c', description: 'Bold shape accent' },
        { name: 'Electric Cyan', hex: '#38bdf8', description: 'Silhouette highlight' },
        { name: 'Deep Midnight', hex: '#0f172a', description: 'Crisp outline edge' }
      ],
      cutout_flat_2d: [
        { name: 'Bold Azure', hex: '#0284c7', description: 'Clean primary fill' },
        { name: 'Warm Tangerine', hex: '#fb923c', description: 'Bold shape accent' },
        { name: 'Electric Cyan', hex: '#38bdf8', description: 'Silhouette highlight' },
        { name: 'Deep Midnight', hex: '#0f172a', description: 'Crisp outline edge' }
      ]
    };

    const colorPalette = paletteMap[answers.artStyle] || paletteMap.anime;

    const analysisData = {
      title: `The ${subjectWords}`,
      tagline: `${styleTitle} • Holding Hot Coffee (Transparent PNG)`,
      narrative: `${chosenStyleDesc} Featuring a ${subjectWords} holding a cup of hot coffee with gentle rising steam, cleanly isolated on a transparent PNG canvas (with solid white fallback). Calibrated for 8.25" × 3.85" ceramic sublimation wrap with zero typography.`,
      smugMantra: answers.customMantra || 'Living with superior tranquility.',
      artStylePrompt: directPrompt,
      vibeKeywords: [
        answers.subjectDetails?.adj1 || 'Brave',
        answers.subjectDetails?.adj2 || 'Fluffy',
        answers.subjectDetails?.noun || 'Companion',
        styleTitle,
        'Hot Coffee',
        'Transparent PNG'
      ],
      colorPalette,
      moodDimensions: [
        { label: 'Character Charm', score: 98 },
        { label: 'Contour Elegance', score: 95 },
        { label: 'Sublimation Balance', score: 96 },
        { label: 'Visual Joy', score: 94 }
      ]
    };

    try {
      // Direct 1-Step Call: Send direct prompt, chosen style, 3 words, and transparent background to /api/art/generate
      const artRes = await fetch('/api/art/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: directPrompt,
          artStyle: answers.artStyle,
          aesthetic: answers.artStyle,
          subjectWords: answers.subjectWords,
          heroSubject: answers.subjectWords,
          backgroundOption: 'transparent'
        })
      });

      let artUrl = '';
      let generationError: string | null = null;
      let artSource: 'ai' | 'vector' | 'upload' = 'vector';

      if (artRes.ok) {
        const artData = await artRes.json();
        artUrl = artData.artworkUrl;
        generationError = artData.error || null;
        artSource = artData.source || (artData.success ? 'ai' : 'vector');
      } else {
        generationError = 'Image generation endpoint returned status ' + artRes.status + '. High-definition studio vector wrap provided.';
      }

      // If no valid URL returned, guarantee high-res procedural wrap with transparent canvas
      if (!artUrl) {
        artUrl = generatePanoramicSublimationSvg(
          answers.artStyle,
          answers.subjectWords,
          colorPalette,
          'transparent'
        );
        artSource = 'vector';
      }

      const newDesign: CuratedDesign = {
        id: `design-${Date.now()}`,
        createdAt: new Date().toISOString(),
        surveyAnswers: { ...answers, backgroundOption: 'transparent' },
        analysis: analysisData,
        artworkUrl: artUrl,
        generationError,
        artSource,
        favorite: false
      };

      setCurrentDesign(newDesign);
      setSavedDesigns((prev) => [newDesign, ...prev]);
      setActiveTab('studio');
      playSelectChime();
    } catch (err: any) {
      console.error('Artwork synthesis error:', err);
      const fallbackVector = generatePanoramicSublimationSvg(
        answers.artStyle,
        answers.subjectWords,
        colorPalette,
        'transparent'
      );
      const fallbackDesign: CuratedDesign = {
        id: `design-${Date.now()}`,
        createdAt: new Date().toISOString(),
        surveyAnswers: { ...answers, backgroundOption: 'transparent' },
        analysis: analysisData,
        artworkUrl: fallbackVector,
        generationError: `Image generation notice: ${err?.message || 'Synthesis was interrupted'}. High-definition 8.25" × 3.85" studio vector wrap loaded.`,
        artSource: 'vector',
        favorite: false
      };
      setCurrentDesign(fallbackDesign);
      setSavedDesigns((prev) => [fallbackDesign, ...prev]);
      setActiveTab('studio');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUpdateArtwork = (newUrl: string, error?: string | null) => {
    if (!currentDesign) return;
    const updated: CuratedDesign = {
      ...currentDesign,
      artworkUrl: newUrl,
      generationError: error !== undefined ? error : currentDesign.generationError,
      artSource: newUrl.startsWith('data:image/svg') ? 'vector' : 'upload'
    };
    setCurrentDesign(updated);
    setSavedDesigns((prev) => prev.map((d) => (d.id === updated.id ? updated : d)));
  };

  const handleToggleFavorite = (id: string) => {
    setSavedDesigns((prev) =>
      prev.map((d) => (d.id === id ? { ...d, favorite: !d.favorite } : d))
    );
    if (currentDesign && currentDesign.id === id) {
      setCurrentDesign({ ...currentDesign, favorite: !currentDesign.favorite });
    }
  };

  const handleRemoveDesign = (id: string) => {
    setSavedDesigns((prev) => prev.filter((d) => d.id !== id));
  };

  const favoritesCount = savedDesigns.filter((d) => d.favorite).length;

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950 text-zinc-900">
      {/* Navigation Header */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        favoritesCount={favoritesCount}
        onOpenLogs={() => setIsLogsModalOpen(true)}
        onOpenProfile={() => setIsProfileModalOpen(true)}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {isGenerating && currentAnswers ? (
          <ArtGenerationProgress answers={currentAnswers} />
        ) : (
          <>
            {activeTab === 'quiz' && (
              <div className="space-y-8 animate-in fade-in duration-300">
                <MoodSurvey onComplete={handleSurveyComplete} isLoading={isGenerating} />
              </div>
            )}

            {activeTab === 'studio' && (
              <div className="animate-in fade-in duration-300">
                {currentDesign ? (
                  <DesignEditor
                    design={currentDesign}
                    onOrderClick={() => setIsOrderModalOpen(true)}
                    onRegenerate={() => {
                      if (currentDesign.surveyAnswers) {
                        handleSurveyComplete(currentDesign.surveyAnswers);
                      } else {
                        setActiveTab('quiz');
                      }
                    }}
                    onToggleFavorite={handleToggleFavorite}
                    onUpdateArtwork={handleUpdateArtwork}
                  />
                ) : (
                  <div className="text-center py-16 bg-white rounded-3xl border border-zinc-200 space-y-4">
                    <Coffee className="w-12 h-12 text-zinc-400 mx-auto" />
                    <h3 className="text-lg font-bold text-zinc-900">No Active Design in Studio</h3>
                    <button
                      onClick={() => setActiveTab('quiz')}
                      className="px-6 py-2.5 rounded-xl bg-zinc-900 text-white text-xs font-bold"
                    >
                      Start Survey
                    </button>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'gallery' && (
              <div className="animate-in fade-in duration-300">
                <InspirationGallery
                  designs={savedDesigns}
                  onSelectDesign={(d) => {
                    setCurrentDesign(d);
                    setActiveTab('studio');
                  }}
                  onRemoveDesign={handleRemoveDesign}
                />
              </div>
            )}
          </>
        )}
      </main>

      {/* Modals */}
      {currentDesign && (
        <PrintifyOrderModal
          isOpen={isOrderModalOpen}
          onClose={() => setIsOrderModalOpen(false)}
          design={currentDesign}
        />
      )}

      <ServerLogsModal
        isOpen={isLogsModalOpen}
        onClose={() => setIsLogsModalOpen(false)}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};
