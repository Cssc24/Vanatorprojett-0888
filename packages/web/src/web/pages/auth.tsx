import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowRight, Loader2 } from "lucide-react";
import { EnamelBadge } from "../components/badge";
import { Reveal } from "../components/reveal";
import { authClient, useSession } from "../lib/auth";

type Mode = "signup" | "signin";

export default function AuthPage() {
  const [, navigate] = useLocation();
  const { data: session } = useSession();
  const [mode, setMode] = useState<Mode>("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const [googlePending, setGooglePending] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setError("");
    setPending(true);
    try {
      const result =
        mode === "signup"
          ? await authClient.signUp.email({ name: name || email.split("@")[0]!, email, password })
          : await authClient.signIn.email({ email, password });
      if (result.error) {
        setError(translate(result.error.message ?? result.error.statusText ?? ""));
        return;
      }
      navigate("/revizuire");
    } catch {
      setError("Ceva nu a funcționat. Încearcă din nou.");
    } finally {
      setPending(false);
    }
  }

  async function google() {
    setError("");
    setGooglePending(true);
    try {
      await authClient.signIn.social({ provider: "google", callbackURL: "/revizuire" });
    } catch {
      setError("Autentificarea cu Google nu a reușit.");
    } finally {
      setGooglePending(false);
    }
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <img
        src="/images/forest-tall.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ filter: "blur(3px) saturate(.75)" }}
      />
      <div className="absolute inset-0 bg-[rgba(15,20,12,.85)]" />

      <div className="relative flex min-h-screen items-center justify-center px-4 py-14">
        <Reveal onScroll={false} className="w-full max-w-[440px]">
          <div className="rounded-[10px] border border-bracken bg-canopy/95 p-8 shadow-[0_24px_60px_-20px_rgba(0,0,0,.7)] backdrop-blur">
            <Link to="/" className="mx-auto block w-fit">
              <EnamelBadge size={104} />
            </Link>

            {session?.user ? (
              <div className="mt-6 text-center">
                <h1 className="text-[27px] text-bone">Ești autentificat</h1>
                <p className="mt-2 text-[15px] text-sage">{session.user.email}</p>
                <Link
                  to="/revizuire"
                  className="label-caps mt-6 flex items-center justify-center gap-2 rounded-[4px] border border-moss bg-mossdeep px-5 py-3 text-[13px] text-bone hover:bg-moss"
                >
                  Mergi la revizuire <ArrowRight size={15} />
                </Link>
              </div>
            ) : (
              <>
                <div className="mt-7 grid grid-cols-2 gap-1 rounded-[4px] border border-bracken p-1">
                  {(
                    [
                      ["signup", "Înscriere"],
                      ["signin", "Autentificare"],
                    ] as [Mode, string][]
                  ).map(([value, label]) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => {
                        setMode(value);
                        setError("");
                      }}
                      className={`label-caps rounded-[3px] py-2.5 text-[12px] transition-colors ${
                        mode === value ? "bg-mossdeep text-bone" : "text-sage hover:text-bone"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>

                <p className="mt-6 text-[15px] text-sage">
                  {mode === "signup"
                    ? "Contul salvează istoricul examenelor, greșelile și statisticile pe capitole."
                    : "Continuă de unde ai rămas."}
                </p>

                <button
                  type="button"
                  onClick={google}
                  disabled={googlePending}
                  className="label-caps mt-6 flex w-full items-center justify-center gap-2.5 rounded-[4px] border border-bracken bg-bark px-5 py-3 text-[13px] text-bone transition-colors hover:border-moss disabled:opacity-60"
                >
                  {googlePending ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <GoogleGlyph />
                  )}
                  Continuă cu Google
                </button>

                <div className="my-6 flex items-center gap-3">
                  <span className="h-px flex-1 bg-bracken" />
                  <span className="eyebrow text-bracken">sau cu email</span>
                  <span className="h-px flex-1 bg-bracken" />
                </div>

                <form onSubmit={submit} className="space-y-3">
                  {mode === "signup" && (
                    <Field label="Nume" value={name} onChange={setName} type="text" required={false} />
                  )}
                  <Field label="Email" value={email} onChange={setEmail} type="email" required />
                  <Field
                    label="Parolă"
                    value={password}
                    onChange={setPassword}
                    type="password"
                    required
                    hint={mode === "signup" ? "minim 8 caractere" : undefined}
                  />

                  {error && (
                    <p className="rounded-[4px] border border-rust bg-rust/12 px-3 py-2 text-[14px] text-bone">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={pending}
                    className="label-caps flex w-full items-center justify-center gap-2 rounded-[4px] border border-moss bg-mossdeep px-5 py-3.5 text-[13px] text-bone transition-colors hover:bg-moss disabled:opacity-60"
                  >
                    {pending && <Loader2 size={16} className="animate-spin" />}
                    {mode === "signup" ? "Creează contul" : "Intră în cont"}
                  </button>
                </form>
              </>
            )}

            <p className="mt-6 text-center text-[13px] text-bracken">
              <Link to="/" className="hover:text-sage">
                ← Înapoi la pagina principală
              </Link>
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type,
  required,
  hint,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type: string;
  required: boolean;
  hint?: string;
}) {
  return (
    <label className="block">
      <span className="eyebrow flex items-center justify-between text-sage">
        {label}
        {hint && <span className="normal-case tracking-normal text-bracken">{hint}</span>}
      </span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        aria-label={label}
        className="mt-2 w-full rounded-[4px] border border-bracken bg-bark px-3.5 py-3 text-[15px] text-bone outline-none transition-colors focus:border-moss"
      />
    </label>
  );
}

function GoogleGlyph() {
  return (
    <svg width="16" height="16" viewBox="0 0 48 48" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.5 0 6.6 1.2 9 3.6l6.8-6.8C35.6 2.4 30.2 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.2C12.4 13.6 17.7 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.1 24.6c0-1.6-.1-2.8-.4-4.1H24v8.4h12.5c-.3 2.1-1.6 5.2-4.6 7.3l7.7 6c4.5-4.2 6.5-10.2 6.5-17.6z"
      />
      <path
        fill="#FBBC05"
        d="M10.5 28.6c-.5-1.5-.8-3-.8-4.6s.3-3.1.8-4.6l-7.9-6.2C1 16.3 0 20 0 24s1 7.7 2.6 10.8l7.9-6.2z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.2 0 11.5-2 15.6-5.7l-7.7-6c-2.1 1.4-4.8 2.3-7.9 2.3-6.3 0-11.6-4.1-13.5-9.9l-7.9 6.2C6.5 42.6 14.6 48 24 48z"
      />
    </svg>
  );
}

function translate(message: string) {
  const map: Record<string, string> = {
    "User already exists": "Există deja un cont cu acest email.",
    "Invalid email or password": "Email sau parolă greșite.",
    "Password too short": "Parola trebuie să aibă minim 8 caractere.",
  };
  if (map[message]) return map[message];
  if (/password/i.test(message) && /short|least/i.test(message))
    return "Parola trebuie să aibă minim 8 caractere.";
  if (/exist/i.test(message)) return "Există deja un cont cu acest email.";
  if (/invalid/i.test(message)) return "Email sau parolă greșite.";
  return message || "Ceva nu a funcționat. Încearcă din nou.";
}
