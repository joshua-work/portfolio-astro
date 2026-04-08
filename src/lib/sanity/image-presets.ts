export type ImagePresetName = 'card' | 'hero' | 'gallery';

export type ImagePreset = {
  width: number;
  widths: number[];
  sizes: string;
};

export const imagePresets: Record<ImagePresetName, ImagePreset> = {
  card: {
    width: 960,
    widths: [480, 768, 960],
    sizes: '(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw',
  },
  hero: {
    width: 1600,
    widths: [960, 1280, 1600, 1920],
    sizes: '(max-width: 1023px) 100vw, 66vw',
  },
  gallery: {
    width: 1200,
    widths: [800, 1200, 1600],
    sizes: '(max-width: 767px) 100vw, (max-width: 1279px) 80vw, 1200px',
  },
};
