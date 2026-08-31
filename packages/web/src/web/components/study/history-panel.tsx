import { Link } from "wouter";
import { Loader2 } from "lucide-react";
import { useHistory, useChapterStats } from "../../queries/progress";
import { useChapters } from "../../queries/exam";
import { useSession } from "../../lib/auth";

export function HistoryPanel() {
  const { data: session } = useSession();
  const signedIn = Boolean(session?.user);
  const history = useHistory(signedIn);
  const stats = useChapterStats(signedIn);
  const chapters = useChapters();

  if (!signedIn) {
    return (
      <div className="rounded-[10px] border border-bracken bg-canopy p-8">
        <p className="eyebrow text-brass">Istoric</p>
        <h2 className="mt-3 text-[27px] text-bone">Ai nevoie de un cont</h2>
        <p className="mt-3 max-w-lg text-[15px] text-sage">
          Istoricul examenelor, greșelile și statisticile pe capitole se salvează doar în cont.
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

  if (history.isLoading) {
    return (
      <div className="flex items-center gap-3 rounded-[10px] border border-bracken bg-canopy p-8 text-sage">
        <Loader2 className="animate-spin" size={18} /> Se încarcă istoricul…
      </div>
    );
  }

  const attempts = history.data?.attempts ?? [];
  const summary = history.data?.stats;
  const series = attempts.slice().reverse();
  const labels = new Map((chapters.data?.chapters ?? []).map((c) => [c.key, c.label]));

  return (
    <div className="space-y-6">
      <div>
        <p className="eyebrow text-brass">Istoric</p>
        <h2 className="mt-2 text-[27px] text-bone">Evoluția ta</h2>
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {[
          { value: summary?.count ?? 0, label: "examene date" },
          { value: summary?.best ?? 0, label: "cel mai bun scor" },
          { value: summary?.average ?? 0, label: "medie" },
          { value: `${summary?.passRate ?? 0}%`, label: "rată de promovare" },
        ].map((item) => (
          <div key={item.label} className="rounded-[10px] border border-bracken bg-canopy p-5">
            <p className="font-display text-[34px] font-bold leading-none text-brass">
              {item.value}
            </p>
            <p className="eyebrow mt-2 text-sage">{item.label}</p>
          </div>
        ))}
      </div>

      {series.length > 1 && (
        <div className="rounded-[10px] border border-bracken bg-canopy p-6">
          <p className="eyebrow text-sage">Scor pe examen (prag 20)</p>
          <Chart points={series.map((a) => a.score)} />
        </div>
      )}

      <div className="overflow-hidden rounded-[10px] border border-bracken">
        <table className="w-full text-left">
          <thead className="bg-forest">
            <tr className="label-caps text-[11px] text-sage">
              <th className="px-5 py-3">Data</th>
              <th className="px-5 py-3">Scor</th>
              <th className="px-5 py-3">Durată</th>
              <th className="px-5 py-3">Rezultat</th>
            </tr>
          </thead>
          <tbody className="bg-canopy">
            {attempts.length === 0 && (
              <tr>
                <td colSpan={4} className="px-5 py-6 text-[15px] text-sage">
                  Nicio simulare încă. Dă primul examen din tabul „Examen 30”.
                </td>
              </tr>
            )}
            {attempts.map((attempt, i) => {
              const passed = attempt.score >= 20;
              return (
                <tr
                  key={attempt.id}
                  className={`border-l-2 ${passed ? "border-moss" : "border-rust"} ${
                    i % 2 ? "bg-white/[.02]" : ""
                  }`}
                >
                  <td className="num px-5 py-3 text-[13px] text-sage">
                    {new Date(attempt.createdAt).toLocaleString("ro-RO", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="num px-5 py-3 text-[15px] text-brass">
                    {attempt.score}/{attempt.total}
                  </td>
                  <td className="num px-5 py-3 text-[13px] text-sage">
                    {Math.floor(attempt.durationSec / 60)} min
                  </td>
                  <td className="px-5 py-3">
                    <span
                      className={`label-caps text-[11px] ${passed ? "text-moss" : "text-rust"}`}
                    >
                      {passed ? "Promovat" : "Nepromovat"}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {(stats.data?.items.length ?? 0) > 0 && (
        <div className="rounded-[10px] border border-bracken bg-canopy p-6">
          <p className="eyebrow text-brass">Precizie pe capitole</p>
          <div className="mt-5 space-y-3">
            {stats.data!.items.map((item) => {
              const pct = item.seen ? Math.round((item.correct / item.seen) * 100) : 0;
              return (
                <div key={item.chapter}>
                  <div className="flex items-center justify-between text-[14px]">
                    <span className="text-bone">{labels.get(item.chapter) ?? item.chapter}</span>
                    <span className="num text-sage">
                      {item.correct}/{item.seen} · <span className="text-brass">{pct}%</span>
                    </span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-bracken">
                    <div
                      className={`h-full ${pct >= 67 ? "bg-moss" : "bg-rust"}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function Chart({ points }: { points: number[] }) {
  const width = 720;
  const height = 180;
  const pad = 24;
  const max = 30;
  const step = points.length > 1 ? (width - pad * 2) / (points.length - 1) : 0;
  const y = (value: number) => height - pad - (value / max) * (height - pad * 2);
  const path = points
    .map((value, i) => `${i === 0 ? "M" : "L"} ${pad + i * step} ${y(value)}`)
    .join(" ");

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="mt-4 w-full" aria-label="Evoluția scorurilor">
      <line
        x1={pad}
        x2={width - pad}
        y1={y(20)}
        y2={y(20)}
        stroke="#C9A227"
        strokeDasharray="4 5"
        strokeWidth="1"
      />
      <path d={path} fill="none" stroke="#7FAE55" strokeWidth="2" strokeLinejoin="round" />
      {points.map((value, i) => (
        <circle
          key={i}
          cx={pad + i * step}
          cy={y(value)}
          r="3.5"
          fill={value >= 20 ? "#7FAE55" : "#B5533A"}
        />
      ))}
    </svg>
  );
}
