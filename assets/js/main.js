/**
 * Guilherme José - Personal Website
 * Dynamic Data Loader & UI Hydrator
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
  
  initNavigationHighlight();
  initEmailCopy();
  initCopyrightYear();
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
  renderBrand(data);
  renderHero(data);
  renderAbout(data);
  renderCV(data);
  renderFooter(data);
}

/**
 * Renders Brand and Header elements
 */
function renderBrand(data) {
  const brandText = document.getElementById('nav-brand-text');
  if (brandText && data.profile?.handle) {
    brandText.textContent = data.profile.handle;
  }

  const navCvBtn = document.getElementById('nav-cv-btn');
  if (navCvBtn && data.cv?.pdfUrl) {
    navCvBtn.setAttribute('href', data.cv.pdfUrl);
  }
}

/**
 * Renders Hero section
 */
function renderHero(data) {
  const statusBadge = document.getElementById('hero-status-text');
  if (statusBadge && data.profile?.status) {
    statusBadge.textContent = data.profile.status;
  }

  const heroHeadline = document.getElementById('hero-headline');
  if (heroHeadline && data.profile) {
    heroHeadline.innerHTML = `
      ${escapeHtml(data.profile.headlinePrefix || "Hi, I'm Guilherme José.")}<br>
      ${escapeHtml(data.profile.taglinePrefix || 'Building resilient systems ')}
      <span class="gradient-text">${escapeHtml(data.profile.taglineGradient || 'from bare metal to cloud.')}</span>
    `;
  }

  const heroSub = document.getElementById('hero-subheadline');
  if (heroSub && data.profile?.subheadline) {
    heroSub.textContent = data.profile.subheadline;
  }
}

/**
 * Renders About section (bio, focus cards, system specs panel)
 */
function renderAbout(data) {
  const about = data.about;
  if (!about) return;

  const tag = document.getElementById('about-tag');
  if (tag && about.sectionTag) tag.textContent = about.sectionTag;

  const title = document.getElementById('about-title');
  if (title && about.sectionTitle) title.textContent = about.sectionTitle;

  const subtitle = document.getElementById('about-subtitle');
  if (subtitle && about.sectionSubtitle) subtitle.textContent = about.sectionSubtitle;

  // Bio Paragraphs
  const bioContainer = document.getElementById('about-bio');
  if (bioContainer && Array.isArray(about.paragraphs)) {
    bioContainer.innerHTML = about.paragraphs.map(p => `<p>${p}</p>`).join('');
  }

  // Focus Cards
  const focusGrid = document.getElementById('focus-cards-grid');
  if (focusGrid && Array.isArray(about.focusAreas)) {
    focusGrid.innerHTML = about.focusAreas.map(card => {
      return `
        <div class="focus-card">
          <div class="focus-icon">
            ${getFocusIconSvg(card.id)}
          </div>
          <h3 class="focus-title">${escapeHtml(card.title)}</h3>
          <p class="focus-desc">${escapeHtml(card.description)}</p>
        </div>
      `;
    }).join('');
  }

  // Sysinfo Specs Panel
  const sysinfo = about.sysinfo;
  if (sysinfo) {
    const fileName = document.getElementById('sysinfo-file-name');
    if (fileName && sysinfo.fileName) fileName.textContent = sysinfo.fileName;

    const discipline = document.getElementById('spec-discipline');
    if (discipline && sysinfo.discipline) discipline.textContent = sysinfo.discipline;

    const specialization = document.getElementById('spec-specialization');
    if (specialization && sysinfo.specialization) specialization.textContent = sysinfo.specialization;

    const statusEl = document.getElementById('spec-status');
    if (statusEl && sysinfo.status) statusEl.textContent = sysinfo.status;

    const languagesContainer = document.getElementById('spec-languages');
    if (languagesContainer && Array.isArray(sysinfo.languages)) {
      languagesContainer.innerHTML = sysinfo.languages
        .map(lang => `<span class="tech-tag">${escapeHtml(lang)}</span>`).join('');
    }

    const toolsContainer = document.getElementById('spec-tools');
    if (toolsContainer && Array.isArray(sysinfo.tools)) {
      toolsContainer.innerHTML = sysinfo.tools
        .map(tool => `<span class="tech-tag">${escapeHtml(tool)}</span>`).join('');
    }
  }
}

/**
 * Renders CV Section (Banner buttons, Education, Coursework, Competencies)
 */
