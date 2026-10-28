import React from 'react';
import { X, Sparkles, Coffee, ShieldCheck, CheckCircle2, PackageCheck } from 'lucide-react';
import { playSoftClick } from '../../utils/audio';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-xs animate-in fade-in duration-200 font-sans">
      <div className="w-full max-w-lg bg-white border border-zinc-200 rounded-3xl shadow-2xl overflow-hidden text-left">
        <div className="px-6 py-4 border-b border-zinc-200 flex items-center justify-between bg-zinc-50">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-zinc-950 text-white">
              <Coffee className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-zinc-950 text-base">Smuglife Studio Specs</h3>
              <p className="text-xs text-zinc-500">11oz Sublimated Ceramic Coffee Mugs</p>
            </div>
          </div>

          <button
            onClick={() => {
              playSoftClick();
              onClose();
            }}
            className="p-2 rounded-xl hover:bg-zinc-200/80 text-zinc-400 hover:text-zinc-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4 text-xs text-zinc-600">
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="font-extrabold text-amber-950 text-sm">Everyday Base Price</span>
              <span className="font-mono font-extrabold text-amber-700 text-base">$9.50</span>
            </div>
            <p className="text-amber-900 leading-relaxed">
              Premium 11oz white ceramic coffee mug with ultra-durable, high-gloss dye sublimation coating.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="font-extrabold text-zinc-900 text-xs uppercase tracking-wider">
              Ceramic Sublimation Features
            </h4>
            <div className="space-y-2">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Exact 8.25" × 3.85" flat 2D wrap @ 300 DPI (2475 × 1155 px)</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Dishwasher & microwave safe up to 1,500+ commercial wash cycles</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Lead and BPA-free food-grade certified ceramic</span>
              </div>
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Automated print-on-demand fulfillment routing via SPOD & Monster Digital</span>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-3 bg-zinc-50 border-t border-zinc-200 flex justify-end">
          <button
            onClick={() => {
              playSoftClick();
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-zinc-900 text-white text-xs font-bold cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
