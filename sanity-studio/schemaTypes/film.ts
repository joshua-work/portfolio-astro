import {defineField, defineType} from 'sanity'

const imageField = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'image',
    options: {hotspot: true},
    fields: [
      defineField({
        name: 'alt',
        title: 'Alt text',
        type: 'string',
        validation: (rule) => rule.max(160),
      }),
      defineField({
        name: 'caption',
        title: 'Caption',
        type: 'string',
      }),
    ],
  })

export const filmType = defineType({
  name: 'film',
  title: 'Films',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'year',
      title: 'Year',
      type: 'number',
      validation: (rule) => rule.required().integer().min(1900).max(2100),
    }),
    defineField({
      name: 'type',
      title: 'Type',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'logline',
      title: 'Logline',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.required().max(280),
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
    }),
    imageField('coverImage', 'Cover image'),
    defineField({
      name: 'runtime',
      title: 'Runtime',
      type: 'string',
      description: 'Example: 01:32',
    }),
    defineField({
      name: 'credits',
      title: 'Credits',
      type: 'array',
      of: [
        defineField({
          name: 'creditItem',
          title: 'Credit item',
          type: 'object',
          fields: [
            defineField({
              name: 'role',
              title: 'Role',
              type: 'string',
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: 'names',
              title: 'Names',
              type: 'array',
              of: [{type: 'string'}],
              validation: (rule) => rule.required().min(1),
            }),
          ],
          preview: {
            select: {
              title: 'role',
              subtitle: 'names.0',
            },
          },
        }),
      ],
    }),
    defineField({
      name: 'stills',
      title: 'Stills',
      type: 'array',
      of: [imageField('stillImage', 'Still image')],
    }),
    defineField({
      name: 'mainVideo',
      title: 'Main video',
      type: 'object',
      fields: [
        defineField({
          name: 'provider',
          title: 'Provider',
          type: 'string',
          options: {
            list: [
              {title: 'YouTube', value: 'youtube'},
              {title: 'Vimeo', value: 'vimeo'},
              {title: 'Custom', value: 'custom'},
            ],
            layout: 'radio',
          },
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'embedUrl',
          title: 'Embed URL',
          type: 'url',
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'watchUrl',
          title: 'Watch URL',
          type: 'url',
        }),
        defineField({
          name: 'title',
          title: 'Video title',
          type: 'string',
        }),
        imageField('poster', 'Poster image'),
      ],
    }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [{type: 'block'}],
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'year',
      media: 'coverImage',
    },
    prepare({title, subtitle, media}) {
      return {
        title,
        subtitle: subtitle ? String(subtitle) : undefined,
        media,
      }
    },
  },
})
