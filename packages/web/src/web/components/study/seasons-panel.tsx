import { Loader2 } from "lucide-react";
import { useSeasons } from "../../queries/exam";

export function SeasonsPanel() {
  const seasons = useSeasons();

  if (seasons.isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-[10px] border border-bracken bg-canopy p-8 text-sage">
        <Loader2 className="animate-spin" size={18} /> Se încarcă perioadele…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow text-brass">Perioade legale</p>
        <h2 className="mt-2 text-[27px] text-bone">Când se poate vâna</h2>
        <p className="mt-2 max-w-2xl text-[15px] text-sage">
          Perioadele din anexele Legii 407/2006. Verifică întotdeauna textul în vigoare — se
          modifică prin ordin de ministru.
        </p>
      </div>

      <Table title="Mamifere" rows={seasons.data?.mammals ?? []} />
      <Table title="Păsări" rows={seasons.data?.birds ?? []} />
    </div>
  );
}

function Table({
  title,
  rows,
}: {
  title: string;
  rows: { species: string; start: string; end: string; quarters: string }[];
}) {
  return (
    <div>
      <p className="eyebrow text-sage">{title}</p>
      <div className="mt-3 overflow-hidden rounded-[10px] border border-bracken">
        <table className="w-full text-left">
          <thead className="bg-forest">
            <tr className="label-caps text-[11px] text-sage">
              <th className="px-5 py-3">Specia</th>
              <th className="px-5 py-3">Deschidere</th>
              <th className="px-5 py-3">Închidere</th>
              <th className="hidden px-5 py-3 md:table-cell">Trimestre</th>
            </tr>
          </thead>
          <tbody className="bg-canopy">
            {rows.map((row, i) => (
              <tr
                key={row.species}
                className={`border-l-2 border-moss ${i % 2 ? "bg-white/[.02]" : ""}`}
              >
                <td className="px-5 py-3 text-[15px] text-bone">{row.species}</td>
                <td className="num px-5 py-3 text-[14px] text-moss">{row.start}</td>
                <td className="num px-5 py-3 text-[14px] text-rust">{row.end}</td>
                <td className="num hidden px-5 py-3 text-[13px] text-sage md:table-cell">
                  {row.quarters}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
