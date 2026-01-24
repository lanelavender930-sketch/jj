const opinionCards = document.querySelectorAll('.opinions-grid');
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }else {
      entry.target.classList.remove('visible');
    }
  });
}, {
  threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});
opinionCards.forEach(grid => {
  observer.observe(grid);
});
