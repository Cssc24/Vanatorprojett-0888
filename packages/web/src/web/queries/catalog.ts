import { useQuery } from "@tanstack/react-query";
import { orpc } from "../lib/api";

export interface WeaponFilters {
  search: string;
  class: string;
  caliber: string;
  game: string;
}

export function useWeapons(filters: WeaponFilters) {
  return useQuery(orpc.catalog.weapons.queryOptions({ input: filters, staleTime: 60_000 }));
}

export function useShops(search: string, county: string) {
  return useQuery(
    orpc.catalog.shops.queryOptions({ input: { search, county }, staleTime: 60_000 }),
  );
}

export function useGuideIndex() {
  return useQuery(orpc.catalog.guideIndex.queryOptions({ staleTime: Infinity }));
}

export function useGuideArticle(slug: string) {
  return useQuery(
    orpc.catalog.guideArticle.queryOptions({
      input: { slug },
      enabled: slug.length > 0,
      staleTime: Infinity,
    }),
  );
}
