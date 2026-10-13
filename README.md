# Personal Website & CV

Clean, dark-themed personal website for **Guilherme José**, specializing in Computer Systems and Infrastructure.

Built with semantic **HTML5**, modern **CSS3**, and vanilla **JavaScript**. All information is cleanly decoupled into `data/profile.json` so you can update your personal website in seconds without touching any HTML or CSS.

---

## ⚡ Instant Content Customization (`data/profile.json`)

To change anything on your site, open and edit **[`data/profile.json`](file:///Users/guilhermejose/Repositories/guiijose.github.io/data/profile.json)**:

```json
{
  "profile": {
    "name": "Guilherme José",
    "handle": "guiijose",
    "status": "CS Student • Computer Systems & Infrastructure",
    "headlinePrefix": "Hi, I'm Guilherme José.",
    "taglinePrefix": "Building resilient systems ",
    "taglineGradient": "from bare metal to cloud.",
    "subheadline": "...",
    "isOpenToOpportunities": true
  },
  "about": {
    "paragraphs": [ ... ],
    "focusAreas": [ ... ],
    "sysinfo": { ... }
  },
  "cv": {
    "pdfUrl": "assets/docs/cv.pdf",
    "downloadFileName": "Guilherme_Jose_CV.pdf",
    "education": [ ... ],
    "coursework": [ ... ],
    "competencies": [ ... ]
  },
  "social": {
    "github": "https://github.com/guiijose",
    "linkedin": "https://linkedin.com",
    "email": "guilhermejose@example.com"
  }
}
```

The site automatically fetches and displays the updated information when loaded.

---

## 📄 Updating Your CV PDF

1. Drop your compiled CV PDF into `assets/docs/`.
2. Name it `cv.pdf` (or customize the `"pdfUrl"` field in `data/profile.json`).

---

## 🛠️ Local Development & Preview

Because the site fetches `data/profile.json` asynchronously, run a local web server (to avoid browser `file://` CORS restrictions):

```bash
python3 -m http.server 8000
```
Then visit **`http://localhost:8000`** in your browser.

*(Note: An embedded fallback is also included in `assets/js/main.js` so the page still loads even if opened directly via `file://`)*.

---

## 📁 Repository Structure

```text
guiijose.github.io/
├── data/
│   └── profile.json      # Single source of truth for all your website content
├── index.html            # Semantic HTML skeleton & hydration containers
├── assets/
│   ├── css/
│   │   └── style.css     # Dark theme styles, CSS variables & typography
│   ├── js/
│   │   └── main.js       # Dynamic JSON loader, UI renderer & interactions
│   └── docs/
│       └── cv.pdf        # Your CV document (PDF)
└── README.md             # Project documentation
```

---

## 🌐 Deploying to GitHub Pages

Push your repository changes to `main`:

```bash
git add .
git commit -m "Update profile data"
git push origin main
```

Your updated website is live immediately at **`https://guiijose.github.io/`**.
