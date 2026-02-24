/* ===== VIDEO BACKGROUND PLAYLIST ===== */
(function initVideoPlaylist() {
  const videoEls = [
    document.getElementById('hero-video-1'),
    document.getElementById('hero-video-2'),
  ];
  let current = 0;

  function playVideo(index) {
    videoEls.forEach((v, i) => {
      if (i === index) {
        v.classList.add('active');
        v.currentTime = 0;
        v.play().catch(() => {});
      } else {
        v.classList.remove('active');
      }
    });
  }

  videoEls.forEach((video, index) => {
    video.addEventListener('ended', () => {
      current = (index + 1) % videoEls.length;
      playVideo(current);
    });
  });

  // Start first video
  if (videoEls[0]) {
    videoEls[0].play().catch(() => {});
  }
})();

/* ===== NAV: HIDE ON SCROLL DOWN, SHOW ON SCROLL UP ===== */
(function initNavScroll() {
  const nav = document.getElementById('main-nav');
  let lastScrollY = window.scrollY;

  window.addEventListener('scroll', () => {
    const currentY = window.scrollY;
    if (currentY > lastScrollY && currentY > 80) {
      nav.classList.add('nav-hidden');
    } else {
      nav.classList.remove('nav-hidden');
    }
    lastScrollY = currentY;
  }, { passive: true });
})();

/* ===== MOBILE HAMBURGER MENU ===== */
(function initMobileMenu() {
  const btn = document.getElementById('nav-hamburger');
  const menu = document.getElementById('nav-mobile-menu');

  btn.addEventListener('click', () => {
    const isOpen = menu.classList.toggle('open');
    btn.setAttribute('aria-expanded', String(isOpen));
  });

  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();

/* ===== SMOOTH SCROLL ===== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* ===== INTERSECTION OBSERVER: FADE-IN ===== */
(function initFadeIn() {
  const elements = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
})();

/* ===== LOG STREAM ANIMATION ===== */
(function initLogStream() {
  const entries = document.querySelectorAll('.log-entry');
  if (!entries.length) return;

  const logCard = document.querySelector('.log-stream-card');
  if (!logCard) return;

  const observer = new IntersectionObserver((records) => {
    records.forEach(record => {
      if (record.isIntersecting) {
        entries.forEach(entry => {
          const delay = parseInt(entry.dataset.delay || '0');
          setTimeout(() => entry.classList.add('log-in'), delay);
        });
        observer.unobserve(record.target);
      }
    });
  }, { threshold: 0.3 });

  observer.observe(logCard);
})();

/* ===== TYPEWRITER EFFECT ===== */
(function initTypewriter() {
  const TARGET_SELECTOR = '[data-typewriter]';

  function typeWrite(el, text, speed) {
    let i = 0;
    el.textContent = '';

    const cursor = document.createElement('span');
    cursor.className = 'tw-cursor';
    cursor.setAttribute('aria-hidden', 'true');
    el.after(cursor);

    function tick() {
      if (i < text.length) {
        el.textContent += text.charAt(i);
        i++;
        setTimeout(tick, speed);
      } else {
        // Remove cursor after a short pause
        setTimeout(() => cursor.remove(), 1200);
      }
    }
    tick();
  }

  const elements = document.querySelectorAll(TARGET_SELECTOR);
  const speed = 28; // ms per character

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.typed) {
        entry.target.dataset.typed = '1';
        const text = entry.target.dataset.typewriter;
        typeWrite(entry.target, text, speed);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  elements.forEach(el => {
    // Clear initial content; text stored in data-typewriter attribute
    el.textContent = '';
    observer.observe(el);
  });
})();

/* ===== ACTIVE NAV LINK ON SCROLL ===== */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id], footer[id]');
  const navLinks = document.querySelectorAll('.nav-links a, .nav-mobile-menu a');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, { threshold: 0.45 });

  sections.forEach(section => observer.observe(section));
})();
