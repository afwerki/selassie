// /schemas/project.js
import { defineType, defineField } from "sanity";

export const project = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Project title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 80 },
    }),
    defineField({
      name: "heroImage",
      title: "Hero image",
      type: "image",
      options: { hotspot: true },
      description: "Main image for this project card.",
    }),
    defineField({
      name: "shortDescription",
      title: "Short description",
      type: "text",
      rows: 2,
      description: "Shown on the card before 'Read more'.",
    }),
    defineField({
      name: "longDescription",
      title: "Full description",
      type: "text",
      rows: 4,
      description: "Shown when the user clicks 'Read more'.",
    }),
    defineField({
      name: "status",
      title: "Status",
      type: "string",
      options: {
        list: [
          { title: "Planned", value: "planned" },
          { title: "In progress", value: "in_progress" },
          { title: "Completed", value: "completed" },
        ],
        layout: "radio",
      },
      initialValue: "in_progress",
    }),
    defineField({
      name: "startDate",
      title: "Start date",
      type: "date",
    }),
    defineField({
      name: "isActive",
      title: "Show on website?",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
      media: "heroImage",
      subtitle: "status",
    },
  },
});
