import React, { useState, useEffect } from 'react';
import { CuratedDesign } from '../../types';
import {
  Sparkles,
  Layers,
  AlertTriangle,
  RefreshCw,
  Maximize2,
  Minimize2,
  Download,
  Palette,
  ChevronDown,
  Coffee,
  ZoomIn
} from 'lucide-react';
import { playSoftClick, playSelectChime } from '../../utils/audio';

export const TONAL_FILTERS = [
  { id: 'none', label: 'Original Tone' },
  { id: 'warm_terracotta', label: 'Warm Glow' },
  { id: 'emerald_sage', label: 'Misty Sage' },
  { id: 'electric_neon', label: 'Vibrant Surge' },
  { id: 'noir_monochrome', label: 'Noir Ink' }
] as const;

interface DesignShowcaseCanvasProps {
  design: CuratedDesign;
  filterMode?: string;
  onFilterChange?: (newFilter: string) => void;
  onUpdateArtwork?: (newUrl: string, error?: string | null) => void;
  onRegenerate?: () => void;
}

export const DesignShowcaseCanvas: React.FC<DesignShowcaseCanvasProps> = ({
  design,
  filterMode = 'none',
  onFilterChange,
  onUpdateArtwork,
  onRegenerate
}) => {
  const [hasImageError, setHasImageError] = useState(false);
  const [imageErrorMessage, setImageErrorMessage] = useState<string | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);

  // Reset states when artwork changes
  useEffect(() => {
    setHasImageError(false);
    setIsLoaded(false);
    setImageErrorMessage(null);
  }, [design.artworkUrl]);

  const getFilterClass = () => {
    switch (filterMode) {
      case 'warm_terracotta': return 'sepia-[0.35] contrast-105 saturate-110';
      case 'emerald_sage': return 'hue-rotate-15 contrast-105 saturate-95';
      case 'electric_neon': return 'contrast-125 saturate-150 brightness-105';
      case 'noir_monochrome': return 'grayscale contrast-125';
      default: return '';
    }
  };

  const handleDownload = () => {
    playSelectChime();
    const link = document.createElement('a');
    link.href = design.artworkUrl;
    link.download = `${design.analysis.title.toLowerCase().replace(/\s+/g, '-')}-wrap-design.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 shadow-md space-y-5 text-left font-sans">
      {/* Top Header Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-100 pb-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-zinc-950 text-white text-xs font-bold shadow-xs">
            <Layers className="w-4 h-4 text-amber-400" />
            <span>Artwork Design (8.25" × 3.85" Wrap)</span>
          </div>

          <span className="text-zinc-300 hidden sm:inline">•</span>

          <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-zinc-100 text-zinc-700 border border-zinc-200">
            ☕ Holding Hot Coffee • Transparent PNG
          </span>
        </div>

        {/* View Tools */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              playSoftClick();
              setIsZoomModalOpen(true);
            }}
            title="Inspect artwork in full resolution"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-zinc-100 hover:bg-zinc-200 text-zinc-800 border border-zinc-200 transition-colors cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Zoom Full View</span>
          </button>
        </div>
      </div>

      {/* Main Flat Artwork Presentation */}
      <div className="relative min-h-[360px] sm:min-h-[420px] flex items-center justify-center rounded-2xl overflow-hidden p-6 sm:p-8 bg-zinc-100/70 border border-zinc-200">
        <div className="relative z-10 w-full max-w-4xl space-y-3">
          <div className="p-3 sm:p-4 bg-white rounded-2xl border border-zinc-200/90 shadow-xl overflow-hidden">
            <div className="relative aspect-[2.14/1] w-full rounded-xl overflow-hidden bg-white flex items-center justify-center shadow-inner">
              {hasImageError ? (
                <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-white space-y-3">
                  <div className="p-3 rounded-full bg-amber-500/10 text-amber-600 border border-amber-500/30">
                    <AlertTriangle className="w-6 h-6" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-bold text-zinc-950 tracking-wide">Artwork Display Notice</h4>
                    <p className="text-xs text-zinc-600 max-w-md mx-auto leading-relaxed">
                      {imageErrorMessage || design.generationError || 'The remote artwork asset could not be loaded into this preview.'}
                    </p>
                    <p className="text-[11px] font-mono text-zinc-400">
                      Dimensions calibrated: 8.25" × 3.85" (2475 × 1155 px @ 300 DPI)
                    </p>
                  </div>
                  {onRegenerate && (
                    <div className="pt-1">
                      <button
                        onClick={() => {
                          playSoftClick();
                          onRegenerate();
                        }}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors flex items-center gap-1.5 cursor-pointer shadow-md"
                      >
                        <RefreshCw className="w-3.5 h-3.5" />
                        <span>Retry Generation</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  <img
                    src={design.artworkUrl}
                    alt={design.analysis.title}
                    onLoad={() => {
                      setIsLoaded(true);
                      setHasImageError(false);
                    }}
                    onError={() => {
                      console.warn('Artwork image failed to load:', design.artworkUrl);
                      setHasImageError(true);
                      setImageErrorMessage(design.generationError || 'Artwork asset failed to load in the browser.');
                    }}
                    className={`w-full h-full object-contain transition-all duration-300 relative z-10 bg-white ${getFilterClass()}`}
                  />

                  {/* Top-Right Badge: Dimensions & Sublimation Status */}
                  <div className="absolute top-3 right-3 z-20 px-3 py-1 rounded-lg bg-white/95 backdrop-blur-md text-[11px] font-mono text-zinc-800 border border-zinc-200/90 flex items-center gap-1.5 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>8.25" × 3.85" Wrap • 300 DPI</span>
                  </div>

                  {/* Bottom-Left Badge: Style & Background Info */}
                  <div className="absolute bottom-3 left-3 z-20 px-3 py-1 rounded-lg bg-white/95 backdrop-blur-md text-[11px] font-mono text-zinc-800 border border-zinc-200/90 flex items-center gap-2 shadow-xs">
                    <span className="font-bold text-amber-600 uppercase">
                      {design.surveyAnswers.artStyle || 'Fine Art'}
                    </span>
                    <span className="text-zinc-300">•</span>
                    <span>Holding Hot Coffee • Transparent PNG</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Visual Tonal Variations Dropdown - Positioned Right Below the Picture-Displayed Image */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-zinc-50 border border-zinc-200/90 rounded-2xl">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs font-bold text-zinc-900">
            <Palette className="w-4 h-4 text-amber-600" />
            <span>Visual Tonal Variation:</span>
          </div>

          <div className="relative inline-block">
            <select
              value={filterMode}
              onChange={(e) => {
                playSoftClick();
                if (onFilterChange) {
                  onFilterChange(e.target.value);
                }
              }}
              className="appearance-none bg-white hover:bg-zinc-100 text-zinc-900 text-xs font-bold pl-3.5 pr-8 py-2 rounded-xl border border-zinc-300 focus:outline-hidden focus:ring-2 focus:ring-amber-500 transition-all cursor-pointer shadow-xs"
            >
              {TONAL_FILTERS.map((f) => (
                <option key={f.id} value={f.id} className="bg-white text-zinc-900 font-medium">
                  {f.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div className="flex items-center justify-between sm:justify-end text-xs text-zinc-500 font-mono gap-2">
          <span>8.25" × 3.85" Wrap @ 300 DPI</span>
          <span className="hidden md:inline">• Pure Flat 2D Artwork</span>
        </div>
      </div>

      {/* Production Notice: Users infer that this flat design will be transferred to a mug upon shipment */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/90 flex items-start gap-3 text-xs text-amber-950">
        <Coffee className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-zinc-950">
            Ceramic Mug Fulfillment Specification:
          </p>
          <p className="text-zinc-600 leading-relaxed">
            This design represents the exact flat panoramic wrap (8.25" × 3.85") that will be heat-pressed onto your 11oz ceramic mug during sublimation manufacturing. Upon arrival, the artwork will wrap edge-to-edge around the glossy ceramic surface.
          </p>
        </div>
      </div>

      {/* Fullscreen / Zoom Inspector Modal */}
      {isZoomModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/85 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-6xl bg-white border border-zinc-200 rounded-3xl p-6 shadow-2xl flex flex-col max-h-[92vh] space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-3 text-zinc-900">
              <div className="flex items-center gap-2">
                <ZoomIn className="w-4 h-4 text-amber-500" />
                <h3 className="font-bold text-sm tracking-wide">
                  High-Resolution Wrap Inspector: {design.analysis.title}
                </h3>
              </div>
              <button
                onClick={() => {
                  playSoftClick();
                  setIsZoomModalOpen(false);
                }}
                className="p-1.5 rounded-lg bg-zinc-100 hover:bg-zinc-200 text-zinc-600 hover:text-zinc-900 transition-colors cursor-pointer"
              >
                <Minimize2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex-1 overflow-auto rounded-2xl border border-zinc-200 bg-white flex items-center justify-center p-4">
              <img
                src={design.artworkUrl}
                alt={design.analysis.title}
                className={`max-w-full max-h-[70vh] object-contain rounded-xl bg-white ${getFilterClass()}`}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-zinc-500">
              <span className="font-mono">2475 × 1155 px • 300 DPI Sublimation Matrix</span>
              <button
                onClick={handleDownload}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-zinc-950 font-bold text-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Wrap Artwork</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
