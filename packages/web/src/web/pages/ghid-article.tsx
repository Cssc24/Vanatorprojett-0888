import { Link, useParams } from "wouter";
import { ArrowLeft, ArrowRight, Check, Clock, Loader2 } from "lucide-react";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { Reveal } from "../components/reveal";
import { useGuideArticle } from "../queries/catalog";

export default function GhidArticlePage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? "";
  const query = useGuideArticle(slug);
  const article = query.data?.article;
  const next = query.data?.next;

  if (query.isLoading) {
    return (
      <div className="min-h-screen bg-bark">
        <SiteHeader />
        <div className="shell flex items-center gap-2 py-24 text-sage">
          <Loader2 size={18} className="animate-spin" /> Se încarcă…
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-bark">
        <SiteHeader />
        <div className="shell py-24">
          <h1 className="font-[var(--font-display)] text-[32px] text-bone">Articol inexistent</h1>
          <Link href="/ghid" className="label-caps mt-4 inline-block text-[11px] text-moss">
            ← Înapoi la ghid
          </Link>
        </div>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bark">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-bracken">
        <img
          src={article.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          style={{ filter: "blur(3px) saturate(.75)" }}
        />
        <div className="absolute inset-0 bg-[rgba(15,20,12,.86)]" />
        <div className="shell relative py-12 md:py-16">
          <Reveal onScroll={false}>
            <Link
              href="/ghid"
              className="label-caps inline-flex items-center gap-1.5 text-[11px] text-sage hover:text-bone"
            >
              <ArrowLeft size={13} /> Ghidul vânătorului
            </Link>
            <p className="eyebrow mt-6 text-brass">{article.eyebrow}</p>
            <h1 className="mt-3 max-w-3xl text-[clamp(28px,4.2vw,54px)] leading-[1.05] text-bone">
              {article.title}
            </h1>
            <p className="num mt-5 flex items-center gap-1.5 text-[13px] text-sage">
              <Clock size={14} />
              {article.readMinutes} min de citit
            </p>
          </Reveal>
        </div>
      </section>

      <main className="shell py-10 md:py-16">
        <article className="max-w-[68ch]">
          <p className="border-l-2 border-moss pl-5 text-[19px] leading-[1.7] text-bone">
            {article.excerpt}
          </p>

          {article.sections.map((section, index) => (
            <Reveal key={section.heading} delay={index * 0.03}>
              <section className="mt-12">
                <h2 className="font-[var(--font-display)] text-[26px] leading-tight text-bone">
                  {section.heading}
                </h2>
                <p className="mt-4 text-[18px] leading-[1.8] text-sage">{section.body}</p>
                {section.bullets.length > 0 && (
                  <ul className="mt-5 space-y-3">
                    {section.bullets.map((bullet) => (
                      <li key={bullet} className="flex gap-3 text-[16px] leading-[1.7] text-sage">
                        <Check size={16} className="mt-1 shrink-0 text-moss" />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            </Reveal>
          ))}
        </article>

        {next && (
          <Link
            href={`/ghid/${next.slug}`}
            className="group mt-16 flex max-w-[68ch] items-center justify-between gap-4 rounded-[10px] border border-bracken bg-canopy px-6 py-5 transition-colors hover:border-moss"
          >
            <span>
              <span className="eyebrow block text-brass">Articolul următor</span>
              <span className="mt-2 block font-[var(--font-display)] text-[21px] text-bone">
                {next.title}
              </span>
            </span>
            <ArrowRight size={20} className="text-moss transition-transform group-hover:translate-x-1" />
          </Link>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
