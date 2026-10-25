/**
 * Mohammad Shjjad Patwary — Portfolio Interaction Engine
 * Modern Vanilla JavaScript: Particles, Telemetry HUD, Real-time Clock,
 * Resume Modal, Bento Spotlight, Theme Toggle, Form Validation & Animations.
 */

'use strict';

/* ═════════════════════════════════════════════════════════════════
   1. UTILITY FUNCTIONS
   ═════════════════════════════════════════════════════════════════ */
const $ = (selector, context = document) => context.querySelector(selector);
const $$ = (selector, context = document) => [...context.querySelectorAll(selector)];
const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

/* ═════════════════════════════════════════════════════════════════
   2. PARTICLE CANVAS (HERO BACKGROUND)
   ═════════════════════════════════════════════════════════════════ */
function initParticles() {
  const canvas = $('#particle-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let width, height, particles = [], animationId;
  const isDark = () => document.documentElement.getAttribute('data-theme') !== 'light';

  function resize() {
    width = canvas.width = canvas.offsetWidth;
    height = canvas.height = canvas.offsetHeight;
  }

  function createParticle() {
    const speed = 0.2 + Math.random() * 0.3;
    return {
      x: Math.random() * width,
      y: Math.random() * height,
      radius: 0.8 + Math.random() * 1.6,
      vx: (Math.random() - 0.5) * speed,
      vy: -(speed * 0.6 + Math.random() * speed),
      alpha: 0.08 + Math.random() * 0.3,
    };
  }

  function init() {
    resize();
    const count = Math.min(Math.floor((width * height) / 10000), 75);
    particles = Array.from({ length: count }, createParticle);
  }

  function render() {
    ctx.clearRect(0, 0, width, height);
    const color = isDark() ? [99, 102, 241] : [79, 70, 229];

    particles.forEach((p, i) => {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${p.alpha})`;
      ctx.fill();

      // Connect nearby particles
      for (let j = i + 1; j < particles.length; j++) {
        const q = particles[j];
        const dist = Math.hypot(p.x - q.x, p.y - q.y);
        if (dist < 110) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = `rgba(${color[0]}, ${color[1]}, ${color[2]}, ${0.07 * (1 - dist / 110)})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      p.x += p.vx;
      p.y += p.vy;

      if (p.y + p.radius < 0) Object.assign(p, createParticle(), { y: height + p.radius });
      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
    });

    animationId = requestAnimationFrame(render);
  }

  init();
  render();

  window.addEventListener('resize', debounce(() => {
    cancelAnimationFrame(animationId);
    init();
    render();
  }, 250));
}

/* ═════════════════════════════════════════════════════════════════
   3. CUSTOM CURSOR
   ═════════════════════════════════════════════════════════════════ */
function initCursor() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const dot = $('#cursor-dot');
  const ring = $('#cursor-ring');
  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top = `${mouseY}px`;
  });

  function renderRing() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    ring.style.left = `${ringX}px`;
    ring.style.top = `${ringY}px`;
    requestAnimationFrame(renderRing);
  }
  renderRing();

  const interactiveElements = 'a, button, .spotlight-card, .btn, .copy-btn, input, textarea, .skill-tab-btn';
  $$(interactiveElements).forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-hover'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-hover'));
  });
}

/* ═════════════════════════════════════════════════════════════════
   4. REAL-TIME DHAKA CLOCK & TELEMETRY FEED
   ═════════════════════════════════════════════════════════════════ */
