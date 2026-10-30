# BackRubbit 🐰 (Spark plan, no accounts)

## 1. Firebase (free Spark)
1. Console → new project → add Web app → copy `apiKey`, `projectId`, `appId` → `cp .env.example .env`.
2. Build → Firestore Database → create (production mode).
3. `src/config.js` → change `COUPLE_ID` to any long random string (it is the secret that protects your data). Optional `HUSBAND_PIN`.
4. Put `rabbit.riv` in `public/`.
5. `npm i` → `npm run dev` → open `/?debug` → poke Rive inputs → fix `RABBIT.poses` / `stateMachine` / `crop` in `src/config.js`.
6. Deploy: `npm i -g firebase-tools && firebase login && firebase use <project> && npm run deploy`

## 2. Push notifications (optional, free)
Spark can't run Cloud Functions, so a tiny free Cloudflare Worker sends the pushes.
1. `npx web-push generate-vapid-keys` → public + private key.
2. `cd worker && npm i`
3. Edit `wrangler.toml`: `ALLOWED_ORIGIN` (your `https://<project>.web.app`), `VAPID_SUBJECT`, `VAPID_PUBLIC_KEY`.
4. `npx wrangler login && npx wrangler secret put VAPID_PRIVATE_KEY && npx wrangler deploy` → prints worker URL.
5. `.env` → `VITE_PUSH_WORKER_URL=<worker url>` and `VITE_VAPID_PUBLIC_KEY=<public key>` → redeploy the app.
6. Both phones: open URL → Add to Home Screen → open from icon → pick role → tap "Turn on notifications".
Push only works in the built app (`npm run build && npm run preview`), not `npm run dev`. iOS needs 16.4+ and the home-screen install.

## Flow
Wife: bunny waves → notebook + "appointment?" → button → coupon −1 → bunny walks → husband notified.
Husband: "All done" → bunny walks off, burrow + sign (`REST_HOURS`). Send coupons (+note) → wife notified + gift popup.
