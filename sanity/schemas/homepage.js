// sanity/schemas/homepage.js
export default {
  name: "homepage",
  title: "Homepage",
  type: "document",
  fields: [
    {
      name: "heroTitle",
      title: "Hero Title",
      type: "string",
    },
    {
      name: "heroSubtitle",
      title: "Hero Subtitle",
      type: "text",
    },
    {
      name: "heroButtonText",
      title: "Hero Button Text",
      type: "string",
    },
  ],
};
