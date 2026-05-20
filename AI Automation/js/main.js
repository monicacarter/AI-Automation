/* ============================================================
   Missless — main.js
   Scroll reveals, donut animation, counters,
   industry tabs, play button, mobile drawer
   ============================================================ */
(function () {
  'use strict';

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ----------------------------------------------------------
     1. MOBILE HAMBURGER DRAWER
  ---------------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const mobileDrawer = document.getElementById('mobileDrawer');
  if (navToggle && mobileDrawer) {
    navToggle.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
      navToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
      mobileDrawer.setAttribute('aria-hidden', String(!isOpen));
    });

    // Close drawer when clicking a link inside it
    mobileDrawer.querySelectorAll('a').forEach((a) => {
      a.addEventListener('click', () => {
        mobileDrawer.classList.remove('is-open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Open menu');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      });
    });
  }

  /* ----------------------------------------------------------
     2. REVEAL ON SCROLL (IntersectionObserver)
     - Honors data-delay attribute for staggered reveals
     - Disabled when prefers-reduced-motion is set
  ---------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (prefersReducedMotion) {
    // Show everything immediately
    revealEls.forEach((el) => el.classList.add('is-in'));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const delay = el.dataset.delay;
            if (delay) el.style.transitionDelay = delay + 'ms';
            el.classList.add('is-in');
            revealObserver.unobserve(el);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealEls.forEach((el) => revealObserver.observe(el));
  }

  /* ----------------------------------------------------------
     3. DONUT CHART RING ANIMATION
     - Triggers when the stats card enters viewport
  ---------------------------------------------------------- */
  const donut = document.querySelector('.donut');
  if (donut && !prefersReducedMotion) {
    const donutObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Slight delay so users see the ring fill
            setTimeout(() => donut.classList.add('is-anim'), 200);
            donutObserver.unobserve(donut);
          }
        });
      },
      { threshold: 0.3 }
    );
    donutObserver.observe(donut);
  } else if (donut) {
    donut.classList.add('is-anim');
  }

  /* ----------------------------------------------------------
     4. COUNTER ANIMATION (dark stats bar)
     - data-count holds final number, data-suffix holds unit
     - "1m 47s" item is set directly via data-prefix
  ---------------------------------------------------------- */
  const counters = document.querySelectorAll('.darkstats__value[data-count]');

  function animateCount(el) {
    const target = parseFloat(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';

    // Special case: "1m 47s" — just fade in the final value, don't count fractionally
    if (prefix) {
      el.textContent = prefix + suffix;
      return;
    }

    const duration = 1400;
    const start = performance.now();
    const isInt = Number.isInteger(target);

    function tick(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic for natural deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = (isInt ? Math.round(value) : value.toFixed(2)) + suffix;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = (isInt ? Math.round(target) : target) + suffix;
    }
    requestAnimationFrame(tick);
  }

  if (counters.length && !prefersReducedMotion) {
    const countObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            countObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => countObserver.observe(el));
  }

  /* ----------------------------------------------------------
     5. INDUSTRY PILL TABS (Hear It In Action)
  ---------------------------------------------------------- */
  const INDUSTRY_LABELS = {
    home:      'Home services',
    financial: 'Financial services',
    health:    'Healthcare',
    real:      'Real estate',
    retail:    'Retail',
    edu:       'Education'
  };

  const pills = document.querySelectorAll('.ipill');
  const playerIndustry = document.getElementById('playerIndustry');

  pills.forEach((pill) => {
    pill.addEventListener('click', () => {
      pills.forEach((p) => {
        p.classList.remove('is-active');
        p.setAttribute('aria-selected', 'false');
      });
      pill.classList.add('is-active');
      pill.setAttribute('aria-selected', 'true');

      const key = pill.dataset.industry;
      if (playerIndustry && INDUSTRY_LABELS[key]) {
        // Brief fade for smoothness
        playerIndustry.style.opacity = '0';
        setTimeout(() => {
          playerIndustry.textContent = INDUSTRY_LABELS[key];
          playerIndustry.style.opacity = '1';
        }, 120);
      }
    });
  });

  if (playerIndustry) {
    playerIndustry.style.transition = 'opacity .2s ease';
  }

  /* ----------------------------------------------------------
     6. PLAY BUTTON TOGGLE (visual state only — no actual audio)
  ---------------------------------------------------------- */
  const playBtn = document.getElementById('playBtn');
  if (playBtn) {
    const playIcon  = '<svg viewBox="0 0 24 24"><path d="M8 5l11 7-11 7z" fill="white"/></svg>';
    const pauseIcon = '<svg viewBox="0 0 24 24"><rect x="6" y="5" width="4" height="14" fill="white" rx="1"/><rect x="14" y="5" width="4" height="14" fill="white" rx="1"/></svg>';
    let playing = false;

    playBtn.addEventListener('click', () => {
      playing = !playing;
      playBtn.innerHTML = playing ? pauseIcon : playIcon;
      playBtn.setAttribute('aria-label', playing ? 'Pause sample' : 'Play sample');
    });
  }

  /* ----------------------------------------------------------
     7. FAQ — close other items when one opens (optional polish)
  ---------------------------------------------------------- */
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    item.addEventListener('toggle', () => {
      if (item.open) {
        faqItems.forEach((other) => {
          if (other !== item) other.open = false;
        });
      }
    });
  });

  /* ----------------------------------------------------------
     8. SMOOTH SCROLL for in-page anchors (lightweight fallback)
     CSS scroll-behavior already handles modern browsers
  ---------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length > 1) {
        const target = document.querySelector(id);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: prefersReducedMotion ? 'auto' : 'smooth', block: 'start' });
        }
      }
    });
  });

  /* ----------------------------------------------------------
     9. Mega menu — close on ESC, accessibility
  ---------------------------------------------------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.nav__item--mega').forEach((item) => {
        const btn = item.querySelector('.nav__link');
        if (btn) btn.setAttribute('aria-expanded', 'false');
      });
      if (mobileDrawer && mobileDrawer.classList.contains('is-open')) {
        mobileDrawer.classList.remove('is-open');
        if (navToggle) navToggle.setAttribute('aria-expanded', 'false');
      }
    }
  });

  /* ----------------------------------------------------------
     10. Update aria-expanded on mega menu hover/focus
  ---------------------------------------------------------- */
  document.querySelectorAll('.nav__item--mega').forEach((item) => {
    const btn = item.querySelector('.nav__link');
    if (!btn) return;
    item.addEventListener('mouseenter', () => btn.setAttribute('aria-expanded', 'true'));
    item.addEventListener('mouseleave', () => btn.setAttribute('aria-expanded', 'false'));
    item.addEventListener('focusin', () => btn.setAttribute('aria-expanded', 'true'));
    item.addEventListener('focusout', (e) => {
      if (!item.contains(e.relatedTarget)) btn.setAttribute('aria-expanded', 'false');
    });
  });
})();
