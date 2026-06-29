document.addEventListener('DOMContentLoaded', function () {
  initMobileNav();
  initScrollReveal();
  initStickyNav();
  initFaqAccordion();
  initContactForm();
  initBackToTop();
  setActiveNavLink();
});

/* ---------- Mobile Navigation ---------- */
function initMobileNav() {
  const toggle = document.querySelector('.nav-toggle');
  const closeBtn = document.querySelector('.mobile-close');
  const menu = document.querySelector('.mobile-menu');

  if (!toggle || !menu) return;

  function openMenu() {
    menu.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    menu.classList.remove('open');
    document.body.style.overflow = '';
  }

  toggle.addEventListener('click', openMenu);
  if (closeBtn) closeBtn.addEventListener('click', closeMenu);

  menu.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });

  // Close on escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && menu.classList.contains('open')) {
      closeMenu();
    }
  });
}

/* ---------- Sticky Nav background on scroll ---------- */
function initStickyNav() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  function update() {
    if (window.scrollY > 30) {
      nav.style.background = 'rgba(20, 22, 26, 0.85)';
    } else {
      nav.style.background = 'rgba(20, 22, 26, 0.55)';
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  update();
}

/* ---------- Scroll reveal animations ---------- */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  if (!('IntersectionObserver' in window)) {
    revealEls.forEach(function (el) {
      el.classList.add('visible');
    });
    return;
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
  );

  revealEls.forEach(function (el) {
    observer.observe(el);
  });
}

/* ---------- Highlight active nav link based on current page ---------- */
function setActiveNavLink() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(function (link) {
    const linkPath = link.getAttribute('href');
    if (linkPath === path) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/* ---------- FAQ Accordion (Services / Contact pages) ---------- */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(function (item) {
    const question = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');

    question.addEventListener('click', function () {
      const isOpen = item.classList.contains('open');

      // Close all other items (single-open accordion)
      items.forEach(function (other) {
        other.classList.remove('open');
        other.querySelector('.faq-answer').style.maxHeight = null;
      });

      if (!isOpen) {
        item.classList.add('open');
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
}

/* ---------- Back to top button ---------- */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  function update() {
    if (window.scrollY > 500) {
      btn.classList.add('show');
    } else {
      btn.classList.remove('show');
    }
  }

  window.addEventListener('scroll', update, { passive: true });
  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  update();
}

function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const statusEl = document.getElementById('form-status');

  const validators = {
    name: function (value) {
      if (!value.trim()) return 'Please enter your name.';
      if (value.trim().length < 2) return 'Name must be at least 2 characters.';
      return '';
    },
    email: function (value) {
      const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!value.trim()) return 'Please enter your email address.';
      if (!pattern.test(value.trim())) return 'Please enter a valid email address.';
      return '';
    },
    phone: function (value) {
      if (!value.trim()) return ''; // optional field
      const pattern = /^[0-9+\-\s()]{7,16}$/;
      if (!pattern.test(value.trim())) return 'Please enter a valid phone number.';
      return '';
    },
    service: function (value) {
      if (!value) return 'Please select a service.';
      return '';
    },
    message: function (value) {
      if (!value.trim()) return 'Please tell us a bit about your project.';
      if (value.trim().length < 10) return 'Message should be at least 10 characters.';
      return '';
    },
    consent: function (checked) {
      if (!checked) return 'Please agree to be contacted before submitting.';
      return '';
    }
  };

  function showError(field, message) {
    const group = field.closest('.form-group');
    if (!group) return;
    const errorEl = group.querySelector('.field-error');
    if (message) {
      group.classList.add('has-error');
      field.classList.add('error');
      if (errorEl) errorEl.textContent = message;
    } else {
      group.classList.remove('has-error');
      field.classList.remove('error');
      if (errorEl) errorEl.textContent = '';
    }
  }

  function validateField(field) {
    const name = field.name;
    if (!validators[name]) return true;

    const value = field.type === 'checkbox' ? field.checked : field.value;
    const error = validators[name](value);
    showError(field, error);
    return !error;
  }

  // Live validation on blur
  Object.keys(validators).forEach(function (name) {
    const field = form.elements[name];
    if (!field) return;
    field.addEventListener('blur', function () {
      validateField(field);
    });
    field.addEventListener('input', function () {
      if (field.closest('.form-group').classList.contains('has-error')) {
        validateField(field);
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();

    let isValid = true;
    Object.keys(validators).forEach(function (name) {
      const field = form.elements[name];
      if (!field) return;
      if (!validateField(field)) {
        isValid = false;
      }
    });

    if (!isValid) {
      if (statusEl) {
        statusEl.textContent = 'Please fix the errors above before submitting.';
        statusEl.className = 'form-status error';
      }
      const firstError = form.querySelector('.has-error input, .has-error select, .has-error textarea');
      if (firstError) firstError.focus();
      return;
    }

    // Simulate successful submission (no backend wired up)
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.querySelector('span') ? (submitBtn.querySelector('span').textContent = 'Sending...') : null;
    }

    setTimeout(function () {
      if (statusEl) {
        statusEl.textContent = 'Thanks! Your message has been sent. We will get back to you within one business day.';
        statusEl.className = 'form-status success';
      }
      form.reset();
      if (submitBtn) {
        submitBtn.disabled = false;
        const span = submitBtn.querySelector('span');
        if (span) span.textContent = 'Send Message';
      }
    }, 900);
  });
}
