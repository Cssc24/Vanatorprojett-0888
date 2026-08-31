import { Link } from "wouter";
import { ArrowRight, Clock, Loader2 } from "lucide-react";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { Reveal } from "../components/reveal";
import { useGuideIndex } from "../queries/catalog";

export default function GhidPage() {
  const guide = useGuideIndex();
  const articles = guide.data ?? [];

  return (
    <div className="min-h-screen bg-bark">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-bracken">
        <img
          src="/images/hunter-dawn.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "blur(3px) saturate(.75)" }}
        />
        <div className="absolute inset-0 bg-[rgba(15,20,12,.84)]" />
        <div className="shell relative py-12 md:py-16">
          <Reveal onScroll={false}>
            <p className="eyebrow text-brass">Ghidul vânătorului</p>
            <h1 className="mt-4 max-w-3xl text-[clamp(30px,4.4vw,58px)] text-bone">
              Ce nu se învață din grile
            </h1>
            <p className="mt-4 max-w-2xl text-[17px] text-sage">
              Etică, siguranță, legislație, prima armă, tir la distanță, câini și echipament — tot
              ce trebuie să știi ca să fii un vânător bun, nu doar un candidat promovat.
            </p>
          </Reveal>
        </div>
      </section>

      <main className="shell py-10 md:py-16">
        {guide.isLoading && (
          <div className="flex items-center gap-2 text-sage">
            <Loader2 size={16} className="animate-spin" /> Se încarcă…
          </div>
        )}

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article, index) => (
            <Reveal key={article.slug} delay={index * 0.05}>
              <Link
                href={`/ghid/${article.slug}`}
                className="group flex h-full flex-col overflow-hidden rounded-[10px] border border-bracken bg-canopy transition-colors hover:border-moss"
              >
                <div className="relative h-40 overflow-hidden">
                  <img
                    src={article.image}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(to_top,rgba(15,20,12,.9),rgba(15,20,12,.1))]" />
                  <p className="eyebrow absolute bottom-3 left-4 text-brass">{article.eyebrow}</p>
                </div>
                <div className="flex flex-1 flex-col p-5">
                  <h2 className="font-[var(--font-display)] text-[21px] leading-tight text-bone">
                    {article.title}
                  </h2>
                  <p className="mt-2 flex-1 text-[14px] leading-relaxed text-sage">
                    {article.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="num flex items-center gap-1.5 text-[12px] text-sage">
                      <Clock size={13} />
                      {article.readMinutes} min
                    </span>
                    <span className="label-caps flex items-center gap-1.5 text-[11px] text-moss">
                      Citește
                      <ArrowRight
                        size={13}
                        className="transition-transform group-hover:translate-x-1"
                      />
                    </span>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