function initDhakaClock() {
  const clockEl = $('#clock-display');
  if (!clockEl) return;

  function updateClock() {
    try {
      const now = new Date();
      // Format to GMT+6
      const timeString = now.toLocaleTimeString('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
      clockEl.textContent = timeString;
    } catch {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString();
    }
  }

  updateClock();
  setInterval(updateClock, 1000);
}

function initTelemetryFeed() {
  const feed = $('#telemetry-feed');
  if (!feed) return;

  const logEvents = [
    { tag: '[ADMIN-OPS]', text: 'Fixed asset registers & sample audit completed: 100% matched' },
    { tag: '[POS-SYNC]', text: 'Multi-outlet inventory synchronized across registers' },
    { tag: '[CATALOG]', text: '2,000+ SKUs taxonomy and barcode database verified' },
    { tag: '[PROCURE]', text: 'Vendor invoice & delivery challan reconciliation vetted' },
    { tag: '[AUDIT]', text: 'Goods Received Note (GRN) audit cycle completed' },
    { tag: '[DATABASE]', text: 'Stock ledger reconciliation: 0 discrepancies found' },
    { tag: '[FACILITY]', text: 'Biometric attendance sync & 24/7 CCTV surveillance: ONLINE' },
    { tag: '[SHOPIFY]', text: 'Real-time stock reservation lock executed for online order' },
    { tag: '[IT-HEALTH]', text: 'Thermal printers & POS scanner heartbeat: 100% operational' },
    { tag: '[LOGISTICS]', text: 'Outbound dispatch verification matched with invoice manifest' }
  ];

  let index = 3;
  setInterval(() => {
    const event = logEvents[index % logEvents.length];
    const line = document.createElement('div');
    line.className = 'stream-line';
    line.innerHTML = `<span class="stream-tag">${event.tag}</span> ${event.text}`;
    
    feed.appendChild(line);
    // Keep maximum 4 lines
    if (feed.children.length > 4) {
      feed.removeChild(feed.children[0]);
    }
    index++;
  }, 3800);
}

/* ═════════════════════════════════════════════════════════════════
   5. DYNAMIC TYPED TEXT
   ═════════════════════════════════════════════════════════════════ */
function initTypedText() {
  const el = $('#typed-text');
  if (!el) return;

  const phrases = [
    'Corporate Office Admin & Governance',
    'Warehouse & Inventory Precision',
    'Omnichannel POS & Web Synchronization',
    'Fixed Asset Registers & Procurement',
    'Catalog & SKU Architecture (2,000+)',
    'IT Infrastructure & POS Deployment',
    'E-Commerce Operations & Order Systems',
    'Data-Driven Stock Variance Audits'
  ];

  let phraseIdx = 0;
  let charIdx = 0;
  let isDeleting = false;

  function type() {
    const current = phrases[phraseIdx];
    if (!isDeleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        isDeleting = true;
        setTimeout(type, 2000);
        return;
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        isDeleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.length;
      }
    }
    setTimeout(type, isDeleting ? 40 : 75);
  }

  type();
}

/* ═════════════════════════════════════════════════════════════════
   6. SCROLL PROGRESS & NAVBAR SHRINK
   ═════════════════════════════════════════════════════════════════ */
function initScrollProgress() {
  const bar = $('#scroll-progress');
  const nav = $('#navbar');
  const header = $('#site-header');
  const btt = $('#back-to-top');

  function handleScroll() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    if (bar && docHeight > 0) {
      bar.style.width = `${(scrollTop / docHeight) * 100}%`;
    }
    if (nav) {
      nav.classList.toggle('scrolled', scrollTop > 20);
    }
    if (header) {
      header.classList.toggle('scrolled', scrollTop > 20);
    }
    if (btt) {
      btt.classList.toggle('visible', scrollTop > 450);
    }
  }

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  btt?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ═════════════════════════════════════════════════════════════════
   7. SCROLL SPY FOR NAVIGATION
   ═════════════════════════════════════════════════════════════════ */
function initScrollSpy() {
  const links = $$('.nav-link, .drawer-link');
  const sections = $$('section[id]');
  if (!sections.length) return;

  function updateActiveLink() {
    const scrollPos = window.scrollY + 140;
    let currentId = '';

    sections.forEach(sec => {
      if (scrollPos >= sec.offsetTop) {
        currentId = sec.id;
      }
    });

    links.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === `#${currentId}`);
    });
  }

  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();
}

/* ═════════════════════════════════════════════════════════════════
   8. SCROLL REVEAL (INTERSECTION OBSERVER)
   ═════════════════════════════════════════════════════════════════ */
