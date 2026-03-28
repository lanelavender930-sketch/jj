let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 9;

// ========== جلب المنتجات ==========
async function loadProducts() {
  try {
    console.log('🔄 جاري جلب المنتجات...');
    const response = await fetch('http://localhost:5000/api/products');
    if (!response.ok) throw new Error('HTTP error: ' + response.status);
    
    allProducts = await response.json();
    filteredProducts = [...allProducts];
    console.log('✅ تم جلب', allProducts.length, 'منتج');
    
    currentPage = 1;
    displayProducts();
    updateProductsCount();
    updatePaginationUI();
    
  } catch (error) {
    console.error('❌ خطأ:', error);
  }
}

// ========== عرض المنتجات ==========
function displayProducts() {
  // ✅ استخدام الكلاس الموجود عندك
  const container = document.querySelector('.cardss.c1');
  
  if (!container) {
    console.error('❌ لم أجد .cardss.c1');
    return;
  }
  
  container.innerHTML = '';
  
  if (filteredProducts.length === 0) {
    container.innerHTML = '<p style="text-align:center;width:100%;padding:20px;">لا توجد منتجات</p>';
    return;
  }
  
  // حساب الـ pagination
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const productsToShow = filteredProducts.slice(start, end);
  
  console.log(`📄 الصفحة ${currentPage} من ${totalPages} - عرض ${productsToShow.length} منتج`);
  
  productsToShow.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';
    
    let imgUrl = product.image || product.image_url || 'img/default.jpg';
    if (!imgUrl.startsWith('http') && !imgUrl.startsWith('/')) imgUrl = '/' + imgUrl;
    
    card.innerHTML = `
      <div class="card-image">
        <img src="${imgUrl}" alt="${product.name}" width="250" 
             onerror="this.src='/img/default.jpg'">
        <div class="overlay">
          <button class="quick-view-btn" onclick="openModal(this)">
            <i class="bi bi-eye"></i> Quick view
          </button>
        </div>
        <i class="bi bi-heart"></i>
      </div>
      <div class="card-content">
        <div class="title-product">
          <div class="rating">
            <span class="category-badge">${product.category_name || 'Plants'}</span>
            <span>${product.rating || '4.5'}⭐</span>
          </div>
          <h3>${product.name}</h3>
        </div>
        <div class="price-product">
          <p>$${product.price}</p>
          <i class="bi bi-cart3"></i>
        </div>
      </div>
    `;
    
    card.dataset.name = (product.name || '').toLowerCase();
    card.dataset.category = (product.category_name || '').toLowerCase();
    
    container.appendChild(card);
  });
  
  updateProductsCount();
  updatePaginationUI();
}

// ========== تحديث عدد المنتجات ==========
function updateProductsCount() {
  // ✅ استخدام الكلاس الموجود عندك
  const countEl = document.querySelector('.right-content p');
  if (countEl) {
    const start = (currentPage - 1) * itemsPerPage;
    const end = Math.min(start + itemsPerPage, filteredProducts.length);
    const count = end - start;
    countEl.textContent = `Showing ${count} product${count !== 1 ? 's' : ''}`;
  }
}

// ========== تحديث حالة الـ Pagination ==========
function updatePaginationUI() {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  
  // ✅ تحديث الأزرار الموجودة عندك
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  
  // تعطيل/تفعيل Previous
  if (prevBtn) {
    if (currentPage === 1) {
      prevBtn.disabled = true;
      prevBtn.style.opacity = '0.5';
    } else {
      prevBtn.disabled = false;
      prevBtn.style.opacity = '1';
    }
  }
  
  // تعطيل/تفعيل Next
  if (nextBtn) {
    if (currentPage >= totalPages) {
      nextBtn.disabled = true;
      nextBtn.style.opacity = '0.5';
    } else {
      nextBtn.disabled = false;
      nextBtn.style.opacity = '1';
    }
    
    // إخفاء Next إذا ما فيش إلا صفحة واحدة
    if (totalPages <= 1) {
      nextBtn.style.display = 'none';
    } else {
      nextBtn.style.display = 'inline-block';
    }
  }
  
  // ✅ تحديث أرقام الصفحات
  document.querySelectorAll('.page-btn').forEach(btn => {
    const pageNum = parseInt(btn.id.replace('page', ''));
    if (!isNaN(pageNum)) {
      // إضافة/إزالة active
      if (pageNum === currentPage) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
      
      // إخفاء الصفحات اللي ما عندهاش منتجات
      if (pageNum > totalPages) {
        btn.style.display = 'none';
      } else {
        btn.style.display = 'inline-block';
      }
    }
  });
}

// ========== دالة changePage (موجودة عندك في HTML) ==========
function changePage(direction) {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const newPage = currentPage + direction;
  
  if (newPage >= 1 && newPage <= totalPages) {
    currentPage = newPage;
    console.log('🔄 الانتقال للصفحة:', currentPage);
    displayProducts();
    
    // سكرول للأعلى
    const container = document.querySelector('.cardss.c1');
    if (container) {
      container.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}

// ========== دالة setPage (موجودة عندك في HTML) ==========
function setPage(pageNum) {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  if (pageNum >= 1 && pageNum <= totalPages) {
    currentPage = pageNum;
    console.log('🔄 الانتقال للصفحة:', currentPage);
    displayProducts();
  }
}

// ========== البحث ==========
function setupSearch() {
  const searchInput = document.querySelector('.search input, #searchInput');
  if (!searchInput) return;
  
  searchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase().trim();
    
    if (term === '') {
      filteredProducts = [...allProducts];
    } else {
      filteredProducts = allProducts.filter(p => 
        (p.name || '').toLowerCase().includes(term) ||
        (p.category_name || '').toLowerCase().includes(term)
      );
    }
    
    currentPage = 1;
    displayProducts();
  });
}

// ========== الفلاتر ==========
function setupCategoryFilter() {
  const categoryRadios = document.querySelectorAll('input[name="c"]');
  categoryRadios.forEach(radio => {
    radio.addEventListener('change', (e) => {
      const category = e.target.value.toLowerCase();
      
      if (category === 'all' || category === '') {
        filteredProducts = [...allProducts];
      } else {
        filteredProducts = allProducts.filter(p => 
          (p.category_name || '').toLowerCase() === category
        );
      }
      
      currentPage = 1;
      displayProducts();
    });
  });
}

function setupSuppliesFilter() {
  const suppliesCheckboxes = document.querySelectorAll('input[name="supplies"]');
  suppliesCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      const checked = document.querySelectorAll('input[name="supplies"]:checked');
      
      if (checked.length === 0) {
        filteredProducts = [...allProducts];
      } else {
        const values = Array.from(checked).map(c => c.value.toLowerCase());
        filteredProducts = allProducts.filter(p => 
          values.some(v => (p.category_name || '').toLowerCase().includes(v))
        );
      }
      
      currentPage = 1;
      displayProducts();
    });
  });
}

// ========== التشغيل ==========
document.addEventListener('DOMContentLoaded', () => {
  console.log('🌱 الصفحة جاهزة!');
  loadProducts();
  setupSearch();
  setupCategoryFilter();
  setupSuppliesFilter();
});