# Domainfit wellbeing website

A responsive, animated Domainfit website concept based on the reference art direction. Built with Next.js App Router, TypeScript, Tailwind CSS v4, Framer Motion, and React Three Fiber.

## Start locally

```powershell
npm install
npm run dev
```

Open the local URL printed by Next.js.

For production hosting steps, see [DEPLOYMENT.md](./DEPLOYMENT.md).

## Booking behaviour

The 3-step orientation form is fully interactive. Without configuration, it ends in a labelled preview and does not save or send personal details. To receive requests, copy `.env.example` to `.env.local`, configure `ORIENTATION_WEBHOOK_URL` with your own secure HTTPS endpoint and optionally add `ORIENTATION_WEBHOOK_TOKEN`. Restart the server. The website will forward validated requests to that endpoint. It does not connect to a calendar or confirm appointment availability; your endpoint should arrange confirmation.

## Included interactions

- Responsive navigation and sticky mobile booking control.
- The black-and-cobalt movement theme and scroll-triggered amber meditation theme.
- Keyboard and touch accessible protocol selector, meditation practice selector, habit preview, real calendar, and specialist explorer.
- Three-step, labelled orientation form with validation, confirmation states, and privacy copy.
- Reduced motion support, pause control, optional offscreen-aware video stage, and a desktop particle layer that switches off on touch or reduced-motion settings.
- Subtle 3D depth on featured image scenes, plus a slow cinematic photo drift that stops for reduced-motion preferences.
- A staggered upward headline reveal, with section text also rising into view as the page scrolls.

## 3D motion and image placement

`components/particle-aura.tsx` provides the Three.js / React Three Fiber layer behind the hero; its particles respond gently to pointer movement and scroll. The hero headline rises in two staggered lines, while section reveals use Framer Motion. The particle layer is omitted for touch-sized screens or reduced-motion preferences.

The generated concept imagery is in `public/media/`:

- `opening.webp` — posture awareness / Louise L. Hay quote
- `movement.webp` — guided strength session
- `meditation.webp` — sanctuary section
- `nutrition.webp` — nutritionist and client meal conversation
- `habits.webp` and `calendar.webp` — interactive member tracker tabs
- `doctors.webp` — illustrative multidisciplinary team concept
- `healthy.webp` — closing wellbeing scene
- `hero.webp` and `coaching.webp` — hero and coaching scenes

To use actual staff portraits, replace `doctors.webp` with an approved team photograph and update its alt text in `components/expert-network.tsx`. The specialist orbit remains interactive and names all ten disciplines.

## Assets

`public/media/` contains ten optimised concept photographs. The team photograph is an illustration, not a verified Domainfit staff portrait. The nine MP4 and WebM source clips described in the brief were not provided; `HiggsfieldStage` is ready to use them when supplied. Static photos remain visible if video files are unavailable.

## Before launch

Replace concept photography with licensed brand imagery. Verify prices, service inclusions, specialist roster, actual contact information, and approved clinical copy. Connect the orientation handler to an approved scheduling/CRM endpoint and confirm the privacy notice matches the data handling in that service.
