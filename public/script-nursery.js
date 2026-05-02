/*opinions grid*/
function initOpinionCards() {
  const opinionCards = document.querySelectorAll(".opinions-grid");
  if (!opinionCards.length) return;

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
}

/*drop list questions*/
function initFaqToggles() {
  document.querySelectorAll(".faq-question").forEach((btn) => {
    btn.addEventListener("click", () => {
      const answer = btn.nextElementSibling;
      if (!answer) return;

      btn.classList.toggle("active");
      answer.style.height =
        answer.style.height === "0px" || !answer.style.height
          ? answer.scrollHeight + "px"
          : "0px";
    });
  });
}
/* clear btn in shop page */

function clearAllFilters() {
  // إعادة تعيين الكل
  document.querySelectorAll('input[type="checkbox"]').forEach((checkbox) => {
    checkbox.checked = false;
  });
  document.querySelectorAll('input[name="c"]').forEach((radio) => {
    radio.checked = false;
  });

  const searchInput = document.getElementById("search_inp");
  if (searchInput) searchInput.value = "";

  filteredProducts = [...allProducts];
  currentPage = 1;
  displayProducts();
}

/* showing nav search */
function initNavSearchToggle() {
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
}

/* pagination buttons "shop" */

function setPage(page) {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  if (page >= 1 && page <= totalPages) {
    currentPage = page;
    displayProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

function changePage(direction) {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const newPage = currentPage + direction;
  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage;
    displayProducts();
    window.scrollTo({ top: 0, behavior: "smooth" });
  }
}

/*Quick view Modal Window */
let currentQuickViewId = null; // متغير لتخزين ID النبات المفتوح حالياً

function openModal(plantId) {
  const plant = allProducts.find((p) => p.plant_id === plantId);
  if (!plant) return;

  currentQuickViewId = plantId; // حفظ الـ ID

  // تعبئة البيانات الأساسية
  const modalTitle = document.getElementById("modal-title");
  const modalPrice = document.getElementById("modal-price");
  const modalType = document.getElementById("modal-type");
  const modalImage = document.querySelector("#quickViewModal img");
  const modalContainer = document.getElementById("quickViewModal");
  const modalQty = document.querySelector(".quantity span");
  if (
    !modalTitle ||
    !modalPrice ||
    !modalType ||
    !modalImage ||
    !modalContainer ||
    !modalQty
  )
    return;

  modalTitle.textContent = plant.name;
  modalPrice.textContent = `$${plant.price}`;
  modalType.textContent = plant.category;
  modalImage.src = plant.image;

  // إعادة تعيين الكمية في النافذة إلى 1 عند كل فتحة جديدة
  modalQty.textContent = "1";

  // إظهار المودال
  modalContainer.style.display = "flex";

  // دالة لتغيير الكمية داخل نافذة Quick View فقط
  function updateModalQty(change) {
    const qtySpan = document.querySelector(".quantity span");
    let currentQty = parseInt(qtySpan.textContent);

    currentQty += change;

    if (currentQty < 1) currentQty = 1; // منع النزول عن 1
    qtySpan.textContent = currentQty;
  }

  // ربط الأزرار بالدالة (أضيفي هذا الجزء داخل document.addEventListener('DOMContentLoaded', ...))
  const quantityButtons = document.querySelectorAll(".quantity button");
  if (quantityButtons.length >= 2) {
    quantityButtons[0].onclick = () => updateModalQty(-1); // زر الناقص
    quantityButtons[1].onclick = () => updateModalQty(1); // زر الزائد
  }
}
// البحث عن زر Add to Cart داخل المودال وربطه
function initModalAddToCart() {
  const addToCartModalBtn = document.querySelector(".m2-button button");
  if (!addToCartModalBtn) return;

  addToCartModalBtn.onclick = function () {
    const qtyEl = document.querySelector(".quantity span");
    if (!qtyEl) return;

    const qtyToStore = parseInt(qtyEl.textContent, 10);
    const plant = allProducts.find((p) => p.plant_id === currentQuickViewId);

    if (plant) {
      let cart = JSON.parse(localStorage.getItem("nurseryCart")) || [];
      const existingItem = cart.find(
        (item) => item.plant_id === currentQuickViewId,
      );

      if (existingItem) {
        existingItem.quantity += qtyToStore; // إضافة الكمية المختارة من المودال
      } else {
        cart.push({
          ...plant,
          quantity: qtyToStore,
        });
      }

      localStorage.setItem("nurseryCart", JSON.stringify(cart));
      updateCartIconCount(); // تحديث العداد في الناف بار
      closeModal(); // إغلاق النافذة بعد الإضافة
    }
  };
}

// دالة إغلاق المودال (للتأكد من عملها)
function closeModal() {
  const modal = document.getElementById("quickViewModal");
  if (modal) {
    modal.style.display = "none";
    document.body.style.overflow = "auto";
  }
}

// إغلاق المودال عند الضغط خارجه
window.onclick = function (event) {
  const modal = document.getElementById("quickViewModal");
  if (event.target == modal) {
    closeModal();
  }
};
/* color change pages */
function initNavbarState() {
  const navbar = document.getElementById("navbar");
  if (!navbar) return;

  fetch("navbar.html")
    .then((res) => res.text())
    .then((data) => {
      navbar.innerHTML = data;

      // ✅ هنا نحطو active link
      const links = document.querySelectorAll("nav ul li a");
      links.forEach((link) => {
        if (window.location.pathname.includes(link.getAttribute("href"))) {
          link.classList.add("active");
        }
      });
    })
    .catch((error) => {
      console.error("Navbar load failed:", error);
    });
}
/*care instractions */
function initCareTabs() {
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
      const targetTab = document.getElementById(targetId);
      if (targetTab) {
        targetTab.classList.add("active");
      }
    });
  });
}
/*login form */
function showForm(formId) {
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  if (!loginForm || !registerForm) return;

  loginForm.style.display = formId === "login" ? "block" : "none";
  registerForm.style.display = formId === "register" ? "block" : "none";
}

