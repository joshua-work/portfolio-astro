import { sanityClient, isSanityConfigured } from '@/lib/sanity/client';
import {
  aboutPageQuery,
  allFilmsQuery,
  contactPageQuery,
  filmBySlugQuery,
  homePageQuery,
  siteSettingsQuery,
} from '@/lib/sanity/queries';
import type {
  AboutPage,
  ContactPage,
  Film,
  FilmSummary,
  HomePage,
  SiteSettings,
} from '@/lib/sanity/types';

function normalizeFilm(film: Film): Film {
  return {
    ...film,
    tags: film.tags ?? [],
    stills: film.stills ?? [],
    credits: film.credits ?? [],
    body: film.body ?? [],
  };
}

async function fetchRequired<T>(
  query: string,
  missingMessage: string,
  params?: Record<string, string>,
): Promise<T> {
  if (!isSanityConfigured()) {
    throw new Error(
      'Sanity is required but is not configured. Check PUBLIC_SANITY_PROJECT_ID and related environment variables.',
    );
  }

  if (!sanityClient) {
    throw new Error(
      'Sanity client is unavailable. Check PUBLIC_SANITY_PROJECT_ID and related environment variables.',
    );
  }

  const result = await sanityClient.fetch<T | null>(query, params ?? {});

  if (result === null || result === undefined) {
    throw new Error(missingMessage);
  }

  return result;
}

export async function getSiteSettings(): Promise<SiteSettings> {
  return fetchRequired(siteSettingsQuery, 'Missing required Sanity document: siteSettings.');
}

export async function getHomePage(): Promise<HomePage> {
  return fetchRequired(homePageQuery, 'Missing required Sanity document: homePage.');
}

export async function getAboutPage(): Promise<AboutPage> {
  return fetchRequired(aboutPageQuery, 'Missing required Sanity document: aboutPage.');
}

export async function getContactPage(): Promise<ContactPage> {
  return fetchRequired(contactPageQuery, 'Missing required Sanity document: contactPage.');
}

export async function getAllFilms(): Promise<Film[]> {
  const films = await fetchRequired<Film[]>(
    allFilmsQuery,
    'Missing required Sanity content: film entries.',
  );

  return films.map(normalizeFilm);
}

export async function getFilmSummaries(): Promise<FilmSummary[]> {
  const films = await getAllFilms();

  return films.map((film) => ({
    title: film.title,
    year: film.year,
    slug: film.slug,
    type: film.type,
    coverImage: film.coverImage,
    tags: film.tags,
    logline: film.logline,
  }));
}

export async function getFeaturedFilms(): Promise<FilmSummary[]> {
  const [homePage, films] = await Promise.all([getHomePage(), getFilmSummaries()]);
  const filmMap = new Map(films.map((film) => [film.slug, film]));
  const featured = homePage.featuredSlugs
    .map((slug) => filmMap.get(slug))
    .filter((film): film is FilmSummary => Boolean(film));

  if (featured.length === 0) {
    throw new Error('No featured films could be resolved from homePage.featuredSlugs.');
  }

  return featured;
}

export async function getFilmBySlug(slug: string): Promise<Film> {
  const film = await fetchRequired<Film>(
    filmBySlugQuery,
    `Missing required Sanity film document for slug "${slug}".`,
    { slug },
  );

  return normalizeFilm(film);
}
