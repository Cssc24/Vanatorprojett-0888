interface QuestionCardProps {
  index: number;
  total: number;
  eyebrow?: string;
  question: { q: string; options: string[]; answer: number };
  selected: number | null;
  revealed: boolean;
  onSelect: (index: number) => void;
}

const KEYS = ["a", "b", "c", "d", "e"];

export function QuestionCard({
  index,
  total,
  eyebrow,
  question,
  selected,
  revealed,
  onSelect,
}: QuestionCardProps) {
  return (
    <div className="rounded-[10px] border border-bracken bg-canopy p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <span className="num text-[13px] text-brass">
          {String(index + 1).padStart(2, "0")} / {total}
        </span>
        {eyebrow && <span className="eyebrow text-sage">{eyebrow}</span>}
      </div>

      <h3 className="mt-4 text-[19px] leading-[1.35] text-bone md:text-[21px]">{question.q}</h3>

      <div className="mt-6 space-y-2.5">
        {question.options.map((option, i) => {
          const isSelected = selected === i;
          const isCorrect = question.answer === i;
          let cls = "border-bracken bg-bark/40 hover:bg-bracken/60";
          if (revealed && isCorrect) cls = "border-moss bg-moss/12";
          else if (revealed && isSelected && !isCorrect) cls = "border-rust bg-rust/12";
          else if (!revealed && isSelected) cls = "border-moss bg-moss/8";

          return (
            <button
              key={i}
              type="button"
              disabled={revealed}
              onClick={() => onSelect(i)}
              className={`flex w-full items-start gap-3 rounded-[4px] border px-4 py-3 text-left transition-colors ${cls} disabled:cursor-default`}
            >
              <span className="num mt-0.5 text-[13px] font-bold text-brass">{KEYS[i]})</span>
              <span className="text-[15px] leading-[1.5] text-bone">{option}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