function animateSwitch(toFormId) {
  const login = document.getElementById("login-form");
  const reg = document.getElementById("register-form");
  if (!login || !reg) return;

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
  const loginEmail = document.getElementById("login-email");
  if (loginEmail) {
    // ✅ تأكد إنه موجود قبل ما تستخدمه
    loginEmail.focus();
  }
});

/* *********************************** */
const API_URL = "http://localhost:3000/plants";
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 9;

async function loadProducts() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error("HTTP error: " + response.status);
    allProducts = await response.json();
    filteredProducts = [...allProducts];
    displayProducts();
  } catch (error) {
    console.error("❌ خطأ في التحميل:", error);
  }
}

function displayProducts() {
  const container = document.querySelector(".cardss.c1");
  if (!container) return;
  container.innerHTML = "";

  if (filteredProducts.length === 0) {
    container.innerHTML =
      '<p style="text-align:center;width:100%;">No results found</p>';
    updateProductsCount(); // تحديث العداد لـ 0
    return;
  }

  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const productsToShow = filteredProducts.slice(start, end);

  productsToShow.forEach((plant) => {
    const card = document.createElement("div");
    card.className = "card";

    const placeholderImage =
      "data:image/svg+xml,%3Csvg%20xmlns%3D%22http://www.w3.org/2000/svg%22%20width%3D%22250%22%20height%3D%22250%22%20viewBox%3D%220%200%20250%20250%22%3E%3Crect%20width%3D%22250%22%20height%3D%22250%22%20fill%3D%22%23f3f3f3%22%2F%3E%3Ctext%20x%3D%22125%22%20y%3D%22130%22%20font-family%3D%22Arial%2C%20sans-serif%22%20font-size%3D%2216%22%20fill%3D%22%23777777%22%20text-anchor%3D%22middle%22%3ENo%20image%3C%2Ftext%3E%3C%2Fsvg%3E";

    let imgUrl = placeholderImage;
    if (plant.image) {
      const imageName = plant.image.trim();
      const ext = imageName.split(".").pop().toLowerCase();
      if (ext === "webp" || ext === "png") {
        imgUrl = `http://localhost:3000/${imageName}`;
      }
    }

    card.innerHTML = `
            <div class="card-image">
                    <img 
        src="${imgUrl}" 
        alt="${plant.name}" 
        width="250" 
        onerror="this.onerror=null;this.src='${placeholderImage}'"
        >
                <div class="overlay">
                    <button class="quick-view-btn" onclick="openModal(${plant.plant_id})">
                        <i class="bi bi-eye"></i> Quick view
                    </button>
                </div>
                <i class="bi bi-heart"></i>
            </div>
            <div class="card-content">
                <div class="title-product">
                    <div class="rating">
                        <span class="category-badge">${plant.category || "Plant"}</span>
                        <span>${plant.rate || "4.5"} <i class="bi bi-star-fill" style="color: #ffc107; font-size: 12px;"></i></span>
                    </div>
                    <h3>${plant.name}</h3>
                </div>
                <div class="price-product">
                    <p>$${plant.price}</p>
                    <i class="bi bi-cart3" style="color: #ffffff; cursor: pointer;" onclick="addToCart(${plant.plant_id})"></i>
                </div>
            </div>`;
    container.appendChild(card);
  });

  updatePaginationUI();
  updateProductsCount();
}

