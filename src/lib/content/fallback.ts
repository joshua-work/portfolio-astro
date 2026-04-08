import type { ImageMetadata } from 'astro';
import type { PortableTextBlock } from '@portabletext/types';

import type {
  AboutPage,
  ContactPage,
  CreditItem,
  Film,
  FilmVideoEmbed,
  FilmSummary,
  HomePage,
  LocalImage,
  SiteSettings,
} from '@/lib/sanity/types';

const legacyImages = import.meta.glob<{ default: ImageMetadata }>(
  '../../assets/legacy/*.{jpg,png}',
  { eager: true },
);

const roleLabels: Record<string, string> = {
  director: 'Director',
  editor: 'Editor',
  cinematographer: 'Cinematographer',
  colorist: 'Colorist',
  'motion-graphic-designer': 'Motion Graphics',
};

function getLocalImage(filename: string, alt: string, caption?: string): LocalImage {
  const match = Object.entries(legacyImages).find(([path]) => path.endsWith(`/${filename}`));

  if (!match) {
    throw new Error(`Missing local legacy image: ${filename}`);
  }

  return {
    source: 'local',
    asset: match[1].default,
    alt,
    caption,
  };
}

function paragraph(text: string): PortableTextBlock {
  return {
    _key: text.slice(0, 24).replace(/\s+/g, '-').toLowerCase(),
    _type: 'block',
    style: 'normal',
    markDefs: [],
    children: [
      {
        _key: `${text.slice(0, 16).replace(/\s+/g, '-').toLowerCase()}-span`,
        _type: 'span',
        marks: [],
        text,
      },
    ],
  };
}

function buildCredits(roles: string[]): CreditItem[] {
  return roles.map((role) => ({
    role: roleLabels[role] ?? role,
    names: ['Joshua Yue'],
  }));
}

function buildYoutubeVideo(videoId: string, title: string): FilmVideoEmbed {
  return {
    provider: 'youtube',
    embedUrl: `https://www.youtube.com/embed/${videoId}?rel=0`,
    watchUrl: `https://www.youtube.com/watch?v=${videoId}`,
    title,
    autoplay: true,
  };
}

type FilmSeed = {
  title: string;
  slug: string;
  year: number;
  type: string;
  coverFile: string;
  videoId: string;
  roles: string[];
  logline: string;
  runtime?: string;
  description: string[];
};

function filmFromSeed(seed: FilmSeed): Film {
  const coverImage = getLocalImage(seed.coverFile, seed.title);

  return {
    title: seed.title,
    slug: seed.slug,
    year: seed.year,
    type: seed.type,
    coverImage,
    tags: [seed.type, ...seed.roles.map((role) => roleLabels[role] ?? role)],
    logline: seed.logline,
    runtime: seed.runtime,
    mainVideo: buildYoutubeVideo(seed.videoId, seed.title),
    stills: [coverImage],
    credits: buildCredits(seed.roles),
    body: seed.description.map(paragraph),
  };
}

