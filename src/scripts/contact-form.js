// contactForm.js

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const inputs = form.querySelectorAll('.form__input, .form__area');

  // Dynamically create container for messages
  const messageContainer = document.createElement('div');
  messageContainer.className = 'form__message-container';
  messageContainer.id = 'formMessageContainer';

  // Append it to the form if not already present
  if (!document.getElementById('formMessageContainer')) {
    form.appendChild(messageContainer);
  }

  // Add event listeners to clear errors on focus
  inputs.forEach(function (input) {
    input.addEventListener('focus', function () {
      clearError(input);
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault(); // Prevent default form submission
    clearErrors();

    let isValid = true;

    // Validate each field
    if (
      !validateField(
        form.name,
        /^[a-zA-Zа-яА-ЯёЁ\s]+$/,
        'Please enter your name.'
      )
    ) {
      isValid = false;
    }
    if (
      !validateField(
        form.email,
        /^\S+@\S+\.\S+$/,
        'Please enter a valid email.'
      )
    ) {
      isValid = false;
    }
    if (
      !validateField(
        form.subject,
        /^[a-zA-Zа-яА-ЯёЁ0-9\s.,!?-]+$/,
        'Please enter a subject.'
      )
    ) {
      isValid = false;
    }
    if (!validateField(form.message, /.+/, 'Please enter a message.')) {
      isValid = false;
    }

    if (!isValid) {
      return; // Stop form submission if validation fails
    }

    // Prepare form data for submission
    const formData = new FormData(form);

    // Send form data using Fetch API
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
        messageContainer.innerHTML = 'Send error';

        setTimeout(() => {
          messageContainer.innerHTML = '';
        }, 3000);
      });
  });

  // Helper function to validate a field
  function validateField(inputElement, regex, errorMessage) {
    const value = inputElement.value.trim();

    if (!regex.test(value)) {
      showError(inputElement, errorMessage);
      return false;
    }
    return true;
  }

  // Function to show error and apply styles
  function showError(inputElement, message) {
    const labelElement = inputElement.closest('.form__label');

    // Check if an error message already exists for this field
    let errorElement = labelElement.querySelector('.form__error-message');
    if (!errorElement) {
      // Create error message element
      errorElement = document.createElement('span');
      errorElement.className = 'form__error-message';

      // Insert error message inside label, after the text
      labelElement.appendChild(errorElement);
    }

    // Set error message text
    errorElement.textContent = message;

    // Add error class to the field
    inputElement.classList.add('form__error-decoration');
  }

  // Function to clear error for a specific field
  function clearError(inputElement) {
    inputElement.classList.remove('form__error-decoration');
    const labelElement = inputElement.closest('.form__label');
    const errorElement = labelElement.querySelector('.form__error-message');

    if (errorElement) {
      errorElement.remove();
    }
  }

  // Function to clear all errors
  function clearErrors() {
    inputs.forEach(function (input) {
      clearError(input);
    });
  }
});