function applyShopFilters() {
  const searchInput = document.getElementById("search_inp");
  const searchTerm = searchInput?.value.toLowerCase().trim() || "";
  const selectedCategory = (
    document.querySelector('input[name="c"]:checked')?.value || ""
  ).toLowerCase();
  const supplies = Array.from(
    document.querySelectorAll('input[name="supplies"]:checked'),
  ).map((c) => c.value.toLowerCase());

  const normalizedCategory = selectedCategory
    .replace("plants", "")
    .replace("& accessories", "")
    .trim();

  filteredProducts = allProducts.filter((p) => {
    const name = (p.name || "").toLowerCase();
    const category = (p.category || "").toLowerCase();

    const matchesSearch =
      searchTerm === "" ||
      name.includes(searchTerm) ||
      category.includes(searchTerm);

    const matchesCategory =
      !normalizedCategory ||
      normalizedCategory === "all" ||
      category.includes(normalizedCategory);

    const matchesSupplies =
      supplies.length === 0 || supplies.some((val) => category.includes(val));

    return matchesSearch && matchesCategory && matchesSupplies;
  });

  currentPage = 1;
  displayProducts();
}

function setupSearch() {
  const searchInput = document.getElementById("search_inp");
  if (!searchInput) return;

  searchInput.addEventListener("input", () => {
    applyShopFilters();
  });

  const form = searchInput.closest("form");
  if (form) form.addEventListener("submit", (e) => e.preventDefault());
}

function setupFilters() {
  document.querySelectorAll('input[name="c"]').forEach((radio) => {
    radio.addEventListener("change", () => {
      applyShopFilters();
    });
  });

  document.querySelectorAll('input[name="supplies"]').forEach((cb) => {
    cb.addEventListener("change", () => {
      applyShopFilters();
    });
  });
}
function updateProductsCount() {
  const countEl = document.querySelector(".right-content p");
  if (countEl) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, filteredProducts.length);
    const currentShown = Math.max(0, end - start);
    countEl.textContent = `${currentShown} product${currentShown !== 1 ? "s" : ""}`;
  }
}

function updatePaginationUI() {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");

  if (prevBtn) prevBtn.disabled = currentPage === 1;
  if (nextBtn)
    nextBtn.disabled = currentPage === totalPages || totalPages === 0;

  document.querySelectorAll(".page-btn").forEach((btn) => {
    const pNum = parseInt(btn.innerText);
    if (!isNaN(pNum)) {
      if (pNum === currentPage) btn.classList.add("active");
      else btn.classList.remove("active");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  initOpinionCards();
  initFaqToggles();
  initNavSearchToggle();
  initNavbarState();
  initCareTabs();
  initModalAddToCart();
  loadProducts();
  setupSearch(); // الآن الدالة موجودة ولن يظهر خطأ
  setupFilters(); // الآن الدالة موجودة ولن يظهر خطأ
});

/* cart-logic*/
function addToCart(plantId) {
  // 1. البحث عن المنتج في المصفوفة الأصلية باستخدام ID
  const plant = allProducts.find((p) => p.plant_id === plantId);

  if (plant) {
    // 2. جلب السلة الحالية من localStorage أو إنشاء مصفوفة فارغة
    let cart = JSON.parse(localStorage.getItem("nurseryCart")) || [];

    // 3. التحقق إذا كان المنتج موجود مسبقاً لزيادة الكمية فقط
    const existingItem = cart.find((item) => item.plant_id === plantId);

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      // إضافة المنتج الجديد مع تحديد كمية افتراضية = 1
      cart.push({
        plant_id: plant.plant_id,
        name: plant.name,
        price: plant.price,
        image: plant.image,
        category: plant.category,
        quantity: 1,
      });
    }

    // 4. حفظ السلة المحدثة في localStorage
    localStorage.setItem("nurseryCart", JSON.stringify(cart));
  }
  updateCartIconCount(); // تحديث العداد في الناف بار
}

function updateQty(id, change) {
  let cart = JSON.parse(localStorage.getItem("nurseryCart")) || [];
  const item = cart.find((i) => i.plant_id === id);
  if (item) {
    item.quantity += change;
    if (item.quantity <= 0) return removeFromCart(id);
    localStorage.setItem("nurseryCart", JSON.stringify(cart));
    displayCartItems();
  }
  updateCartIconCount(); // تحديث العداد في الناف بار
}

function removeFromCart(id) {
  let cart = JSON.parse(localStorage.getItem("nurseryCart")) || [];
  cart = cart.filter((i) => i.plant_id !== id);
  localStorage.setItem("nurseryCart", JSON.stringify(cart));
  displayCartItems();
  updateCartIconCount(); // تحديث العداد في الناف بار
}

function clearCart() {
  localStorage.removeItem("nurseryCart");
  displayCartItems();
  updateCartIconCount(); // تحديث العداد في الناف بار
}
document.addEventListener("DOMContentLoaded", () => {
  displayCartItems();
});

function displayCartItems() {
  const cartContainer = document.querySelector(".shopping-cart-1");
  if (!cartContainer) return;
  const cart = JSON.parse(localStorage.getItem("nurseryCart")) || [];

  //Header الثابت
  const header = `
        <div class="shopping-cart-header">
            <p class="pr">PRODUCT</p>
            <p>QUANTITY</p>
            <p>TOTAL</p>
        </div>`;

  // جلب الأزرار الحالية قبل مسح المحتوى للحفاظ عليها
  const existingButtons = document.querySelector(".carts-buttons");
  const buttonsHTML = existingButtons ? existingButtons.outerHTML : "";

  if (cart.length === 0) {
    cartContainer.innerHTML =
      header +
      '<p style="text-align:center; padding:20px;">Your cart is empty.</p>' +
      buttonsHTML;
    updateSummary(0);
    updateCartIconCount(); // تحديث العداد في الناف بار
    return;
  }

  let itemsHTML = "";
  let subtotal = 0;

  cart.forEach((item) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    itemsHTML += `
            <div class="cart-item">
                <img src="${item.image}" width="100" />
                <div class="info">
                    <p>${item.category}</p>
                    <h3>${item.name}</h3>
                    <p style="color: var(--primary-color); font-weight: bold;">$${item.price}</p>
                    <button class="remove" onclick="removeFromCart(${item.plant_id})">
                        <i class="bi bi-trash3"></i> Remove
                    </button>
                </div>
                <div class="quantity">
                    <button onclick="updateQty(${item.plant_id}, -1)">-</button>
                    <span style="font-weight: bold;">${item.quantity}</span>
                    <button onclick="updateQty(${item.plant_id}, 1)">+</button>
                </div>
                <div class="total">$${itemTotal.toFixed(2)}</div>
            </div>`;
  });

  // دمج الهيدر + المنتجات + الأزرار لضمان بقاء الأزرار في مكانها
  cartContainer.innerHTML = header + itemsHTML + buttonsHTML;

  updateSummary(subtotal);
  updateCartIconCount(); // تحديث العداد
}

