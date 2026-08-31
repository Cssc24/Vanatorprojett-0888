import { useEffect } from "react";
import { useLocation } from "wouter";
import { ArrowRight, BookOpen, Crosshair, Layers, MapPin, Target, Timer } from "lucide-react";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { Reveal } from "../components/reveal";
import { useSession } from "../lib/auth";

const ONBOARDED_KEY = "vanator_onboarded";

const STEPS = [
  {
    icon: Layers,
    title: "Învață pe capitole",
    text: "Cele 953 de întrebări sunt împărțite în 10 capitole. Treci prin ele cu flashcards și teste-grilă.",
  },
  {
    icon: Timer,
    title: "Simulează examenul",
    text: "30 de întrebări, 60 de minute, prag 20 corecte — exact ca la examenul real.",
  },
  {
    icon: Target,
    title: "Repară greșelile",
    text: "Fiecare greșeală intră în „Greșelile mele” și rămâne acolo până o răspunzi corect.",
  },
];

const MODULES = [
  { icon: Target, label: "Revizuire examen" },
  { icon: Crosshair, label: "Inventar de arme" },
  { icon: MapPin, label: "Harta armuriilor" },
  { icon: BookOpen, label: "Ghidul vânătorului" },
];

export default function StartPage() {
  const [, navigate] = useLocation();
  const { data: session, isPending } = useSession();

  useEffect(() => {
    if (isPending) return;
    if (!session?.user) {
      navigate("/auth");
      return;
    }
    try {
      if (localStorage.getItem(ONBOARDED_KEY)) navigate("/revizuire");
    } catch {
      /* localStorage unavailable — just show onboarding */
    }
  }, [isPending, session, navigate]);

  function go(to: string) {
    try {
      localStorage.setItem(ONBOARDED_KEY, "1");
    } catch {
      /* ignore */
    }
    navigate(to);
  }

  const firstName = (session?.user?.name || "").split(" ")[0];

  return (
    <div className="min-h-screen bg-bark">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-bracken">
        <img
          src="/images/forest-mist.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "blur(2px) saturate(.8)" }}
        />
        <div className="absolute inset-0 bg-[rgba(15,20,12,.82)]" />
        <div className="shell relative py-16 md:py-20">
          <Reveal onScroll={false}>
            <p className="eyebrow text-brass">Bine ai venit</p>
            <h1 className="mt-4 max-w-3xl text-[clamp(30px,4.4vw,56px)] text-bone">
              {firstName ? `Bun venit, ${firstName}!` : "Bun venit!"}
            </h1>
            <p className="mt-4 max-w-2xl text-[17px] leading-[1.7] text-sage">
              Contul tău e gata. Progresul se salvează automat la fiecare sesiune. Uite, în trei pași,
              cum folosești platforma ca să treci examenul.
            </p>
          </Reveal>
        </div>
      </section>

      <section className="py-14 md:py-20">
        <div className="shell">
          <div className="grid gap-5 md:grid-cols-3">
            {STEPS.map((step, i) => (
              <Reveal key={step.title} delay={i * 0.08}>
                <div className="h-full rounded-[10px] border border-bracken bg-canopy p-7">
                  <div className="flex items-center justify-between">
                    <step.icon size={22} className="text-moss" />
                    <span className="num text-[13px] text-brass">0{i + 1}</span>
                  </div>
                  <h2 className="mt-5 text-[21px] text-bone">{step.title}</h2>
                  <p className="mt-3 text-[15px] text-sage">{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={0.1}>
            <div className="mt-10 rounded-[12px] border border-moss/40 bg-canopy p-7 md:p-9">
              <p className="eyebrow text-moss">Pasul următor</p>
              <h2 className="mt-3 text-[24px] text-bone">Începe cu un capitol ușor</h2>
              <p className="mt-3 max-w-2xl text-[15px] text-sage">
                Recomandat: pornește cu flashcards pe un capitol, apoi dă o simulare când te simți
                pregătit. Ai la dispoziție și inventarul de arme, harta armuriilor și ghidul de teren.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => go("/revizuire")}
                  className="label-caps flex items-center gap-2 rounded-[4px] border border-moss bg-mossdeep px-6 py-3.5 text-[13px] text-bone transition-colors hover:bg-moss"
                >
                  Începe revizuirea <ArrowRight size={15} />
                </button>
                <button
                  type="button"
                  onClick={() => go("/ghid")}
                  className="label-caps rounded-[4px] border border-bracken px-6 py-3.5 text-[13px] text-bone transition-colors hover:border-moss"
                >
                  Vezi ghidul
                </button>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-3 border-t border-bracken pt-6 md:grid-cols-4">
                {MODULES.map((mod) => (
                  <div key={mod.label} className="flex items-center gap-2 text-[13px] text-sage">
                    <mod.icon size={15} className="shrink-0 text-moss" />
                    <span>{mod.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
