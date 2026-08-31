# Vânător — build scratchpad

## Done
- Data extracted: 953 questions / 10 chapters, 24 weapons, 54 shops, 8 guide articles, seasons, facts (src/api/data/*.json)
- API: exam.ts, catalog.ts, progress.ts (authed), auth.ts (managed Google + email/pass), middleware/auth.ts
- db:push OK (better-auth tables + exam_attempts, missed_questions, chapter_stats)
- Frontend base: index.html (fonts Bitter/Oswald/Karla/JetBrains), styles.css tokens, lib/auth.ts, lib/api.ts (bearer), main.tsx (handleRedirect)
- components/badge.tsx, components/reveal.tsx
- queries/exam.ts, queries/catalog.ts, queries/progress.ts

## In progress
- components/site-header.tsx, site-footer.tsx
- pages: index (landing), auth, revizuire (tabs shell), arme, armurii (leaflet), ghid, ghid/:slug
- study components: exam-runner, quiz, flashcards, history, missed, facts, seasons

## Then
- app.tsx routes
- bun run lint && bun run build && bun run dev (port 4200 only)
- mb screenshot check → deliver {type: website, path: /home/user/vanator, port: 4200}

## Rules
- assets only in packages/web/public/images, absolute paths
- no inline orpc.*.queryOptions in components (use queries/)
- keep RunableBadge + analytics, never edit __ files
