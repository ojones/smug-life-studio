import React from 'react';
import { CuratedDesign } from '../../types';
import { Heart, Sparkles, Coffee, ExternalLink, Trash2 } from 'lucide-react';
import { playSoftClick } from '../../utils/audio';
import { generatePanoramicSublimationSvg } from '../../utils/proceduralArt';

interface InspirationGalleryProps {
  designs: CuratedDesign[];
  onSelectDesign: (design: CuratedDesign) => void;
  onRemoveDesign?: (id: string) => void;
}

export const InspirationGallery: React.FC<InspirationGalleryProps> = ({
  designs,
  onSelectDesign,
  onRemoveDesign
}) => {
  return (
    <div className="w-full max-w-7xl mx-auto space-y-8 font-sans text-left">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200 shadow-sm">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
            Design Vault & Vault Archive
          </h2>
          <p className="text-zinc-500 text-sm mt-1">
            Browse your saved fine art formulations, previously generated 2D wraps, and curated masterpieces.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3.5 py-1 rounded-full bg-zinc-100 border border-zinc-200 text-zinc-700 text-xs font-bold">
            {designs.length} {designs.length === 1 ? 'Design' : 'Designs'} Stored
          </span>
        </div>
      </div>

      {designs.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-zinc-200 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
            <Coffee className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-zinc-900">No Saved Designs Yet</h3>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Complete the 2-step art style and heroic subject survey to generate and store your first bespoke mug artwork!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {designs.map((d) => (
            <div
              key={d.id}
              className="group bg-white rounded-3xl border border-zinc-200/80 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="p-4 space-y-3">
                <div
                  onClick={() => {
                    playSoftClick();
                    onSelectDesign(d);
                  }}
                  className="relative aspect-[2.14/1] w-full rounded-2xl overflow-hidden bg-white border border-zinc-200/80 cursor-pointer flex items-center justify-center"
                >
                  <img
                    src={d.artworkUrl}
                    alt={d.analysis.title}
                    onError={(e) => {
                      // Gracefully recover to procedural vector preview
                      const target = e.currentTarget as HTMLImageElement;
                      target.src = generatePanoramicSublimationSvg(
                        d.surveyAnswers?.artStyle,
                        d.surveyAnswers?.heroSubject,
                        d.analysis?.colorPalette,
                        'transparent'
                      );
                    }}
                    className="w-full h-full object-contain p-2 bg-white group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[10px] font-mono text-zinc-700 border border-zinc-200/80 shadow-xs">
                    8.25" × 3.85" Wrap
                  </div>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-900 uppercase">
                      {d.surveyAnswers.artStyle || 'Fine Art'}
                    </span>
                    <span className="text-[11px] text-zinc-400 font-mono">
                      {new Date(d.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3
                    onClick={() => {
                      playSoftClick();
                      onSelectDesign(d);
                    }}
                    className="text-base font-extrabold text-zinc-950 cursor-pointer hover:text-amber-600 transition-colors line-clamp-1"
                  >
                    {d.analysis.title}
                  </h3>
                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed">
                    {d.analysis.narrative}
                  </p>
                </div>
              </div>

              <div className="p-4 pt-2 border-t border-zinc-100 flex items-center justify-between">
                <div className="flex -space-x-1">
                  {d.analysis.colorPalette.slice(0, 4).map((c, i) => (
                    <div
                      key={i}
                      className="w-5 h-5 rounded-full border-2 border-white shadow-xs"
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  {onRemoveDesign && (
                    <button
                      onClick={() => {
                        playSoftClick();
                        onRemoveDesign(d.id);
                      }}
                      className="p-2 rounded-xl text-zinc-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      playSoftClick();
                      onSelectDesign(d);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold transition-colors cursor-pointer"
                  >
                    Load in Studio
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
