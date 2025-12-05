import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

export default defineConfig({
  name: 'default',
  title: 'Selassie Church',

  projectId: 'x43gpx4o',
  dataset: 'production2',

  plugins: [
    structureTool(),   // 👈 THIS GIVES YOU THE "Structure" UI
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
