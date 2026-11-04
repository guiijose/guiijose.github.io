/**
 * Guilherme José - Personal Website
 * Dynamic Data Loader & Hydrator (Terminal Edition)
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
    console.warn('Could not fetch data/profile.json directly (e.g. file:// CORS). Using embedded fallback data.', error);
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
 * Renders Top Bar Links: CV, LinkedIn, Email, GitHub
 */
function renderTopBar(data) {
  const cvBtn = document.getElementById('nav-cv-btn');
  const cvUrl = data.social?.cv || data.cv?.pdfUrl;
  if (cvBtn && cvUrl) {
    cvBtn.setAttribute('href', cvUrl);
  }

  const linkedinLink = document.getElementById('nav-linkedin-link');
  if (linkedinLink && data.social?.linkedin) {
    linkedinLink.setAttribute('href', data.social.linkedin);
  }

  const emailLink = document.getElementById('nav-email-link');
  if (emailLink && data.social?.email) {
    emailLink.setAttribute('href', `mailto:${data.social.email}`);
    emailLink.setAttribute('data-copy-email', data.social.email);
  }

  const githubLink = document.getElementById('nav-github-link');
  if (githubLink && data.social?.github) {
    githubLink.setAttribute('href', data.social.github);
  }
}

/**
 * Renders Center-Top Hero: Photo and Name
 */
function renderHero(data) {
  const heroName = document.getElementById('hero-name');
  if (heroName && data.profile?.name) {
    heroName.textContent = data.profile.name;
  }

  const heroPhoto = document.getElementById('hero-photo');
  if (heroPhoto && data.profile?.photoUrl) {
    heroPhoto.setAttribute('src', data.profile.photoUrl);
    heroPhoto.setAttribute('alt', data.profile.name || 'Guilherme Andrez José');
  }
}

/**
 * Renders About Section: bio text
 */
function renderAbout(data) {
  const about = data.about;
  if (!about) return;

  const bioContainer = document.getElementById('about-bio');
  if (bioContainer && Array.isArray(about.paragraphs)) {
    const paragraphsHtml = about.paragraphs
      .map(p => `<p>${escapeHtml(p)}</p>`)
      .join('');
    bioContainer.innerHTML = paragraphsHtml;
  }
}

/**
 * Copies contact email to clipboard and presents a terminal feedback toast notification
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
        showToast(`[✓] Copied to clipboard: ${email}`);
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
      "name": "Guilherme Andrez José",
      "handle": "guiijose",
      "photoUrl": "assets/images/portrait.jpeg"
    },
    "about": {
      "paragraphs": [
        "I am a Computer Science master’s student at VU / UvA, specializing in Computer Systems and Infrastructure. I care about how computers work under the hood, especially performance, security, and building reliable distributed systems. I mainly write code in C and C++, am currently learning Rust, and enjoy competitive programming in my spare time. I am a Neovim user but plan to try Emacs at some point in the future."
      ]
    },
    "cv": {
      "pdfUrl": "assets/docs/cv.pdf"
    },
    "social": {
      "cv": "assets/docs/cv.pdf",
      "linkedin": "https://www.linkedin.com/in/guilherme-a-jose/",
      "email": "guiandrezjose@gmail.com",
      "github": "https://github.com/guiijose"
    }
  };
}