function initScrollReveal() {
  const revealElements = $$('.reveal-fade, .reveal-up, .reveal-right');
  if (!revealElements.length) return;

  // Immediately reveal all elements on mobile screens or if observer unsupported
  if (window.innerWidth <= 768 || !('IntersectionObserver' in window)) {
    revealElements.forEach(el => el.classList.add('revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.05, rootMargin: '0px 0px 50px 0px' });

  revealElements.forEach(el => observer.observe(el));
}

/* ═════════════════════════════════════════════════════════════════
   9. ANIMATED NUMBER COUNTERS
   ═════════════════════════════════════════════════════════════════ */
function initCounters() {
  const counters = $$('.counter');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const parent = el.closest('[data-target]');
      if (!parent) return;

      const target = parseFloat(parent.dataset.target);
      const suffix = parent.dataset.suffix || '';
      const isDecimal = target % 1 !== 0;
      const duration = 1600;
      const steps = 60;
      const increment = target / steps;
      let currentVal = 0;
      let frame = 0;

      const step = () => {
        frame++;
        currentVal = Math.min(currentVal + increment, target);
        el.textContent = (isDecimal ? currentVal.toFixed(1) : Math.round(currentVal).toLocaleString()) + suffix;

        if (frame < steps) {
          requestAnimationFrame(step);
        } else {
          el.textContent = (isDecimal ? target.toFixed(1) : target.toLocaleString()) + suffix;
        }
      };

      requestAnimationFrame(step);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.1 });

  counters.forEach(c => observer.observe(c));
}

/* ═════════════════════════════════════════════════════════════════
   10. SPOTLIGHT CARD EFFECT (MOUSE GRADIENT HOVER)
   ═════════════════════════════════════════════════════════════════ */
function initSpotlight() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  const cards = $$('.spotlight-card');
  cards.forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });
}

/* ═════════════════════════════════════════════════════════════════
   11. THEME SWITCHER (DARK / LIGHT)
   ═════════════════════════════════════════════════════════════════ */
function initTheme() {
  const toggleBtn = $('#theme-toggle');
  const icon = $('#theme-icon');
  const root = document.documentElement;

  const savedTheme = localStorage.getItem('shjjad-theme');
  const initialTheme = savedTheme || 'dark';

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (icon) {
      icon.className = 'fas fa-circle-half-stroke';
      icon.style.transform = theme === 'light' ? 'rotate(180deg)' : 'rotate(0deg)';
    }
    const label = theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme';
    toggleBtn?.setAttribute('aria-label', label);
    toggleBtn?.setAttribute('title', label);
    localStorage.setItem('shjjad-theme', theme);
  }

  applyTheme(initialTheme);

  toggleBtn?.addEventListener('click', () => {
    const current = root.getAttribute('data-theme');
    const target = current === 'light' ? 'dark' : 'light';
    applyTheme(target);
    showToast(`Switched to ${target === 'light' ? 'Arctic Light' : 'Dark'} mode`);
  });
}

/* ═════════════════════════════════════════════════════════════════
   12. SKILLS TAB FILTER
   ═════════════════════════════════════════════════════════════════ */
