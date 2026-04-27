# August Pirraglia Portfolio

Single-page scroll-film portfolio for August Pirraglia. Built with Vite, vanilla TypeScript, GSAP, and ScrollTrigger.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Deploy

GitHub Pages deployment is handled by `.github/workflows/deploy-pages.yml`.
Set the repository's Pages source to **GitHub Actions**, then push to `main`
or run the workflow manually.

The Vite build uses a relative base path so generated assets and public media
work under GitHub Pages project URLs such as `/repository-name/`.

## Notes

- The experience is intentionally full-screen and motion-heavy, with a reduced-motion fallback.
- `public/media/astro-fools-hopper` contains the deployed poster and WebP frame sequence used by the hero scroll section.
- Source video exports live under `assets/source/` and are ignored so GitHub Pages does not ship large unused files.
- The repo is set up for GitHub Pages deployment through GitHub Actions.
