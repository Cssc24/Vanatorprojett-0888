import { Link } from "wouter";
import { ArrowRight, BookOpen, Crosshair, MapPin, Target, Timer, Layers } from "lucide-react";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { EnamelBadge } from "../components/badge";
import { Reveal } from "../components/reveal";
import { useChapters } from "../queries/exam";
import { useGuideIndex } from "../queries/catalog";

const STATS = [
  { value: "953", label: "întrebări oficiale" },
  { value: "10", label: "capitole de examen" },
  { value: "54", label: "armurii pe hartă" },
  { value: "24", label: "arme documentate" },
];

const MODULES = [
  {
    to: "/revizuire",
    eyebrow: "Modul 01",
    title: "Revizuire examen",
    text: "Simulare de examen cu 30 de întrebări și 60 de minute, flashcards pe capitole, teste-grilă, fișe rapide și perioadele legale de vânătoare.",
    image: "/images/stag.jpg",
    icon: Target,
    wide: true,
  },
  {
    to: "/arme",
    eyebrow: "Modul 02",
    title: "Inventar de arme",
    text: "Fiecare armă cu specificul ei: clasă, calibre, acțiune, greutate, vânatul potrivit și prețul orientativ.",
    image: "/images/shotgun.jpg",
    icon: Crosshair,
    wide: false,
  },
  {
    to: "/armurii",
    eyebrow: "Modul 03",
    title: "Harta armuriilor",
    text: "Armurii și magazine de vânătoare din toată România, căutabile după oraș și județ, pe hartă.",
    image: "/images/gear.jpg",
    icon: MapPin,
    wide: false,
  },
  {
    to: "/ghid",
    eyebrow: "Modul 04",
    title: "Ghidul bunului vânător",
    text: "Etică, siguranța armei, prima achiziție, tir și distanțe, câinele de vânătoare, echipament de teren, legislație.",
    image: "/images/hunter-dawn.jpg",
    icon: BookOpen,
    wide: true,
  },
];

const STEPS = [
  {
    icon: Layers,
    title: "Învață pe capitole",
    text: "Cele 953 de întrebări oficiale sunt împărțite în 10 capitole. Treci prin ele cu flashcards și teste-grilă până nu mai greșești.",
  },
  {
    icon: Timer,
    title: "Simulează examenul",
    text: "30 de întrebări extrase aleatoriu, 60 de minute, prag de promovare 20 de răspunsuri corecte — exact ca la examen.",
  },
  {
    icon: Target,
    title: "Repară greșelile",
    text: "Fiecare întrebare greșită intră automat în lista „Greșelile mele” și rămâne acolo până o răspunzi corect.",
  },
];

