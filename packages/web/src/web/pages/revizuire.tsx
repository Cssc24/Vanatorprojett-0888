import { useState } from "react";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { Reveal } from "../components/reveal";
import { ExamRunner } from "../components/study/exam-runner";
import { QuizRunner } from "../components/study/quiz-runner";
import { Flashcards } from "../components/study/flashcards";
import { HistoryPanel } from "../components/study/history-panel";
import { MissedPanel } from "../components/study/missed-panel";
import { SeasonsPanel } from "../components/study/seasons-panel";
import { FactsPanel } from "../components/study/facts-panel";

const TABS = [
  { key: "examen", label: "Examen 30" },
  { key: "flashcards", label: "Flashcards" },
  { key: "grila", label: "Test-grilă" },
  { key: "greseli", label: "Greșelile mele" },
  { key: "istoric", label: "Istoric" },
  { key: "fise", label: "Fișe rapide" },
  { key: "perioade", label: "Perioade" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

export default function RevizuirePage() {
  const [tab, setTab] = useState<TabKey>("examen");

  return (
    <div className="min-h-screen bg-bark">
      <SiteHeader />

      <section className="relative overflow-hidden border-b border-bracken">
        <img
          src="/images/stag-portrait.jpg"
          alt=""
          className="absolute inset-0 h-full w-full object-cover object-top"
          style={{ filter: "blur(2px) saturate(.8)" }}
        />
        <div className="absolute inset-0 bg-[rgba(15,20,12,.84)]" />
        <div className="shell relative py-12 md:py-16">
          <Reveal onScroll={false}>
            <p className="eyebrow text-brass">Revizuire examen</p>
            <h1 className="mt-4 max-w-3xl text-[clamp(30px,4.4vw,58px)] text-bone">
              953 de întrebări oficiale, împărțite pe cele 10 capitole
            </h1>
            <p className="mt-4 max-w-2xl text-[17px] text-sage">
              Simulare cronometrată, flashcards, teste-grilă pe capitole, greșelile de recuperat,
              fișele cu cifre și perioadele legale de vânătoare.
            </p>
          </Reveal>
        </div>
      </section>

      <div className="sticky top-16 z-40 border-b border-bracken bg-bark/95 backdrop-blur">
        <div className="shell flex gap-1 overflow-x-auto py-3">
          {TABS.map((item) => (
            <button
              key={item.key}
              type="button"
              onClick={() => setTab(item.key)}
              className={`label-caps shrink-0 rounded-[4px] border px-4 py-2.5 text-[12px] transition-colors ${
                tab === item.key
                  ? "border-moss bg-mossdeep text-bone"
                  : "border-transparent text-sage hover:text-bone"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      <main className="shell py-12 md:py-16">
        <Reveal key={tab} onScroll={false}>
          {tab === "examen" && <ExamRunner />}
          {tab === "flashcards" && <Flashcards />}
          {tab === "grila" && <QuizRunner />}
          {tab === "greseli" && <MissedPanel />}
          {tab === "istoric" && <HistoryPanel />}
          {tab === "fise" && <FactsPanel />}
          {tab === "perioade" && <SeasonsPanel />}
        </Reveal>
      </main>

      <SiteFooter />
    </div>
  );
}
