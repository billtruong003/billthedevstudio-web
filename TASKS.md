# billthedevstudio.com: build tasks

Design source: canvas "Bill The Dev Studio · Website" (pages Site, Pick, Full site). Stack: Next.js 14 static export, Tailwind, Framer Motion, like BillPortfolio.

## 1. Setup
- [x] Next 14 + TypeScript + Tailwind + Framer Motion, `output: "export"`, trailing slashes, unoptimized images
- [x] `NEXT_PUBLIC_BASE_PATH` so the same build can run under the review link (`/preview/<token>/site`) or at the root
- [x] Brand tokens in `tailwind.config.ts` (ink, card, line, amber, muted, disc) and Baloo 2 via `next/font`

## 2. Content (one place, no copy in components)
- [x] `content/games.ts`: 4 games (Meh Merge, Nah Blocks, Bruh Arrows, Slam Cards): copy, media, trailer, store, info, privacy
- [x] `content/studio.ts`: slogan, values, services, project steps, stats, experience, contacts, collab
- [x] `content/i18n.ts`: UI text in English and Vietnamese; the other 7 languages show in the dropdown as "soon"
- [x] Images: game icons, key art, screenshots, Slam Cards, Spirit Story, the fox, Lucy

## 3. Components
- [x] Header: nav, language dropdown, Hire the studio; phone: EN button + menu sheet
- [x] Hero: "Shades on. Ship it.", sub line, two buttons, the gameplay fan
- [x] Game strip (icons under the hero)
- [x] Values: fox medallion in the middle (desktop), 2×2 tiles around the fox (phone)
- [x] Game cards with the store badge and Details; Spirit Story collab card
- [x] Numbers
- [x] Services (4) + How a project runs
- [x] The studio (founder, experience, link to billthedev.com)
- [x] Contact A (fox postcard)
- [x] Footer
- [x] Game sheet: tabs, store badge / Play in the browser, trailer, screenshots, screenshot viewer, about, features, info, more games; opens over the home page with the address `/games/<slug>/`, closes with X / Esc / Back
- [x] Ask Lucy: launcher + chat panel calling `api.billthedevstudio.com/lucy/chat`
- [x] Motion: fox bob, halo, sheet slide-up; all off with "reduce motion"

## 4. Pages
- [x] `/` and `/vi/`: home
- [x] `/games/<slug>/` and `/vi/games/<slug>/`: game page (same sheet, as a page)
- [x] `/press/` and `/vi/press/`: press kit
- [x] `/privacy/...`: the existing policy pages, unchanged addresses (copied as static files)
- [x] `app-ads.txt`, `CNAME`, `robots.txt`, `sitemap.xml`, 404

## 4b. News (16 Oct)
- [x] /news/ and /vi/news/: featured story, category filter, list, press strip; /news/<story>/ with byline, share, cover, NewsArticle data
- [x] Stories are markdown in content/news/*.md, built from blocks (`:::lead`, `quote`, `person`, `game`, `games`, `video`, `image`, `gallery`, `facts`, `stats`, `steps`, `note`, `cta`); catalog at /news/blocks/ (not indexed)
- [x] RSS at /news/rss.xml and stories in the sitemap (published ones only; drafts are noindex)
- [ ] Real dates and the missing facts in the 4 drafts, then `draft: false`

## 5. Check
- [x] Build, open at 390 px and 1440 px, no sideways scroll; sheet, tabs, screenshots, Esc/Back, menu and language switch tested
- [x] Review link on the VPS: `api.billthedevstudio.com/preview/<token>/site/` (`scripts/deploy-preview.sh <token>`)
- [x] Lucy answers from the review link (origin added to Lucy's allowed list)

## 6. Needs you before going live
- [ ] Full real name, real download numbers, Zalo / Discord / Telegram links, which email, photo, reply time
- [ ] Official Google Play badge files (the badge is a drawn stand-in for now)
- [ ] Google Play: are the 3 games public? Age ratings, sizes, release dates
- [ ] Slam Cards privacy policy
- [ ] Translations for ja, ko, zh, th, id, es, pt (or drop them)
- [ ] GitHub repo + GitHub Pages + DNS for billthedevstudio.com (see the old static site's README)
- [x] Lucy's facts: Drip Duck and HordeCall hidden, services added (deployed 15 Oct)

## 7. Later
- [ ] Git repo for this folder (not created yet; no commits made)
- [ ] First visit: offer the browser's language once
- [ ] Real press kit zips; studio wordmark
- [ ] Replace the drawn Play badge with Google's official files
