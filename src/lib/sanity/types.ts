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

export type VideoProvider = 'youtube' | 'vimeo' | 'custom';

export type FilmVideoSource = {
  provider: VideoProvider;
  src?: string;
  mimeType?: string;
  embedUrl?: string;
  watchUrl?: string;
  title?: string;
  poster?: SanityImage;
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
  coverImage: SanityImage;
  tags: string[];
  logline: string;
};

export type Film = FilmSummary & {
  runtime?: string;
  mainVideo?: FilmVideoSource;
  stills: SanityImage[];
  credits: CreditItem[];
  body: PortableTextBlock[];
};

export type SiteSettings = {
  siteTitle: string;
  siteDescription: string;
  logo?: SanityImage;
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

export type Tag = {
  title: string;
};