// دالة تحديث ملخص الطلب (Subtotal & Total)
function updateSummary(subtotal) {
  // 1. حساب الشحن: إذا السلة فارغة الشحن 0، إذا أكثر من 200$ الشحن FREE (0)، غير ذلك 20$
  let shippingCost = 0;
  if (subtotal > 0) {
    shippingCost = subtotal > 200 ? 0 : 20.0;
  }

  // 2. حساب الإجمالي النهائي
  const finalTotal = subtotal + shippingCost;

  // --- التحديث في الواجهة ---

  // تحديث Subtotal (بجانب كلمة Total Price في المربع الأول)
  const subtotalLabel = document.querySelector(".total-price-content span");
  if (subtotalLabel) subtotalLabel.textContent = `$${subtotal.toFixed(2)}`;

  // تحديث قيمة الشحن في القائمة
  // نستخدم nth-of-type(2) لأن الشحن هو العنصر الثاني في القائمة حسب صورتك
  const shippingLabel = document.querySelector(".subtotal:nth-of-type(2) span");
  if (shippingLabel) {
    shippingLabel.textContent =
      shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`;
  }

  // تحديث الـ TOTAL النهائي (الأهم)
  const totalLabel = document.getElementById("final-total");
  if (totalLabel) {
    totalLabel.textContent = `$${finalTotal.toFixed(2)}`;
  } else {
    // إذا لم تجدي الـ ID، جربي البحث عن الكلاس والقيمة الخضراء
    const fallbackTotal = document.querySelector(".total span");
    if (fallbackTotal) fallbackTotal.textContent = `$${finalTotal.toFixed(2)}`;
  }
}

// دالة لتحديث عداد السلة في الـ Navbar
function updateCartIconCount() {
  // جلب السلة من الـ localStorage
  const cart = JSON.parse(localStorage.getItem("nurseryCart")) || [];

  // حساب إجمالي الكميات لجميع المنتجات المضافة
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const badge = document.getElementById("cart-badge");

  if (badge) {
    if (totalItems > 0) {
      badge.textContent = totalItems;
      badge.style.display = "flex"; // إظهار الدائرة
    } else {
      badge.style.display = "none"; // إخفاء الدائرة إذا كانت فارغة
    }
  }
}

// تشغيل الدالة عند تحميل الصفحة للتأكد من ظهور العدد فوراً
document.addEventListener("DOMContentLoaded", updateCartIconCount);
