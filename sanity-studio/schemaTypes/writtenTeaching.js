// /schemaTypes/writtenTeaching.js
import { defineType, defineField } from "sanity";

export const writtenTeaching = defineType({
  name: "writtenTeaching",
  title: "ትምህርቶች በፅሁፍ",
  type: "document",

  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      // ✅ NOT required (prevents publish-blocking + that yellow warning)
      // If you still want to *encourage* title, use description instead:
      description: "Please add a clear title (you can publish drafts without it).",
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      // ✅ optional + auto source
      options: { source: "title", maxLength: 96 },
      description: "Optional. Click Generate after you enter a title.",
    }),

    defineField({
      name: "language",
      title: "Language",
      type: "string",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "አማርኛ (Amharic)", value: "am" },
          { title: "ትግርኛ (Tigrinya)", value: "ti" },
        ],
        layout: "radio",
      },
      // ✅ default value = avoids missing field on new docs
      initialValue: "am",
    }),

    defineField({ name: "series", title: "Series", type: "string" }),
    defineField({ name: "author", title: "Author", type: "string" }),

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
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      rows: 3,
      description: "Short summary shown on the card (recommended).",
    }),

    defineField({
      name: "body",
      title: "Body",
      type: "array",
      of: [{ type: "block" }],
    }),

    defineField({
      name: "pdfFile",
      title: "PDF File",
      type: "file",
      options: {
        accept: "application/pdf",
      },
    }),

    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      description: "Image shown on the teaching card (optional).",
    }),
  ],

  preview: {
    select: {
      title: "title",
      media: "heroImage",
      subtitle: "author",
    },
    prepare({ title, media, subtitle }) {
      return {
        title: title || "Untitled teaching",
        subtitle: subtitle ? `By ${subtitle}` : "No author",
        media,
      };
    },
  },
});