function initSkillsTabs() {
  const tabBtns = $$('.skill-tab-btn');
  const skillCards = $$('.skill-card');
  if (!tabBtns.length || !skillCards.length) return;

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetCategory = btn.dataset.tab;

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      skillCards.forEach(card => {
        const matches = targetCategory === 'all' || card.dataset.category === targetCategory;
        if (matches) {
          card.style.display = 'flex';
          requestAnimationFrame(() => {
            card.classList.add('revealed');
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          });
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

/* ═════════════════════════════════════════════════════════════════
   13. EXECUTIVE RESUME MODAL & PRINT/PDF FUNCTIONALITY
   ═════════════════════════════════════════════════════════════════ */
function initResumeModal() {
  const modal = $('#resume-modal');
  const triggers = [
    $('#open-resume-btn'),
    $('#hero-resume-trigger'),
    $('#drawer-resume-trigger'),
    $('#dossier-open-modal-btn'),
    $('#preview-expand-btn'),
    $('#dossier-avatar-btn')
  ].filter(Boolean);
  const closeBtn = $('#close-resume-btn');
  const printBtns = [
    $('#print-resume-btn'),
    $('#dossier-print-btn')
  ].filter(Boolean);
  const pdfBtns = [
    $('#save-pdf-btn'),
    $('#dossier-pdf-btn'),
    $('#nav-download-cv-btn'),
    $('#drawer-download-cv-btn')
  ].filter(Boolean);
  const shareCvBtns = [
    $('#share-cv-link-btn'),
    $('#dossier-share-btn'),
    $('#nav-share-cv-btn'),
    $('#drawer-share-cv-btn')
  ].filter(Boolean);
  const dossierBtns = [
    $('#request-dossier-btn'),
    $('#dossier-request-btn')
  ].filter(Boolean);

  if (!modal) return;

  function openModal() {
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    // Ensure CV content always starts displaying from the top of the modal
    modal.scrollTop = 0;
    const modalWindow = modal.querySelector('.resume-modal-window');
    if (modalWindow) modalWindow.scrollTop = 0;
    const paper = modal.querySelector('.resume-paper');
    if (paper) {
      paper.scrollTop = 0;
      if (typeof paper.scrollTo === 'function') {
        paper.scrollTo({ top: 0, left: 0, behavior: 'instant' });
      }
    }
  }

  function closeModal() {
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  triggers.forEach(t => t.addEventListener('click', openModal));
  closeBtn?.addEventListener('click', closeModal);

  modal.addEventListener('click', e => {
    if (e.target === modal) closeModal();
  });

  // Portrait Lightbox Modal handlers
  const cvAvatarBtn = $('#cv-avatar-btn');
  const photoLightbox = $('#photo-lightbox');
  const photoLightboxClose = $('#photo-lightbox-close');

  function openPhotoLightbox() {
    if (!photoLightbox) return;
    photoLightbox.classList.add('open');
    photoLightbox.setAttribute('aria-hidden', 'false');
  }

  function closePhotoLightbox() {
    if (!photoLightbox) return;
    photoLightbox.classList.remove('open');
    photoLightbox.setAttribute('aria-hidden', 'true');
  }

  cvAvatarBtn?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    openPhotoLightbox();
  });

  photoLightboxClose?.addEventListener('click', (e) => {
    e.preventDefault();
    closePhotoLightbox();
  });

  photoLightbox?.addEventListener('click', (e) => {
    if (e.target === photoLightbox) closePhotoLightbox();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
      if (photoLightbox?.classList.contains('open')) {
        closePhotoLightbox();
        return;
      }
      if (modal.classList.contains('open')) {
        closeModal();
      }
    }
  });

  function triggerPrint(isPdf = false) {
    const wasOpen = modal.classList.contains('open');
    if (!wasOpen) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }

    const originalTitle = document.title;
    document.title = ' ';

    if (isPdf) {
      showToast('Opening PDF Engine — Select "Save as PDF" as Destination');
    }

    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.title = originalTitle;
        if (!wasOpen) {
          modal.classList.remove('open');
          modal.setAttribute('aria-hidden', 'true');
        }
      }, 1200);
    }, isPdf ? 300 : 100);
  }

  printBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      triggerPrint(false);
    });
  });

  // CV Download Dropdowns (Dual Options: With Photo & Without Photo)
  const dropdownWrappers = $$('.cv-dropdown-wrapper');
  dropdownWrappers.forEach(wrapper => {
    const toggle = wrapper.querySelector('.cv-dropdown-toggle');
    if (!toggle) return;

    toggle.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      const isOpen = wrapper.classList.contains('open');

      // Close all other dropdowns
      dropdownWrappers.forEach(w => {
        if (w !== wrapper) {
          w.classList.remove('open');
          w.querySelector('.cv-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
        }
      });

      wrapper.classList.remove('dismissed');
      wrapper.classList.toggle('open', !isOpen);
      toggle.setAttribute('aria-expanded', !isOpen ? 'true' : 'false');
    });

    // Close ('X') button inside dropdown header
    const closeBtn = wrapper.querySelector('.cv-dropdown-close-btn');
    if (closeBtn) {
      closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        wrapper.classList.remove('open');
        wrapper.classList.add('dismissed');
        toggle.setAttribute('aria-expanded', 'false');
      });
    }

    wrapper.addEventListener('mouseleave', () => {
      wrapper.classList.remove('dismissed');
    });
  });

  // Close dropdowns on outside click or escape
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.cv-dropdown-wrapper')) {
      dropdownWrappers.forEach(w => {
        w.classList.remove('open');
        w.querySelector('.cv-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      });
    }
  });

  // Direct download links toast feedback
  $$('.direct-download-link').forEach(link => {
    link.addEventListener('click', () => {
      const isNoPhoto = link.getAttribute('href')?.includes('No_Photo');
      showToast(isNoPhoto ? 'Downloading Executive CV (Without Photo)...' : 'Downloading Executive CV (With Photo)...');
      // Automatically close dropdown after option click
      dropdownWrappers.forEach(w => {
        w.classList.remove('open');
        w.querySelector('.cv-dropdown-toggle')?.setAttribute('aria-expanded', 'false');
      });
    });
  });

  // Direct Shareable Link to Finalized Executive CV
  function getShareableCvUrl() {
    return new URL('cv.html', window.location.href).href;
  }

  shareCvBtns.forEach(btn => {
    btn.addEventListener('click', async (e) => {
      e.preventDefault();
      const shareUrl = getShareableCvUrl();

      if (navigator.clipboard && navigator.clipboard.writeText) {
        try {
          await navigator.clipboard.writeText(shareUrl);
          const originalContent = btn.innerHTML;
          btn.innerHTML = '<i class="fas fa-check"></i> <span>Link Copied!</span>';
          showToast('Direct Executive CV link copied to clipboard!');
          setTimeout(() => {
            btn.innerHTML = originalContent;
          }, 2400);
          return;
        } catch {
          // Fallback if clipboard permission fails
        }
      }

      prompt('Copy shareable direct Executive CV link:', shareUrl);
    });
  });

  // Support direct hash URL navigation (e.g., #cv)
  if (window.location.hash === '#cv' || window.location.hash === '#resume-modal') {
    setTimeout(openModal, 250);
  }

  dossierBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      openDossierModal();
    });
  });
}

