// /sanity/schemas/newsArticle.js
import { defineType, defineField } from "sanity";
import { EarthGlobeIcon } from "@sanity/icons";

export const newsArticle = defineType({
  name: "newsArticle",
  title: "የቤተክርስቲያን ዜናዎች መጫኛ",
  type: "document",
  icon: EarthGlobeIcon,

  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required().min(5),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Announcement", value: "Announcement" },
          { title: "Community", value: "Community" },
          { title: "Feast Day", value: "Feast Day" },
          { title: "Service Update", value: "Service Update" },
          { title: "Youth Ministry", value: "Youth" },
          { title: "General", value: "General" },
        ],
        layout: "dropdown",
      },
    }),

    defineField({
      name: "language",
      title: "Language",
      type: "string",
      initialValue: "en",
      options: {
        list: [
          { title: "English", value: "en" },
          { title: "Amharic", value: "am" },
        ],
        layout: "radio",
      },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "summary",
      title: "Short Summary",
      type: "text",
      rows: 3,
      description: "Appears in the preview card and summary area.",
      validation: (Rule) => Rule.max(300),
    }),

    defineField({
      name: "body",
      title: "Full Article Body",
      type: "array",
      of: [{ type: "block" }],
      description: "Optional full news story (future feature).",
    }),

    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "publishedAt",
      title: "Published Date",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),

    defineField({
      name: "isPublished",
      title: "Is Published?",
      type: "boolean",
      initialValue: true,
    }),

    // 🔔 Web Push Notification Controls
    defineField({
      name: "sendPush",
      title: "Send Web Push Notification",
      type: "boolean",
      description: "Notify users when this news article is published",
      initialValue: false,
    }),

    defineField({
      name: "pushTitle",
      title: "Push Title (optional)",
      type: "string",
      description: "Overrides the notification title",
    }),

    defineField({
      name: "pushBody",
      title: "Push Message (optional)",
      type: "text",
      rows: 2,
      description: "Overrides the notification message",
    }),
  ],

  preview: {
    select: {
      title: "title",
      media: "heroImage",
      language: "language",
      category: "category",
    },
    prepare({ title, media, language, category }) {
      return {
        title,
        subtitle: `${language?.toUpperCase() || "EN"} — ${category || ""}`,
        media,
      };
    },
  },
});
