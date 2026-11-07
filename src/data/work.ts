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

export type Poster = (typeof posters)[number];
export { posters };