/* ═════════════════════════════════════════════════════════════════
   13B. EXECUTIVE DOSSIER REQUEST MODAL
   ═════════════════════════════════════════════════════════════════ */
function openDossierModal() {
  const dModal = $('#dossier-modal');
  if (!dModal) return;
  dModal.classList.add('open');
  dModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeDossierModal() {
  const dModal = $('#dossier-modal');
  if (!dModal) return;
  dModal.classList.remove('open');
  dModal.setAttribute('aria-hidden', 'true');
  const resumeModal = $('#resume-modal');
  if (!resumeModal || !resumeModal.classList.contains('open')) {
    document.body.style.overflow = '';
  }
}

function initDossierModal() {
  const dModal = $('#dossier-modal');
  const closeBtn = $('#close-dossier-btn');
  const copyBtn = $('#copy-dossier-email-btn');

  if (!dModal) return;

  closeBtn?.addEventListener('click', closeDossierModal);

  dModal.addEventListener('click', e => {
    if (e.target === dModal) closeDossierModal();
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && dModal.classList.contains('open')) {
      closeDossierModal();
    }
  });

  copyBtn?.addEventListener('click', async (e) => {
    e.preventDefault();
    const textToCopy = 'shjjadpatwary@gmail.com';
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(textToCopy);
      } else {
        const temp = document.createElement('textarea');
        temp.value = textToCopy;
        document.body.appendChild(temp);
        temp.select();
        document.execCommand('copy');
        document.body.removeChild(temp);
      }
      showToast('Copied shjjadpatwary@gmail.com to clipboard!');
      const arrow = $('#copy-dossier-arrow');
      if (arrow) {
        arrow.className = 'fas fa-check opt-arrow';
        arrow.style.color = 'var(--c-emerald)';
        setTimeout(() => {
          arrow.className = 'fas fa-arrow-right opt-arrow';
          arrow.style.color = '';
        }, 2200);
      }
    } catch {
      showToast('Email address: shjjadpatwary@gmail.com');
    }
  });
}

/* ═════════════════════════════════════════════════════════════════
   14. MOBILE NAVIGATION DRAWER
   ═════════════════════════════════════════════════════════════════ */
function initMobileDrawer() {
  const hamburger = $('#hamburger');
  const drawer = $('#mobile-drawer');
  const overlay = $('#drawer-overlay');
  const closeBtn = $('#drawer-close');

  if (!hamburger || !drawer || !overlay) return;

  function openDrawer() {
    hamburger.classList.add('open');
    drawer.classList.add('open');
    overlay.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    drawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    hamburger.classList.remove('open');
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    drawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    drawer.classList.contains('open') ? closeDrawer() : openDrawer();
  });

  closeBtn?.addEventListener('click', closeDrawer);
  overlay.addEventListener('click', closeDrawer);

  $$('.drawer-link, .drawer-wa-btn, .drawer-resume-btn', drawer).forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });

  // Native swipe-to-close gesture on mobile drawer
  let touchStartX = 0;
  let touchStartY = 0;

  drawer.addEventListener('touchstart', e => {
    if (!e.touches.length) return;
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  drawer.addEventListener('touchend', e => {
    if (!e.changedTouches.length) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    // Dismiss if swiped right by more than 50px and horizontally dominant
    if (deltaX > 50 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      closeDrawer();
    }
  }, { passive: true });
}

/* ═════════════════════════════════════════════════════════════════
   15. 1-CLICK CLIPBOARD COPY & TOAST
   ═════════════════════════════════════════════════════════════════ */
let toastTimeout;
function showToast(message, duration = 3000) {
  const toast = $('#toast');
  const msg = $('#toast-message');
  if (!toast || !msg) return;

  msg.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, duration);
}

