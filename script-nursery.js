/*opinions grid*/
const opinionCards = document.querySelectorAll(".opinions-grid");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      } else {
        entry.target.classList.remove("visible");
      }
    });
  },
  {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  },
);
opinionCards.forEach((grid) => {
  observer.observe(grid);
});
/*drop list questions*/
document.querySelectorAll(".faq-question").forEach((btn) => {
  btn.addEventListener("click", () => {
    const answer = btn.nextElementSibling;

    btn.classList.toggle("active");

    answer.style.height =
      answer.style.height === "0px" || !answer.style.height
        ? answer.scrollHeight + "px"
        : "0px";
  });
});
/* clear btn in shop page */

function clearAllFilters() {
  var allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
  for (var i = 0; i < allCheckboxes.length; i++) {
    allCheckboxes[i].checked = false;
  }
}

/* showing nav search */
document.getElementById("searchIcon").onclick = function () {
  var searchField = document.getElementById("searchField");

  if (searchField.classList.contains("active")) {
    searchField.classList.remove("active");
  } else {
    searchField.classList.add("active");
    searchField.focus();
  }
};


