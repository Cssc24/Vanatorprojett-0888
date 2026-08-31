# Vânător

Plateforme de révision pour l'examen de chasseur en Roumanie : 953 questions officielles,
simulation d'examen chronométrée, flashcards, ghid de teren, inventaire d'armes et carte des
armureries. Comptes utilisateurs avec progrès sauvegardé.

## Stack

- **Frontend** : React 19 + Vite + Tailwind (`packages/web/src/web`)
- **API** : oRPC + Hono, servie à `/api/rpc` (`packages/web/src/api`)
- **Auth** : Better Auth (email/mot de passe + Google en option), session par cookie
- **Base de données** : Drizzle ORM + Turso (libSQL / SQLite)
- **Runtime** : Bun. Un seul process sert le build statique **et** l'API
  (`packages/web/src/__server.ts`).

> Le repo contient aussi `packages/mobile` (Expo) et `packages/desktop` (Electron), optionnels et
> non déployés par le service web.

## Développement local

```bash
bun install
cp .env.template .env          # puis remplis les valeurs (voir ci-dessous)
cd packages/web && bun run db:push   # crée les tables
cd ../.. && bun run dev              # http://localhost:4200
```

Variables `.env` (toutes à la racine) :

| Variable | Rôle |
|---|---|
| `WEBSITE_URL` | URL publique (local : `http://localhost:4200`) |
| `BETTER_AUTH_SECRET` | Secret de signature des sessions — `openssl rand -hex 32` |
| `DATABASE_URL` / `DATABASE_AUTH_TOKEN` | Base Turso (gratuite sur [turso.tech](https://turso.tech)) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | Login Google (optionnel — vide = email/mdp seul) |

## Déploiement (Render)

1. Crée une base **Turso** (`turso db create vanator`) et récupère l'URL + un token.
2. Sur [Render](https://render.com) : **New → Blueprint**, connecte ce repo GitHub. Le
   [`render.yaml`](render.yaml) crée un service web Docker (build via [`Dockerfile`](Dockerfile)).
3. Dans l'onglet **Environment** du service, renseigne les secrets : `WEBSITE_URL` (l'URL Render,
   ex. `https://vanator.onrender.com`), `BETTER_AUTH_SECRET`, `DATABASE_URL`, `DATABASE_AUTH_TOKEN`.
4. Applique le schéma une fois : `bun run db:push` (en local, pointé sur la base Turso de prod).
5. **Auto-deploy** : chaque push sur GitHub redéploie.

Health check : `GET /api/health`.

### Login Google (optionnel)

Dans Google Cloud Console → *Identifiants* → *ID client OAuth* (type Web) :
- **URI de redirection autorisée** : `<WEBSITE_URL>/api/auth/callback/google`
- Colle le *client ID* et le *secret* dans `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` sur Render.

## Commandes

- `bun run dev` — serveur de dev web (port 4200)
- `bun run build` — build de tous les packages
- `bun run start` — serveur de production (pm2)
- `bun run lint` / `bun run typecheck`
- `bun run db:push` / `db:generate` / `db:migrate` — base de données
