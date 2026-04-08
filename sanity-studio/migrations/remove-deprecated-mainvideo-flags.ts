import {at, defineMigration, unset} from 'sanity/migrate'

export default defineMigration({
  title: 'Remove deprecated mainVideo flags',
  documentTypes: ['film'],

  migrate: {
    document(doc) {
      const patches = []

      if (doc.mainVideo?.autoplay !== undefined) {
        patches.push(at('mainVideo.autoplay', unset()))
      }

      if (doc.mainVideo?.muted !== undefined) {
        patches.push(at('mainVideo.muted', unset()))
      }

      if (doc.mainVideo?.loop !== undefined) {
        patches.push(at('mainVideo.loop', unset()))
      }

      return patches
    },
  },
})
