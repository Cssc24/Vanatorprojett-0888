import { useEffect, useMemo, useState } from "react";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Loader2, MapPin, Phone, Search, ShieldAlert, X } from "lucide-react";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { Reveal } from "../components/reveal";
import { useShops } from "../queries/catalog";

const ROMANIA_CENTER: [number, number] = [45.9, 25.0];

const pin = (active: boolean) =>
  L.divIcon({
    className: "",
    html: `<span style="display:block;width:${active ? 18 : 13}px;height:${
      active ? 18 : 13
    }px;border-radius:999px;background:${
      active ? "#c9a227" : "#7fae55"
    };box-shadow:0 0 0 3px rgba(15,20,12,.85),0 0 12px rgba(0,0,0,.6)"></span>`,
    iconSize: [active ? 18 : 13, active ? 18 : 13],
    iconAnchor: [active ? 9 : 6.5, active ? 9 : 6.5],
  });

function MapFocus({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (target) map.flyTo(target, 12, { duration: 0.8 });
  }, [target, map]);
  return null;
}

export default function ArmuriiPage() {
  const [search, setSearch] = useState("");
  const [county, setCounty] = useState("toate");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const shops = useShops(search, county);
  const items = useMemo(() => shops.data?.items ?? [], [shops.data]);
  const counties = shops.data?.counties ?? [];

  const active = useMemo(() => items.find((s) => s.id === activeId) ?? null, [items, activeId]);
  const target: [number, number] | null = active ? [active.lat, active.lng] : null;

  return (
    <div className="min-h-screen bg-bark">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-bracken">
        <img
          src="/images/gear.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "blur(3px) saturate(.75)" }}
        />
        <div className="absolute inset-0 bg-[rgba(15,20,12,.84)]" />
        <div className="shell relative py-12 md:py-16">
          <Reveal onScroll={false}>
            <p className="eyebrow text-brass">Harta armurăriilor</p>
            <h1 className="mt-4 max-w-3xl text-[clamp(30px,4.4vw,58px)] text-bone">
              Unde cumperi arme și muniție în România
            </h1>
            <p className="mt-4 max-w-2xl text-[17px] text-sage">
              {shops.data?.totalCount ?? 54} magazine de arme și muniție, în{" "}
              {counties.length || 27} județe. Caută după oraș, județ sau nume și vezi punctul exact
              pe hartă.
            </p>
          </Reveal>
        </div>
      </section>

      <main className="shell py-10 md:py-14">
        <div className="flex flex-col gap-3 md:flex-row">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Caută după oraș, județ sau nume de magazin…"
              aria-label="Caută o armurărie"
              className="w-full rounded-[4px] border border-bracken bg-canopy py-3 pl-10 pr-10 text-[15px] text-bone outline-none focus:border-moss"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-sage hover:text-bone"
                aria-label="Șterge căutarea"
              >
                <X size={16} />
              </button>
            )}
          </div>
          <select
            value={county}
            onChange={(event) => setCounty(event.target.value)}
            aria-label="Filtrează după județ"
            className="rounded-[4px] border border-bracken bg-canopy px-4 py-3 text-[15px] text-bone outline-none focus:border-moss"
          >
            <option value="toate">Toate județele</option>
            {counties.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="relative h-[420px] overflow-hidden rounded-[10px] border border-bracken md:h-[560px]">
            {mounted ? (
              <MapContainer
                center={ROMANIA_CENTER}
                zoom={7}
                scrollWheelZoom
                className="h-full w-full"
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap"
                />
                <MapFocus target={target} />
                {items.map((shop) => (
                  <Marker
                    key={shop.id}
                    position={[shop.lat, shop.lng]}
                    icon={pin(shop.id === activeId)}
                    eventHandlers={{ click: () => setActiveId(shop.id) }}
                  >
                    <Popup>
                      <strong className="font-[var(--font-display)] text-[15px]">{shop.name}</strong>
                      <br />
                      {shop.address}
                      <br />
                      {shop.city}, {shop.county}
                      {shop.phone && (
                        <>
                          <br />
                          <a href={`tel:${shop.phone}`}>{shop.phone}</a>
                        </>
                      )}
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            ) : (
              <div className="flex h-full items-center justify-center text-sage">
                <Loader2 size={20} className="animate-spin" />
              </div>
            )}
          </div>

          <div className="flex max-h-[560px] flex-col overflow-hidden rounded-[10px] border border-bracken bg-canopy">
            <div className="flex items-center justify-between border-b border-bracken px-4 py-3">
              <span className="label-caps text-[11px] text-sage">Rezultate</span>
              <span className="num text-[13px] text-brass">{items.length}</span>
            </div>
            <div className="flex-1 overflow-y-auto">
              {shops.isLoading && (
                <div className="flex items-center gap-2 px-4 py-6 text-sage">
                  <Loader2 size={16} className="animate-spin" /> Se încarcă…
                </div>
              )}
              {!shops.isLoading && items.length === 0 && (
                <p className="px-4 py-6 text-[15px] text-sage">
                  Niciun magazin găsit. Încearcă alt oraș sau șterge filtrele.
                </p>
              )}
              {items.map((shop) => (
                <button
                  key={shop.id}
                  type="button"
                  onClick={() => setActiveId(shop.id)}
                  className={`block w-full border-b border-bracken px-4 py-3 text-left transition-colors ${
                    shop.id === activeId ? "bg-forest" : "hover:bg-forest/60"
                  }`}
                >
                  <p className="font-[var(--font-display)] text-[16px] text-bone">{shop.name}</p>
                  <p className="mt-1 flex items-center gap-1.5 text-[13px] text-sage">
                    <MapPin size={13} className="text-moss" />
                    {shop.city}, {shop.county}
                  </p>
                  <p className="mt-0.5 text-[13px] text-sage">{shop.address}</p>
                  {shop.phone && (
                    <p className="num mt-1 flex items-center gap-1.5 text-[13px] text-brass">
                      <Phone size={13} />
                      {shop.phone}
                    </p>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p className="mt-6 flex items-start gap-2 rounded-[8px] border border-bracken bg-forest px-4 py-3 text-[13px] text-sage">
          <ShieldAlert size={16} className="mt-0.5 shrink-0 text-rust" />
          Datele magazinelor sunt colectate din surse publice și nu sunt verificate individual.
          Sună înainte de deplasare — programul și adresa se pot schimba.
        </p>
      </main>

      <SiteFooter />
    </div>
  );
}
