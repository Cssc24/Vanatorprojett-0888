import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X, LogOut } from "lucide-react";
import { BadgeMark } from "./badge";
import { authClient, useSession } from "../lib/auth";

const NAV = [
  { to: "/revizuire", label: "Revizuire" },
  { to: "/arme", label: "Arme" },
  { to: "/armurii", label: "Armurii" },
  { to: "/ghid", label: "Ghid" },
];

export function SiteHeader() {
  const [location] = useLocation();
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-bracken bg-bark/92 backdrop-blur-md">
      <div className="shell flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-3">
          <BadgeMark size={34} />
          <span className="font-display text-[19px] font-bold tracking-[0.06em] text-bone">
            VÂNĂTOR
          </span>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((item) => {
            const active = location === item.to || location.startsWith(`${item.to}/`);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`label-caps rounded-[4px] px-3 py-2 text-[13px] transition-colors ${
                  active ? "text-moss" : "text-sage hover:text-bone"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          {session?.user ? (
            <div className="hidden items-center gap-3 md:flex">
              <Link
                to="/cont"
                className={`num text-[12px] transition-colors hover:text-bone ${
                  location === "/cont" ? "text-moss" : "text-sage"
                }`}
              >
                {session.user.name || session.user.email}
              </Link>
              <button
                type="button"
                onClick={() => authClient.signOut()}
                className="label-caps flex items-center gap-1.5 rounded-[4px] border border-bracken px-3 py-2 text-[12px] text-sage transition-colors hover:border-rust hover:text-bone"
              >
                <LogOut size={13} /> Ieși
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="label-caps hidden rounded-[4px] border border-moss bg-mossdeep px-4 py-2 text-[13px] text-bone transition-colors hover:bg-moss md:block"
            >
              Intră în cont
            </Link>
          )}
          <button
            type="button"
            aria-label="Meniu"
            onClick={() => setOpen((v) => !v)}
            className="rounded-[4px] border border-bracken p-2 text-bone md:hidden"
          >
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="border-t border-bracken bg-forest md:hidden">
          <div className="shell flex flex-col py-3">
            {NAV.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setOpen(false)}
                className="label-caps border-b border-bracken/60 py-3 text-[14px] text-sage"
              >
                {item.label}
              </Link>
            ))}
            {session?.user ? (
              <>
                <Link
                  to="/cont"
                  onClick={() => setOpen(false)}
                  className="label-caps border-b border-bracken/60 py-3 text-[14px] text-sage"
                >
                  Contul meu
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    authClient.signOut();
                  }}
                  className="label-caps mt-3 rounded-[4px] border border-bracken py-3 text-[13px] text-sage"
                >
                  Ieși din cont
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setOpen(false)}
                className="label-caps mt-3 rounded-[4px] border border-moss bg-mossdeep py-3 text-center text-[13px] text-bone"
              >
                Intră în cont
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
