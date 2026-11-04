# Pallavi Vholgade — AI engineering portfolio

Live: https://pallavi-portfolio-preview.vercel.app

A responsive portfolio covering Generative AI, agentic workflows, Python development and applied ML. Built as static HTML, CSS and JavaScript, with an optional deferred Three.js playground.

## Editing

- `index.html`: profile, five projects, experience, eighteen linked skills and seven credential entries.
- `portfolio.css`: current blue/ink visual system, Space Grotesk headings, responsive composition and light/dark surfaces.
- `immersive.css`: shared components and accessibility/motion foundations.
- `project-models.css`: code-native project illustrations.
- `app.js`: project dialogs, navigation, theme and contact interactions.
- `certifications.js`: independent credential filtering.
- `immersive.js`, `portrait.js`, `technologies.js`: pointer and scroll interactions with reduced-motion support.

The page uses `pv-studio-theme` for its light/dark preference. Older style files remain for reference and are not loaded.

## Content and evidence

Keep titles, dates, qualifications and project claims grounded in supplied records. Previews identify sample data, test data and illustrations. The résumé PDF is maintained separately. Credential cards publish metadata without private certificate PDFs or personal credential IDs; the supplied public Drive participation certificate is linked.

## Local preview

Serve this directory with a static HTTP server. All assets use relative paths. Original font, icon and Three.js licences remain under `assets/`.

## 3D animation

The opening portrait now includes a real Three.js neural globe with orbiting nodes, drag/keyboard rotation and a pause control. `hero-scene.js` owns this renderer and its lifecycle; `three-d-effects.css` adds floating portrait and project-preview motion. The renderer stops off screen and in hidden tabs, caps pixel ratio and frame rate, remembers a pause preference, and renders a static scene for reduced-motion users. A CSS 3D illustration remains visible when WebGL is unavailable. No external model downloads or new libraries are required.
