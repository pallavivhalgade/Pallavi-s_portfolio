const $ = (selector) => document.querySelector(selector);
const themeButton = $('#theme');
function updateThemeLabel() { const dark = document.documentElement.dataset.theme === 'dark'; themeButton.setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} theme`); themeButton.textContent = dark ? '☀' : '☾'; themeButton.title = themeButton.getAttribute('aria-label'); document.querySelector('meta[name="theme-color"]').content = dark ? '#10121e' : '#fbf2ec'; }
updateThemeLabel();
themeButton.addEventListener('click', () => { const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark'; document.documentElement.dataset.theme = theme; try { localStorage.setItem('pv-aurora-theme', theme); } catch {} document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#10121e' : '#fbf2ec'; themeButton.textContent = theme === 'dark' ? '☾' : '☀'; updateThemeLabel(); });
const menu = $('#menu'), navigation = $('#navigation');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); navigation.classList.remove('open'); }
menu.addEventListener('click', () => { const open = menu.getAttribute('aria-expanded') !== 'true'; menu.setAttribute('aria-expanded', String(open)); menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation'); navigation.classList.toggle('open', open); });
navigation.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
document.addEventListener('click', e => { if (!e.target.closest('.header')) closeMenu(); });
const wideScreen = matchMedia('(min-width: 701px)'); wideScreen.addEventListener('change', closeMenu);
const navLinks = [...navigation.querySelectorAll('a')];
const sections = navLinks.map(a => document.querySelector(a.getAttribute('href')));
let scrollQueued = false;
function updateNavigation() { let active; for (const section of sections) { if (section.getBoundingClientRect().top < 180) active = section.id; } navLinks.forEach(a => { const selected = a.hash === `#${active}`; a.classList.toggle('active', selected); if (selected) a.setAttribute('aria-current', 'location'); else a.removeAttribute('aria-current'); }); scrollQueued = false; }
window.addEventListener('scroll', () => { if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateNavigation); } }, { passive: true }); updateNavigation();
document.querySelectorAll('[data-filter]').forEach(button => button.addEventListener('click', () => { const filter = button.dataset.filter; let count = 0; document.querySelectorAll('[data-filter]').forEach(b => { b.classList.toggle('active', b === button); b.setAttribute('aria-pressed', String(b === button)); }); document.querySelectorAll('.project-card').forEach(card => { card.hidden = filter !== 'all' && !card.dataset.category.split(' ').includes(filter); if (!card.hidden) count++; }); $('.project-count').textContent = `${count} ${count === 1 ? 'project' : 'projects'}`; }));
const projects = {
  "career": {
    "title": "CareerPilot AI",
    "label": "01 / GENERATIVE AI · CAREER PREPARATION",
    "description": "A career preparation workspace combining resume matching, interview practice, seven-day plans and contextual coaching.",
    "features": [
      "A LangGraph workflow connects resume matching, skill gaps, retrieval, planning and verification.",
      "Chroma vector search and BM25 keyword retrieval provide context, with cross-encoder reranking.",
      "A React interface connects to a FastAPI backend, with local models through Ollama and LangChain."
    ],
    "note": "The frontend preview supports sample-data browsing. Full AI functionality requires the configured Python backend, retrieval store and local model.",
    "links": [
      [
        "Open frontend preview",
        "https://careerpilot-ai-three-virid.vercel.app"
      ],
      [
        "Explore source",
        "https://github.com/pallavivhalgade/CareerPilotAI"
      ]
    ]
  },
  "driver": {
    "title": "DriverGuard AI",
    "label": "02 / COMPUTER VISION · ANDROID",
    "description": "A college-project prototype combining on-device computer vision with driver fatigue and distraction signals.",
    "features": [
      "Google ML Kit face analysis and TensorFlow Lite yawn inference feed a timing and threshold policy.",
      "Voice warnings support English, Hindi and Marathi, subject to installed Android voices.",
      "Configurable emergency contacts and GPS-linked messaging support escalation, with an SMS-composer fallback."
    ],
    "note": "Source and release information are public. Emergency messaging depends on Android permissions, device support and GPS. The project is a prototype, not a certified driver-safety system. Dashboard previews use test data.",
    "links": [
      [
        "Explore source",
        "https://github.com/pallavivhalgade/AI-Based-Driver-Fatigue-and-Distraction-Detection"
      ],
      [
        "View Android releases",
        "https://github.com/pallavivhalgade/AI-Based-Driver-Fatigue-and-Distraction-Detection/releases"
      ]
    ]
  },
  "interview": {
    "title": "Interview Prep Agent",
    "label": "03 / LLM + NLP · INTERVIEW PREPARATION",
    "description": "A Python application that uses a resume and target job description to make interview preparation more focused.",
    "features": [
      "Resume–job semantic matching with Sentence Transformers and cosine similarity.",
      "Groq LLM integration for requirements, interview questions, skill gaps and preparation plans.",
      "A Streamlit interface with PDF/DOCX parsing and downloadable preparation reports."
    ],
    "note": "Generated guidance should be checked against the candidate’s actual experience and target role.",
    "links": [
      [
        "Open application",
        "https://interview-prep-agent-94gjmmzu9q3w9gp4by8uan.streamlit.app/"
      ],
      [
        "Explore source",
        "https://github.com/pallavivhalgade/interview-prep-agent"
      ]
    ]
  },
  "health": {
    "title": "Smart Health Appointment",
    "label": "04 / DJANGO · INTERNSHIP PROJECT",
    "description": "A healthcare appointment-booking application developed during my Python and Django internship at Manasvi Tech Solutions.",
    "features": [
      "Patient and doctor dashboards support appointment booking and management.",
      "Role-based access separates patient and doctor functionality.",
      "Booking validation and Django backend integration connect the application’s web pages."
    ],
    "note": "The artwork is an illustrative model of the scheduling experience. The repository contains setup and implementation details.",
    "links": [
      [
        "Explore source",
        "https://github.com/pallavivhalgade/smart-health-appointment"
      ],
      [
        "Open application",
        "https://smart-health-appointment-1.onrender.com"
      ]
    ]
  },
  "learnmate": {
    "title": "LearnMate",
    "label": "05 / IBM CLOUD · LEARNING PATHWAYS",
    "description": "An AI learning-path advisor developed during the Edunet Foundation AI & Cloud internship, leveraging IBM SkillsBuild and IBM Cloud.",
    "features": [
      "IBM watsonx and Granite foundation models support personalized course recommendations.",
      "Conversational prompts capture students’ interests, learning goals and current skill levels.",
      "A course-document vector index provides learning context for roadmap recommendations."
    ],
    "note": "The cloud workflow requires an appropriate IBM Cloud configuration. The artwork illustrates the workflow; it is not an application screenshot.",
    "links": [
      [
        "Explore source",
        "https://github.com/pallavivhalgade/learnmate-watsonx"
      ]
    ]
  }
};
const dialog = $('#project-dialog'); let previousFocus;
document.querySelectorAll('[data-project]').forEach(button => button.addEventListener('click', () => { const project = projects[button.dataset.project]; previousFocus = button; $('#dialog-title').textContent = project.title; $('#dialog-label').textContent = project.label; $('#dialog-description').textContent = project.description; $('#dialog-features').replaceChildren(...project.features.map(feature => { const p = document.createElement('p'); p.textContent = feature; return p; })); $('#dialog-note').textContent = project.note; $('#dialog-note').hidden = !project.note; $('#dialog-links').replaceChildren(...project.links.map(([label, href]) => { const a = document.createElement('a'); a.textContent = `${label} ↗`; a.href = href; a.target = '_blank'; a.rel = 'noopener noreferrer'; return a; })); dialog.showModal(); document.body.style.overflow = 'hidden'; }));
$('#close-dialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', e => { const r = dialog.getBoundingClientRect(); if (e.target === dialog && (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)) dialog.close(); });
dialog.addEventListener('close', () => { document.body.style.overflow = ''; previousFocus?.focus({ preventScroll: true }); });
let toastTimeout;
function toast(message) { clearTimeout(toastTimeout); $('#toast').textContent = message; $('#toast').classList.add('visible'); toastTimeout = setTimeout(() => $('#toast').classList.remove('visible'), 3500); }
$('#copy-email').addEventListener('click', async () => { try { await navigator.clipboard.writeText('pallavivhalgade@gmail.com'); toast('Email address copied. Let’s connect!'); } catch { toast('Email: pallavivhalgade@gmail.com'); } });
$('#year').textContent = new Date().getFullYear();
