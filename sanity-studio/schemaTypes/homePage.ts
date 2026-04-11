import {defineField, defineType} from 'sanity'

export const homePageType = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
      name: 'eyebrow',
      title: 'Eyebrow',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'title',
      title: 'Title',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      title: 'Intro',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'focusAreas',
      title: 'Focus areas',
      type: 'array',
      of: [{type: 'string'}],
    }),
    defineField({
      name: 'featuredSlugs',
      title: 'Featured film slugs',
      type: 'array',
      of: [{type: 'string'}],
      description: 'These should match the slug value of film documents.',
    }),
  ],
})
