import { z } from "zod";
import { base } from "../__core/app";
import weaponsData from "../data/weapons.json";
import shopsData from "../data/shops.json";
import guideData from "../data/guide.json";
import seasonsData from "../data/seasons.json";
import factsData from "../data/facts.json";

export type Weapon = (typeof weaponsData)[number];
export type Shop = (typeof shopsData)[number];
export type GuideArticle = (typeof guideData)[number];

const WEAPONS = weaponsData as Weapon[];
const SHOPS = shopsData as Shop[];
const GUIDE = guideData as GuideArticle[];

const norm = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();

export const catalog = {
  /** Weapon inventory with filters + the facet values for the filter bar. */
  weapons: base
    .input(
      z
        .object({
          search: z.string().default(""),
          class: z.string().default("toate"),
          caliber: z.string().default("toate"),
          game: z.string().default("toate"),
        })
        .default({ search: "", class: "toate", caliber: "toate", game: "toate" }),
    )
    .handler(({ input }) => {
      const q = norm(input.search);
      const items = WEAPONS.filter((w) => {
        if (input.class !== "toate" && w.class !== input.class) return false;
        if (input.caliber !== "toate" && !w.calibers.includes(input.caliber)) return false;
        if (input.game !== "toate" && !w.game.includes(input.game)) return false;
        if (!q) return true;
        return norm(`${w.name} ${w.brand} ${w.type} ${w.calibers.join(" ")}`).includes(q);
      });
      return {
        items,
        facets: {
          calibers: [...new Set(WEAPONS.flatMap((w) => w.calibers))].sort(),
          game: [...new Set(WEAPONS.flatMap((w) => w.game))].sort(),
        },
        totalCount: WEAPONS.length,
      };
    }),

  weapon: base.input(z.object({ id: z.string() })).handler(({ input }) => {
    return WEAPONS.find((w) => w.id === input.id) ?? null;
  }),

  /** Gun shops, searchable by city / county / name. */
  shops: base
    .input(
      z
        .object({ search: z.string().default(""), county: z.string().default("toate") })
        .default({ search: "", county: "toate" }),
    )
    .handler(({ input }) => {
      const q = norm(input.search);
      const items = SHOPS.filter((s) => {
        if (input.county !== "toate" && s.county !== input.county) return false;
        if (!q) return true;
        return norm(`${s.name} ${s.city} ${s.county} ${s.address}`).includes(q);
      });
      return {
        items,
        counties: [...new Set(SHOPS.map((s) => s.county))].sort((a, b) => a.localeCompare(b, "ro")),
        cities: [...new Set(SHOPS.map((s) => s.city))].sort((a, b) => a.localeCompare(b, "ro")),
        totalCount: SHOPS.length,
      };
    }),

  /** Hunter's guide index (no section bodies). */
  guideIndex: base.handler(() =>
    GUIDE.map(({ slug, title, eyebrow, excerpt, readMinutes, image }) => ({
      slug,
      title,
      eyebrow,
      excerpt,
      readMinutes,
      image,
    })),
  ),

  guideArticle: base.input(z.object({ slug: z.string() })).handler(({ input }) => {
    const index = GUIDE.findIndex((a) => a.slug === input.slug);
    if (index === -1) return null;
    const next = GUIDE[(index + 1) % GUIDE.length]!;
    return { article: GUIDE[index]!, next: { slug: next.slug, title: next.title } };
  }),

  /** Hunting seasons table + quick facts. */
  seasons: base.handler(() => seasonsData),
  facts: base.handler(() => factsData),
};
