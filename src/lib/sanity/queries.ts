export const filmSummaryProjection = `
  title,
  year,
  "slug": slug.current,
  type,
  logline,
  "tags": tags[]->title,
  coverImage{
    asset->{
      _id,
      url,
      metadata{
        dimensions,
        lqip
      }
    },
    alt,
    caption
  }
`;

export const filmsListQuery = `*[_type == "film"] | order(year desc) {
  ${filmSummaryProjection}
}`;

export const filmDetailProjection = `
  ${filmSummaryProjection},
  runtime,
  credits[]{
    role,
    names
  },
  stills[]{
    asset->{
      _id,
      url,
      metadata{
        dimensions,
        lqip
      }
    },
    alt,
    caption
  },
  mainVideo{
    provider,
    embedUrl,
    watchUrl,
    title,
    autoplay,
    muted,
    loop,
    poster{
      asset->{
        _id,
        url,
        metadata{
          dimensions,
          lqip
        }
      },
      alt,
      caption
    }
  },
  body
`;

export const allFilmsQuery = `*[_type == "film"] | order(year desc) {
  ${filmDetailProjection}
}`;

export const filmBySlugQuery = `*[_type == "film" && slug.current == $slug][0] {
  ${filmDetailProjection}
}`;

export const siteSettingsQuery = `*[_type == "siteSettings"][0] {
  siteTitle,
  siteDescription,
  logo{
    asset->{
      _id,
      url,
      metadata{
        dimensions,
        lqip
      }
    },
    alt,
    caption
  },
  primaryNav[]{
    href,
    label
  },
  footerNote,
  contactEmail,
  socialLinks[]{
    label,
    href
  }
}`;

export const homePageQuery = `*[_type == "homePage"][0] {
  eyebrow,
  title,
  intro,
  focusAreas,
  featuredSlugs,
  closingNote
}`;

export const aboutPageQuery = `*[_type == "aboutPage"][0] {
  eyebrow,
  title,
  intro,
  bio,
  highlights
}`;

export const contactPageQuery = `*[_type == "contactPage"][0] {
  eyebrow,
  title,
  intro,
  availability,
  email,
  socialLinks[]{
    label,
    href
  }
}`;
