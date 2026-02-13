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
setTimeout(() => {
  const icon = document.getElementById("searchIcon");
  const box = document.getElementById("searchBox");

  if (icon && box) {
    icon.addEventListener("click", () => {
      box.classList.toggle("active");
      box.focus();
    });
  }
}, 500);

/* pagination buttons "shop" */

let currentPage = 1;
const totalPages = 3;

function setPage(page) {
  currentPage = page;
  updateUI();
}

function changePage(direction) {
  const newPage = currentPage + direction;
  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage;
    updateUI();
  }
}

function updateUI() {
  for (let i = 1; i <= totalPages; i++) {
    document
      .getElementById("page" + i)
      .classList.toggle("active", i === currentPage);
  }
  document.getElementById("prevBtn").disabled = currentPage === 1;
  document.getElementById("nextBtn").disabled = currentPage === totalPages;
}

/*Quick view Modal Window */
function openModal(button) {

    const card = button.closest('.card');

  // 2. نأخذ الصورة من البطاقة
  const imgSrc = card.querySelector('img')?.src || '';

  // 3. نأخذ اسم النبتة من <h3> داخل البطاقة
  const titleText = card.querySelector('h3')?.textContent || 'نبتة غير معروفة';
 const paragraphs = card.querySelectorAll('p');
  const typeText = paragraphs[0]?.textContent || 'غير محدد';
  const priceText = paragraphs[1]?.textContent || '$0.00';
  // 4. نملأ النافذة:
  const modalImg = document.querySelector('#quickViewModal img');
  const modalTitle = document.getElementById('modal-title');
  const modalType = document.getElementById('modal-type');
  const modalPrice = document.getElementById('modal-price');

   if (modalImg) modalImg.src = imgSrc;
  if (modalTitle) modalTitle.textContent = titleText;
  if (modalType) modalType.textContent = typeText;
  if (modalPrice) modalPrice.textContent = priceText;

  
  document.getElementById("quickViewModal").style.display = "flex";
  document.body.style.overflow = "hidden";
}

function closeModal() {
  document.getElementById("quickViewModal").style.display = "none";
  document.body.style.overflow = "";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

/* color change pages */
fetch("navbar.html")
  .then((res) => res.text())
  .then((data) => {
    document.getElementById("navbar").innerHTML = data;

    // ✅ هنا نحطو active link
    const links = document.querySelectorAll("nav ul li a");

    links.forEach((link) => {
      if (window.location.pathname.includes(link.getAttribute("href"))) {
        link.classList.add("active");
      }
    });
  });
