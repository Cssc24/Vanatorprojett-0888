import { Link } from "wouter";
import { BadgeMark } from "./badge";

export function SiteFooter() {
  return (
    <footer className="relative overflow-hidden border-t border-bracken bg-forest">
      <div className="topo absolute inset-0 opacity-60" aria-hidden="true" />
      <div className="shell relative grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr] md:py-16">
        <div>
          <div className="flex items-center gap-3">
            <BadgeMark size={40} />
            <span className="font-display text-[21px] font-bold tracking-[0.06em] text-bone">
              VÂNĂTOR
            </span>
          </div>
          <p className="mt-4 max-w-sm text-[15px] text-sage">
            Platformă independentă de pregătire pentru examenul de vânător și de documentare pentru
            vânătorii din România. 953 de întrebări, ghid de teren, arme și armurii.
          </p>
        </div>

        <div>
          <p className="eyebrow text-brass">Platformă</p>
          <ul className="mt-4 space-y-2 text-[15px] text-sage">
            <li>
              <Link to="/revizuire" className="hover:text-bone">
                Revizuire examen
              </Link>
            </li>
            <li>
              <Link to="/arme" className="hover:text-bone">
                Inventar de arme
              </Link>
            </li>
            <li>
              <Link to="/armurii" className="hover:text-bone">
                Harta armuriilor
              </Link>
            </li>
            <li>
              <Link to="/ghid" className="hover:text-bone">
                Ghidul vânătorului
              </Link>
            </li>
            <li>
              <a href="/#preturi" className="hover:text-bone">
                Prețuri
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="eyebrow text-brass">Atenție</p>
          <p className="mt-4 text-[14px] leading-relaxed text-sage">
            Materialele au caracter informativ. Legislația cinegetică (Legea 407/2006, Legea
            295/2004) și perioadele legale se pot modifica — verifică întotdeauna textul oficial în
            vigoare și regulamentul A.J.V.P.S. înainte de examen sau de ieșirea pe teren.
          </p>
          <p className="num mt-6 text-[12px] text-bracken">© {new Date().getFullYear()} Vânător</p>
        </div>
      </div>
    </footer>
  );
}