const filmSeeds: FilmSeed[] = [
  {
    title: '2024臺灣國際光影藝術節─前導影片',
    slug: '2024-臺灣國際光影藝術節【前導影片】',
    year: 2024,
    type: 'Art Event',
    coverFile: '2024-臺灣國際光影藝術節【前導影片】.jpg',
    videoId: '2GwNEgn3KgM',
    roles: ['editor', 'motion-graphic-designer'],
    logline: 'A teaser built to announce the 2024 Taiwan International Light Festival with graphic rhythm and a concise, high-energy editorial cut.',
    runtime: '01:10',
    description: [
      'This teaser distills the atmosphere of the festival into a short-form reveal built around timing, graphic motion, and visual contrast.',
      'For the migration prototype, the page keeps the legacy project framing while presenting it inside a cleaner, static-first portfolio structure.',
    ],
  },
  {
    title: '2023 Real Leather Stay Different Taiwan',
    slug: '2023-real-leather-stay-different-taiwan',
    year: 2023,
    type: 'Commercial',
    coverFile: '2023-Real-Leather-Stay-Different-Taiwan-─-形象影片.jpg',
    videoId: 'MsdrR4XmQrU',
    roles: ['editor', 'director', 'cinematographer', 'colorist'],
    logline: 'A brand film entry in the Real Leather series, balancing tactile product imagery with a polished editorial pace.',
    runtime: '01:12',
    description: [
      'The Real Leather campaign work combines direction, camera, edit, and finishing into a unified visual voice.',
      'This project now lives in the same data model as the rest of the portfolio, making future Sanity migration straightforward.',
    ],
  },
  {
    title: 'Inside Out Project 生而自由─形象影片',
    slug: 'inside-out-project-生而自由─形象影片',
    year: 2023,
    type: 'Commercial',
    coverFile: 'Inside-Out-Project-生而自由─形象影片.jpg',
    videoId: 'TSGsDzV4sGs',
    roles: ['editor', 'director', 'cinematographer', 'colorist'],
    logline: 'A campaign portrait centered on identity, movement, and a grounded visual tone.',
    runtime: '01:23',
    description: [
      'The piece is framed as a branded moving portrait, shaped through careful camera rhythm and a restrained finishing pass.',
      'In the new site, it is treated like a first-class film entry rather than a one-off embedded page.',
    ],
  },
  {
    title: '第2屆浪漫台三線藝術季｜設計導入計畫',
    slug: '第2屆浪漫台三線藝術季｜設計導入計畫',
    year: 2023,
    type: 'Art Event',
    coverFile: '第2屆浪漫台三線藝術季｜設計導入計畫.jpg',
    videoId: '5Cth38tAiH8',
    roles: ['editor', 'motion-graphic-designer', 'director', 'cinematographer', 'colorist'],
    logline: 'A cultural documentation piece connecting spatial design, public storytelling, and editorial structure.',
    runtime: '02:17',
    description: [
      'This project sits at the intersection of event documentation and design communication, so the new portfolio groups it under art and cultural commissions.',
      'The updated structure makes it easier to surface both the project context and the specific roles covered in production.',
    ],
  },
  {
    title: '2023 Taiwan Crafts & Design－Evolving Life',
    slug: '2023-taiwan-crafts-design－evolving-life',
    year: 2023,
    type: 'Art Event',
    coverFile: '2023-Taiwan-Crafts-Design－Evolving-Life-2.jpg',
    videoId: 'qWUqniwHgPc',
    roles: ['editor', 'motion-graphic-designer', 'director', 'cinematographer', 'colorist'],
    logline: 'A visual introduction to a craft and design exhibition, mixing identity-led motion with exhibition imagery.',
    runtime: '01:32',
    description: [
      'The project brings together direction, editorial timing, and graphic treatment to frame the exhibition experience before the audience arrives on site.',
      'It is a strong example of how cultural work can live beside brand and documentary projects inside a single portfolio system.',
    ],
  },
  {
    title: '白晝之夜起義吧 Nuit Blanche 2023',
    slug: '白晝之夜起義吧-nuit-blanche-2023',
    year: 2023,
    type: 'Art Event',
    coverFile: '白晝之夜起義吧-Nuit-Blanche-2023.jpg',
    videoId: 'swGeKl3q_Ac',
    roles: ['editor', 'director', 'cinematographer', 'colorist'],
    logline: 'A moody event film that leans into nocturnal texture, atmosphere, and an urban sense of momentum.',
    runtime: '01:48',
    description: [
      'The edit emphasizes transition, pacing, and the emotional charge of the event environment.',
      'Within the new Astro build, the project sits comfortably inside the cinematic visual language defined for the site.',
    ],
  },
  {
    title: '山中小市 ─ 活動紀錄',
    slug: '山中小市-─-活動紀錄',
    year: 2023,
    type: 'Documentary',
    coverFile: '山中小市-─-活動紀錄.jpg',
    videoId: 'mJjwZMXqOTA',
    roles: ['editor', 'director', 'cinematographer', 'colorist'],
    logline: 'An event record shaped around place, crowd flow, and the energy of a market gathering.',
    runtime: '02:04',
    description: [
      'The film documents an on-site experience with enough texture to feel lived-in rather than purely informational.',
      'The migration keeps that observational quality while giving the project clearer metadata and navigation.',
    ],
  },
  {
    title: '【過日子Living the Days】展覽紀錄',
    slug: '【過日子living-the-days】展覽紀錄',
    year: 2023,
    type: 'Art Event',
    coverFile: '【過日子Living-the-Days】展覽紀錄-.jpg',
    videoId: 'FDoqUrYu6gg',
    roles: ['editor', 'director', 'cinematographer', 'colorist'],
    logline: 'An exhibition record focused on spatial rhythm, visitor movement, and curatorial atmosphere.',
    runtime: '02:28',
    description: [
      'This documentation piece translates an exhibition into a screen experience without flattening the sense of space.',
      'For v1, the migrated page preserves the essential story: title, year, roles, moving image, and a concise project note.',
    ],
  },
  {
    title: '山林記憶 ─ 巡山日記',
    slug: '山林記憶-─-巡山日記',
    year: 2023,
    type: 'Documentary',
    coverFile: '山林記憶-─-巡山日記.jpg',
    videoId: 'f9xz-PM3ygc',
    roles: ['editor', 'cinematographer', 'colorist'],
    logline: 'A documentary-led piece grounded in landscape, field observation, and measured editorial pacing.',
    runtime: '03:06',
    description: [
      'Among the more documentary-oriented entries in the archive, this project leans into environment, memory, and duration.',
      'It helps anchor the portfolio so the site does not read only as a collection of commissioned brand work.',
    ],
  },
  {
    title: '衛武營五週年─形象紀錄片',
    slug: '衛武營五週年─形象紀錄片',
    year: 2023,
    type: 'Documentary',
    coverFile: '衛武營五週年─形象紀錄片.jpg',
    videoId: 'JYZnNcU8tRY',
    roles: ['editor', 'cinematographer'],
    logline: 'A commemorative documentary portrait built around institutional identity and milestone storytelling.',
    runtime: '02:41',
    description: [
      'The piece balances ceremony with intimacy, using editorial structure to frame the venue and its anniversary in human terms.',
      'The new detail page format gives this kind of long-tail institutional work a calmer, more legible presentation.',
    ],
  },
  {
    title: '2022 Real Leather Stay Different Taiwan',
    slug: '2022-real-leather-stay-different-taiwan',
    year: 2022,
    type: 'Commercial',
    coverFile: '2022-Real-Leather-Stay-Different-Taiwan-─-形象影片.jpg',
    videoId: 'bLXK8DyKzP8',
    roles: ['editor', 'director', 'cinematographer', 'colorist'],
    logline: 'A 2022 campaign entry shaped around confident product imagery and premium finishing.',
    runtime: '01:09',
    description: [
      'This film continues the Real Leather visual line while refining pacing and material emphasis.',
      'In the new system, yearly campaign iterations can live as independent projects without losing their relationship to the wider series.',
    ],
  },
  {
    title: '做工的人 ─ 展覽形象影片',
    slug: '做工的人-─-展覽形象影片',
    year: 2022,
    type: 'Art Event',
    coverFile: '做工的人-─-展覽形象影片.jpg',
    videoId: '0OR6gUbPwpo',
    roles: ['editor', 'motion-graphic-designer'],
    logline: 'A short exhibition-led identity piece using motion design and concise cutting to establish tone quickly.',
    runtime: '00:58',
    description: [
      'The work is compact but graphic, sitting closer to a teaser than a long-form record.',
      'That makes it a good fit for the updated portfolio approach, where short-form pieces are presented with the same care as larger commissions.',
    ],
  },
  {
    title: '小笠原美環 展覽紀錄',
    slug: '小笠原美環-展覽紀錄',
    year: 2022,
    type: 'Art Event',
    coverFile: '小笠原美環-展覽紀錄.jpg',
    videoId: 'uR_aWUJahMM',
    roles: ['editor', 'colorist'],
    logline: 'An exhibition documentation piece focused on mood, material, and gallery rhythm.',
    runtime: '02:12',
    description: [
      'The film relies on editorial restraint and finish work to support the exhibition rather than overpower it.',
      'In the migration, it also demonstrates how partial-role credits can be represented cleanly in the shared schema.',
    ],
  },
  {
    title: '春來尬電 ─ 15秒廣告',
    slug: '春來尬電-─-15秒廣告',
    year: 2022,
    type: 'Short Form',
    coverFile: '春來尬電-─-15秒廣告.jpg',
    videoId: 'RqziPODnUZ0',
    roles: ['editor', 'motion-graphic-designer', 'colorist'],
    logline: 'A fast 15-second commercial cut built for concise messaging and punchy recall.',
    runtime: '00:15',
    description: [
      'This is the shortest-form piece in the portfolio, designed around speed, clarity, and finishing polish.',
      'It gives the v1 site a useful contrast against the slower documentary and exhibition projects.',
    ],
  },
  {
    title: '第一屆馬祖國際藝術島 ─ 作品全記錄',
    slug: '第一屆馬祖國際藝術島-─-作品全記錄',
    year: 2022,
    type: 'Documentary',
    coverFile: '第一屆馬祖國際藝術島-─-作品全記錄.jpg',
    videoId: '5rpZOnC5dtk',
    roles: ['editor', 'cinematographer', 'colorist'],
    logline: 'A broad documentation record capturing the scale and identity of the first Matsu Biennial-style art island project.',
    runtime: '03:15',
    description: [
      'The piece functions as both archive and interpretation, carrying a large event into a coherent screen format.',
      'Projects like this benefit from the new portfolio structure because they need more context than a simple thumbnail grid can provide.',
    ],
  },
  {
    title: '魔幻時空大稻埕 ─ 宣傳短片',
    slug: '魔幻時空大稻埕-─-宣傳短片',
    year: 2022,
    type: 'Commercial',
    coverFile: '魔幻時空大稻埕-─-宣傳短片.jpg',
    videoId: 'scrF1mdUqBE',
    roles: ['editor', 'motion-graphic-designer'],
    logline: 'A promotional short introducing the project through atmosphere, typography, and compact momentum.',
    runtime: '00:49',
    description: [
      'This short is built to sell mood fast, relying on editorial precision and graphic energy.',
      'It remains a useful reference for how the new site can represent promotional work without flattening it into generic marketing content.',
    ],
  },
  {
    title: '2021 Real Leather Stay Different Taiwan',
    slug: '2021-real-leather-stay-different-taiwan',
    year: 2021,
    type: 'Commercial',
    coverFile: '2021-Real-Leather-Stay-Different-Taiwan-─-形象影片.jpg',
    videoId: 'Yuc1RpUiZeo',
    roles: ['editor', 'director', 'cinematographer', 'colorist'],
    logline: 'An earlier campaign entry that established the tactile, polished tone of the Real Leather series.',
    runtime: '01:06',
    description: [
      'As an earlier chapter in the series, this project helps show continuity across multiple years of commissioned work.',
      'The new content model keeps series-like projects manageable without forcing them into a blog-style chronology.',
    ],
  },
  {
    title: '衛武營週年慶3.0 ─ 形象片',
    slug: '衛武營週年慶3-0-─-形象片',
    year: 2021,
    type: 'Art Event',
    coverFile: '衛武營週年慶3.0-─-形象片.jpg',
    videoId: 'K6hSZHLx6UI',
    roles: ['editor', 'cinematographer', 'colorist'],
    logline: 'A celebratory event identity film that condenses a festival atmosphere into a short branded statement.',
    runtime: '01:14',
    description: [
      'This project sits between cultural campaign work and event presentation, with emphasis on tone and momentum.',
      'It is representative of the kind of hybrid commission the new portfolio is being designed to support well.',
    ],
  },
  {
    title: '衛武營週年慶3.0 ─ 活動紀錄',
    slug: '衛武營週年慶3-0-─-活動紀錄',
    year: 2021,
    type: 'Art Event',
    coverFile: '衛武營週年慶3.0-─-活動紀錄.jpg',
    videoId: '6UynxJzqIqc',
    roles: ['editor', 'cinematographer', 'colorist'],
    logline: 'A documentation companion to the anniversary campaign, focusing on live experience and audience presence.',
    runtime: '02:05',
    description: [
      'Presented alongside the identity film, this record captures the event from a more observational angle.',
      'Splitting the two into separate detail pages keeps the distinction between promotion and documentation clear.',
    ],
  },
  {
    title: '2020台灣美術雙年展 ─ 宣傳影片',
    slug: '2020台灣美術雙年展-─-宣傳影片',
    year: 2020,
    type: 'Art Event',
    coverFile: '2020台灣美術雙年展-─-宣傳影片.jpg',
    videoId: 'T_TDoj6zMNY',
    roles: ['editor', 'motion-graphic-designer'],
    logline: 'A promotional teaser for the Taiwan Biennial, centered on pacing, reveals, and event identity.',
    runtime: '00:52',
    description: [
      'This earlier art event project gives the portfolio historical range and shows the continuity of exhibition-related work over time.',
      'It also makes a strong candidate for future featured curation once the Sanity-driven homepage is live.',
    ],
  },
];

