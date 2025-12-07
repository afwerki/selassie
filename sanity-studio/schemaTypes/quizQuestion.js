import { defineType, defineField } from "sanity";

export const quizQuestion = defineType({
  name: "quizQuestion",
  title: "ጥያቄ እና መልስ መጫኛ",
  type: "object",
  fields: [
    defineField({
      name: "questionText",
      title: "Question",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "difficulty",
      title: "Difficulty",
      type: "string",
      options: {
        list: [
          { title: "Beginner", value: "Beginner" },
          { title: "Intermediate", value: "Intermediate" },
          { title: "Advanced", value: "Advanced" },
        ],
        layout: "radio",
      },
      initialValue: "Beginner",
    }),
    defineField({
      name: "explanation",
      title: "Explanation / Feedback",
      type: "text",
      rows: 3,
      description:
        "Short explanation shown after the user answers. Keep it pastoral and simple.",
    }),
    defineField({
      name: "options",
      title: "Answer options",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "label",
              title: "Answer text",
              type: "string",
              validation: (Rule) => Rule.required(),
            },
            {
              name: "isCorrect",
              title: "Correct answer?",
              type: "boolean",
              initialValue: false,
            },
          ],
          preview: {
            select: {
              title: "label",
              isCorrect: "isCorrect",
            },
            prepare({ title, isCorrect }) {
              return {
                title: title || "Option",
                subtitle: isCorrect ? "✅ Correct" : "—",
              };
            },
          },
        },
      ],
      validation: (Rule) =>
        Rule.min(2).custom((options) => {
          if (!options) return "Add at least 2 options.";
          const correctCount = options.filter((o) => o.isCorrect).length;
          if (correctCount === 0) return "Mark exactly one option as correct.";
          if (correctCount > 1)
            return "Only one option should be marked as correct.";
          return true;
        }),
    }),
  ],
  preview: {
    select: {
      title: "questionText",
      difficulty: "difficulty",
    },
    prepare({ title, difficulty }) {
      return {
        title: (title || "").slice(0, 60),
        subtitle: difficulty || "No difficulty set",
      };
    },
  },
});
