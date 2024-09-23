// fixed header

const headerEl = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (window.scrollY > headerEl.offsetHeight) {
    headerEl.classList.add('scrolled');
  } else {
    headerEl.classList.remove('scrolled');
  }
});

// burger

const burgerBtnEl = document.querySelector('.burger');
const menuLinks = document.querySelectorAll('.menu__link');

const handleBurgerClick = () => {
  burgerBtnEl.classList.toggle('burger--active');
};

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('burger')) {
    handleBurgerClick();
  }
});

menuLinks.forEach((link) => {
  link.addEventListener('click', () => {
    burgerBtnEl.classList.remove('burger--active');
  });
});

// link enable/disable atribut target= blank

const links = document.querySelectorAll('.links__anchor');

links.forEach((link) => {
  const href = link.getAttribute('href');

  if (href === '/not-found.html') {
    link.removeAttribute('target');
  }
});

// load more/less text

document.querySelectorAll('.experience-card__btn').forEach((button) => {
  button.addEventListener('click', function () {
    const textElement =
      this.closest('.experience-card').querySelector('#collapseSummary');
    if (textElement) {
      textElement.classList.toggle('expanded');

      this.textContent = textElement.classList.contains('expanded')
        ? 'Show Less'
        : 'Load More';
    }
  });
});

// btn animation disabled shake

const disabledButton = document.querySelector('.btn--disabled');
if (disabledButton) {
  disabledButton.addEventListener('click', function (e) {
    e.preventDefault();
    disabledButton.classList.add('shake');

    setTimeout(() => {
      disabledButton.classList.remove('shake');
    }, 1000);
  });
}

// add link to div container projects-card

document.querySelectorAll('.project-card').forEach((card) => {
  card.addEventListener('click', function () {
    const link = card.querySelector('a.links__anchor').href;
    window.open(link, '_blank');
  });
});
