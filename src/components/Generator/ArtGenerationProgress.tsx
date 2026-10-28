import React, { useEffect, useState } from 'react';
import { Sparkles, Palette, Wand2, Coffee } from 'lucide-react';
import { SurveyAnswers } from '../../types';

interface ArtGenerationProgressProps {
  answers: SurveyAnswers;
  onFinished?: () => void;
}

export const ArtGenerationProgress: React.FC<ArtGenerationProgressProps> = ({ answers }) => {
  const [progress, setProgress] = useState(15);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    { title: 'Harmonizing Pigment & Style Matrices', desc: `Calibrating ${answers.artStyle || 'artistic'} aesthetic tone and dynamic contrast.` },
    { title: 'Heroic Subject Composition Synthesis', desc: 'Crafting central character / heroic animal / majestic tree focal presence.' },
    { title: 'Sublimation Calibration for 11oz Ceramic Wrap', desc: 'Framing 8.25" × 3.85" flat 2D high-resolution wrap composition @ 300 DPI.' },
    { title: 'Finalizing Bespoke Artwork Showcase', desc: 'Rendering flat 2D museum-grade sublimation wrap design.' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) return 95;
        return prev + 2;
      });
    }, 150);

    const stepTimer = setInterval(() => {
      setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 1200);

    return () => {
      clearInterval(timer);
      clearInterval(stepTimer);
    };
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto bg-white border border-zinc-200 rounded-3xl p-8 sm:p-12 shadow-xl text-center space-y-8 font-sans">
      <div className="relative mx-auto w-24 h-24 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-4 border-amber-500/20 border-t-amber-600 animate-spin" />
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-600 via-rose-600 to-zinc-900 flex items-center justify-center text-white shadow-lg">
          <Coffee className="w-8 h-8 animate-pulse" />
        </div>
      </div>

      <div className="space-y-2">
        <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-extrabold uppercase tracking-wider">
          Gemini AI Fine Art Director
        </span>
        <h3 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
          {steps[currentStep].title}
        </h3>
        <p className="text-zinc-500 text-sm max-w-md mx-auto">
          {steps[currentStep].desc}
        </p>
      </div>

      <div className="space-y-2 max-w-md mx-auto">
        <div className="w-full h-2.5 bg-zinc-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-zinc-900 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-zinc-400 font-mono">
          <span>Synthesizing Bespoke 2D Art</span>
          <span>{progress}%</span>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-100 flex items-center justify-center gap-6 text-xs text-zinc-500 font-medium">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span>Pure Flat 2D Artwork</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Palette className="w-4 h-4 text-rose-500" />
          <span>8.25" × 3.85" Wrap Ratio</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wand2 className="w-4 h-4 text-purple-500" />
          <span>$9.50 Mug Dropship</span>
        </div>
      </div>
    </div>
  );
};
