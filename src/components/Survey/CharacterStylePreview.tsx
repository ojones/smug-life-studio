import React, { useState } from 'react';
import { ArtStyleCategory } from '../../types';

interface CharacterStylePreviewProps {
  styleId: ArtStyleCategory;
  isSelected?: boolean;
}

const STYLE_IMAGE_MAP: Record<string, { src: string; label: string; badgeColor: string }> = {
  anime: {
    src: '/assets/aistudio/penguin_anime_02df6d53.png',
    label: 'ANIME',
    badgeColor: 'bg-indigo-950/85 text-indigo-200 border-indigo-400/30'
  },
  anime_inspired: {
    src: '/assets/aistudio/penguin_anime_02df6d53.png',
    label: 'ANIME',
    badgeColor: 'bg-indigo-950/85 text-indigo-200 border-indigo-400/30'
  },
  vector: {
    src: '/assets/aistudio/penguin_vector_0f451cb0.png',
    label: 'VECTOR',
    badgeColor: 'bg-sky-950/85 text-sky-200 border-sky-400/30'
  },
  cutout_flat_2d: {
    src: '/assets/aistudio/penguin_vector_0f451cb0.png',
    label: 'VECTOR',
    badgeColor: 'bg-sky-950/85 text-sky-200 border-sky-400/30'
  },
  '3d_animated': {
    src: '/assets/aistudio/penguin_vector_0f451cb0.png',
    label: 'VECTOR',
    badgeColor: 'bg-sky-950/85 text-sky-200 border-sky-400/30'
  },
  pencil_sketch: {
    src: '/assets/aistudio/penguin_sketch_70f03910.png',
    label: 'PENCIL SKETCH',
    badgeColor: 'bg-stone-900/85 text-stone-200 border-stone-500/30'
  },
  classic_hand_drawn: {
    src: '/assets/aistudio/penguin_sketch_70f03910.png',
    label: 'PENCIL SKETCH',
    badgeColor: 'bg-stone-900/85 text-stone-200 border-stone-500/30'
  },
  chinese_watercolor: {
    src: '/assets/aistudio/penguin_water_color_d9c197f7.png',
    label: 'CHINESE WATERCOLOR',
    badgeColor: 'bg-amber-950/85 text-amber-200 border-amber-500/30'
  },
  watercolor: {
    src: '/assets/aistudio/penguin_water_color_d9c197f7.png',
    label: 'CHINESE WATERCOLOR',
    badgeColor: 'bg-amber-950/85 text-amber-200 border-amber-500/30'
  }
};

export const CharacterStylePreview: React.FC<CharacterStylePreviewProps> = ({
  styleId,
  isSelected = false
}) => {
  const [hasError, setHasError] = useState(false);
  const info = STYLE_IMAGE_MAP[styleId] || STYLE_IMAGE_MAP.anime;

  return (
    <div className={`relative w-full h-44 sm:h-48 rounded-2xl overflow-hidden bg-zinc-100 border transition-all duration-300 flex items-center justify-center ${
      isSelected
        ? 'border-amber-400 shadow-md ring-2 ring-amber-400/60'
        : 'border-zinc-200/80 shadow-xs group-hover:border-zinc-300'
    }`}>
      {/* Character Image Display */}
      <img
        src={info.src}
        alt={`${info.label} character preview`}
        onError={() => setHasError(true)}
        className="w-full h-full object-contain p-2 group-hover:scale-105 transition-transform duration-500"
      />

      {/* Style Label Tag */}
      <div className={`absolute bottom-2.5 left-3 px-2.5 py-1 rounded-md text-[10px] font-mono tracking-wider font-bold border backdrop-blur-sm shadow-xs ${info.badgeColor}`}>
        {info.label}
      </div>

      {/* Subtle selection ring indicator */}
      {isSelected && (
        <div className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
      )}
    </div>
  );
};
