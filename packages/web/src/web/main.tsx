// Entry point referenced by index.html — composition only, real bootstrap
// lives in __main.tsx (template-managed). The returning managed sign-in
// redirect is finished in lib/auth.ts, before the app tree renders.
import "./__main";
