(() => {
  // Constants for button text
  const SHOW_LESS_TEXT = 'Show Less';
  const LOAD_MORE_TEXT = 'Load More';

  // Throttle function to limit the rate at which a function can fire
  const throttle = (func, limit) => {
    let inThrottle;
    return function () {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  };

  // Helper function to toggle class based on condition
  const toggleClass = (element, className, condition) => {
    if (condition) {
      element.classList.add(className);
    } else {
      element.classList.remove(className);
    }
  };

  // Fixed header with optimized scroll event handler
  const headerEl = document.querySelector('.header');
  const headerHeight = headerEl.offsetHeight;

  window.addEventListener(
    'scroll',
    throttle(() => {
      const isScrolled = window.scrollY > headerHeight;
      toggleClass(headerEl, 'scrolled', isScrolled);
    }, 100),
    { passive: true }
  );

  // Burger menu with accessibility considerations
  const burgerBtnEl = document.querySelector('.burger');

  const handleBurgerClick = () => {
    burgerBtnEl.classList.toggle('burger--active');
  };

  // Handle keyboard events for accessibility
  burgerBtnEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault(); // Prevent page scrolling
      handleBurgerClick();
    }
  });

  // Event delegation for handling clicks
  document.body.addEventListener('click', (e) => {
    // Toggle burger menu
    if (e.target.classList.contains('burger')) {
      handleBurgerClick();
    }

    // Close burger menu when a menu link is clicked
    if (e.target.classList.contains('menu__link')) {
      burgerBtnEl.classList.remove('burger--active');
    }

    // Toggle text in experience cards
    if (e.target.classList.contains('experience-card__btn')) {
      const textElement = e.target
        .closest('.experience-card')
        ?.querySelector('#collapseSummary');
      if (textElement) {
        textElement.classList.toggle('expanded');
        e.target.textContent = textElement.classList.contains('expanded')
          ? SHOW_LESS_TEXT
          : LOAD_MORE_TEXT;
      }
    }

    // Handle external links with href '/not-found.html'
    if (e.target.matches('.links__anchor')) {
      const href = e.target.getAttribute('href');
      if (href === '/not-found.html') {
        e.preventDefault();
        window.location.href = href;
      }
    }

    // Shake animation for disabled buttons
    if (e.target.matches('.btn--disabled')) {
      e.preventDefault();
      e.target.classList.add('shake');
      e.target.addEventListener(
        'animationend',
        () => {
          e.target.classList.remove('shake');
        },
        { once: true }
      );
    }
  });

  // Handle clicks on project cards
  document.querySelectorAll('.project-card').forEach((card) => {
    card.addEventListener('click', (e) => {
      // Ignore clicks on internal links
      if (e.target.closest('a.links__anchor')) return;
      const linkEl = card.querySelector('a.links__anchor');
      if (linkEl && linkEl.href !== '/not-found.html') {
        window.open(linkEl.href, '_blank');
      }
    });
  });
})();
