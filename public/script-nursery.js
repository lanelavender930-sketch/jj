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
  // 1. نلغوا كل الـ checkboxes
  var allCheckboxes = document.querySelectorAll('input[type="checkbox"]');
  for (var i = 0; i < allCheckboxes.length; i++) {
    allCheckboxes[i].checked = false;
  }
  
  // 2. نرجعوا الـ radio buttons للوضع الافتراضي
  var allRadios = document.querySelectorAll('input[name="c"]');
  allRadios.forEach(radio => {
    radio.checked = false;
  });
  
  // 3. نرجعوا نحمّلوا كل المنتجات من جديد ✅
  loadProducts();
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
let currentQuickViewId = null; // متغير لتخزين ID النبات المفتوح حالياً

function openModal(plantId) {
    const plant = allProducts.find(p => p.plant_id === plantId);
    if (!plant) return;

    currentQuickViewId = plantId; // حفظ الـ ID

    // تعبئة البيانات الأساسية
    document.getElementById("modal-title").textContent = plant.name;
    document.getElementById("modal-price").textContent = `$${plant.price}`;
    document.getElementById("modal-type").textContent = plant.category;
    document.querySelector("#quickViewModal img").src = plant.image;

    // إعادة تعيين الكمية في النافذة إلى 1 عند كل فتحة جديدة
    document.querySelector(".quantity span").textContent = "1";

    // إظهار المودال
    document.getElementById("quickViewModal").style.display = "flex";

    // دالة لتغيير الكمية داخل نافذة Quick View فقط
function updateModalQty(change) {
    const qtySpan = document.querySelector(".quantity span");
    let currentQty = parseInt(qtySpan.textContent);
    
    currentQty += change;
    
    if (currentQty < 1) currentQty = 1; // منع النزول عن 1
    qtySpan.textContent = currentQty;
}

// ربط الأزرار بالدالة (أضيفي هذا الجزء داخل document.addEventListener('DOMContentLoaded', ...))
document.querySelectorAll(".quantity button")[0].onclick = () => updateModalQty(-1); // زر الناقص
document.querySelectorAll(".quantity button")[1].onclick = () => updateModalQty(1);  // زر الزائد
}
// البحث عن زر Add to Cart داخل المودال وربطه
const addToCartModalBtn = document.querySelector(".m2-button button");

if (addToCartModalBtn) {
    addToCartModalBtn.onclick = function() {
        const qtyToStore = parseInt(document.querySelector(".quantity span").textContent);
        const plant = allProducts.find(p => p.plant_id === currentQuickViewId);

        if (plant) {
            let cart = JSON.parse(localStorage.getItem('nurseryCart')) || [];
            const existingItem = cart.find(item => item.plant_id === currentQuickViewId);

            if (existingItem) {
                existingItem.quantity += qtyToStore; // إضافة الكمية المختارة من المودال
            } else {
                cart.push({
                    ...plant,
                    quantity: qtyToStore
                });
            }

            localStorage.setItem('nurseryCart', JSON.stringify(cart));
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
window.onclick = function(event) {
    const modal = document.getElementById("quickViewModal");
    if (event.target == modal) {
        closeModal();
    }
}
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
    const loginEmail = document.getElementById("login-email");
    if (loginEmail) {  // ✅ تأكد إنه موجود قبل ما تستخدمه
        loginEmail.focus();
    }
});

/* *********************************** */
const API_URL = 'http://localhost:3000/plants'; 
let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 9;

async function loadProducts() {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('HTTP error: ' + response.status);
        allProducts = await response.json();
        filteredProducts = [...allProducts];
        displayProducts();
    } catch (error) {
        console.error('❌ خطأ في التحميل:', error);
    }
}

