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
      description:
        'YouTube 與 Vimeo 使用嵌入網址。Custom 僅接受 Vidstack 可播放的 MP4 / HLS / DASH 媒體來源。',
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
          description: 'YouTube / Vimeo 使用。舊的 custom 內容過渡期仍會讀取此欄位。',
          hidden: ({parent}) => parent?.provider === 'custom',
          validation: (rule) =>
            rule.custom((value, context) => {
              const provider = context.parent && typeof context.parent === 'object'
                ? (context.parent as {provider?: string}).provider
                : undefined

              if (provider === 'youtube' || provider === 'vimeo') {
                return typeof value === 'string' && value.length > 0
                  ? true
                  : 'YouTube 與 Vimeo 必須提供 Embed URL。'
              }

              return true
            }),
        }),
        defineField({
          name: 'src',
          title: 'Media source URL',
          type: 'url',
          description: 'Custom 影片請填可直接播放的 MP4、m3u8 或 mpd 來源網址。',
          hidden: ({parent}) => parent?.provider !== 'custom',
          validation: (rule) =>
            rule.custom((value, context) => {
              const parent =
                context.parent && typeof context.parent === 'object'
                  ? (context.parent as {provider?: string; embedUrl?: string})
                  : undefined

              if (parent?.provider !== 'custom') {
                return true
              }

              if (
                (typeof value === 'string' && value.length > 0) ||
                (typeof parent.embedUrl === 'string' && parent.embedUrl.length > 0)
              ) {
                return true
              }

              return 'Custom 影片至少要提供一個可播放的媒體來源 URL。'
            }),
        }),
        defineField({
          name: 'mimeType',
          title: 'MIME type',
          type: 'string',
          description: '選填，例如 video/mp4、application/x-mpegURL、application/dash+xml。',
          hidden: ({parent}) => parent?.provider !== 'custom',
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
