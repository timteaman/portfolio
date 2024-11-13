// Constants for button text
const SHOW_LESS_TEXT = 'Show Less';
const LOAD_MORE_TEXT = 'Load More';

// Throttle function to limit the rate at which a function can fire
function throttle(func, limit) {
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
}

// Helper function to toggle class based on condition
function toggleClass(element, className, condition) {
  if (condition) {
    element.classList.add(className);
  } else {
    element.classList.remove(className);
  }
}

// Function to initialize event listeners and other functionalities
function initializePage() {
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

  function handleBurgerClick() {
    burgerBtnEl.classList.toggle('burger--active');
  }

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

  // header anchor link change for current page
  const currentPage = window.location.pathname.includes('about')
    ? 'about.html'
    : 'index.html';

  const footerLink = document.getElementById('footer-link');

  footerLink.setAttribute('href', `/${currentPage}#footer`);
}

// Initialize the page after the DOM is fully loaded
document.addEventListener('DOMContentLoaded', initializePage);

// Email form

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  const inputs = form.querySelectorAll('.form__input, .form__area');

  // Динамически создаем container для сообщений
  const messageContainer = document.createElement('div');
  messageContainer.className = 'form__message-container';
  messageContainer.id = 'formMessageContainer';

  // Добавляем его в конец формы, если еще не добавлен
  if (!document.getElementById('formMessageContainer')) {
    form.appendChild(messageContainer);
  }

  // Добавляем обработчики событий для очистки ошибок при фокусе на поле
  inputs.forEach(function (input) {
    input.addEventListener('focus', function () {
      clearError(input);
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Предотвращаем стандартную отправку формы
    clearErrors();

    let isValid = true;

    // Валидация каждого поля
    if (
      !validateField(
        form.name,
        /^[a-zA-Zа-яА-ЯёЁ\s]+$/,
        'Пожалуйста, введите ваше имя.'
      )
    ) {
      isValid = false;
    }
    if (
      !validateField(
        form.email,
        /^\S+@\S+\.\S+$/,
        'Пожалуйста, введите корректный email.'
      )
    ) {
      isValid = false;
    }
    if (
      !validateField(
        form.subject,
        /^[a-zA-Zа-яА-ЯёЁ0-9\s.,!?-]+$/,
        'Пожалуйста, введите тему сообщения.'
      )
    ) {
      isValid = false;
    }
    if (!validateField(form.message, /.+/, 'Пожалуйста, введите сообщение.')) {
      isValid = false;
    }

    if (!isValid) {
      return; // Прерываем отправку формы, если валидация не пройдена
    }

    // Подготовка данных формы для отправки
    const formData = new FormData(form);

    // Отправляем данные формы с помощью Fetch API
    fetch('send_email.php', {
      method: 'POST',
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        messageContainer.innerHTML = data.message;

        if (data.success) {
          form.reset();
        }

        setTimeout(() => {
          messageContainer.innerHTML = '';
        }, 3000);
      })
      .catch((error) => {
        messageContainer.innerHTML = 'Произошла ошибка при отправке формы.';

        setTimeout(() => {
          messageContainer.innerHTML = '';
        }, 3000);
      });
  });

  // Вспомогательная функция для валидации поля
  function validateField(inputElement, regex, errorMessage) {
    const value = inputElement.value.trim();

    if (!regex.test(value)) {
      showError(inputElement, errorMessage);
      return false;
    }
    return true;
  }

  // Функция для отображения ошибки и применения стилей
  function showError(inputElement, message) {
    const labelElement = inputElement.closest('.form__label');

    // Проверяем, существует ли уже сообщение об ошибке для этого поля
    let errorElement = labelElement.querySelector('.form__error-message');
    if (!errorElement) {
      // Создаем элемент сообщения об ошибке
      errorElement = document.createElement('span');
      errorElement.className = 'form__error-message';

      // Вставляем сообщение об ошибке внутрь label, после текста
      labelElement.appendChild(errorElement);
    }

    // Устанавливаем текст сообщения об ошибке
    errorElement.textContent = message;

    // Добавляем класс ошибки к полю
    inputElement.classList.add('form__error-decoration');
  }

  // Функция для очистки ошибки конкретного поля
  function clearError(inputElement) {
    inputElement.classList.remove('form__error-decoration');
    const labelElement = inputElement.closest('.form__label');
    const errorElement = labelElement.querySelector('.form__error-message');

    if (errorElement) {
      errorElement.remove();
    }
  }

  // Функция для очистки всех ошибок
  function clearErrors() {
    inputs.forEach(function (input) {
      clearError(input);
    });
  }
});
