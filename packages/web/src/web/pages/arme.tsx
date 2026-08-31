import { useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { Reveal } from "../components/reveal";
import { useWeapons } from "../queries/catalog";

const CLASSES = [
  { key: "toate", label: "Toate" },
  { key: "lisa", label: "Țeavă lisă" },
  { key: "glont", label: "Glonț" },
  { key: "mixta", label: "Mixte" },
];

export default function ArmePage() {
  const [search, setSearch] = useState("");
  const [klass, setKlass] = useState("toate");
  const [caliber, setCaliber] = useState("toate");
  const [game, setGame] = useState("toate");
  const [openId, setOpenId] = useState<string | null>(null);

  const weapons = useWeapons({ search, class: klass, caliber, game });
  const items = weapons.data?.items ?? [];

  return (
    <div className="min-h-screen bg-bark">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-bracken">
        <img
          src="/images/shotgun-wide.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "blur(2px) saturate(.8)" }}
        />
        <div className="absolute inset-0 bg-[rgba(15,20,12,.82)]" />
        <div className="shell relative py-12 md:py-16">
          <Reveal onScroll={false}>
            <p className="eyebrow text-brass">Inventar de arme</p>
            <h1 className="mt-4 max-w-3xl text-[clamp(30px,4.4vw,58px)] text-bone">
              Fiecare armă, cu specificul ei
            </h1>
            <p className="mt-4 max-w-2xl text-[17px] text-sage">
              {weapons.data?.totalCount ?? 24} modele folosite în România — clasă, acțiune, calibre,
              lungime de țeavă, greutate, vânatul potrivit și prețul orientativ.
            </p>
          </Reveal>
        </div>
      </section>

      <main className="shell py-10 md:py-14">
        {/* FILTRE */}
        <div className="space-y-4 rounded-[10px] border border-bracken bg-canopy p-5">
          <div className="relative">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sage" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Caută după model, marcă sau calibru…"
              aria-label="Caută o armă"
              className="w-full rounded-[4px] border border-bracken bg-bark py-3 pl-10 pr-10 text-[15px] text-bone outline-none focus:border-moss"
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

          <div className="flex flex-wrap gap-2">
            {CLASSES.map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setKlass(item.key)}
                className={`label-caps rounded-[999px] border px-4 py-2 text-[11px] transition-colors ${
                  klass === item.key
                    ? "border-moss bg-mossdeep text-bone"
                    : "border-bracken text-sage hover:border-moss hover:text-bone"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            <Select
              label="Calibru"
              value={caliber}
              onChange={setCaliber}
              options={weapons.data?.facets.calibers ?? []}
            />
            <Select
              label="Vânat"
              value={game}
              onChange={setGame}
              options={weapons.data?.facets.game ?? []}
            />
          </div>
        </div>

        <p className="num mt-6 text-[13px] text-sage">
          <span className="text-brass">{items.length}</span> modele afișate
        </p>

        {weapons.isLoading ? (
          <div className="mt-6 flex items-center gap-3 rounded-[10px] border border-bracken bg-canopy p-8 text-sage">
            <Loader2 className="animate-spin" size={18} /> Se încarcă inventarul…
          </div>
        ) : (
          <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {items.map((weapon, i) => {
              const open = openId === weapon.id;
              return (
                <Reveal key={weapon.id} delay={Math.min(i, 5) * 0.05}>
                  <button
                    type="button"
                    onClick={() => setOpenId(open ? null : weapon.id)}
                    className={`flex h-full w-full flex-col overflow-hidden rounded-[10px] border bg-canopy text-left transition-all hover:-translate-y-0.5 ${
                      open ? "border-moss" : "border-bracken hover:border-moss"
                    }`}
                  >
                    <div className="relative h-36 overflow-hidden border-b border-bracken">
                      <img
                        src={weapon.class === "lisa" ? "/images/shotgun.jpg" : "/images/gear.jpg"}
                        alt=""
                        className="h-full w-full object-cover opacity-40"
                      />
                      <span className="label-caps absolute left-4 top-4 rounded-[999px] border border-brass px-3 py-1 text-[10px] text-brass">
                        {weapon.class === "lisa"
                          ? "Țeavă lisă"
                          : weapon.class === "glont"
                            ? "Glonț"
                            : "Mixtă"}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <p className="eyebrow text-sage">
                        {weapon.brand} · {weapon.origin}
                      </p>
                      <h3 className="mt-2 text-[21px] leading-tight text-bone">{weapon.name}</h3>
                      <p className="mt-2 text-[14px] text-sage">{weapon.type}</p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {weapon.calibers.map((cal) => (
                          <span
                            key={cal}
                            className="num rounded-[999px] border border-bracken px-2.5 py-1 text-[11px] text-brass"
                          >
                            {cal}
                          </span>
                        ))}
                      </div>

                      <dl className="num mt-5 grid grid-cols-2 gap-y-2 text-[12.5px]">
                        <Spec label="Acțiune" value={weapon.action} />
                        <Spec label="Țeavă" value={weapon.barrel} />
                        <Spec label="Capacitate" value={weapon.capacity} />
                        <Spec label="Greutate" value={weapon.weight} />
                        {open && <Spec label="Șocuri" value={weapon.chokes} />}
                        {open && <Spec label="Nivel" value={weapon.level} />}
                      </dl>

                      {open && (
                        <>
                          <p className="mt-4 text-[14px] leading-relaxed text-sage">
                            {weapon.notes}
                          </p>
                          <p className="mt-3 text-[13px] text-sage">
                            <span className="eyebrow text-bracken">Vânat </span>
                            {weapon.game.join(", ")}
                          </p>
                        </>
                      )}

                      <p className="num mt-auto pt-5 text-[15px] text-brass">{weapon.price}</p>
                      <p className="label-caps mt-2 text-[11px] text-moss">
                        {open ? "Închide" : "Vezi detalii"}
                      </p>
                    </div>
                  </button>
                </Reveal>
              );
            })}
          </div>
        )}

        {!weapons.isLoading && items.length === 0 && (
          <div className="mt-6 rounded-[10px] border border-bracken bg-canopy p-8 text-[16px] text-sage">
            Nicio armă nu corespunde filtrelor. Resetează calibrul sau vânatul.
          </div>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}

function Spec({ label, value }: { label: string; value: string }) {
  return (
    <div className="pr-3">
      <dt className="eyebrow text-[9.5px] text-bracken">{label}</dt>
      <dd className="text-bone">{value}</dd>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="block">
      <span className="eyebrow text-sage">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 w-full rounded-[4px] border border-bracken bg-bark px-3.5 py-2.5 text-[15px] text-bone outline-none focus:border-moss"
      >
        <option value="toate">Toate</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