function renderCV(data) {
  const cv = data.cv;
  if (!cv) return;

  const tag = document.getElementById('cv-tag');
  if (tag && cv.sectionTag) tag.textContent = cv.sectionTag;

  const title = document.getElementById('cv-title');
  if (title && cv.sectionTitle) title.textContent = cv.sectionTitle;

  const subtitle = document.getElementById('cv-subtitle');
  if (subtitle && cv.sectionSubtitle) subtitle.textContent = cv.sectionSubtitle;

  const bannerTitle = document.getElementById('cv-banner-title');
  if (bannerTitle && cv.bannerTitle) bannerTitle.textContent = cv.bannerTitle;

  const bannerText = document.getElementById('cv-banner-text');
  if (bannerText && cv.bannerText) bannerText.textContent = cv.bannerText;

  // CV Links
  const viewCvBtn = document.getElementById('cv-view-btn');
  if (viewCvBtn && cv.pdfUrl) {
    viewCvBtn.setAttribute('href', cv.pdfUrl);
  }

  const downloadCvBtn = document.getElementById('cv-download-btn');
  if (downloadCvBtn && cv.pdfUrl) {
    downloadCvBtn.setAttribute('href', cv.pdfUrl);
    if (cv.downloadFileName) {
      downloadCvBtn.setAttribute('download', cv.downloadFileName);
    }
  }

  // Education Timeline
  const educationContainer = document.getElementById('cv-education-list');
  if (educationContainer && Array.isArray(cv.education)) {
    educationContainer.innerHTML = cv.education.map(item => `
      <div class="timeline-item">
        <div class="timeline-date">${escapeHtml(item.period || '')}</div>
        <div class="timeline-title">${escapeHtml(item.degree || '')}</div>
        <div class="timeline-subtitle">${escapeHtml(item.specialization || '')}</div>
        <p class="timeline-desc">${escapeHtml(item.description || '')}</p>
      </div>
    `).join('');
  }

  // Coursework Tags
  const courseworkContainer = document.getElementById('cv-coursework-list');
  if (courseworkContainer && Array.isArray(cv.coursework)) {
    courseworkContainer.innerHTML = cv.coursework
      .map(course => `<span class="tech-tag">${escapeHtml(course)}</span>`).join('');
  }

  // Technical Competencies
  const competenciesContainer = document.getElementById('cv-competencies-list');
  if (competenciesContainer && Array.isArray(cv.competencies)) {
    competenciesContainer.innerHTML = cv.competencies.map(cat => `
      <div class="skill-category">
        <span class="skill-category-title">${escapeHtml(cat.category)}</span>
        <div class="tech-tag-group">
          ${cat.items.map(item => `<span class="tech-tag">${escapeHtml(item)}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }
}

/**
 * Renders Footer & Social contacts
 */
function renderFooter(data) {
  const footerBrand = document.getElementById('footer-brand-text');
  if (footerBrand && data.profile?.handle) {
    footerBrand.textContent = data.profile.handle;
  }

  const social = data.social;
  if (!social) return;

  const githubLink = document.getElementById('footer-github-link');
  if (githubLink && social.github) {
    githubLink.setAttribute('href', social.github);
  }

  const linkedinLink = document.getElementById('footer-linkedin-link');
  if (linkedinLink && social.linkedin) {
    linkedinLink.setAttribute('href', social.linkedin);
  }

  const emailLink = document.getElementById('footer-email-link');
  if (emailLink && social.email) {
    emailLink.setAttribute('href', `mailto:${social.email}`);
    emailLink.setAttribute('data-copy-email', social.email);
  }
}

/**
 * Returns matching SVG for known focus area icons
 */
function getFocusIconSvg(iconId) {
  switch (iconId) {
    case 'os':
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="2" y="2" width="20" height="8" rx="2" ry="2"></rect>
        <rect x="2" y="14" width="20" height="8" rx="2" ry="2"></rect>
        <line x1="6" y1="6" x2="6.01" y2="6"></line>
        <line x1="6" y1="18" x2="6.01" y2="18"></line>
      </svg>`;
    case 'networks':
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <line x1="2" y1="12" x2="22" y2="12"></line>
        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
      </svg>`;
    case 'infra':
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"></path>
      </svg>`;
    case 'perf':
    default:
      return `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline>
      </svg>`;
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
 * Highlights navigation items based on current scroll position using IntersectionObserver
 */
function initNavigationHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  if (!sections.length || !navLinks.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -60% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
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
      const email = btn.getAttribute('data-copy-email') || 'guilhermejose@example.com';

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
 * Sets current year in footer dynamically
 */
function initCopyrightYear() {
  const yearElement = document.getElementById('current-year');
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }
}

/**
 * Embedded fallback data used if fetch() is blocked by browser file:// policy
 */
function getFallbackData() {
  return {
    "profile": {
      "name": "Guilherme José",
      "handle": "guiijose",
      "status": "CS Student • Computer Systems & Infrastructure",
      "headlinePrefix": "Hi, I'm Guilherme José.",
      "taglinePrefix": "Building resilient systems ",
      "taglineGradient": "from bare metal to cloud.",
      "subheadline": "I am a Computer Science student dedicated to understanding what happens under the hood—specializing in low-level systems, distributed architectures, operating systems, and scalable infrastructure.",
      "isOpenToOpportunities": true
    },
    "about": {
      "sectionTag": "// 01. Profile & Background",
      "sectionTitle": "About Me",
      "sectionSubtitle": "Deeply curious about computing abstractions, performance engineering, and system reliability.",
      "paragraphs": [
        "I am pursuing a degree in <strong>Computer Science</strong> with a dedicated specialization in <strong>Computer Systems and Infrastructure</strong>. My academic and practical focus revolves around how software interfaces directly with hardware, how operating systems manage resources, and how modern distributed systems achieve resilience at scale.",
        "Whether it is writing high-performance code in C, analyzing Linux kernel internals, configuring containerized environments, or reasoning about network protocol overhead, I thrive on demystifying complex abstractions and engineering robust infrastructure foundations."
      ],
      "focusAreas": [
        {
          "id": "os",
          "title": "Systems & OS Internals",
          "description": "Process scheduling, virtual memory, POSIX interfaces, concurrency primitives, and hardware-software interaction."
        },
        {
          "id": "networks",
          "title": "Distributed Systems & Networks",
          "description": "Socket programming, TCP/IP stack, consensus, RPC protocols, and designing fault-tolerant communication pipelines."
        },
        {
          "id": "infra",
          "title": "Infrastructure & DevOps",
          "description": "Containerization with Docker, Linux system administration, CI/CD pipelines, and automated environment provisioning."
        },
        {
          "id": "perf",
          "title": "Performance & Diagnostics",
          "description": "Benchmarking, memory profiling, profiling system bottlenecks, cache utilization, and observability."
        }
      ],
      "sysinfo": {
        "fileName": "sysinfo.sh",
        "discipline": "Computer Science (B.S.)",
        "specialization": "Computer Systems & Infrastructure",
        "languages": ["C", "C++", "Python", "Bash", "Go"],
        "tools": ["Linux / Unix", "Docker", "Git", "GDB / Valgrind", "POSIX", "Virtualization"],
        "status": "Open to opportunities"
      }
    },
    "cv": {
      "sectionTag": "// 02. Curriculum Vitae",
      "sectionTitle": "Curriculum Vitae",
      "sectionSubtitle": "Explore my educational qualifications, systems coursework, and technical competencies.",
      "pdfUrl": "assets/docs/cv.pdf",
      "downloadFileName": "Guilherme_Jose_CV.pdf",
      "bannerTitle": "Complete Resume / CV",
      "bannerText": "Access the complete document detailing my academic track, technical projects, and background. Available for immediate in-browser viewing or PDF download.",
      "education": [
        {
          "degree": "B.S. in Computer Science",
          "specialization": "Specialization: Computer Systems and Infrastructure",
          "period": "CURRENT / ONGOING",
          "description": "Rigorous focus on system fundamentals, OS principles, algorithms, data structures, and networked environments."
        }
      ],
      "coursework": [
        "Operating Systems",
        "Computer Architecture",
        "Computer Networks",
        "Distributed Systems",
        "Cloud Infrastructure",
        "Database Management Systems",
        "Algorithms & Complexity",
        "System Security & Dependability"
      ],
      "competencies": [
        {
          "category": "Languages & Scripting",
          "items": ["C", "C++", "Python", "Bash / Shell", "Go", "SQL"]
        },
        {
          "category": "Platforms & Infrastructure",
          "items": ["Linux / Unix Kernel", "Docker", "Git & GitHub Actions", "TCP/IP & Sockets", "CI/CD"]
        }
      ]
    },
    "social": {
      "github": "https://github.com/guiijose",
      "linkedin": "https://linkedin.com",
      "email": "guilhermejose@example.com"
    }
  };
}