export default function IndexPage() {
  const chapters = useChapters();
  const guide = useGuideIndex();

  return (
    <div className="min-h-screen bg-bark">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/forest-mist.jpg"
            alt=""
            className="h-full w-full object-cover"
            style={{ filter: "blur(2px) saturate(.8)" }}
          />
          <div className="absolute inset-0 bg-[rgba(15,20,12,.78)]" />
          <div className="absolute inset-0 bg-gradient-to-t from-bark via-bark/40 to-transparent" />
        </div>

        <div className="shell relative grid items-center gap-12 py-20 md:grid-cols-[58fr_42fr] md:py-32">
          <div>
            <Reveal onScroll={false} delay={0}>
              <p className="eyebrow text-brass">Platformă pentru vânătorii din România</p>
            </Reveal>
            <Reveal onScroll={false} delay={0.07}>
              <h1 className="mt-5 text-[clamp(38px,6vw,76px)] leading-[1.03] text-bone">
                Treci examenul de vânător.
                <br />
                <span className="text-moss">Apoi devino un vânător bun.</span>
              </h1>
            </Reveal>
            <Reveal onScroll={false} delay={0.14}>
              <p className="mt-6 max-w-xl text-[18px] leading-[1.75] text-sage">
                Toate cele {chapters.data?.total ?? 953} de întrebări oficiale, simulare de examen
                cronometrată, ghid de teren, inventar de arme și harta armuriilor din România — într-un
                singur loc.
              </p>
            </Reveal>
            <Reveal onScroll={false} delay={0.21}>
              <div className="mt-9 flex flex-wrap items-center gap-3">
                <Link
                  to="/revizuire"
                  className="label-caps flex items-center gap-2 rounded-[4px] border border-moss bg-mossdeep px-6 py-3.5 text-[13px] text-bone transition-colors hover:bg-moss"
                >
                  Începe revizuirea <ArrowRight size={15} />
                </Link>
                <Link
                  to="/ghid"
                  className="label-caps rounded-[4px] border border-bracken px-6 py-3.5 text-[13px] text-bone transition-colors hover:border-moss"
                >
                  Vezi ghidul
                </Link>
              </div>
            </Reveal>
            <Reveal onScroll={false} delay={0.28}>
              <p className="num mt-6 text-[12px] text-bracken">
                Gratuit · fără reclame · progres salvat în cont
              </p>
            </Reveal>
          </div>

          <Reveal onScroll={false} delay={0.18} className="justify-self-center md:justify-self-end">
            <div className="relative">
              <div className="absolute -inset-6 rounded-full bg-moss/10 blur-2xl" aria-hidden="true" />
              <EnamelBadge size={280} className="relative drop-shadow-[0_24px_60px_rgba(0,0,0,.7)]" />
            </div>
          </Reveal>
        </div>
      </section>

      {/* STATS */}
      <section className="border-y border-bracken bg-forest">
        <div className="shell grid grid-cols-2 gap-8 py-12 md:grid-cols-4">
          {STATS.map((stat, i) => (
            <Reveal key={stat.label} delay={i * 0.07}>
              <p className="font-display text-[44px] font-bold leading-none text-brass">
                {stat.value}
              </p>
              <p className="eyebrow mt-2 text-sage">{stat.label}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CUM FUNCȚIONEAZĂ */}
      <section className="relative overflow-hidden py-20 md:py-24">
        <div className="topo absolute inset-0" aria-hidden="true" />
        <div className="shell relative">
          <Reveal>
            <p className="eyebrow text-brass">Cum funcționează</p>
            <h2 className="mt-4 max-w-2xl text-[clamp(28px,3.4vw,44px)] text-bone">
              Trei pași până la carnetul de vânător
            </h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08}>
                <div className="h-full rounded-[10px] border border-bracken bg-canopy p-7 transition-all hover:-translate-y-0.5 hover:border-moss">
                  <div className="flex items-center justify-between">
                    <step.icon size={22} className="text-moss" />
                    <span className="num text-[13px] text-brass">0{i + 1}</span>
                  </div>
                  <h3 className="mt-5 text-[21px] text-bone">{step.title}</h3>
                  <p className="mt-3 text-[15px] text-sage">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* MODULE */}
      <section className="border-t border-bracken bg-forest py-20 md:py-24">
        <div className="shell">
          <Reveal>
            <p className="eyebrow text-brass">Ce găsești aici</p>
            <h2 className="mt-4 text-[clamp(28px,3.4vw,44px)] text-bone">Patru module</h2>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {MODULES.map((mod, i) => (
              <Reveal
                key={mod.to}
                delay={i * 0.07}
                className={mod.wide ? "md:col-span-2" : "md:col-span-1"}
              >
                <Link
                  to={mod.to}
                  className="group relative block h-full overflow-hidden rounded-[10px] border border-bracken transition-all hover:-translate-y-0.5 hover:border-moss"
                >
                  <img
                    src={mod.image}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover opacity-35 transition-opacity duration-500 group-hover:opacity-50"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-bark via-bark/85 to-bark/40" />
                  <div className="relative flex h-full min-h-[260px] flex-col justify-end p-7">
                    <mod.icon size={22} className="text-moss" />
                    <p className="eyebrow mt-4 text-brass">{mod.eyebrow}</p>
                    <h3 className="mt-2 text-[27px] text-bone">{mod.title}</h3>
                    <p className="mt-3 max-w-lg text-[15px] text-sage">{mod.text}</p>
                    <span className="label-caps mt-5 flex items-center gap-2 text-[12px] text-moss">
                      Deschide <ArrowRight size={14} />
                    </span>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CAPITOLE */}
      <section className="py-20 md:py-24">
        <div className="shell">
          <Reveal>
            <p className="eyebrow text-brass">Materia de examen</p>
            <h2 className="mt-4 text-[clamp(28px,3.4vw,44px)] text-bone">
              Cele 10 capitole, cu numărul de întrebări
            </h2>
          </Reveal>
          {chapters.isLoading ? (
            <div className="mt-10 grid gap-3 md:grid-cols-2">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="h-14 animate-pulse rounded-[4px] border border-bracken bg-canopy" />
              ))}
            </div>
          ) : (
            <div className="mt-10 grid gap-3 md:grid-cols-2">
              {chapters.data?.chapters.map((chapter, i) => (
                <Reveal key={chapter.key} delay={Math.min(i, 6) * 0.04}>
                  <div className="flex items-center justify-between gap-4 rounded-[4px] border border-bracken bg-canopy px-5 py-4">
                    <span className="text-[16px] text-bone">{chapter.label}</span>
                    <span className="num text-[14px] text-brass">{chapter.count}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* GHID PREVIEW */}
      <section className="border-t border-bracken bg-forest py-20 md:py-24">
        <div className="shell">
          <Reveal>
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-brass">Din ghid</p>
                <h2 className="mt-4 text-[clamp(28px,3.4vw,44px)] text-bone">
                  Ce nu se învață din manual
                </h2>
              </div>
              <Link to="/ghid" className="label-caps text-[12px] text-moss hover:text-bone">
                Toate articolele →
              </Link>
            </div>
          </Reveal>
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {(guide.data ?? []).slice(0, 3).map((article, i) => (
              <Reveal key={article.slug} delay={i * 0.08}>
                <Link
                  to={`/ghid/${article.slug}`}
                  className="group block h-full overflow-hidden rounded-[10px] border border-bracken bg-canopy transition-all hover:-translate-y-0.5 hover:border-moss"
                >
                  <div className="h-40 overflow-hidden">
                    <img
                      src={article.image}
                      alt=""
                      className="h-full w-full object-cover opacity-70 transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <p className="eyebrow text-brass">{article.eyebrow}</p>
                    <h3 className="mt-2 text-[21px] text-bone">{article.title}</h3>
                    <p className="mt-3 text-[15px] text-sage">{article.excerpt}</p>
                    <p className="num mt-4 text-[12px] text-bracken">
                      {article.readMinutes} min citire
                    </p>
                  </div>
                </Link>
              </Reveal>
            ))}
            {guide.isLoading &&
              Array.from({ length: 3 }).map((_, i) => (
                <div
                  key={i}
                  className="h-80 animate-pulse rounded-[10px] border border-bracken bg-canopy"
                />
              ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden py-24">
        <img
          src="/images/forest-dark.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "blur(2px) saturate(.8)" }}
        />
        <div className="absolute inset-0 bg-[rgba(15,20,12,.82)]" />
        <div className="shell relative text-center">
          <Reveal>
            <p className="eyebrow text-brass">Acces gratuit</p>
            <h2 className="mx-auto mt-4 max-w-3xl text-[clamp(30px,4vw,58px)] text-bone">
              Fă-ți cont și progresul te așteaptă la fiecare sesiune
            </h2>
            <p className="mx-auto mt-5 max-w-xl text-[17px] text-sage">
              Istoricul examenelor, greșelile de recuperat și statisticile pe capitole se salvează
              automat. Fără abonament.
            </p>
            <div className="mt-9 flex flex-wrap justify-center gap-3">
              <Link
                to="/auth"
                className="label-caps flex items-center gap-2 rounded-[4px] border border-moss bg-mossdeep px-7 py-3.5 text-[13px] text-bone transition-colors hover:bg-moss"
              >
                Creează cont <ArrowRight size={15} />
              </Link>
              <Link
                to="/revizuire"
                className="label-caps rounded-[4px] border border-bracken px-7 py-3.5 text-[13px] text-bone transition-colors hover:border-moss"
              >
                Încearcă fără cont
              </Link>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
