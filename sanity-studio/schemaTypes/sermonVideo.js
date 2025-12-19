// /schemaTypes/sermonVideo.js
import { defineType, defineField } from "sanity";

export const sermonVideo = defineType({
  name: "sermonVideo",
  title: "ትምህርቶች በVideo",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
    }),

    defineField({ name: "series", title: "Series", type: "string" }),
    defineField({ name: "speaker", title: "Speaker", type: "string" }),

    defineField({
      name: "topicTags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
    }),

    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
    }),

    defineField({
      name: "isFeatured",
      title: "Featured",
      type: "boolean",
      initialValue: false,
    }),

    defineField({
      name: "youtubeId",
      title: "YouTube Video ID",
      type: "string",
      validation: (Rule) => Rule.required(),
      description: "Example: dQw4w9WgXcQ (not the full URL).",
    }),

    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 4,
    }),

    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: { list: ["en", "am", "ti"] },
      initialValue: "en",
    }),

    defineField({
      name: "thumbnail",
      title: "Thumbnail",
      type: "image",
      options: { hotspot: true },
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "speaker",
      media: "thumbnail",
    },
  },
});
