# RdSAP EPC Assessor Training

A browser-based training environment where trainee Energy Performance Certificate (EPC)
assessors practise recording every field collected during an RdSAP survey. Field definitions,
allowed options and guidance are taken from **RdSAP10 specification (Feb 2024), Table 31
"Data to be collected"** (the source PDF is in this repo).

No login, no server — everything runs in the browser and persists to `localStorage`.

## Modes

- **Survey (trainee):** fill in all 12 RdSAP sections; each field shows its allowed options and
  a guidance note (the spec's "Comment" column). Repeatable items (building parts, walls,
  windows) support multiple instances.
- **Config (trainer):** edit any field's label, options, guidance and type; add custom fields;
  set an optional **model answer** per field to enable grading; reset back to the spec defaults.
- **Review & feedback:** shows a completion summary and grades any field that has a model
  answer, with the guidance shown as the explanation.

Catalogues and trainee attempts can be exported/imported as JSON, so a trainer can author a
field set and share it.

## Scope

This is a data-entry/learning tool. The SAP energy calculation engine (U-value maths, EER
rating, fuel costs) is **intentionally out of scope**.

## Develop

```bash
npm install
npm run dev      # local dev server
npm run build    # type-check + production build to dist/
npm run preview  # serve the production build
```

## Deploy (GitHub Pages)

`.github/workflows/deploy.yml` builds and publishes to GitHub Pages on every push to `main`.
One-time setup: in the repo, go to **Settings → Pages → Build and deployment → Source: GitHub
Actions**. The app is then served at `https://<user>.github.io/rdsap/`.

The Vite `base` is set to `/rdsap/` (the repo name) so asset paths resolve under that sub-path.
