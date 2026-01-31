/*opinions grid*/
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
/*drop list questions*/
document.querySelectorAll(".faq-question").forEach(btn => {
  btn.addEventListener("click", () => {
    const answer = btn.nextElementSibling;

btn.classList.toggle("active");

    answer.style.height =
      answer.style.height === "0px" || !answer.style.height
        ? answer.scrollHeight + "px"
        : "0px";
  });
});
