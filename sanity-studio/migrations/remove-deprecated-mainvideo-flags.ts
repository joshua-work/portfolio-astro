import {at, defineMigration, unset} from 'sanity/migrate'

type FilmMigrationDocument = {
  mainVideo?: {
    autoplay?: boolean
    muted?: boolean
    loop?: boolean
  }
}

export default defineMigration({
  title: 'Remove deprecated mainVideo flags',
  documentTypes: ['film'],

  migrate: {
    document(doc) {
      const filmDoc = doc as FilmMigrationDocument
      const patches = []

      if (filmDoc.mainVideo?.autoplay !== undefined) {
        patches.push(at('mainVideo.autoplay', unset()))
      }

      if (filmDoc.mainVideo?.muted !== undefined) {
        patches.push(at('mainVideo.muted', unset()))
      }

      if (filmDoc.mainVideo?.loop !== undefined) {
        patches.push(at('mainVideo.loop', unset()))
      }

      return patches
    },
  },
})
