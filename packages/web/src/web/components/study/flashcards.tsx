import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Loader2, RotateCw, X } from "lucide-react";
import { useChapters, useChapterQuestions } from "../../queries/exam";
import { useRecordAnswer } from "../../queries/progress";
import { useSession } from "../../lib/auth";
import { ChapterChips } from "./chapter-chips";

const LETTERS = ["a", "b", "c", "d", "e"];

export function Flashcards() {
  const chapters = useChapters();
  const [chapter, setChapter] = useState("");
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState(0);
  const [unknown, setUnknown] = useState(0);
  const { data: session } = useSession();
  const recordAnswer = useRecordAnswer();

  useEffect(() => {
    if (!chapter && chapters.data?.chapters[0]) setChapter(chapters.data.chapters[0].key);
  }, [chapters.data, chapter]);

  const questions = useChapterQuestions(chapter);
  const items = questions.data?.questions ?? [];
  const card = items[index];

  function mark(correct: boolean) {
    if (correct) setKnown((v) => v + 1);
    else setUnknown((v) => v + 1);
    if (session?.user && chapter) recordAnswer.mutate({ chapter, correct });
    next();
  }

  function next() {
    setFlipped(false);
    setIndex((value) => (items.length ? (value + 1) % items.length : 0));
  }

  function prev() {
    setFlipped(false);
    setIndex((value) => (items.length ? (value - 1 + items.length) % items.length : 0));
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-brass">Flashcards</p>
        <h2 className="mt-2 text-[27px] text-bone">Întrebare pe o față, răspunsul pe cealaltă</h2>
      </div>

      <ChapterChips
        chapters={chapters.data?.chapters ?? []}
        value={chapter}
        onChange={(key) => {
          setChapter(key);
          setIndex(0);
          setFlipped(false);
          setKnown(0);
          setUnknown(0);
        }}
      />

      {questions.isLoading || !card ? (
        <div className="flex items-center gap-3 rounded-[10px] border border-bracken bg-canopy p-8 text-sage">
          <Loader2 className="animate-spin" size={18} /> Se încarcă fișele…
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="num text-[13px] text-sage">
              fișa <span className="text-brass">{index + 1}</span> / {items.length}
            </span>
            <span className="num text-[13px] text-sage">
              știute <span className="text-moss">{known}</span> · de reluat{" "}
              <span className="text-rust">{unknown}</span>
            </span>
          </div>

          <div className="[perspective:1400px]">
            <button
              type="button"
              onClick={() => setFlipped((v) => !v)}
              aria-label="Întoarce cartonașul"
              className={`flip-3d relative block w-full text-left ${flipped ? "is-flipped" : ""}`}
              style={{ minHeight: 320 }}
            >
              <div className="flip-face flex min-h-[320px] flex-col justify-between rounded-[10px] border border-bracken bg-canopy p-7 md:p-9">
                <div>
                  <p className="eyebrow text-brass">{questions.data?.label}</p>
                  <h3 className="mt-5 text-[21px] leading-[1.35] text-bone md:text-[27px]">
                    {card.q}
                  </h3>
                </div>
                <p className="label-caps flex items-center gap-2 text-[12px] text-sage">
                  <RotateCw size={14} /> Apasă pentru răspuns
                </p>
              </div>

              <div className="flip-face flip-back absolute inset-0 flex min-h-[320px] flex-col justify-between rounded-[10px] border border-moss bg-forest p-7 md:p-9">
                <div>
                  <p className="eyebrow text-moss">Răspuns corect</p>
                  <p className="mt-5 text-[19px] leading-[1.45] text-bone md:text-[21px]">
                    <span className="num mr-2 font-bold text-brass">
                      {LETTERS[card.answer]})
                    </span>
                    {card.options[card.answer]}
                  </p>
                  <ul className="mt-6 space-y-1.5">
                    {card.options.map((option, i) =>
                      i === card.answer ? null : (
                        <li key={i} className="text-[14px] text-sage/70 line-through">
                          {LETTERS[i]}) {option}
                        </li>
                      ),
                    )}
                  </ul>
                </div>
                <p className="label-caps flex items-center gap-2 text-[12px] text-sage">
                  <RotateCw size={14} /> Întoarce fișa
                </p>
              </div>
            </button>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={prev}
              className="label-caps flex items-center gap-2 rounded-[4px] border border-bracken px-5 py-3 text-[12px] text-bone hover:border-moss"
            >
              <ArrowLeft size={14} /> Înapoi
            </button>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => mark(false)}
                className="label-caps flex items-center gap-2 rounded-[4px] border border-rust px-5 py-3 text-[12px] text-bone hover:bg-rust/15"
              >
                <X size={14} /> De reluat
              </button>
              <button
                type="button"
                onClick={() => mark(true)}
                className="label-caps flex items-center gap-2 rounded-[4px] border border-moss bg-mossdeep px-5 py-3 text-[12px] text-bone hover:bg-moss"
              >
                <Check size={14} /> Știu
              </button>
            </div>
            <button
              type="button"
              onClick={next}
              className="label-caps flex items-center gap-2 rounded-[4px] border border-bracken px-5 py-3 text-[12px] text-bone hover:border-moss"
            >
              Următoarea <ArrowRight size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
