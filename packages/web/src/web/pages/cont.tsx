import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Loader2, LogOut, ShieldCheck, Trash2 } from "lucide-react";
import { SiteHeader } from "../components/site-header";
import { SiteFooter } from "../components/site-footer";
import { Reveal } from "../components/reveal";
import { authClient, useSession } from "../lib/auth";
import { useHistory, useMissed, useChapterStats } from "../queries/progress";
import { useDeleteAccount } from "../queries/account";

export default function ContPage() {
  const [, navigate] = useLocation();
  const { data: session, isPending } = useSession();
  const signedIn = Boolean(session?.user);

  const history = useHistory(signedIn);
  const missed = useMissed(signedIn);
  const stats = useChapterStats(signedIn);
  const deleteAccount = useDeleteAccount();

  const [confirming, setConfirming] = useState(false);

  // Not signed in → send to the auth screen.
  useEffect(() => {
    if (!isPending && !signedIn) navigate("/auth");
  }, [isPending, signedIn, navigate]);

  if (isPending || !session?.user) {
    return (
      <div className="min-h-screen bg-bark">
        <SiteHeader />
        <div className="shell flex items-center gap-3 py-24 text-sage">
          <Loader2 className="animate-spin" size={18} /> Se încarcă contul…
        </div>
        <SiteFooter />
      </div>
    );
  }

  const user = session.user;
  const summary = history.data?.stats;
  const missedCount = missed.data?.items.length ?? 0;
  const chaptersPracticed = stats.data?.items.length ?? 0;
  const recent = (history.data?.attempts ?? []).slice(0, 6);

  const statTiles = [
    { value: summary?.count ?? 0, label: "examene date" },
    { value: summary?.best ?? 0, label: "cel mai bun scor" },
    { value: `${summary?.passRate ?? 0}%`, label: "rată de promovare" },
    { value: missedCount, label: "greșeli de recuperat" },
  ];

  async function remove() {
    try {
      await deleteAccount.mutateAsync({});
      await authClient.signOut();
      navigate("/");
    } catch {
      setConfirming(false);
    }
  }

  return (
    <div className="min-h-screen bg-bark">
      <SiteHeader />

      <section className="border-b border-bracken bg-forest">
        <div className="shell py-12 md:py-16">
          <Reveal onScroll={false}>
            <p className="eyebrow text-brass">Contul meu</p>
            <h1 className="mt-3 text-[clamp(28px,3.4vw,44px)] text-bone">
              {user.name || user.email}
            </h1>
            <p className="num mt-2 text-[13px] text-sage">{user.email}</p>
          </Reveal>
        </div>
      </section>

      <div className="shell grid gap-6 py-12 md:grid-cols-[1fr_320px] md:py-16">
        {/* MAIN */}
        <div className="space-y-6">
          {/* stats */}
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            {statTiles.map((tile) => (
              <div key={tile.label} className="rounded-[10px] border border-bracken bg-canopy p-5">
                <p className="font-display text-[34px] font-bold leading-none text-brass">
                  {tile.value}
                </p>
                <p className="eyebrow mt-2 text-sage">{tile.label}</p>
              </div>
            ))}
          </div>

          {/* recent exams */}
          <div className="overflow-hidden rounded-[10px] border border-bracken">
            <div className="flex items-center justify-between bg-forest px-5 py-3">
              <p className="eyebrow text-brass">Ultimele examene</p>
              <Link to="/revizuire" className="label-caps text-[11px] text-moss hover:text-bone">
                Vezi tot istoricul →
              </Link>
            </div>
            <table className="w-full text-left">
              <tbody className="bg-canopy">
                {recent.length === 0 && (
                  <tr>
                    <td className="px-5 py-6 text-[15px] text-sage">
                      Nicio simulare încă.{" "}
                      <Link to="/revizuire" className="text-moss hover:text-bone">
                        Dă primul examen
                      </Link>
                      .
                    </td>
                  </tr>
                )}
                {recent.map((attempt, i) => {
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

          <p className="text-[13px] text-sage">
            Ai exersat <span className="text-brass">{chaptersPracticed}</span> din 10 capitole.
            Statisticile detaliate pe capitole sunt în{" "}
            <Link to="/revizuire" className="text-moss hover:text-bone">
              Revizuire → Istoric
            </Link>
            .
          </p>
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-6">
          {/* plan */}
          <div className="rounded-[10px] border border-moss/50 bg-canopy p-6">
            <div className="flex items-center gap-2 text-moss">
              <ShieldCheck size={18} />
              <p className="eyebrow text-moss">Planul tău</p>
            </div>
            <p className="mt-3 font-display text-[26px] text-bone">Gratuit</p>
            <p className="num text-[13px] text-brass">0 Lei</p>
            <ul className="mt-4 space-y-2 text-[14px] text-sage">
              <li>Toate cele 953 de întrebări</li>
              <li>Simulări de examen nelimitate</li>
              <li>Greșeli, istoric și statistici</li>
              <li>Fără reclame · fără abonament</li>
            </ul>
          </div>

          {/* session actions */}
          <div className="rounded-[10px] border border-bracken bg-canopy p-6">
            <button
              type="button"
              onClick={() => authClient.signOut().then(() => navigate("/"))}
              className="label-caps flex w-full items-center justify-center gap-2 rounded-[4px] border border-bracken px-4 py-3 text-[12px] text-sage transition-colors hover:border-moss hover:text-bone"
            >
              <LogOut size={14} /> Ieși din cont
            </button>

            {/* danger zone */}
            <div className="mt-6 border-t border-bracken pt-5">
              <p className="eyebrow text-rust">Zonă periculoasă</p>
              {!confirming ? (
                <>
                  <p className="mt-2 text-[13px] text-sage">
                    Ștergerea contului elimină definitiv istoricul, greșelile și statisticile tale.
                  </p>
                  <button
                    type="button"
                    onClick={() => setConfirming(true)}
                    className="label-caps mt-4 flex items-center gap-2 text-[12px] text-rust hover:text-bone"
                  >
                    <Trash2 size={14} /> Șterge contul
                  </button>
                </>
              ) : (
                <>
                  <p className="mt-2 text-[13px] text-bone">
                    Sigur? Acțiunea este ireversibilă.
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={remove}
                      disabled={deleteAccount.isPending}
                      className="label-caps flex items-center gap-2 rounded-[4px] border border-rust bg-rust/20 px-4 py-2.5 text-[12px] text-bone transition-colors hover:bg-rust/40 disabled:opacity-60"
                    >
                      {deleteAccount.isPending ? (
                        <Loader2 className="animate-spin" size={13} />
                      ) : (
                        <Trash2 size={13} />
                      )}
                      Da, șterge
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirming(false)}
                      disabled={deleteAccount.isPending}
                      className="label-caps rounded-[4px] border border-bracken px-4 py-2.5 text-[12px] text-sage hover:text-bone"
                    >
                      Anulează
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>

          <Link
            to="/revizuire"
            className="label-caps flex items-center justify-center gap-2 rounded-[4px] border border-moss bg-mossdeep px-5 py-3.5 text-[13px] text-bone transition-colors hover:bg-moss"
          >
            Continuă revizuirea <ArrowRight size={15} />
          </Link>
        </aside>
      </div>

      <SiteFooter />
    </div>
  );
}
