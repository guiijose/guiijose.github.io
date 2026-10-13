/**
 * Guilherme José - Personal Website
 * Dynamic Data Loader & Hydrator
 */

document.addEventListener('DOMContentLoaded', async () => {
  await initWebsite();
});

/**
 * Main initialization pipeline: fetches data, renders sections, binds listeners
 */
async function initWebsite() {
  const data = await loadProfileData();
  if (data) {
    renderAll(data);
  }
  
  initEmailCopy();
}

/**
 * Fetches data/profile.json with an inline fallback for offline or file:// usage
 */
async function loadProfileData() {
  try {
    const response = await fetch('./data/profile.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn('Could not fetch data/profile.json directly (likely due to file:// CORS restriction). Using embedded fallback data. To load changes directly from data/profile.json, run a local web server (e.g., python3 -m http.server).', error);
    return getFallbackData();
  }
}

/**
 * Renders all website sections from the loaded profile data
 */
function renderAll(data) {
  renderTopBar(data);
  renderHero(data);
  renderAbout(data);
}

/**
 * Renders Top Bar: >guiijose (Left) | [Icons + View CV] (Right)
 */
function renderTopBar(data) {
  const brandText = document.getElementById('nav-brand-text');
  if (brandText && data.profile?.handle) {
    brandText.textContent = data.profile.handle;
  }

  const linkedinLink = document.getElementById('nav-linkedin-link');
  if (linkedinLink && data.social?.linkedin) {
    linkedinLink.setAttribute('href', data.social.linkedin);
  }

  const githubLink = document.getElementById('nav-github-link');
  if (githubLink && data.social?.github) {
    githubLink.setAttribute('href', data.social.github);
  }

  const emailLink = document.getElementById('nav-email-link');
  if (emailLink && data.social?.email) {
    emailLink.setAttribute('href', `mailto:${data.social.email}`);
    emailLink.setAttribute('data-copy-email', data.social.email);
  }

  const cvBtn = document.getElementById('nav-cv-btn');
  if (cvBtn && data.cv?.pdfUrl) {
    cvBtn.setAttribute('href', data.cv.pdfUrl);
  }
}

/**
 * Renders Hero: 3-line Name on left, photo on right
 */
function renderHero(data) {
  const heroName = document.getElementById('hero-name');
  if (heroName) {
    const lines = Array.isArray(data.profile?.nameLines) && data.profile.nameLines.length
      ? data.profile.nameLines
      : (data.profile?.name ? data.profile.name.split(' ') : ['Guilherme', 'Andrez', 'Jose']);

    heroName.innerHTML = lines
      .map(line => `<span class="hero-name-line">${escapeHtml(line)}</span>`)
      .join('');
  }

  const heroPhoto = document.getElementById('hero-photo');
  if (heroPhoto && data.profile?.photoUrl) {
    heroPhoto.setAttribute('src', data.profile.photoUrl);
    heroPhoto.setAttribute('alt', data.profile.name || 'Guilherme Andrez Jose');
  }
}

/**
 * Renders About Section: bio, education, and experience timelines
 */
function renderAbout(data) {
  const about = data.about;
  if (!about) return;

  // Bio Paragraphs
  const bioContainer = document.getElementById('about-bio');
  if (bioContainer && Array.isArray(about.paragraphs)) {
    bioContainer.innerHTML = about.paragraphs.map(p => `<p>${p}</p>`).join('');
  }

  // Education Timeline
  const educationContainer = document.getElementById('about-education-list');
  if (educationContainer && Array.isArray(about.education)) {
    educationContainer.innerHTML = about.education.map(item => `
      <div class="timeline-item">
        <div class="timeline-date">${escapeHtml(item.period || '')}</div>
        <div class="timeline-title">${escapeHtml(item.degree || '')}</div>
        <div class="timeline-subtitle">${escapeHtml(item.institution || item.specialization || '')}</div>
        ${item.description ? `<p class="timeline-desc">${escapeHtml(item.description)}</p>` : ''}
      </div>
    `).join('');
  }

  // Experience Timeline
  const experienceContainer = document.getElementById('about-experience-list');
  if (experienceContainer && Array.isArray(about.experience)) {
    experienceContainer.innerHTML = about.experience.map(item => `
      <div class="timeline-item">
        <div class="timeline-date">${escapeHtml(item.period || '')}</div>
        <div class="timeline-title">${escapeHtml(item.role || '')}</div>
        <div class="timeline-subtitle">${escapeHtml(item.organization || '')}</div>
        ${item.description ? `<p class="timeline-desc">${escapeHtml(item.description)}</p>` : ''}
        ${Array.isArray(item.bullets) ? `
          <ul class="timeline-bullets">
            ${item.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join('')}
          </ul>
        ` : ''}
        ${item.technologies ? `<div class="timeline-tech"><span class="tech-label">Technologies:</span> ${escapeHtml(item.technologies)}</div>` : ''}
      </div>
    `).join('');
  }
}

/**
 * Copies contact email to clipboard and presents a feedback toast notification
 */
function initEmailCopy() {
  const copyButtons = document.querySelectorAll('[data-copy-email]');
  const toast = document.getElementById('toast');

  if (!copyButtons.length) return;

  copyButtons.forEach((btn) => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const email = btn.getAttribute('data-copy-email') || 'guiandrezjose@gmail.com';

      try {
        if (navigator.clipboard && window.isSecureContext) {
          await navigator.clipboard.writeText(email);
        } else {
          const textArea = document.createElement('textarea');
          textArea.value = email;
          textArea.style.position = 'fixed';
          textArea.style.left = '-9999px';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          document.execCommand('copy');
          document.body.removeChild(textArea);
        }
        showToast(`Copied to clipboard: ${email}`);
      } catch (err) {
        showToast(`Email: ${email}`);
      }
    });
  });

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000);
  }
}

