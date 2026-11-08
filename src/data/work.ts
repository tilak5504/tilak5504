// ─────────────────────────────────────────────────────────────
//  EDIT YOUR WORK HERE
//  Everything shown in the "Proof of Work" section comes from
//  this file. Change the text, numbers or links below and the
//  site updates — no other code needs touching.
// ─────────────────────────────────────────────────────────────

import posters from "./posters.json";

export type Reel = {
  id: string;
  title: string;
  client: string;
  type: string;
  /** "portrait" for 9:16 phone videos, "landscape" for 16:9 */
  shape: "portrait" | "landscape";
};

export const reels: Reel[] = [
  { id: "reel-2", title: "The viral dessert", client: "Deluxe Mahal", type: "Launch reel", shape: "portrait" },
  { id: "reel-6", title: "Deluxe Sitaphal", client: "Deluxe Mahal", type: "Product reel", shape: "portrait" },
  { id: "reel-5", title: "Behind the service", client: "Deluxe Mahal", type: "Brand film", shape: "portrait" },
  { id: "reel-1", title: "From above", client: "Deluxe Mahal", type: "Cinematic edit", shape: "portrait" },
  { id: "reel-3", title: "Paid internship in Infosys", client: "Staid India", type: "Typography reel", shape: "portrait" },
  { id: "reel-4", title: "How to build what you don't know", client: "Staid India", type: "Typography reel", shape: "portrait" },
  { id: "reel-7", title: "Aaya", client: "Personal", type: "Festival edit", shape: "landscape" },
  { id: "reel-8", title: "What's cooking?", client: "Personal", type: "Motion graphics", shape: "landscape" },
];

export type Video = { id: string; title: string; subtitle: string; kind: "Podcast" | "Short film" };

export const videos: Video[] = [
  { id: "wOwXPLGLPjY", title: "Escape", subtitle: "Short film · Fictional Frames", kind: "Short film" },
  { id: "3DsbOnrOvJs", title: "Acuvate Podcast · Ep 1", subtitle: "Produced & directed", kind: "Podcast" },
  { id: "jXGHHk7ZOPI", title: "Acuvate Podcast · Ep 2", subtitle: "Produced & directed", kind: "Podcast" },
];

export type Blog = {
  title: string;
  publisher: string;
  date: string;
  summary: string;
  url: string;
  image: string;
};

export const blogs: Blog[] = [
  {
    title: "From a Picker Role to a Store Manager at Swiggy: Meet Pritam Chakraborty",
    publisher: "Swiggy",
    date: "May 2025",
    summary: "A Swiggster growth story: how Pritam rose from Instamart pod picker to store manager in about three years.",
    url: "https://blog.swiggy.com/life-at-swiggy/from-a-picker-role-to-a-store-manager-at-swiggy-meet-pritam-chakraborty/",
    image: "https://blog.swiggy.com/wp-content/uploads/2025/05/Pritam-Blog-Creative-1.2-1-1.png",
  },
  {
    title: "Tableau to Power BI Migration: Benefits, Challenges & Best Practices",
    publisher: "Acuvate",
    date: "Feb 2025",
    summary: "Why companies are moving from Tableau to Power BI, and best practices for a smooth switch.",
    url: "https://acuvate.com/blog/tableau-to-power-bi-migration/",
    image: "https://acuvate.com/wp-content/uploads/2024/05/Tableau-to-PowerBi-Migration.webp",
  },
  {
    title: "Unlock the Full Potential of Your Data with AcuPrism",
    publisher: "Acuvate",
    date: "Jan 2025",
    summary: "A product blog introducing AcuPrism, Acuvate's enterprise data platform for Databricks and Microsoft Fabric.",
    url: "https://acuvate.com/blog/scalable-seamless-data-platform-acuprism/",
    image: "https://acuvate.com/wp-content/uploads/2025/01/Unlock-the-Full-Potential-of-Your-Data-with-Acuprism.webp",
  },
];

export type Poster = (typeof posters)[number];
export { posters };
