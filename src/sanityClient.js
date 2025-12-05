import { createClient } from "@sanity/client";

export const client = createClient({
  projectId: "x43gpx4o",      // from your sanity.config.js
  dataset: "production2",     // 🔴 MUST MATCH sanity.config.js
  apiVersion: "2023-01-01",
  useCdn: true,
});
