// /schemas/quizSet.js
import { defineType, defineField } from "sanity";

export const quizSet = defineType({
  name: "quizSet",
  title: "ጥያቄ እና መልስ መጫኛ",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Quiz title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 80,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      description: "Shown at the top of this quiz set on the website.",
    }),
    defineField({
      name: "description",
      title: "Short description",
      type: "text",
      rows: 2,
      description:
        "Short intro for this quiz set (e.g. ‘Basics of the Holy Trinity’).",
    }),
    defineField({
      name: "createdAt",
      title: "Created / Published at",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      description: "Used to order quiz sets (newest first).",
    }),
    defineField({
      name: "questions",
      title: "Questions",
      type: "array",
      of: [{ type: "quizQuestion" }], // the object schema we created earlier
      validation: (Rule) => Rule.min(1),
    }),
    defineField({
      name: "isActive",
      title: "Active?",
      type: "boolean",
      initialValue: true,
    }),

    // 🔔 Web Push Notification Controls
    defineField({
      name: "sendPush",
      title: "Send Web Push Notification",
      type: "boolean",
      description: "Notify users when this quiz set is published",
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
      subtitle: "description",
    },
  },
});
