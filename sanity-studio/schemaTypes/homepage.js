import { defineType, defineField } from 'sanity'

export const homepage = defineType({
  name: 'homepage',
  title: 'Homepage',
  type: 'document',
  fields: [
    // SERVICE BOX HEADER
    defineField({
      name: 'serviceBoxTitle',
      title: 'Service box title',
      type: 'string',
      initialValue: 'Service Times',
    }),
    defineField({
      name: 'serviceBoxSubtitle',
      title: 'Service box subtitle',
      type: 'string',
      initialValue: 'Join us for worship',
    }),

    // SERVICE ITEMS (REPEATABLE)
    defineField({
      name: 'serviceItems',
      title: 'Service items',
      type: 'array',
      of: [
        defineField({
          name: 'serviceItem',
          type: 'object',
          fields: [
            {
              name: 'label',
              title: 'Service name',
              type: 'string',
            }, // e.g. Sunday Liturgy

            {
              name: 'subLabel',
              title: 'Short description',
              type: 'string',
            },

            {
              name: 'time',
              title: 'Time',
              type: 'string',
              description: 'Example: 8:00 AM',
            },

            {
              name: 'description',
              title: 'Full details (shown on click)',
              type: 'text',
            },

            // NEW — Clean multi-line address
            {
              name: 'address',
              title: 'Address (displayed nicely)',
              type: 'text',
              description: 'Write a clean, multi-line address. Example:\nDebre-Genet Holy Trinity Church\nSt Michael’s Church Hall\nLondon NW2 6QX',
            },

            // NEW — Google Maps link
            {
              name: 'mapLink',
              title: 'Google Maps Link',
              type: 'url',
              description: 'Paste the full Google Maps URL (opens when user clicks "View on Google Maps").',
            },

            // OLD FIELD — kept to avoid breaking existing data
            {
              name: 'location',
              title: 'Location (deprecated)',
              type: 'string',
              description: 'This is replaced by the Address + Google Maps Link fields above.',
            },

            {
              name: 'notes',
              title: 'Extra notes',
              type: 'text',
            },

            {
              name: 'isActive',
              title: 'Show this service?',
              type: 'boolean',
              initialValue: true,
            },
          ],

          preview: {
            select: {
              title: 'label',
              subtitle: 'time',
            },
          },
        }),
      ],
    }),
  ],
})
