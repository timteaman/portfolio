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

const handleBurgerClick = () => {
  burgerBtnEl.classList.toggle('burger--active');
};

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('burger')) {
    handleBurgerClick();
  }
});

// link enable/disable atribut target= blank

const links = document.querySelectorAll('.links__anchor');

links.forEach((link) => {
  const href = link.getAttribute('href');

  if (href === '/not-found.html') {
    link.removeAttribute('target');
  }
});

// btn animation disabled shake

const disabledButton = document.querySelector('.btn--disabled');

disabledButton.addEventListener('click', function (e) {
  e.preventDefault();
  disabledButton.classList.add('shake');

  setTimeout(() => {
    disabledButton.classList.remove('shake');
  }, 1000);
});
