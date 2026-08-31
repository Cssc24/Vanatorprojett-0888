import { Link, Route, Switch } from "wouter";
import Index from "./pages/index";
import AuthPage from "./pages/auth";
import ContPage from "./pages/cont";
import RevizuirePage from "./pages/revizuire";
import ArmePage from "./pages/arme";
import ArmuriiPage from "./pages/armurii";
import GhidPage from "./pages/ghid";
import GhidArticlePage from "./pages/ghid-article";
import { SiteHeader } from "./components/site-header";
import { SiteFooter } from "./components/site-footer";
import { Provider } from "./components/provider";

function NotFound() {
  return (
    <div className="min-h-screen bg-bark">
      <SiteHeader />
      <div className="shell py-24">
        <p className="eyebrow text-brass">Eroare 404</p>
        <h1 className="mt-4 font-[var(--font-display)] text-[clamp(30px,4vw,52px)] text-bone">
          Pagina nu există
        </h1>
        <p className="mt-4 max-w-xl text-[17px] text-sage">
          Link greșit sau pagină mutată. Întoarce-te la pagina principală sau intră direct în
          revizuire.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/"
            className="label-caps rounded-[4px] bg-mossdeep px-5 py-3 text-[11px] text-bone"
          >
            Pagina principală
          </Link>
          <Link
            href="/revizuire"
            className="label-caps rounded-[4px] border border-bracken px-5 py-3 text-[11px] text-bone"
          >
            Revizuire
          </Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function App() {
  return (
    <Provider>
      <Switch>
        <Route path="/" component={Index} />
        <Route path="/auth" component={AuthPage} />
        <Route path="/cont" component={ContPage} />
        <Route path="/revizuire" component={RevizuirePage} />
        <Route path="/arme" component={ArmePage} />
        <Route path="/armurii" component={ArmuriiPage} />
        <Route path="/ghid" component={GhidPage} />
        <Route path="/ghid/:slug" component={GhidArticlePage} />
        <Route component={NotFound} />
      </Switch>
    </Provider>
  );
}

export default App;
