// Throttle function to limit the rate at which a function can fire
function throttle(func, limit) {
  let inThrottle;
  return function () {
    if (!inThrottle) {
      func.apply(this, arguments);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Initialize header scroll behavior
function initializeHeaderScroll() {
  const headerEl = document.querySelector('.header');
  if (headerEl) {
    const headerHeight = headerEl.offsetHeight;
    window.addEventListener(
      'scroll',
      throttle(() => {
        headerEl.classList.toggle('scrolled', window.scrollY > headerHeight);
      }, 100),
      { passive: true }
    );
  }
}

// Initialize burger menu with accessibility considerations
function initializeBurgerMenu() {
  const burgerBtnEl = document.querySelector('.burger');
  if (burgerBtnEl) {
    document.body.addEventListener('click', (e) => {
      if (e.target.classList.contains('burger')) {
        burgerBtnEl.classList.toggle('burger--active');
      }
      if (e.target.classList.contains('menu__link')) {
        burgerBtnEl.classList.remove('burger--active');
      }
    });

    burgerBtnEl.addEventListener('keydown', (e) => {
      if (['Enter', ' '].includes(e.key)) {
        e.preventDefault();
        burgerBtnEl.classList.toggle('burger--active');
      }
    });
  }
}

// Initialize shake animation for disabled buttons
function initializeButtonShake() {
  document.body.addEventListener('click', (e) => {
    if (e.target.matches('.btn--disabled')) {
      e.preventDefault();
      e.target.classList.add('shake');
      e.target.addEventListener(
        'animationend',
        () => e.target.classList.remove('shake'),
        { once: true }
      );
    }
  });
}

// Handle clicks on project cards
function initializeProjectCards() {
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      if (!e.target.closest('a.links__anchor')) {
        const linkEl = card.querySelector('a.links__anchor');
        if (linkEl?.href !== '/not-found.html') {
          window.open(linkEl.href, '_blank');
        }
      }
    });
  });
}

// Update footer link based on current page
function initializeFooterLink() {
  const footerLink = document.getElementById('footer-link');
  if (footerLink) {
    footerLink.setAttribute(
      'href',
      `/${
        window.location.pathname.includes('about') ? 'about.html' : 'index.html'
      }#footer`
    );
  }
}

// Initialize common functionalities after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  initializeHeaderScroll();
  initializeBurgerMenu();
  initializeButtonShake();
  initializeProjectCards();
  initializeFooterLink();
});
