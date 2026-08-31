interface ChapterChipsProps {
  chapters: { key: string; label: string; count: number }[];
  value: string;
  onChange: (key: string) => void;
}

export function ChapterChips({ chapters, value, onChange }: ChapterChipsProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {chapters.map((chapter) => {
        const active = chapter.key === value;
        return (
          <button
            key={chapter.key}
            type="button"
            onClick={() => onChange(chapter.key)}
            className={`label-caps rounded-[999px] border px-4 py-2 text-[11px] transition-colors ${
              active
                ? "border-moss bg-mossdeep text-bone"
                : "border-bracken text-sage hover:border-moss hover:text-bone"
            }`}
          >
            {chapter.label}
            <span className="num ml-2 text-[11px] opacity-70">{chapter.count}</span>
          </button>
        );
      })}
    </div>
  );
}
