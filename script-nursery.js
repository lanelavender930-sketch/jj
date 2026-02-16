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
  const card = button.closest(".card");

  // 2. نأخذ الصورة من البطاقة
  const imgSrc = card.querySelector("img")?.src || "";

  // 3. نأخذ اسم النبتة من <h3> داخل البطاقة
  const titleText = card.querySelector("h3")?.textContent || "نبتة غير معروفة";
  const paragraphs = card.querySelectorAll("p");
  const typeText = paragraphs[0]?.textContent || "غير محدد";
  const priceText = paragraphs[1]?.textContent || "$0.00";
  // 4. نملأ النافذة:
  const modalImg = document.querySelector("#quickViewModal img");
  const modalTitle = document.getElementById("modal-title");
  const modalType = document.getElementById("modal-type");
  const modalPrice = document.getElementById("modal-price");

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
/*care instractions */
document.querySelectorAll(".tab").forEach((tab) => {
  tab.addEventListener("click", () => {
    // إزالة التفعيل من كل التبويبات والمحتويات
    document
      .querySelectorAll(".tab")
      .forEach((t) => t.classList.remove("active"));
    document
      .querySelectorAll(".tab-content")
      .forEach((c) => c.classList.remove("active"));
    // تفعيل التبويب المضغوط
    tab.classList.add("active");

    // عرض المحتوى المرتبط
    const targetId = tab.getAttribute("data-target");
    document.getElementById(targetId).classList.add("active");
  });
});
/*login form */
function showForm(formId) {
  document.getElementById("login-form").style.display =
    formId === "login" ? "block" : "none";
  document.getElementById("register-form").style.display =
    formId === "register" ? "block" : "none";
}

function animateSwitch(toFormId) {
  const login = document.getElementById("login-form");
  const reg = document.getElementById("register-form");

  login.classList.remove("slide-out", "slide-in");
  reg.classList.remove("slide-out", "slide-in");

  if (toFormId === "register") {
    login.classList.add("slide-out");
    reg.classList.add("slide-in");
    setTimeout(() => {
      showForm("register");
      login.classList.remove("slide-out");
      reg.classList.remove("slide-in");
    }, 0);
  } else if (toFormId === "login") {
    reg.classList.add("slide-out");
    login.classList.add("slide-in");
    setTimeout(() => {
      showForm("login");
      reg.classList.remove("slide-out");
      login.classList.remove("slide-in");
    }, 0);
  }
}

// تركيز تلقائي عند التحميل
document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("login-email").focus();
});

/* blog page */
// وظيفة البحث
const searchInput = document.getElementById("searchInput");
const articles = document.querySelectorAll(".blog-card");

searchInput.addEventListener("keyup", function (e) {
  const term = e.target.value.toLowerCase();

  articles.forEach((article) => {
    const title = article.querySelector("h2").textContent.toLowerCase();
    const desc = article.querySelector("p").textContent.toLowerCase();

    if (title.indexOf(term) != -1 || desc.indexOf(term) != -1) {
      article.style.display = "block";
    } else {
      article.style.display = "none";
    }
  });
});
