import { sanityClient, isSanityConfigured } from '@/lib/sanity/client';
import {
  aboutPageQuery,
  allFilmsQuery,
  contactPageQuery,
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

import {
  fallbackAboutPage,
  fallbackContactPage,
  fallbackFilms,
  fallbackFilmSummaries,
  fallbackHomePage,
  fallbackSiteSettings,
} from '@/lib/content/fallback';

export type ContentSource = 'sanity' | 'fallback';

export type ContentResult<T> = {
  data: T;
  source: ContentSource;
};

function normalizeFilm(film: Film): Film {
  return {
    ...film,
    tags: film.tags ?? [],
    stills: film.stills ?? [],
    credits: film.credits ?? [],
    body: film.body ?? [],
  };
}

async function fetchWithFallback<T>(
  query: string,
  fallback: T,
  params?: Record<string, string>,
): Promise<ContentResult<T>> {
  if (!isSanityConfigured()) {
    return {
      data: fallback,
      source: 'fallback',
    };
  }

  try {
    const client = sanityClient;

    if (!client) {
      return {
        data: fallback,
        source: 'fallback',
      };
    }

    const result = await client.fetch<T | null>(query, params ?? {});
    return {
      data: result ?? fallback,
      source: result ? 'sanity' : 'fallback',
    };
  } catch {
    return {
      data: fallback,
      source: 'fallback',
    };
  }
}

export async function getSiteSettings(): Promise<SiteSettings> {
  const result = await getSiteSettingsWithSource();
  return result.data;
}

export async function getSiteSettingsWithSource(): Promise<ContentResult<SiteSettings>> {
  return fetchWithFallback(siteSettingsQuery, fallbackSiteSettings);
}

export async function getHomePage(): Promise<HomePage> {
  const result = await getHomePageWithSource();
  return result.data;
}

export async function getHomePageWithSource(): Promise<ContentResult<HomePage>> {
  return fetchWithFallback(homePageQuery, fallbackHomePage);
}

export async function getAboutPage(): Promise<AboutPage> {
  const result = await getAboutPageWithSource();
  return result.data;
}

export async function getAboutPageWithSource(): Promise<ContentResult<AboutPage>> {
  return fetchWithFallback(aboutPageQuery, fallbackAboutPage);
}

export async function getContactPage(): Promise<ContactPage> {
  const result = await getContactPageWithSource();
  return result.data;
}

export async function getContactPageWithSource(): Promise<ContentResult<ContactPage>> {
  return fetchWithFallback(contactPageQuery, fallbackContactPage);
}

export async function getAllFilms(): Promise<Film[]> {
  const result = await getAllFilmsWithSource();
  return result.data;
}

export async function getAllFilmsWithSource(): Promise<ContentResult<Film[]>> {
  const result = await fetchWithFallback(allFilmsQuery, fallbackFilms);

  return {
    ...result,
    data: result.data.map(normalizeFilm),
  };
}

export async function getFilmSummaries(): Promise<FilmSummary[]> {
  const result = await getFilmSummariesWithSource();
  return result.data;
}

export async function getFilmSummariesWithSource(): Promise<ContentResult<FilmSummary[]>> {
  const result = await getAllFilmsWithSource();
  const films = result.data;

  return {
    data: films.map((film) => ({
      title: film.title,
      year: film.year,
      slug: film.slug,
      type: film.type,
      coverImage: film.coverImage,
      tags: film.tags,
      logline: film.logline,
    })),
    source: result.source,
  };
}

export async function getFeaturedFilms(): Promise<FilmSummary[]> {
  const result = await getFeaturedFilmsWithSource();
  return result.data;
}

export async function getFeaturedFilmsWithSource(): Promise<ContentResult<FilmSummary[]>> {
  const [homePageResult, filmsResult] = await Promise.all([
    getHomePageWithSource(),
    getFilmSummariesWithSource(),
  ]);
  const filmMap = new Map(filmsResult.data.map((film) => [film.slug, film]));
  const featured = homePageResult.data.featuredSlugs
    .map((slug) => filmMap.get(slug))
    .filter((film): film is FilmSummary => Boolean(film));

  if (featured.length > 0) {
    return {
      data: featured,
      source:
        homePageResult.source === 'sanity' && filmsResult.source === 'sanity'
          ? 'sanity'
          : 'fallback',
    };
  }

  return {
    data: fallbackFilmSummaries.slice(0, 6),
    source: 'fallback',
  };
}

export async function getFilmBySlug(slug: string): Promise<Film | undefined> {
  const result = await getFilmBySlugWithSource(slug);
  return result.data;
}

export async function getFilmBySlugWithSource(
  slug: string,
): Promise<ContentResult<Film | undefined>> {
  const result = await getAllFilmsWithSource();
  return {
    data: result.data.find((film) => film.slug === slug),
    source: result.source,
  };
}
