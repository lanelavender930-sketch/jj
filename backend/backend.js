let allProducts = [];

// ========== دالة جلب المنتجات من API ==========
async function loadProducts() {
  try {
    console.log('🔄 جاري جلب المنتجات...');
    
    const response = await fetch('http://localhost:5000/api/products');
    
    if (!response.ok) {
      throw new Error('Failed to fetch products: ' + response.status);
    }
    
    allProducts = await response.json();
    console.log('✅ تم جلب', allProducts.length, 'منتج');
    
    displayProducts();
    updateProductsCount();
    
  } catch (error) {
    console.error('❌ خطأ في جلب المنتجات:', error);
  }
}

// ========== دالة عرض المنتجات في الصفحة ==========
function displayProducts() {
  const container = document.querySelector('.cardss.c1');
  
  if (!container) {
    console.log('⚠️ لم يتم العثور على الحاوية .cardss.c1');
    return;
  }
  
  // مسح المحتوى القديم
  container.innerHTML = '';
  
  // إذا لم توجد منتجات
  if (allProducts.length === 0) {
    container.innerHTML = '<p style="text-align:center; width:100%;">No products found</p>';
    return;
  }
  
  // إنشاء بطاقة لكل منتج
  allProducts.forEach(product => {
    const card = document.createElement('div');
    card.className = 'card';
    
    // ✅ معالجة مسار الصورة: تجربة عدة احتمالات
    let imageUrl = product.image || product.image_url || 'img/default.jpg';
        // إذا كان المسار نسبي ولا يبدأ بـ http أو / نضيف /
    if (!imageUrl.startsWith('http') && !imageUrl.startsWith('/')) {
      imageUrl = '/' + imageUrl;
    }
    
    // ✅ إنشاء HTML البطاقة (تم إصلاح Template Literals بـ backticks ``)
    card.innerHTML = `
      <div class="card-image">
        <img 
          src="${imageUrl}" 
          alt="${product.name || 'Product'}" 
          width="250" 
          onerror="this.src='/img/default.jpg'; console.log('صورة غير موجودة:', this.src);"
        />
        <div class="overlay">
          <button class="quick-view-btn" onclick="openModal(this)">
            <i class="bi bi-eye" style="font-size: 17px"></i> Quick view
          </button>
        </div>
        <div class="bi bi-heart"></div>
      </div>
      <div class="card-content">
        <div class="title-product">
          <div class="rating">
            <p class="category-badge">${product.category_name || 'Indoor Plants'}</p>
            <span>${product.rating || '4.5'} ⭐</span>
          </div>
          <h3>${product.name || 'Unnamed Product'}</h3>
        </div>
        <div class="price-product">
          <p>$${product.price || '0.00'}</p>
          <i class="bi bi-cart3" style="color: #ffffff; cursor:pointer;" onclick="addToCart(${product.id})"></i>
        </div>
      </div>
    `;
    
    // ✅ حفظ بيانات المنتج في dataset للبحث والتصنيف
    card.dataset.productId = product.id || '';
    card.dataset.productName = (product.name || '').toLowerCase();
    card.dataset.productCategory = (product.category_name || product.category || '').toLowerCase();
    
    container.appendChild(card);
  });
  
  console.log(`🎨 تم عرض ${allProducts.length} منتج في الصفحة`);
}

// ========== دالة تحديث عدد المنتجات المعروضة ==========
function updateProductsCount() {
  const countElement = document.querySelector('.right-content p');
  if (countElement) {
    // نحسبوا البطاقات المرئية فقط
    const visibleCards = document.querySelectorAll('.card[style="block"], .card:not([style*="display: none"])');
    const count = visibleCards.length;
    countElement.textContent = `Showing ${count} product${count !== 1 ? 's' : ''}`;
  }
}

// ========== دالة البحث والتصفية ==========
function setupSearch() {
  const searchInput = document.querySelector('.search, #searchInput');
  
  if (searchInput) {
    searchInput.addEventListener('input', function(e) {
      const searchTerm = e.target.value.toLowerCase().trim();
      const cards = document.querySelectorAll('.card');
      
      if (searchTerm === '') {
        cards.forEach(card => card.style.display = 'block');
        updateProductsCount(); // ✅ أضف هذا
        return;
      }
      
      cards.forEach(card => {
        const name = card.dataset.productName || '';
        const category = card.dataset.productCategory || '';
        
        if (name.includes(searchTerm) || category.includes(searchTerm)) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
      
      // ✅ أضف هذا السطر لتحديث العدد
      updateProductsCount();
    });
  }
}

// ========== دالة تصفية حسب التصنيف (Radio Buttons) ==========
function setupCategoryFilter() {
  const categoryRadios = document.querySelectorAll('input[name="c"]');
  
  categoryRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      const selectedCategory = this.value.toLowerCase();
      const cards = document.querySelectorAll('.card');
      
      cards.forEach(card => {
        const category = card.dataset.productCategory || '';
        
        if (selectedCategory === 'all' || category === selectedCategory) {
          card.style.display = 'block';
        } else {
          card.style.display = 'none';
        }
      });
      
      // ✅ أضف هذا السطر لتحديث العدد
      updateProductsCount();
    });
  });
}

function setupSuppliesFilter() {
  const suppliesCheckboxes = document.querySelectorAll('input[name="supplies"]');
  
  suppliesCheckboxes.forEach(checkbox => {
    checkbox.addEventListener('change', filterBySupplies);
  });
}

function filterBySupplies() {
  const checkedBoxes = document.querySelectorAll('input[name="supplies"]:checked');
  const selectedSupplies = Array.from(checkedBoxes).map(cb => cb.value);
  
  if (selectedSupplies.length === 0) {
    // إذا ما فيش اختيار، عرض الكل
    loadProducts();
    return;
  }
  
  // فلترة محلية (أسرع)
  const cards = document.querySelectorAll('.card');
  cards.forEach(card => {
    const category = card.dataset.productCategory || '';
    const matches = selectedSupplies.some(supply => 
      category.toLowerCase().includes(supply.toLowerCase())
    );
    card.style.display = matches ? 'block' : 'none';
  });
  
  updateProductsCount();
}

// ========== التشغيل عند تحميل الصفحة ==========
document.addEventListener('DOMContentLoaded', function() {
  console.log('🌱 الصفحة جاهزة، جاري تحميل المنتجات...');
  
  loadProducts();
  setupSearch();
  setupCategoryFilter();
  setupSuppliesFilter(); 
});