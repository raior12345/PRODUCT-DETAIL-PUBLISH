# AMAZONA Global Asset & Detail Page Hub

A multilingual (KO / EN / JA) hub where overseas partners and buyers can review and download the detail pages for Amazona's five freeze-dried parrot treats.

- Pure HTML, CSS and vanilla JS. No build step, works as-is on GitHub Pages.
- Detail page images load straight from the shared Google Drive files (860px PNG).
- Every link and text string lives in `config.js`.

## Structure

```
├── index.html   # shell (header, footer, script loading)
├── config.js    # products, Drive links, file IDs, UI copy per language
├── style.css    # Amazona tokens, layout, phone mockup, light/dark
├── app.js       # hash router, PC/Mobile viewer, QR, image loading
└── assets/
    └── logo.png
```

## Routes (shareable links)

| URL | Screen |
| --- | --- |
| `#/` | Language selection |
| `#/ko` | Two main actions (Preview / Download) |
| `#/ko/preview` | Five-product gallery |
| `#/ko/preview/violet?view=pc` | PC viewer (860px) |
| `#/ko/preview/violet?view=mobile` | Phone-frame viewer + QR code |
| `#/ko/download` | Six download cards (all products + five products) |

Swap `ko` for `en` or `ja`. Product ids: `violet`, `brown`, `green`, `berry`, `tropical`.

## Updating links

Open `config.js`:

- **All-products download**: `bundles.all / ko / en / ja`
- **Product folders**: `assets.{lang}.{product}.driveFolder`
- **Individual pages**: `assets.{lang}.{product}.files[].id` (the part after `/file/d/` in a Drive link)
- If a link isn't ready yet, use `https://drive.google.com/your-drive-link-here`. The button switches to "Link coming soon" automatically.

Every Drive file and folder must be shared as **"Anyone with the link - Viewer"**, or the preview images won't load.

## Deploying (GitHub Pages)

```bash
git init
git add .
git commit -m "Amazona global asset hub"
git branch -M main
git remote add origin https://github.com/raior12345/PRODUCT-DETAIL-PUBLISH.git
git push -u origin main
```

Then go to GitHub, **Settings > Pages > Source: Deploy from a branch > main / (root)**. A few minutes later the site is live at
`https://raior12345.github.io/PRODUCT-DETAIL-PUBLISH/`.

If you deploy to a different address, update `brand.siteUrl` in `config.js` (it's the fallback address the QR code uses).

## Local preview

```bash
python -m http.server 8766
```

Open `http://localhost:8766` in a browser.
