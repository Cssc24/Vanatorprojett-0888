import { Loader2 } from "lucide-react";
import { useFacts } from "../../queries/exam";

export function FactsPanel() {
  const facts = useFacts();

  if (facts.isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-[10px] border border-bracken bg-canopy p-8 text-sage">
        <Loader2 className="animate-spin" size={18} /> Se încarcă fișele…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-brass">Fișe rapide</p>
        <h2 className="mt-2 text-[27px] text-bone">Cifrele care se cer la examen</h2>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {(facts.data ?? []).map((fact) => (
          <div key={fact.title} className="rounded-[10px] border border-bracken bg-canopy p-6">
            <p className="eyebrow text-brass">{fact.title}</p>
            <ul className="mt-4 space-y-2.5">
              {fact.items.map((item, i) => (
                <li
                  key={i}
                  className="border-l border-bracken pl-3 text-[15px] leading-[1.55] text-sage [&_b]:text-bone"
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
