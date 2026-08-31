import { useEffect, useState } from "react";
import { Loader2, RotateCcw } from "lucide-react";
import { QuestionCard } from "./question-card";
import { ChapterChips } from "./chapter-chips";
import { useChapters, useQuiz } from "../../queries/exam";
import { useRecordAnswer, useRecordMiss, useClearMiss } from "../../queries/progress";
import { useSession } from "../../lib/auth";

const SIZES = [10, 20, 30];

export function QuizRunner() {
  const chapters = useChapters();
  const [chapter, setChapter] = useState("");
  const [size, setSize] = useState(10);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const { data: session } = useSession();
  const recordAnswer = useRecordAnswer();
  const recordMiss = useRecordMiss();
  const clearMiss = useClearMiss();

  useEffect(() => {
    if (!chapter && chapters.data?.chapters[0]) setChapter(chapters.data.chapters[0].key);
  }, [chapters.data, chapter]);

  const quiz = useQuiz(chapter, size);
  const questions = quiz.data?.questions ?? [];
  const question = questions[index];

  function reset() {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  function choose(value: number) {
    if (selected !== null || !question) return;
    setSelected(value);
    const correct = value === question.answer;
    if (correct) setScore((s) => s + 1);
    if (session?.user && chapter) {
      recordAnswer.mutate({ chapter, correct });
      if (correct) clearMiss.mutate({ chapter, question: question.q });
      else recordMiss.mutate({ chapter, question: question.q });
    }
  }

  function advance() {
    if (index >= questions.length - 1) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-brass">Test-grilă</p>
        <h2 className="mt-2 text-[27px] text-bone">Antrenament pe un singur capitol</h2>
        <p className="mt-2 text-[15px] text-sage">
          Feedback imediat după fiecare răspuns — bun pentru capitolele slabe.
        </p>
      </div>

      <ChapterChips
        chapters={chapters.data?.chapters ?? []}
        value={chapter}
        onChange={(key) => {
          setChapter(key);
          reset();
        }}
      />

      <div className="flex flex-wrap items-center gap-2">
        <span className="eyebrow text-sage">Întrebări</span>
        {SIZES.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => {
              setSize(value);
              reset();
            }}
            className={`num rounded-[4px] border px-3.5 py-2 text-[13px] transition-colors ${
              size === value
                ? "border-moss bg-mossdeep text-bone"
                : "border-bracken text-sage hover:border-moss"
            }`}
          >
            {value}
          </button>
        ))}
        <button
          type="button"
          onClick={() => {
            reset();
            quiz.refetch();
          }}
          className="label-caps ml-auto flex items-center gap-2 rounded-[4px] border border-bracken px-4 py-2 text-[12px] text-sage hover:border-moss hover:text-bone"
        >
          <RotateCcw size={13} /> Serie nouă
        </button>
      </div>

      {quiz.isLoading || quiz.isFetching ? (
        <div className="flex items-center gap-3 rounded-[10px] border border-bracken bg-canopy p-8 text-sage">
          <Loader2 className="animate-spin" size={18} /> Se extrag întrebările…
        </div>
      ) : finished ? (
        <div className="rounded-[10px] border border-bracken bg-canopy p-7 md:p-9">
          <p className="eyebrow text-brass">Serie încheiată</p>
          <p className="mt-4 font-display text-[58px] font-bold leading-none text-brass">
            {score}
            <span className="text-[27px] text-sage">/{questions.length}</span>
          </p>
          <p className="mt-3 text-[15px] text-sage">
            {score === questions.length
              ? "Capitol curat. Trece la următorul."
              : "Reia seria — întrebările greșite au fost salvate în „Greșelile mele”."}
          </p>
          <button
            type="button"
            onClick={() => {
              reset();
              quiz.refetch();
            }}
            className="label-caps mt-7 flex items-center gap-2 rounded-[4px] border border-moss bg-mossdeep px-5 py-3 text-[13px] text-bone hover:bg-moss"
          >
            <RotateCcw size={15} /> Serie nouă
          </button>
        </div>
      ) : question ? (
        <>
          <div className="flex items-center justify-between">
            <span className="num text-[13px] text-sage">
              scor <span className="text-brass">{score}</span>
            </span>
            <div className="h-1 w-40 overflow-hidden rounded-full bg-bracken">
              <div
                className="h-full bg-moss transition-all"
                style={{ width: `${((index + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
          <QuestionCard
            index={index}
            total={questions.length}
            eyebrow={quiz.data?.label}
            question={question}
            selected={selected}
            revealed={selected !== null}
            onSelect={choose}
          />
          {selected !== null && (
            <button
              type="button"
              onClick={advance}
              className="label-caps w-full rounded-[4px] border border-moss bg-mossdeep py-3.5 text-[13px] text-bone hover:bg-moss"
            >
              {index >= questions.length - 1 ? "Vezi rezultatul" : "Următoarea întrebare"}
            </button>
          )}
        </>
      ) : null}
    </div>
  );
}