function initCopyButtons() {
  $$('.copy-btn').forEach(btn => {
    btn.addEventListener('click', async e => {
      e.preventDefault();
      const text = btn.dataset.copy;
      if (!text) return;

      try {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text);
        } else {
          const temp = document.createElement('textarea');
          temp.value = text;
          temp.style.position = 'fixed';
          temp.style.opacity = '0';
          document.body.appendChild(temp);
          temp.select();
          document.execCommand('copy');
          document.body.removeChild(temp);
        }

        showToast(`Copied to clipboard: ${text}`);
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<i class="fas fa-check" style="color:var(--c-emerald)"></i>';
        setTimeout(() => { btn.innerHTML = originalHTML; }, 2000);
      } catch {
        showToast('Unable to copy automatically — please copy manually.');
      }
    });
  });
}

/* ═════════════════════════════════════════════════════════════════
   16. CONTACT FORM HANDLING
   ═════════════════════════════════════════════════════════════════ */
function initContactForm() {
  const form = $('#contact-form');
  const submitBtn = $('#cf-submit');
  const btnText = $('#submit-btn-text');
  const btnIcon = $('#submit-btn-icon');

  if (!form || !submitBtn) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name = $('#cf-name', form)?.value.trim();
    const email = $('#cf-email', form)?.value.trim();
    const subject = $('#cf-subject', form)?.value.trim() || 'Portfolio Inquiry';
    const message = $('#cf-message', form)?.value.trim();

    if (!name || !email || !message) {
      showToast('Please fill out all required fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('Please enter a valid email address.');
      return;
    }

    // Animate to loading state
    submitBtn.disabled = true;
    if (btnText) btnText.textContent = 'Transmitting…';
    if (btnIcon) btnIcon.className = 'fas fa-spinner fa-spin';

    setTimeout(() => {
      if (btnText) btnText.textContent = 'Message Transmitted!';
      if (btnIcon) btnIcon.className = 'fas fa-check-circle';
      showToast(`Thank you, ${name}! Your message has been sent.`, 4500);

      // Open mailto link as reliable client fallback
      const mailtoUrl = `mailto:shjjadpatwary@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`From: ${name} (${email})\n\n${message}`)}`;
      window.location.href = mailtoUrl;

      form.reset();

      setTimeout(() => {
        submitBtn.disabled = false;
        if (btnText) btnText.textContent = 'Transmit Message';
        if (btnIcon) btnIcon.className = 'fas fa-paper-plane';
      }, 4000);
    }, 1000);
  });
}

/* ═════════════════════════════════════════════════════════════════
   17. MAGNETIC BUTTON INTERACTION
   ═════════════════════════════════════════════════════════════════ */
function initMagneticButtons() {
  if (!window.matchMedia('(pointer: fine)').matches) return;

  $$('.magnetic').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
}

/* ═════════════════════════════════════════════════════════════════
   18. SMOOTH SCROLL OFFSET FOR FLOATING NAVBAR
   ═════════════════════════════════════════════════════════════════ */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#' || href === '#home') {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
      const target = $(href);
      if (!target) return;
      e.preventDefault();

      const navHeight = window.innerWidth <= 768 ? 70 : 88;
      const targetTop = target.getBoundingClientRect().top + window.scrollY - navHeight;
      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    });
  });
}

/* ═════════════════════════════════════════════════════════════════
   19. INITIALIZATION ON DOM READY
   ═════════════════════════════════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initParticles();
  initCursor();
  initDhakaClock();
  initTelemetryFeed();
  initTypedText();
  initScrollProgress();
  initScrollSpy();
  initScrollReveal();
  initCounters();
  initSpotlight();
  initSkillsTabs();
  initResumeModal();
  initDossierModal();
  initMobileDrawer();
  initCopyButtons();
  initContactForm();
  initMagneticButtons();
  initSmoothScroll();
});