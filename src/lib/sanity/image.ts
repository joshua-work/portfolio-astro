import imageUrlBuilder from '@sanity/image-url';

import { sanityClient } from '@/lib/sanity/client';
import type { SanityImage } from '@/lib/sanity/types';

type ImageOptions = {
  width: number;
  widths?: number[];
  sizes?: string;
  format?: 'webp' | 'jpg' | 'png';
  quality?: number;
};

export function buildImageUrl(image: SanityImage, options: ImageOptions) {
  if (!sanityClient) {
    throw new Error('Sanity image URLs are unavailable until PUBLIC_SANITY_PROJECT_ID is configured.');
  }

  const builder = imageUrlBuilder(sanityClient);
  const format = options.format ?? 'webp';
  const quality = options.quality ?? 80;

  return builder
    .image(image)
    .width(options.width)
    .format(format)
    .quality(quality)
    .url();
}

export type ResolvedImageSource = {
  src: string;
  srcSet?: string;
  sizes?: string;
  width: number;
  height: number;
  alt?: string;
  lqip?: string;
};

export function resolveImageSource(image: SanityImage, options: ImageOptions): ResolvedImageSource {
  const candidateWidths = options.widths?.filter(
    (candidateWidth) => candidateWidth <= image.asset.metadata.dimensions.width,
  );
  const srcSetWidths =
    candidateWidths && candidateWidths.length > 0
      ? Array.from(new Set([...candidateWidths, options.width])).sort((left, right) => left - right)
      : undefined;

  return {
    src: buildImageUrl(image, options),
    srcSet: srcSetWidths
      ?.map((width) => `${buildImageUrl(image, { ...options, width })} ${width}w`)
      .join(', '),
    sizes: options.sizes,
    width: image.asset.metadata.dimensions.width,
    height: image.asset.metadata.dimensions.height,
    alt: image.alt,
    lqip: image.asset.metadata.lqip,
  };
}