const sortedFilms = filmSeeds
  .map(filmFromSeed)
  .sort((left, right) => right.year - left.year || left.title.localeCompare(right.title));

export const fallbackFilms: Film[] = sortedFilms;

export const fallbackFilmSummaries: FilmSummary[] = sortedFilms.map((film) => ({
  title: film.title,
  year: film.year,
  slug: film.slug,
  type: film.type,
  coverImage: film.coverImage,
  tags: film.tags,
  logline: film.logline,
}));

const logo = getLocalImage('logo_v1.png', 'Joshua Yue');

export const fallbackSiteSettings: SiteSettings = {
  siteTitle: 'Joshua Yue',
  siteDescription:
    'A cinematic portfolio of documentary, art event, and brand moving-image work rebuilt with Astro and Sanity-ready content models.',
  logo,
  primaryNav: [
    { href: '/', label: 'Work' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ],
  footerNote: 'Static-first portfolio prototype with legacy content migrated from the previous WordPress build.',
  contactEmail: 'hello@joshuayue.studio',
  socialLinks: [
    { label: 'YouTube', href: 'https://www.youtube.com/' },
    { label: 'Instagram', href: 'https://www.instagram.com/' },
  ],
};

export const fallbackHomePage: HomePage = {
  eyebrow: 'Selected Work',
  title: 'Moving-image work across cultural commissions, documentary texture, and brand storytelling.',
  intro:
    'This first Astro build brings the legacy portfolio into a cleaner static-first structure while keeping the project archive easy to browse and ready for Sanity-backed editing later.',
  focusAreas: ['Documentary', 'Commercial', 'Short Form', 'Art Event'],
  featuredSlugs: [
    '2024-臺灣國際光影藝術節【前導影片】',
    '2023-real-leather-stay-different-taiwan',
    'inside-out-project-生而自由─形象影片',
    '山林記憶-─-巡山日記',
    '第2屆浪漫台三線藝術季｜設計導入計畫',
    '衛武營五週年─形象紀錄片',
  ],
  closingNote:
    'For this testing phase, legacy media is kept local inside the repo so the site remains buildable before Sanity asset delivery is finalized.',
};

export const fallbackAboutPage: AboutPage = {
  eyebrow: 'About',
  title: 'Joshua Yue builds films that stay attentive to place, texture, and editorial rhythm.',
  intro:
    'The original WordPress portfolio was centered on the work itself. This rebuilt version keeps that focus, but adds structure for biography, contact, and future CMS-managed updates.',
  bio: [
    'Joshua Yue is a filmmaker working across documentary, cultural commissions, exhibition media, and brand storytelling.',
    'The current site rebuild prioritizes clarity: each project is presented as a durable film entry with roles, media, and context, instead of living as a one-off WordPress page.',
    'As the project grows, the same structure can expand into Sanity-managed copy, richer still galleries, and better editorial sequencing without changing the frontend architecture.',
  ],
  highlights: [
    'Static-first Astro routing with deferred islands only where interaction matters',
    'Sanity-ready content models for site settings, homepage, about, contact, and film entries',
    'Legacy media preserved locally for testing while keeping a clean path to future CDN-backed delivery',
  ],
};

export const fallbackContactPage: ContactPage = {
  eyebrow: 'Contact',
  title: 'Available for documentary, cultural, and commissioned moving-image projects.',
  intro:
    'This prototype keeps contact details lightweight and easy to update later from Sanity. For now, it provides a clear path for collaboration inquiries while the new portfolio is being tested.',
  availability:
    'Open to commissions, editorial collaborations, and conversations around documentary, exhibition, and culture-facing film work.',
  email: fallbackSiteSettings.contactEmail,
  socialLinks: fallbackSiteSettings.socialLinks,
};