/**
 * Escapes HTML characters to prevent XSS
 */
function escapeHtml(str) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Embedded fallback data used if fetch() is blocked by browser file:// policy
 */
function getFallbackData() {
  return {
    "profile": {
      "name": "Guilherme Andrez Jose",
      "nameLines": [
        "Guilherme",
        "Andrez",
        "Jose"
      ],
      "handle": "guiijose",
      "photoUrl": "assets/images/portrait.jpeg"
    },
    "about": {
      "paragraphs": [
        "I am pursuing a degree in <strong>Computer Science</strong> with a dedicated specialization in <strong>Computer Systems and Infrastructure</strong>. My academic and practical focus revolves around how software interfaces directly with hardware, how operating systems manage resources, and how modern distributed systems achieve resilience at scale.",
        "Whether it is writing high-performance code in C, analyzing Linux kernel internals, configuring containerized environments, or reasoning about network protocol overhead, I thrive on demystifying complex abstractions and engineering robust infrastructure foundations."
      ],
      "education": [
        {
          "degree": "MSc in Computer Science (Joint Degree)",
          "specialization": "Track: Computer Systems and Infrastructure",
          "institution": "University of Amsterdam / Vrije Universiteit (UvA/VU) • Amsterdam, Netherlands",
          "period": "SEP 2026 – JUL 2028",
          "description": "Specializing in advanced computer systems and large-scale infrastructure."
        },
        {
          "degree": "B.S. in Computer Science and Engineering",
          "specialization": "Grade: 16/20",
          "institution": "Instituto Superior Técnico • Lisbon, Portugal",
          "period": "SEP 2023 – JUL 2026",
          "description": "Coursework: Operating Systems, Distributed Systems, Computer Networks, Compilers, Computer Architecture & Organization, Algorithms & Data Structures, Databases, Machine Learning."
        },
        {
          "degree": "MIAI Summer School in Artificial Intelligence",
          "specialization": "Summer School",
          "institution": "Grenoble INP-ENSIMAG • Grenoble, France",
          "period": "JUL 2024",
          "description": "Summer school covering applied and foundational artificial intelligence."
        }
      ],
      "experience": [
        {
          "role": "Software Engineering Intern, Engine Department",
          "organization": "SingleStore • Lisbon, Portugal",
          "period": "JUN 2026 – AUG 2026",
          "bullets": [
            "Clustering: Developed and maintained clustering features within the distributed database engine, supporting node coordination and system stability.",
            "Two-Phase Commit (2PC): Implemented a feature extension for the 2PC protocol that triggers during failure scenarios, ensuring fault tolerance and consistent state recovery across distributed nodes.",
            "Concurrency Monitoring: Engineered monitoring capabilities and applied optimizations to internal engine spin locks, improving visibility into thread contention and concurrency metrics."
          ],
          "technologies": "C, C++, Python"
        },
        {
          "role": "Summer Internship, Quantitative Research Compute Team",
          "organization": "BNP Paribas • Lisbon, Portugal",
          "period": "JUL 2025 – AUG 2025",
          "bullets": [
            "Website: Built a full-stack website serving as a wrapper for an external API, improving usability and accessibility of the service.",
            "Automation Tasks: Developed automation scripts to streamline repetitive tasks, reducing manual effort and increasing efficiency."
          ],
          "technologies": "Python, Flask"
        }
      ]
    },
    "cv": {
      "pdfUrl": "assets/docs/cv.pdf"
    },
    "social": {
      "linkedin": "https://www.linkedin.com/in/guilherme-a-jose/",
      "github": "https://github.com/guiijose",
      "email": "guiandrezjose@gmail.com"
    }
  };
}
