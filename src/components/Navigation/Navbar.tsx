import React from 'react';
import { Sparkles, Terminal, Heart, Coffee, Layers } from 'lucide-react';
import { playSoftClick } from '../../utils/audio';

interface NavbarProps {
  activeTab: 'quiz' | 'studio' | 'gallery';
  setActiveTab: (tab: 'quiz' | 'studio' | 'gallery') => void;
  favoritesCount: number;
  onOpenLogs?: () => void;
  onOpenProfile?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  favoritesCount,
  onOpenLogs,
  onOpenProfile
}) => {
  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 backdrop-blur-md border-b border-zinc-200/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <button
          onClick={() => {
            playSoftClick();
            setActiveTab('quiz');
          }}
          className="flex items-center gap-2.5 group text-left cursor-pointer focus:outline-none"
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-amber-600 via-rose-600 to-zinc-900 flex items-center justify-center shadow-md shadow-amber-900/10 group-hover:scale-105 transition-transform duration-200">
            <Coffee className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg text-zinc-950 tracking-tight">Smuglife</span>
              <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-md bg-amber-100 text-amber-900 uppercase tracking-wide">
                Studio
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-medium hidden sm:block">
              Custom 11oz Ceramic Mug Art Studio
            </p>
          </div>
        </button>

        {/* Navigation Tabs */}
        <nav className="flex items-center gap-1 sm:gap-2">
          <button
            onClick={() => {
              playSoftClick();
              setActiveTab('quiz');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'quiz'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Create</span>
          </button>

          <button
            onClick={() => {
              playSoftClick();
              setActiveTab('studio');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'studio'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            <Layers className="w-4 h-4 text-rose-400" />
            <span>Studio</span>
          </button>

          <button
            onClick={() => {
              playSoftClick();
              setActiveTab('gallery');
            }}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
              activeTab === 'gallery'
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            <Heart className="w-4 h-4 text-pink-500" />
            <span>Vault</span>
            {favoritesCount > 0 && (
              <span className="w-4 h-4 rounded-full bg-pink-500 text-white text-[10px] flex items-center justify-center font-bold">
                {favoritesCount}
              </span>
            )}
          </button>
        </nav>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          {onOpenLogs && (
            <button
              onClick={() => {
                playSoftClick();
                onOpenLogs();
              }}
              title="Shopify / Printify Integration Status & Webhooks"
              className="p-2 rounded-xl bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 border border-zinc-200 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Terminal className="w-4 h-4 text-zinc-600" />
              <span className="hidden md:inline">API & Logs</span>
            </button>
          )}

          {onOpenProfile && (
            <button
              onClick={() => {
                playSoftClick();
                onOpenProfile();
              }}
              className="px-3.5 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-white text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              $9.50 Mug
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
