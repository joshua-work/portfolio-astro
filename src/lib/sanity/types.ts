import type { ImageMetadata } from 'astro';
import type { PortableTextBlock } from '@portabletext/types';

export type SanityImage = {
  source?: 'sanity';
  asset: {
    _id: string;
    url: string;
    metadata: {
      dimensions: {
        width: number;
        height: number;
      };
      lqip: string;
    };
  };
  alt?: string;
  caption?: string;
};

export type LocalImage = {
  source: 'local';
  asset: ImageMetadata;
  alt?: string;
  caption?: string;
};

export type PortfolioImage = LocalImage | SanityImage;

export type VideoProvider = 'youtube' | 'vimeo' | 'custom';

export type FilmVideoEmbed = {
  provider: VideoProvider;
  embedUrl: string;
  watchUrl?: string;
  title?: string;
  poster?: PortfolioImage;
  autoplay?: boolean;
  muted?: boolean;
  loop?: boolean;
};

export type SocialLink = {
  label: string;
  href: string;
};

export type NavItem = {
  href: string;
  label: string;
};

export type CreditItem = {
  role: string;
  names: string[];
};

export type FilmSummary = {
  title: string;
  year: number;
  slug: string;
  type: string;
  coverImage: PortfolioImage;
  tags: string[];
  logline: string;
};

export type Film = FilmSummary & {
  runtime?: string;
  mainVideo?: FilmVideoEmbed;
  stills: PortfolioImage[];
  credits: CreditItem[];
  body: PortableTextBlock[];
};

export type SiteSettings = {
  siteTitle: string;
  siteDescription: string;
  logo?: PortfolioImage;
  primaryNav: NavItem[];
  footerNote: string;
  contactEmail: string;
  socialLinks: SocialLink[];
};

export type HomePage = {
  eyebrow: string;
  title: string;
  intro: string;
  focusAreas: string[];
  featuredSlugs: string[];
  closingNote: string;
};

export type AboutPage = {
  eyebrow: string;
  title: string;
  intro: string;
  bio: string[];
  highlights: string[];
};

export type ContactPage = {
  eyebrow: string;
  title: string;
  intro: string;
  availability: string;
  email: string;
  socialLinks: SocialLink[];
};
