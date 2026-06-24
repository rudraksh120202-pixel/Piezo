/* PIEZO — Premium Water Brand Scripts */

// ============================================================
// WATER CANVAS — animated flowing background
// ============================================================

(function initWaterCanvas() {
  const canvas = document.getElementById('waterCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w, h, ripples = [], time = 0;

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }

  window.addEventListener('resize', resize);
  resize();

  function drawWaves() {
    ctx.clearRect(0, 0, w, h);

    const waveConfigs = [
      { amp: 18, freq: 0.008, speed: 0.0006, y: h * 0.35, color: 'rgba(13,50,90,0.35)', width: h * 0.18 },
      { amp: 24, freq: 0.006, speed: 0.0004, y: h * 0.55, color: 'rgba(10,38,80,0.3)', width: h * 0.22 },
      { amp: 14, freq: 0.01, speed: 0.0009, y: h * 0.72, color: 'rgba(7,20,45,0.4)', width: h * 0.28 },
      { amp: 10, freq: 0.012, speed: 0.0012, y: h * 0.85, color: 'rgba(168,216,234,0.04)', width: h * 0.12 },
    ];

    waveConfigs.forEach(wc => {
      ctx.beginPath();
      for (let x = 0; x <= w; x += 3) {
        const y = wc.y + Math.sin(x * wc.freq + time * wc.speed * 60000) * wc.amp
                       + Math.sin(x * wc.freq * 0.7 + time * wc.speed * 60000 * 1.3) * wc.amp * 0.5;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = wc.color;
      ctx.fill();
    });
  }

  function drawRipples() {
    ripples = ripples.filter(r => r.alpha > 0);
    ripples.forEach(r => {
      ctx.beginPath();
      ctx.arc(r.x, r.y, r.radius, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(168,216,234,${r.alpha})`;
      ctx.lineWidth = 1;
      ctx.stroke();
      r.radius += 1.2;
      r.alpha -= 0.012;
    });
  }

  let lastTime = 0;
  function animate(timestamp) {
    time = timestamp;
    const delta = timestamp - lastTime;
    lastTime = timestamp;

    drawWaves();
    drawRipples();

    if (Math.random() < 0.006) {
      ripples.push({
        x: Math.random() * w,
        y: Math.random() * h * 0.8,
        radius: Math.random() * 10 + 5,
        alpha: 0.25 + Math.random() * 0.15
      });
    }

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();

// ============================================================
// FLOATING PARTICLES
// ============================================================

(function initParticles() {
  const container = document.getElementById('particles');
  if (!container) return;

  const COUNT = window.innerWidth < 768 ? 12 : 24;

  for (let i = 0; i < COUNT; i++) {
    const el = document.createElement('div');
    el.className = 'particle';
    const size = Math.random() * 4 + 2;
    const x = Math.random() * 100;
    const duration = Math.random() * 20 + 15;
    const delay = Math.random() * 20;

    el.style.cssText = `
      width: ${size}px;
      height: ${size}px;
      left: ${x}%;
      top: ${100 + Math.random() * 10}%;
      animation-duration: ${duration}s;
      animation-delay: -${delay}s;
    `;
    container.appendChild(el);
  }
})();

// ============================================================
// NAVBAR — scroll behavior
// ============================================================

(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const isOpen = links.classList.toggle('open');
      toggle.classList.toggle('open', isOpen);
      toggle.setAttribute('aria-expanded', isOpen);
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('open');
        toggle.setAttribute('aria-expanded', false);
      });
    });
  }
})();

// ============================================================
// SCROLL REVEAL
// ============================================================

(function initScrollReveal() {
  const targets = [];

  // Add reveal class to key elements
  const selectors = [
    '.about-grid > *',
    '.stat-card',
    '.product-card',
    '.why-card',
    '.area-item',
    '.testimonial-card',
    '.dist-grid > *',
    '.faq-item',
    '.contact-card',
    '.footer-links-group',
    '.about-bottle-display',
    '.about-content',
    '.dist-info',
    '.dist-form-wrap',
    '.areas-text',
    '.areas-map',
  ];

  selectors.forEach(sel => {
    document.querySelectorAll(sel).forEach((el, i) => {
      el.classList.add('reveal');
      if (i < 6) el.classList.add(`reveal-delay-${i + 1}`);
    });
  });

  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => observer.observe(el));
})();

// ============================================================
// STATS COUNTER ANIMATION
// ============================================================

(function initStats() {
  const cards = document.querySelectorAll('.stat-card');
  if (!cards.length) return;

  function animateCount(el, target, duration) {
    const start = performance.now();
    const countEl = el.querySelector('.stat-count');
    if (!countEl) return;

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = Math.round(eased * target);
      countEl.textContent = value >= 1000 ? (value >= 1000 ? value.toLocaleString() : value) : value;
      if (progress < 1) requestAnimationFrame(update);
      else {
        countEl.textContent = target >= 1000 ? target.toLocaleString() : target;
      }
    }

    requestAnimationFrame(update);
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
        entry.target.classList.add('counted');
        const target = parseInt(entry.target.dataset.target, 10);
        animateCount(entry.target, target, 2000);
      }
    });
  }, { threshold: 0.4 });

  cards.forEach(c => observer.observe(c));
})();

// ============================================================
// TESTIMONIALS SLIDER
// ============================================================

(function initTestimonials() {
  const track = document.getElementById('testimonialsTrack');
  const prevBtn = document.getElementById('tPrev');
  const nextBtn = document.getElementById('tNext');
  const dotsContainer = document.getElementById('tDots');
  if (!track) return;

  const cards = track.querySelectorAll('.testimonial-card');
  const dots = dotsContainer ? dotsContainer.querySelectorAll('.t-dot') : [];
  let current = 0;

  function getVisible() {
    return window.innerWidth < 768 ? 1 : 2;
  }

  function getMax() {
    return Math.max(0, cards.length - getVisible());
  }

  function goTo(idx) {
    current = Math.max(0, Math.min(idx, getMax()));
    const cardWidth = cards[0].offsetWidth + 24; // 24 = gap
    track.style.transform = `translateX(-${current * cardWidth}px)`;

    dots.forEach((d, i) => d.classList.toggle('active', i === current));
  }

  if (prevBtn) prevBtn.addEventListener('click', () => goTo(current - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => goTo(current + 1));

  dots.forEach((dot, i) => dot.addEventListener('click', () => goTo(i)));

  window.addEventListener('resize', () => goTo(0));

  // Auto-advance
  let autoplay = setInterval(() => goTo(current + 1 > getMax() ? 0 : current + 1), 5000);

  track.closest('.testimonials-section').addEventListener('mouseenter', () => clearInterval(autoplay));
  track.closest('.testimonials-section').addEventListener('mouseleave', () => {
    autoplay = setInterval(() => goTo(current + 1 > getMax() ? 0 : current + 1), 5000);
  });
})();

// ============================================================
// FAQ ACCORDION
// ============================================================

(function initFAQ() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!question || !answer) return;

    question.addEventListener('click', () => {
      const isOpen = question.getAttribute('aria-expanded') === 'true';

      // Close all others
      items.forEach(other => {
        if (other !== item) {
          other.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
          other.querySelector('.faq-answer').classList.remove('open');
        }
      });

      question.setAttribute('aria-expanded', !isOpen);
      answer.classList.toggle('open', !isOpen);
    });
  });
})();

// ============================================================
// DISTRIBUTOR FORM — WhatsApp Submission
// ============================================================

(function initDistForm() {
  const form = document.getElementById('distForm');
  if (!form) return;

  const WHATSAPP_NUMBER = '918690319830';

  function validate() {
    let valid = true;

    const fields = [
      { id: 'fullName', errId: 'err-fullName', msg: 'Please enter your full name.' },
      { id: 'mobile', errId: 'err-mobile', msg: 'Please enter a valid 10-digit mobile number.', pattern: /^[6-9][0-9]{9}$/ },
      { id: 'city', errId: 'err-city', msg: 'Please enter your city.' },
      { id: 'businessName', errId: 'err-businessName', msg: 'Please enter your business name.' },
      { id: 'monthly', errId: 'err-monthly', msg: 'Please select your monthly requirement.' },
    ];

    fields.forEach(f => {
      const el = document.getElementById(f.id);
      const err = document.getElementById(f.errId);
      if (!el || !err) return;

      const val = el.value.trim();
      let fieldValid = val.length > 0;

      if (fieldValid && f.pattern) {
        fieldValid = f.pattern.test(val);
      }

      err.textContent = fieldValid ? '' : f.msg;
      el.classList.toggle('error', !fieldValid);
      if (!fieldValid) valid = false;
    });

    return valid;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!validate()) return;

    const fullName = document.getElementById('fullName').value.trim();
    const mobile = document.getElementById('mobile').value.trim();
    const city = document.getElementById('city').value.trim();
    const businessName = document.getElementById('businessName').value.trim();
    const monthly = document.getElementById('monthly').value;
    const message = document.getElementById('message').value.trim();

    const lines = [
      '🌊 *PIEZO Distributor Application*',
      '',
      `*Name:* ${fullName}`,
      `*Mobile:* ${mobile}`,
      `*City:* ${city}`,
      `*Business Name:* ${businessName}`,
      `*Monthly Requirement:* ${monthly}`,
    ];

    if (message) {
      lines.push(`*Message:* ${message}`);
    }

    lines.push('', '_Sent via PIEZO website_');

    const waText = encodeURIComponent(lines.join('\n'));
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`;

    window.open(waUrl, '_blank', 'noopener,noreferrer');
  });

  // Live validation on blur
  form.querySelectorAll('input, select').forEach(el => {
    el.addEventListener('blur', () => {
      if (el.classList.contains('error')) validate();
    });
    el.addEventListener('input', () => {
      if (el.classList.contains('error')) {
        el.classList.remove('error');
        const errEl = document.getElementById('err-' + el.id);
        if (errEl) errEl.textContent = '';
      }
    });
  });
})();

// ============================================================
// SMOOTH ANCHOR SCROLL (offset for fixed navbar)
// ============================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ============================================================
// INTERACTIVE WATER RIPPLE ON CLICK
// ============================================================

document.addEventListener('click', (e) => {
  if (e.target.closest('button, a, input, select, textarea')) return;

  const ripple = document.createElement('div');
  ripple.style.cssText = `
    position: fixed;
    left: ${e.clientX - 25}px;
    top: ${e.clientY - 25}px;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    border: 1px solid rgba(168,216,234,0.5);
    pointer-events: none;
    z-index: 9999;
    animation: clickRipple 0.8s ease-out forwards;
  `;

  if (!document.getElementById('clickRippleStyle')) {
    const style = document.createElement('style');
    style.id = 'clickRippleStyle';
    style.textContent = '@keyframes clickRipple { from { transform: scale(0); opacity: 0.6; } to { transform: scale(4); opacity: 0; } }';
    document.head.appendChild(style);
  }

  document.body.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
});

// ============================================================
// PERFORMANCE: Pause canvas when tab not visible
// ============================================================

let canvasActive = true;
document.addEventListener('visibilitychange', () => {
  canvasActive = !document.hidden;
});

document.querySelectorAll('.product-popup').forEach(item => {
    item.addEventListener('click', function(e){
        e.preventDefault();

        const overlay = document.createElement('div');
        overlay.style.cssText =
        'position:fixed;inset:0;background:rgba(0,0,0,.9);display:flex;justify-content:center;align-items:center;z-index:9999;';

        const img = document.createElement('img');
        img.src = this.querySelector('img').src;
        img.style.maxWidth = '90%';
        img.style.maxHeight = '90%';
        img.style.borderRadius = '20px';

        overlay.appendChild(img);
        document.body.appendChild(overlay);

        overlay.onclick = () => overlay.remove();
    });
});
