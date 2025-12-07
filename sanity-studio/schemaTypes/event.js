// /sanity/schemas/event.js
import { defineType, defineField } from "sanity";

export const event = defineType({
  name: "event",
  title: "ቀን መቁጠሪያ እና ፕሮግራሞች",
  type: "document",
  fields: [
    // BASIC INFO
    defineField({
      name: "title",
      title: "Event title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
    }),

    defineField({
      name: "isActive",
      title: "Show this event?",
      type: "boolean",
      initialValue: true,
    }),

    defineField({
      name: "isFeatured",
      title: "Feature this event?",
      type: "boolean",
      description: "Featured events can be highlighted on the homepage later.",
      initialValue: false,
    }),

    // DATE & TIME
    defineField({
      name: "startDateTime",
      title: "Start date & time",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),

    defineField({
      name: "endDateTime",
      title: "End date & time",
      type: "datetime",
      description: "Optional – leave empty if not needed.",
    }),

    // TEXT CONTENT
    defineField({
      name: "shortSummary",
      title: "Short summary",
      type: "string",
      description: "1–2 line summary shown on the card before you expand it.",
    }),

    defineField({
      name: "description",
      title: "Full event description",
      type: "text",
      description: "Full details shown when the user expands the event.",
    }),

    // LOCATION
    defineField({
      name: "location",
      title: "Location (short)",
      type: "string",
      description: 'Example: "Church Sanctuary", "Community Hall".',
    }),

    defineField({
      name: "address",
      title: "Address (multi-line, optional)",
      type: "text",
      description:
        'Write a clean, multi-line address. Example:\nDebre-Genet Holy Trinity Church\nSt Michael’s Church Hall\nLondon NW2 6QX',
    }),

    defineField({
      name: "mapLink",
      title: "Google Maps link",
      type: "url",
      description: 'Full Google Maps URL – opens when user clicks "View on map".',
    }),

    // IMAGE
    defineField({
      name: "mainImage",
      title: "Event image",
      type: "image",
      options: {
        hotspot: true,
      },
      description: "This image will appear on the event card.",
    }),
  ],

  preview: {
    select: {
      title: "title",
      subtitle: "location",
      media: "mainImage",
      startDateTime: "startDateTime",
    },
    prepare(selection) {
      const { title, subtitle, media, startDateTime } = selection;
      const dateLabel = startDateTime
        ? new Date(startDateTime).toLocaleDateString("en-GB", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        : "";

      return {
        title,
        subtitle: subtitle
          ? `${subtitle} — ${dateLabel}`
          : dateLabel || "No date set",
        media,
      };
    },
  },
});