function displayProducts() {
    const container = document.querySelector('.cardss.c1');
    if (!container) return;
    container.innerHTML = '';

    if (filteredProducts.length === 0) {
        container.innerHTML = '<p style="text-align:center;width:100%;">No results found</p>';
        updateProductsCount(); // تحديث العداد لـ 0
        return;
    }

    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const productsToShow = filteredProducts.slice(start, end);

    productsToShow.forEach(plant => {
        const card = document.createElement('div');
        card.className = 'card';
        let imgUrl = plant.image || 'img/default.jpg';
        
        card.innerHTML = `
            <div class="card-image">
                <img src="${imgUrl}" alt="${plant.name}" width="250" onerror="this.src='img/default.jpg'">
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
                        <span class="category-badge">${plant.category || 'Plant'}</span>
                        <span>${plant.rate || '4.5'} <i class="bi bi-star-fill" style="color: #ffc107; font-size: 12px;"></i></span>
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

// ========== إصلاح دالة البحث (Search) ==========
function setupSearch() {
    const searchInput = document.getElementById('search_inp');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const term = e.target.value.toLowerCase().trim();
            
            // الفلترة بناءً على الاسم أو الكاتيجوري
            filteredProducts = allProducts.filter(p => 
                (p.name || '').toLowerCase().includes(term) ||
                (p.category || '').toLowerCase().includes(term)
            );

            currentPage = 1; // العودة للصفحة 1 عند البحث
            displayProducts();
        });

        // منع الفورم من عمل Refresh للصفحة
        const form = searchInput.closest('form');
        if (form) form.addEventListener('submit', (e) => e.preventDefault());
    }
}

// ========== إصلاح دالة الفلاتر (Filters) ==========
function setupFilters() {
    // 1. فلاتر الـ Radio (Categories)
    document.querySelectorAll('input[name="c"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const val = e.target.value.toLowerCase();
            if (val === 'all') {
                filteredProducts = [...allProducts];
            } else {
                filteredProducts = allProducts.filter(p => p.category.toLowerCase().includes(val));
            }
            currentPage = 1;
            displayProducts();
        });
    });

    // 2. فلاتر الـ Checkbox (Supplies)
    document.querySelectorAll('input[name="supplies"]').forEach(cb => {
        cb.addEventListener('change', () => {
            const checked = Array.from(document.querySelectorAll('input[name="supplies"]:checked')).map(c => c.value.toLowerCase());
            if (checked.length === 0) {
                filteredProducts = [...allProducts];
            } else {
                filteredProducts = allProducts.filter(p => 
                    checked.some(val => p.category.toLowerCase().includes(val))
                );
            }
            currentPage = 1;
            displayProducts();
        });
    });
}

function updateProductsCount() {
    const countEl = document.querySelector('.right-content p');
    if (countEl) {
        const start = (currentPage - 1) * itemsPerPage;
        const end = Math.min(start + itemsPerPage, filteredProducts.length);
        const currentShown = Math.max(0, end - start);
        countEl.textContent = `${currentShown} product${currentShown !== 1 ? 's' : ''}`;
    }
}

function changePage(direction) {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    if (currentPage + direction >= 1 && currentPage + direction <= totalPages) {
        currentPage += direction;
        displayProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

function updatePaginationUI() {
    const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    
    if (prevBtn) prevBtn.disabled = (currentPage === 1);
    if (nextBtn) nextBtn.disabled = (currentPage === totalPages || totalPages === 0);
    
    document.querySelectorAll('.page-btn').forEach(btn => {
        const pNum = parseInt(btn.innerText);
        if (!isNaN(pNum)) {
            if (pNum === currentPage) btn.classList.add('active');
            else btn.classList.remove('active');
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupSearch();   // الآن الدالة موجودة ولن يظهر خطأ
    setupFilters();  // الآن الدالة موجودة ولن يظهر خطأ
});

/* cart-logic*/
function addToCart(plantId) {
    // 1. البحث عن المنتج في المصفوفة الأصلية باستخدام ID
    const plant = allProducts.find(p => p.plant_id === plantId);
    
    if (plant) {
        // 2. جلب السلة الحالية من localStorage أو إنشاء مصفوفة فارغة
        let cart = JSON.parse(localStorage.getItem('nurseryCart')) || [];
        
        // 3. التحقق إذا كان المنتج موجود مسبقاً لزيادة الكمية فقط
        const existingItem = cart.find(item => item.plant_id === plantId);
        
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
                quantity: 1
            });
        }
        
        // 4. حفظ السلة المحدثة في localStorage
        localStorage.setItem('nurseryCart', JSON.stringify(cart));
    }
    updateCartIconCount(); // تحديث العداد في الناف بار
}

function updateQty(id, change) {
    let cart = JSON.parse(localStorage.getItem('nurseryCart'));
    const item = cart.find(i => i.plant_id === id);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) return removeFromCart(id);
        localStorage.setItem('nurseryCart', JSON.stringify(cart));
        displayCartItems();
    }
    updateCartIconCount(); // تحديث العداد في الناف بار
}

function removeFromCart(id) {
    let cart = JSON.parse(localStorage.getItem('nurseryCart'));
    cart = cart.filter(i => i.plant_id !== id);
    localStorage.setItem('nurseryCart', JSON.stringify(cart));
    displayCartItems();
    updateCartIconCount(); // تحديث العداد في الناف بار
}

function clearCart() {
    localStorage.removeItem('nurseryCart');
    displayCartItems();
    updateCartIconCount(); // تحديث العداد في الناف بار
}
document.addEventListener('DOMContentLoaded', () => {
    displayCartItems();
});

function displayCartItems() {
    const cartContainer = document.querySelector('.shopping-cart-1');
    const cart = JSON.parse(localStorage.getItem('nurseryCart')) || [];
    
    //Header الثابت
    const header = `
        <div class="shopping-cart-header">
            <p class="pr">PRODUCT</p>
            <p>QUANTITY</p>
            <p>TOTAL</p>
        </div>`;
    
    // جلب الأزرار الحالية قبل مسح المحتوى للحفاظ عليها
    const existingButtons = document.querySelector('.carts-buttons');
    const buttonsHTML = existingButtons ? existingButtons.outerHTML : '';

    if (cart.length === 0) {
        cartContainer.innerHTML = header + '<p style="text-align:center; padding:20px;">Your cart is empty.</p>' + buttonsHTML;
        updateSummary(0);
        updateCartIconCount(); // تحديث العداد في الناف بار
        return;
    }

    let itemsHTML = "";
    let subtotal = 0;

    cart.forEach(item => {
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
        shippingCost = subtotal > 200 ? 0 : 20.00;
    }
    
    // 2. حساب الإجمالي النهائي
    const finalTotal = subtotal + shippingCost;

    // --- التحديث في الواجهة ---

    // تحديث Subtotal (بجانب كلمة Total Price في المربع الأول)
    const subtotalLabel = document.querySelector('.total-price-content span');
    if (subtotalLabel) subtotalLabel.textContent = `$${subtotal.toFixed(2)}`;

    // تحديث قيمة الشحن في القائمة
    // نستخدم nth-of-type(2) لأن الشحن هو العنصر الثاني في القائمة حسب صورتك
    const shippingLabel = document.querySelector('.subtotal:nth-of-type(2) span');
    if (shippingLabel) {
        shippingLabel.textContent = shippingCost === 0 ? 'FREE' : `$${shippingCost.toFixed(2)}`;
    }

    // تحديث الـ TOTAL النهائي (الأهم)
    const totalLabel = document.getElementById('final-total');
    if (totalLabel) {
        totalLabel.textContent = `$${finalTotal.toFixed(2)}`;
    } else {
        // إذا لم تجدي الـ ID، جربي البحث عن الكلاس والقيمة الخضراء
        const fallbackTotal = document.querySelector('.total span');
        if (fallbackTotal) fallbackTotal.textContent = `$${finalTotal.toFixed(2)}`;
    }
}

// دالة لتحديث عداد السلة في الـ Navbar
function updateCartIconCount() {
    // جلب السلة من الـ localStorage
    const cart = JSON.parse(localStorage.getItem('nurseryCart')) || [];
    
    // حساب إجمالي الكميات لجميع المنتجات المضافة
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    const badge = document.getElementById('cart-badge');
    
    if (badge) {
        if (totalItems > 0) {
            badge.textContent = totalItems;
            badge.style.display = 'flex'; // إظهار الدائرة
        } else {
            badge.style.display = 'none'; // إخفاء الدائرة إذا كانت فارغة
        }
    }
}

// تشغيل الدالة عند تحميل الصفحة للتأكد من ظهور العدد فوراً
document.addEventListener('DOMContentLoaded', updateCartIconCount);


