function initializeExperienceCards() {
  const buttons = document.querySelectorAll('.experience-card__btn');

  buttons.forEach((button) => {
    button.addEventListener('click', () => {
      const textElement = button
        .closest('.experience-card')
        .querySelector('#collapseSummary');

      if (textElement) {
        const isExpanded = textElement.classList.toggle('expanded');
        button.textContent = isExpanded ? 'Show Less' : 'Load More';
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', initializeExperienceCards);
