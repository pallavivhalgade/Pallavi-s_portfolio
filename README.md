# Pallavi Vholgade — Portfolio

**Live portfolio: https://pallavi-portfolio-preview.vercel.app**

AI/ML Engineer Intern at GritzNova and a 2026 AI/ML graduate based in Pune, India. Focused on generative AI, agentic workflows, RAG, no-code automation and voice AI.

This repository contains the updated static portfolio: introduction and interactive portrait, About and education, five project feature stories, experience, a grouped, keyboard-accessible technology toolkit, an interactive 3D playground, and contact links.

## Features

- Responsive layouts for desktop, tablet, and mobile
- Distinct dark and light themes
- Contour and orbital live wallpapers with pause and reduced-motion support
- Locally hosted technology assets, grouped by practical use
- Current no-code AI platform work and confirmed internship dates
- Optional 3D playground loaded near the viewport
- Five project stories, direct repository links, category filters and accessible project dialogs
- Direct links to LinkedIn, GitHub, email, and the résumé

## Run locally

Serve this directory with any static HTTP server, for example:

```sh
python -m http.server 8000
```

Open http://localhost:8000. All paths are relative and support GitHub Pages project hosting.

## Connect

[Portfolio](https://pallavi-portfolio-preview.vercel.app) · [LinkedIn](https://www.linkedin.com/in/pallavi-vholgade-05565b24b) · [Email](mailto:pallavivhalgade@gmail.com) · [Résumé](https://pallavi-portfolio-preview.vercel.app/assets/Pallavi_Vholgade_BE.pdf)

Asset sources and licences are included under `assets/`, including `assets/skills/credits.json` and `assets/social-icons-source.txt`.

## Content updates

Edit `index.html` for page content, `app.js` for project details, and `immersive.css` for the focused profile layouts. Project illustrations and sample-data previews are identified in the relevant details. Keep role titles, employment dates and numerical claims grounded in actual records. The downloadable r?sum? is maintained separately.

## Certifications

The training and credentials section contains seven entries with category filters: one training completion, four internship completions/milestones, and two hackathon participations. The Gen AI Exchange participation certificate links to the supplied public Google Drive file. Other entries show titles, issuers, learning details and related work without publishing uploaded certificate PDFs or personal credential identifiers. No certificate URLs or issue dates are invented.

Edit `certifications.js` for filter behavior and `certifications.css` for responsive presentation. Certificate cards are present in the HTML and remain available without JavaScript.

## Visual system

The site uses a unified Bricolage Grotesque / Inter / Space Grotesk type system, navy/mint/violet dark mode, and a complementary light mode. `immersive.css` owns the responsive layout and card presentation; `project-models.css` supplies the existing project illustrations. Pointer-driven card depth, scroll reveals, and progress are in `immersive.js`, with reduced-motion and coarse-pointer fallbacks. Project screenshots remain labeled as sample-data or test-data previews. Older style files are retained for history but are not loaded.
