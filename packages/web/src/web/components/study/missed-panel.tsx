import { useState } from "react";
import { Link } from "wouter";
import { Check, Loader2 } from "lucide-react";
import { useLookup } from "../../queries/exam";
import { useMissed, useClearMiss } from "../../queries/progress";
import { useSession } from "../../lib/auth";

const LETTERS = ["a", "b", "c", "d", "e"];

export function MissedPanel() {
  const { data: session } = useSession();
  const signedIn = Boolean(session?.user);
  const missed = useMissed(signedIn);
  const items = missed.data?.items ?? [];
  const lookup = useLookup(
    items.map((item) => ({ chapter: item.chapter, question: item.question })),
    signedIn,
  );
  const clearMiss = useClearMiss();
  const [open, setOpen] = useState<string | null>(null);

  if (!signedIn) {
    return (
      <div className="rounded-[10px] border border-bracken bg-canopy p-8">
        <p className="eyebrow text-brass">Greșelile mele</p>
        <h2 className="mt-3 text-[27px] text-bone">Ai nevoie de un cont</h2>
        <p className="mt-3 max-w-lg text-[15px] text-sage">
          Fiecare întrebare greșită se salvează automat aici și rămâne până o răspunzi corect.
        </p>
        <Link
          to="/auth"
          className="label-caps mt-6 inline-block rounded-[4px] border border-moss bg-mossdeep px-5 py-3 text-[13px] text-bone hover:bg-moss"
        >
          Intră în cont
        </Link>
      </div>
    );
  }

  if (missed.isLoading || lookup.isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-[10px] border border-bracken bg-canopy p-8 text-sage">
        <Loader2 className="animate-spin" size={18} /> Se încarcă greșelile…
      </div>
    );
  }

  const questions = lookup.data?.questions ?? [];
  const missesByQuestion = new Map(items.map((item) => [item.question, item.misses]));

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-brass">Greșelile mele</p>
          <h2 className="mt-2 text-[27px] text-bone">
            {questions.length} întrebări de recuperat
          </h2>
        </div>
        {questions.length > 0 && (
          <p className="text-[14px] text-sage">Marchează „Am învățat-o” ca să iasă din listă.</p>
        )}
      </div>

      {questions.length === 0 && (
        <div className="rounded-[10px] border border-moss bg-moss/8 p-8">
          <p className="text-[17px] text-bone">Lista e curată. Nimic de recuperat.</p>
          <p className="mt-2 text-[15px] text-sage">
            Dă un examen sau un test-grilă — greșelile apar automat aici.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {questions.map((question) => {
          const isOpen = open === question.q;
          return (
            <div key={question.q} className="rounded-[10px] border border-bracken bg-canopy">
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : question.q)}
                className="flex w-full items-start justify-between gap-4 p-5 text-left"
              >
                <div>
                  <p className="eyebrow text-sage">{question.chapterLabel}</p>
                  <p className="mt-2 text-[16px] leading-[1.45] text-bone">{question.q}</p>
                </div>
                <span className="num shrink-0 rounded-[999px] border border-rust px-2.5 py-1 text-[12px] text-rust">
                  ×{missesByQuestion.get(question.q) ?? 1}
                </span>
              </button>

              {isOpen && (
                <div className="border-t border-bracken p-5">
                  <ul className="space-y-2">
                    {question.options.map((option, i) => (
                      <li
                        key={i}
                        className={`rounded-[4px] border px-3.5 py-2.5 text-[15px] ${
                          i === question.answer
                            ? "border-moss bg-moss/12 text-bone"
                            : "border-bracken text-sage"
                        }`}
                      >
                        <span className="num mr-2 text-brass">{LETTERS[i]})</span>
                        {option}
                      </li>
                    ))}
                  </ul>
                  <button
                    type="button"
                    disabled={clearMiss.isPending}
                    onClick={() =>
                      clearMiss.mutate({ chapter: question.chapter, question: question.q })
                    }
                    className="label-caps mt-4 flex items-center gap-2 rounded-[4px] border border-moss bg-mossdeep px-4 py-2.5 text-[12px] text-bone hover:bg-moss disabled:opacity-60"
                  >
                    {clearMiss.isPending ? (
                      <Loader2 size={13} className="animate-spin" />
                    ) : (
                      <Check size={13} />
                    )}
                    Am învățat-o
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
