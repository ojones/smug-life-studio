import React, { useState } from 'react';
import { ArtStyleCategory, SurveyAnswers } from '../../types';
import {
  ART_STYLE_OPTIONS,
  SubjectTripletOption,
  generateRandomSubjectOptions
} from '../../data/surveyData';
import { CharacterStylePreview } from './CharacterStylePreview';
import {
  Sparkles,
  ArrowLeft,
  Sun,
  Zap,
  Smile,
  Shuffle,
  Droplets,
  Moon,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import { playSelectChime, playSoftClick, playRevealFanfare } from '../../utils/audio';

interface MoodSurveyProps {
  onComplete: (answers: SurveyAnswers) => void;
  isLoading?: boolean;
}

export const MoodSurvey: React.FC<MoodSurveyProps> = ({ onComplete, isLoading = false }) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 2;

  // Generate 4 initial random 3-word options (adjectives + noun)
  const [subjectOptions, setSubjectOptions] = useState<SubjectTripletOption[]>(() => generateRandomSubjectOptions(4));
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  const [answers, setAnswers] = useState<SurveyAnswers>({
    artStyle: 'anime',
    subjectWords: 'Brave Fluffy Fox',
    heroSubject: 'valiant_animal_hero',
    backgroundOption: 'transparent',
    aesthetic: 'anime',
    energyMood: 'anime',
    smugMantraOption: 'none'
  });

  const getStyleIcon = (iconName: string) => {
    switch (iconName) {
      case 'Droplets': return <Droplets className="w-5 h-5" />;
      case 'Sparkles': return <Sparkles className="w-5 h-5" />;
      case 'Zap': return <Zap className="w-5 h-5" />;
      case 'Moon': return <Moon className="w-5 h-5" />;
      case 'Sun': return <Sun className="w-5 h-5" />;
      case 'Smile': return <Smile className="w-5 h-5" />;
      default: return <Sparkles className="w-5 h-5" />;
    }
  };

  // Step 1: Select Art Style -> Auto-advance to Step 2
  const handleSelectArtStyle = (styleId: ArtStyleCategory) => {
    playSelectChime();
    const updated: SurveyAnswers = {
      ...answers,
      artStyle: styleId,
      aesthetic: styleId,
      energyMood: styleId
    };
    setAnswers(updated);
    // Shuffle Step 2 options freshly each time style is selected
    setSubjectOptions(generateRandomSubjectOptions(4));
    setSelectedOptionId(null);
    setTimeout(() => {
      setStep(2);
    }, 150);
  };

  // Step 2: Select tile to animate & shift reflective surface
  const handleTileSelect = (option: SubjectTripletOption) => {
    playSelectChime();
    setSelectedOptionId(option.id);
    setAnswers((prev) => ({
      ...prev,
      backgroundOption: 'transparent',
      subjectWords: option.words,
      subjectDetails: {
        adj1: option.adj1,
        adj2: option.adj2,
        noun: option.noun
      },
      heroSubject: option.words
    }));
  };

  // Step 2: Finalize creation and synthesize artwork
  const handleCreate = (option: SubjectTripletOption, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
    }
    setSelectedOptionId(option.id);
    playRevealFanfare();
    const finalAnswers: SurveyAnswers = {
      ...answers,
      backgroundOption: 'transparent',
      subjectWords: option.words,
      subjectDetails: {
        adj1: option.adj1,
        adj2: option.adj2,
        noun: option.noun
      },
      heroSubject: option.words
    };
    setAnswers(finalAnswers);
    setTimeout(() => {
      onComplete(finalAnswers);
    }, 220);
  };

  const handleRerollOptions = () => {
    playSoftClick();
    setSubjectOptions(generateRandomSubjectOptions(4));
    setSelectedOptionId(null);
  };

  const handleBack = () => {
    playSoftClick();
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleRandomize = () => {
    playSelectChime();
    const randomStyle = ART_STYLE_OPTIONS[Math.floor(Math.random() * ART_STYLE_OPTIONS.length)].id;
    const randomTriplet = generateRandomSubjectOptions(1)[0];

    const randomized: SurveyAnswers = {
      artStyle: randomStyle,
      backgroundOption: 'transparent',
      subjectWords: randomTriplet.words,
      subjectDetails: {
        adj1: randomTriplet.adj1,
        adj2: randomTriplet.adj2,
        noun: randomTriplet.noun
      },
      heroSubject: randomTriplet.words,
      aesthetic: randomStyle,
      energyMood: randomStyle,
      smugMantraOption: 'none'
    };
    setAnswers(randomized);
    onComplete(randomized);
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border border-zinc-200/80 rounded-3xl p-6 sm:p-10 shadow-lg relative overflow-hidden text-left font-sans">
      {/* Header & Step Tracker */}
      <div className="relative z-10 mb-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-50 border border-amber-200 text-amber-900 text-xs font-bold uppercase tracking-wider">
              Step {step} of {totalSteps}
            </span>
            <span className="text-zinc-500 text-xs font-medium hidden sm:inline">
              11oz Mug Signature Artwork • $9.50
            </span>
          </div>

          <button
            type="button"
            onClick={handleRandomize}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-zinc-100 hover:bg-zinc-200/80 border border-zinc-200 text-xs text-zinc-700 font-medium transition-all group shadow-xs cursor-pointer"
          >
            <Shuffle className="w-3.5 h-3.5 group-hover:rotate-180 transition-transform duration-500 text-amber-600" />
            <span>Surprise Me (Instant Creation)</span>
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-amber-500 via-rose-500 to-zinc-900 transition-all duration-500 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Title based on current step */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
              Choose your character animation style
            </h2>
            <p className="text-zinc-500 text-sm mt-1">
              Select an animation style below to shape the character design, rendering, and visual personality.
            </p>
          </div>
        )}

        {step === 2 && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-zinc-950 tracking-tight">
                Choose your 3-word character concept
              </h2>
              <p className="text-zinc-500 text-sm mt-1">
                4 randomized combinations mixing adjectives and a noun. Select one to generate your artwork!
              </p>
            </div>
            <button
              type="button"
              onClick={handleRerollOptions}
              className="self-start sm:self-auto flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-50 hover:bg-amber-100/90 border border-amber-200 text-amber-900 text-xs font-bold transition-all shadow-xs cursor-pointer group"
              title="Generate 4 fresh random word combinations"
            >
              <RotateCcw className="w-3.5 h-3.5 group-hover:-rotate-90 transition-transform duration-300 text-amber-700" />
              <span>🎲 Roll New 4 Options</span>
            </button>
          </div>
        )}
      </div>

      {/* Step Content */}
      <div className="relative z-10 min-h-[300px]">
        {/* STEP 1: 4 Character Animation Styles with Visual Character Previews */}
        {step === 1 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {ART_STYLE_OPTIONS.map((style) => {
              const isSelected = answers.artStyle === style.id;
              return (
                <button
                  key={style.id}
                  type="button"
                  onClick={() => handleSelectArtStyle(style.id)}
                  className={`group relative text-left p-5 rounded-3xl border transition-all duration-200 flex flex-col justify-between cursor-pointer overflow-hidden ${
                    isSelected
                      ? 'border-zinc-950 bg-zinc-900 text-white shadow-xl scale-[1.01] ring-2 ring-zinc-900'
                      : 'border-zinc-200 bg-white hover:bg-zinc-50/90 hover:border-zinc-400 hover:shadow-md hover:scale-[1.005] text-zinc-900'
                  }`}
                >
                  {/* Tile Header: Style Title & Badge */}
                  <div className="flex items-center justify-between mb-3.5">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="p-2.5 rounded-xl transition-transform group-hover:scale-110"
                        style={{
                          backgroundColor: isSelected ? 'rgba(255,255,255,0.15)' : `${style.color}15`,
                          color: isSelected ? '#ffffff' : style.color
                        }}
                      >
                        {getStyleIcon(style.iconName)}
                      </div>
                      <h3 className={`font-extrabold text-lg tracking-tight ${isSelected ? 'text-white' : 'text-zinc-950'}`}>
                        {style.title}
                      </h3>
                    </div>

                    <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                      isSelected ? 'bg-white/20 text-white' : 'bg-zinc-100 text-zinc-700 border border-zinc-200/80'
                    }`}>
                      {style.badge}
                    </span>
                  </div>

                  {/* Visual Example of a Character in that Style (replaces text description) */}
                  <div className="my-1.5 w-full">
                    <CharacterStylePreview styleId={style.id} isSelected={isSelected} />
                  </div>

                  {/* Tile Footer: Tags & Selection CTA */}
                  <div className="pt-3.5 mt-2 border-t border-zinc-200/60 flex items-center justify-between w-full">
                    <div className="flex flex-wrap gap-1.5">
                      {style.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-medium ${
                            isSelected ? 'bg-white/15 text-zinc-200' : 'bg-zinc-100 text-zinc-600'
                          }`}
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <div className={`text-xs font-bold flex items-center gap-1 ${
                      isSelected ? 'text-amber-300' : 'text-zinc-700 group-hover:text-zinc-950'
                    }`}>
                      <span>Select</span>
                      <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                    </div>
                  </div>

                  {isSelected && (
                    <div className="absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>
        )}

        {/* STEP 2: 4 Randomized 3-Word Combinations (Adjective + Adjective + Noun) */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {subjectOptions.map((option) => {
                const isSelected = selectedOptionId === option.id;
                return (
                  <div
                    key={option.id}
                    role="button"
                    tabIndex={0}
                    onClick={() => {
                      if (isSelected) {
                        handleCreate(option);
                      } else {
                        handleTileSelect(option);
                      }
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        if (isSelected) {
                          handleCreate(option);
                        } else {
                          handleTileSelect(option);
                        }
                      }
                    }}
                    className={`group relative text-left p-6 sm:p-7 rounded-3xl border transition-all duration-300 flex flex-col justify-between cursor-pointer select-none overflow-hidden ${
                      isSelected
                        ? 'border-amber-400/90 bg-gradient-to-b from-amber-50/70 via-white to-amber-50/40 text-zinc-950 shadow-xl ring-2 ring-amber-400 -translate-y-1 animate-tile-selected'
                        : 'border-zinc-200/90 bg-gradient-to-b from-white via-zinc-50/30 to-zinc-100/50 hover:border-zinc-300 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] text-zinc-900 shadow-sm'
                    }`}
                    style={{
                      boxShadow: isSelected
                        ? '0 16px 36px -8px rgba(245, 158, 11, 0.24), inset 0 1px 2px rgba(255, 255, 255, 0.95), inset 0 -2px 4px rgba(0, 0, 0, 0.04)'
                        : '0 4px 16px -2px rgba(0, 0, 0, 0.05), inset 0 1px 1px rgba(255, 255, 255, 0.95), inset 0 -2px 3px rgba(0, 0, 0, 0.02)'
                    }}
                  >
                    {/* Reflective Surface Glass Layer */}
                    <div
                      className={`absolute inset-0 pointer-events-none transition-all duration-500 rounded-3xl overflow-hidden ${
                        isSelected ? 'opacity-100' : 'opacity-80 group-hover:opacity-100'
                      }`}
                      style={{
                        background: isSelected
                          ? 'linear-gradient(140deg, rgba(251, 191, 36, 0.38) 0%, rgba(255, 255, 255, 0.65) 26%, rgba(255, 255, 255, 0.15) 52%, transparent 76%)'
                          : 'linear-gradient(118deg, rgba(255, 255, 255, 0.55) 0%, rgba(255, 255, 255, 0.14) 32%, transparent 62%)'
                      }}
                    >
                      {/* Specular gloss top curved rim */}
                      <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/50 via-white/10 to-transparent" />

                      {/* Animated Reflective Light Sweep when Selected */}
                      {isSelected && (
                        <div className="absolute inset-y-0 w-28 bg-gradient-to-r from-transparent via-white/70 to-transparent animate-reflective-glance pointer-events-none" />
                      )}
                    </div>

                    {/* Main Content: Clean 3-Word Title & Flavor Subtitle (No icons, no chips, no wrap measurements) */}
                    <div className="relative z-10 space-y-2">
                      <h3 className={`text-xl sm:text-2xl font-black tracking-tight leading-snug transition-colors ${
                        isSelected ? 'text-zinc-950' : 'text-zinc-900 group-hover:text-zinc-950'
                      }`}>
                        {option.words}
                      </h3>

                      <p className={`text-sm leading-relaxed transition-colors ${
                        isSelected ? 'text-zinc-700 font-medium' : 'text-zinc-500'
                      }`}>
                        {option.flavor}
                      </p>
                    </div>

                    {/* Card Footer: Tactile "Create" Button */}
                    <div className="relative z-10 pt-4 mt-4 border-t border-zinc-200/60 flex items-center justify-between w-full">
                      <span className={`text-xs font-medium transition-colors ${
                        isSelected ? 'text-amber-900 font-bold' : 'text-zinc-400'
                      }`}>
                        {isSelected ? '✨ Selected concept' : 'Tap to select'}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => handleCreate(option, e)}
                        className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black tracking-wide transition-all duration-200 cursor-pointer shadow-sm ${
                          isSelected
                            ? 'bg-amber-500 hover:bg-amber-600 text-zinc-950 shadow-md shadow-amber-500/30 scale-105 ring-1 ring-amber-400'
                            : 'bg-zinc-900 hover:bg-amber-600 text-white group-hover:scale-102'
                        }`}
                      >
                        <span>Create</span>
                        <Sparkles className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Footer Controls */}
      <div className="relative z-10 mt-8 pt-4 border-t border-zinc-200 flex items-center justify-between">
        {step > 1 ? (
          <button
            type="button"
            onClick={handleBack}
            disabled={isLoading}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-zinc-100 hover:bg-zinc-200/80 text-zinc-700 border border-zinc-200 shadow-xs transition-all cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Art Styles</span>
          </button>
        ) : (
          <div className="text-xs text-zinc-400 font-medium">
            💡 Click any art style tile to advance instantly.
          </div>
        )}

        <div className="text-xs text-zinc-500 font-medium">
          {isLoading && (
            <span className="flex items-center gap-2 text-amber-700 font-bold">
              <Sparkles className="w-3.5 h-3.5 animate-spin" />
              Synthesizing 2D Artwork...
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
