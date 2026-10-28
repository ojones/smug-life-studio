import React, { useState, useRef } from 'react';
import { CuratedDesign, PrintifyProvider } from '../../types';
import { DesignShowcaseCanvas } from './DesignShowcaseCanvas';
import { PRINTIFY_PROVIDERS } from '../../data/surveyData';
import {
  ShoppingBag,
  Download,
  Share2,
  Heart,
  Truck,
  RefreshCw,
  ArrowRight,
  AlertTriangle,
  UploadCloud
} from 'lucide-react';
import { playSoftClick, playSelectChime } from '../../utils/audio';

interface DesignEditorProps {
  design: CuratedDesign;
  onOrderClick: () => void;
  onRegenerate: () => void;
  onToggleFavorite?: (id: string) => void;
  onUpdateArtwork?: (newUrl: string, error?: string | null) => void;
}

export const DesignEditor: React.FC<DesignEditorProps> = ({
  design,
  onOrderClick,
  onRegenerate,
  onToggleFavorite,
  onUpdateArtwork
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('none');
  const [selectedProvider, setSelectedProvider] = useState<PrintifyProvider>(PRINTIFY_PROVIDERS[0]);
  const [isCopied, setIsCopied] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentMediumPrice = 9.50; // Fixed 11oz Ceramic Mug base price

  const handleShare = () => {
    playSoftClick();
    if (navigator.share) {
      navigator.share({
        title: design.analysis.title,
        text: `Check out my custom 11oz ceramic mug artwork "${design.analysis.title}" created with Smuglife Studio!`,
        url: window.location.href
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }
  };

  const handleDownloadArtwork = () => {
    playSoftClick();
    const link = document.createElement('a');
    link.href = design.artworkUrl;
    link.download = `${design.analysis.title.toLowerCase().replace(/\s+/g, '-')}-wrap.png`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (PNG, JPEG, or SVG).');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl && onUpdateArtwork) {
        playSelectChime();
        onUpdateArtwork(dataUrl, null);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className={`w-full max-w-7xl mx-auto space-y-6 font-sans text-left transition-colors ${
        isDragging ? 'ring-4 ring-amber-400/50 rounded-3xl' : ''
      }`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />

      {/* Top Header Card */}
      <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
              {design.surveyAnswers.artStyle || 'Fine Art'} Style
            </span>
            <span className="text-zinc-400 text-xs">•</span>
            <span className="text-xs text-zinc-500 font-medium">
              8.25" × 3.85" Flat 2D Sublimation
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
            {design.analysis.title}
          </h2>
          <p className="text-zinc-500 text-sm italic">
            "{design.analysis.tagline}"
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {onToggleFavorite && (
            <button
              onClick={() => {
                playSoftClick();
                onToggleFavorite(design.id);
              }}
              className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                design.favorite
                  ? 'bg-rose-50 border-rose-200 text-rose-600'
                  : 'bg-zinc-50 hover:bg-zinc-100 border-zinc-200 text-zinc-600'
              }`}
              title="Save to Vault"
            >
              <Heart className={`w-5 h-5 ${design.favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
            </button>
          )}

          <button
            onClick={handleShare}
            className="p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 transition-colors cursor-pointer"
            title="Share Design"
          >
            <Share2 className="w-5 h-5" />
          </button>

          <button
            onClick={handleDownloadArtwork}
            className="p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 transition-colors cursor-pointer"
            title="Download Hi-Res 300 DPI PNG Wrap"
          >
            <Download className="w-5 h-5" />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-3 rounded-2xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-700 transition-colors cursor-pointer"
            title="Upload Custom Image Wrap (Drag & drop also supported)"
          >
            <UploadCloud className="w-5 h-5" />
          </button>

          <button
            onClick={() => {
              playSoftClick();
              onRegenerate();
            }}
            className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-xs sm:text-sm font-bold border border-zinc-200 transition-all cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Regenerate</span>
          </button>

          <button
            onClick={() => {
              playSelectChime();
              onOrderClick();
            }}
            className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-600 to-rose-600 hover:from-amber-700 hover:to-rose-700 text-white text-xs sm:text-sm font-extrabold shadow-md shadow-amber-900/10 transition-all transform hover:scale-[1.02] cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Order Mug • $9.50</span>
          </button>
        </div>
      </div>

      {/* Generation Error Callout Banner */}
      {design.generationError && (
        <div className="bg-amber-50 border border-amber-300 rounded-3xl p-5 sm:p-6 text-amber-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 rounded-2xl bg-amber-200/80 text-amber-900 shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <h4 className="text-sm font-bold text-amber-950">Image Generation Status</h4>
                <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-amber-200 text-amber-900 font-semibold">
                  8.25" × 3.85" Calibrated
                </span>
                {design.artSource && (
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-amber-100 border border-amber-300/60 text-amber-900 uppercase">
                    Mode: {design.artSource}
                  </span>
                )}
              </div>
              <p className="text-xs text-amber-900 leading-relaxed max-w-2xl">
                {design.generationError}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => {
                playSoftClick();
                onRegenerate();
              }}
              className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Retry Generation</span>
            </button>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-4 py-2 rounded-xl bg-white hover:bg-zinc-100 border border-zinc-300 text-zinc-800 text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <UploadCloud className="w-3.5 h-3.5 text-zinc-600" />
              <span>Upload Custom</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Grid: Showcase Canvas + Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Canvas */}
        <div className="lg:col-span-8 space-y-6">
          <DesignShowcaseCanvas
            design={design}
            filterMode={selectedFilter}
            onFilterChange={setSelectedFilter}
            onUpdateArtwork={onUpdateArtwork}
            onRegenerate={onRegenerate}
          />

          {/* Harmonic Color Palette & Narrative */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-8 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-extrabold text-zinc-950 mb-1">
                Aesthetic Formulation & Palette
              </h3>
              <p className="text-xs text-zinc-500 leading-relaxed">
                {design.analysis.narrative}
              </p>
            </div>

            {/* Swatches */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {design.analysis.colorPalette.map((color, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-2xl bg-zinc-50 border border-zinc-200/80 flex items-center gap-3"
                >
                  <div
                    className="w-8 h-8 rounded-xl shadow-xs shrink-0 border border-black/10"
                    style={{ backgroundColor: color.hex }}
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-zinc-950 truncate">{color.name}</p>
                    <p className="text-[10px] font-mono text-zinc-400">{color.hex}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Dimension Breakdown */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 border-t border-zinc-100">
              {design.analysis.moodDimensions.map((dim, idx) => (
                <div key={idx} className="space-y-1">
                  <div className="flex justify-between text-[11px] font-bold text-zinc-600">
                    <span>{dim.label}</span>
                    <span>{dim.score}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-zinc-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-zinc-900 rounded-full"
                      style={{ width: `${dim.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Fulfillment Spec */}
        <div className="lg:col-span-4 space-y-6">
          {/* Fulfillment Details & Provider Selection */}
          <div className="bg-white border border-zinc-200/80 rounded-3xl p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Truck className="w-4 h-4 text-rose-600" />
                <h3 className="text-sm font-extrabold text-zinc-950">
                  Printify Fulfillment Routing
                </h3>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Live Sublimation
              </span>
            </div>

            <div className="space-y-2">
              {PRINTIFY_PROVIDERS.map((provider) => (
                <button
                  key={provider.id}
                  onClick={() => {
                    playSoftClick();
                    setSelectedProvider(provider);
                  }}
                  className={`w-full p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    selectedProvider.id === provider.id
                      ? 'bg-amber-50/50 border-amber-300 ring-1 ring-amber-300'
                      : 'bg-zinc-50/70 border-zinc-200 hover:bg-zinc-100'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-extrabold text-zinc-950">{provider.name}</span>
                    <span className="text-xs font-bold text-zinc-900">${provider.basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-zinc-500 mt-1">
                    <span>{provider.location}</span>
                    <span>~{provider.avgProductionTimeDays} days dispatch</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Quick Summary Box */}
            <div className="p-4 rounded-2xl bg-zinc-950 text-white space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">11oz Ceramic Mug</span>
                <span className="font-bold text-white">${currentMediumPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-zinc-400">Est. USA Standard Shipping</span>
                <span className="font-bold text-zinc-300">${selectedProvider.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="pt-2 border-t border-zinc-800 flex justify-between items-center">
                <span className="text-xs font-extrabold">Instant Checkout Subtotal</span>
                <span className="text-sm font-extrabold text-amber-400">
                  ${(currentMediumPrice + selectedProvider.shippingPrice).toFixed(2)}
                </span>
              </div>

              <button
                onClick={() => {
                  playSelectChime();
                  onOrderClick();
                }}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-600 hover:to-rose-600 text-white text-xs font-extrabold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
