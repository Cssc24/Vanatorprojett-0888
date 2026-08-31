import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "wouter";
import { ArrowLeft, ArrowRight, Loader2, Play, RotateCcw, Timer } from "lucide-react";
import { QuestionCard } from "./question-card";
import { useExamDraw } from "../../queries/exam";
import { useRecordExam, useRecordMiss, useClearMiss } from "../../queries/progress";
import { useSession } from "../../lib/auth";

const SIZE = 30;
const LIMIT_SEC = 60 * 60;
const PASS = 20;

type Phase = "idle" | "running" | "done";

function clock(seconds: number) {
  const m = Math.floor(Math.max(seconds, 0) / 60);
  const s = Math.max(seconds, 0) % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

export function ExamRunner({
  onRunningChange,
}: {
  onRunningChange?: (running: boolean) => void;
}) {
  const { data: session } = useSession();
  const [phase, setPhase] = useState<Phase>("idle");
  const [nonce, setNonce] = useState(0);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [left, setLeft] = useState(LIMIT_SEC);
  const startedAt = useRef(Date.now());

  const draw = useExamDraw(SIZE, phase !== "idle");
  const questions = useMemo(() => draw.data?.questions ?? [], [draw.data]);

  const recordExam = useRecordExam();
  const recordMiss = useRecordMiss();
  const clearMiss = useClearMiss();
  const saved = useRef(false);

  useEffect(() => {
    if (phase !== "running") return;
    const id = setInterval(() => {
      setLeft((value) => {
        if (value <= 1) {
          clearInterval(id);
          setPhase("done");
          return 0;
        }
        return value - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [phase]);

  // Let the page know whether an exam is in progress (for the leave guard).
  useEffect(() => {
    onRunningChange?.(phase === "running");
  }, [phase, onRunningChange]);

  // Warn before a full page unload (refresh / close / external link) mid-exam.
  useEffect(() => {
    if (phase !== "running") return;
    const handler = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [phase]);

  const score = useMemo(
    () => questions.reduce((sum, q, i) => sum + (answers[i] === q.answer ? 1 : 0), 0),
    [questions, answers],
  );

  useEffect(() => {
    if (phase !== "done" || saved.current || questions.length === 0) return;
    saved.current = true;
    if (!session?.user) return;
    const durationSec = Math.round((Date.now() - startedAt.current) / 1000);
    recordExam.mutate({ score, total: questions.length, durationSec });
    questions.forEach((question, i) => {
      const given = answers[i];
      if (given === question.answer) {
        clearMiss.mutate({ chapter: question.chapter, question: question.q });
      } else {
        recordMiss.mutate({ chapter: question.chapter, question: question.q });
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, questions.length]);

  function start() {
    saved.current = false;
    setAnswers({});
    setCurrent(0);
    setLeft(LIMIT_SEC);
    startedAt.current = Date.now();
    setNonce((n) => n + 1);
    setPhase("running");
    draw.refetch();
  }

  if (phase === "idle") {
    return (
      <div className="grid gap-5 md:grid-cols-[1.3fr_1fr]">
        <div className="rounded-[10px] border border-bracken bg-canopy p-7 md:p-9">
          <p className="eyebrow text-brass">Simulare oficială</p>
          <h2 className="mt-3 text-[clamp(26px,3vw,38px)] text-bone">Examen — 30 de întrebări</h2>
          <p className="mt-4 max-w-xl text-[16px] text-sage">
            30 de întrebări extrase aleatoriu din toate cele 10 capitole, 60 de minute la dispoziție,
            prag de promovare 20 de răspunsuri corecte. Rezultatele se văd doar la final, ca la examen.
          </p>
          <button
            type="button"
            onClick={start}
            className="label-caps mt-8 flex items-center gap-2 rounded-[4px] border border-moss bg-mossdeep px-6 py-3.5 text-[13px] text-bone transition-colors hover:bg-moss"
          >
            <Play size={15} /> Începe examenul
          </button>
          {!session?.user && (
            <p className="mt-4 text-[14px] text-bracken">
              Nu ești autentificat — rezultatul nu se va salva.{" "}
              <Link to="/auth" className="text-moss hover:text-bone">
                Fă-ți cont
              </Link>
            </p>
          )}
        </div>
        <div className="rounded-[10px] border border-bracken bg-canopy p-7">
          <p className="eyebrow text-brass">Reguli</p>
          <ul className="mt-4 space-y-3 text-[15px] text-sage">
            <li className="border-l border-bracken pl-3">
              <span className="num text-bone">30</span> întrebări, un singur răspuns corect
            </li>
            <li className="border-l border-bracken pl-3">
              <span className="num text-bone">60</span> minute — cronometrul nu se oprește
            </li>
            <li className="border-l border-bracken pl-3">
              <span className="num text-bone">20</span> corecte = promovat
            </li>
            <li className="border-l border-bracken pl-3">
              Întrebările greșite intră în „Greșelile mele”
            </li>
          </ul>
        </div>
      </div>
    );
  }

  if (draw.isLoading || questions.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-[10px] border border-bracken bg-canopy p-8 text-sage">
        <Loader2 className="animate-spin" size={18} /> Se pregătesc întrebările…
      </div>
    );
  }

  if (phase === "done") {
    const passed = score >= PASS;
    return (
      <div key={nonce} className="space-y-5">
        <div className="rounded-[10px] border border-bracken bg-canopy p-7 md:p-9">
          <p className="eyebrow text-brass">Rezultat</p>
          <div className="mt-4 flex flex-wrap items-end gap-6">
            <p className="font-display text-[76px] font-bold leading-none text-brass">
              {score}
              <span className="text-[34px] text-sage">/{questions.length}</span>
            </p>
            <p
              className={`label-caps rounded-[999px] border px-4 py-2 text-[13px] ${
                passed ? "border-moss bg-moss/12 text-moss" : "border-rust bg-rust/12 text-rust"
              }`}
            >
              {passed ? "Promovat" : "Nepromovat"}
            </p>
          </div>
          <p className="mt-4 text-[15px] text-sage">
            {passed
              ? "Peste pragul de 20. Ține ritmul — repetă până devine reflex."
              : `Îți lipsesc ${PASS - score} răspunsuri corecte. Verifică lista de greșeli mai jos, apoi reia.`}
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={start}
              className="label-caps flex items-center gap-2 rounded-[4px] border border-moss bg-mossdeep px-5 py-3 text-[13px] text-bone hover:bg-moss"
            >
              <RotateCcw size={15} /> Examen nou
            </button>
            <button
              type="button"
              onClick={() => setPhase("idle")}
              className="label-caps rounded-[4px] border border-bracken px-5 py-3 text-[13px] text-bone hover:border-moss"
            >
              Închide
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {questions.map((question, i) => (
            <QuestionCard
              key={`${question.q}-${i}`}
              index={i}
              total={questions.length}
              eyebrow={question.chapterLabel}
              question={question}
              selected={answers[i] ?? null}
              revealed
              onSelect={() => undefined}
            />
          ))}
        </div>
      </div>
    );
  }

  const question = questions[current]!;
  const answered = Object.keys(answers).length;

  return (
    <div className="space-y-5">
      <div className="sticky top-[120px] z-30 flex flex-wrap items-center justify-between gap-4 rounded-[10px] border border-bracken bg-canopy px-5 py-4 shadow-[0_10px_24px_-14px_rgba(0,0,0,.8)]">
        <div className="flex items-center gap-2">
          <Timer size={16} className="text-sage" />
          <span className={`num text-[20px] ${left < 300 ? "timer-danger" : "text-bone"}`}>
            {clock(left)}
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="num text-[13px] text-sage">
            răspunse <span className="text-brass">{answered}</span>/{questions.length}
          </span>
          <button
            type="button"
            onClick={() => setPhase("done")}
            className="label-caps rounded-[4px] border border-bracken px-4 py-2 text-[12px] text-sage hover:border-rust hover:text-bone"
          >
            Predă lucrarea
          </button>
        </div>
      </div>

      <div className="h-1 w-full overflow-hidden rounded-full bg-bracken">
        <div
          className="h-full bg-moss transition-all"
          style={{ width: `${((current + 1) / questions.length) * 100}%` }}
        />
      </div>

      <QuestionCard
        index={current}
        total={questions.length}
        eyebrow={question.chapterLabel}
        question={question}
        selected={answers[current] ?? null}
        revealed={false}
        onSelect={(value) => {
          setAnswers((prev) => ({ ...prev, [current]: value }));
          if (current < questions.length - 1) {
            setTimeout(() => setCurrent((c) => c + 1), 180);
          }
        }}
      />

      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={current === 0}
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          className="label-caps flex items-center gap-2 rounded-[4px] border border-bracken px-5 py-3 text-[12px] text-bone hover:border-moss disabled:opacity-40"
        >
          <ArrowLeft size={14} /> Anterioara
        </button>
        <div className="hidden flex-wrap justify-center gap-1.5 md:flex">
          {questions.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Întrebarea ${i + 1}`}
              onClick={() => setCurrent(i)}
              className={`h-2.5 w-2.5 rounded-full transition-colors ${
                i === current
                  ? "bg-brass"
                  : answers[i] !== undefined
                    ? "bg-mossdeep"
                    : "bg-bracken"
              }`}
            />
          ))}
        </div>
        <button
          type="button"
          disabled={current === questions.length - 1}
          onClick={() => setCurrent((c) => Math.min(questions.length - 1, c + 1))}
          className="label-caps flex items-center gap-2 rounded-[4px] border border-bracken px-5 py-3 text-[12px] text-bone hover:border-moss disabled:opacity-40"
        >
          Următoarea <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
