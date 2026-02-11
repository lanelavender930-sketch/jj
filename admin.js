function showPage(pageClass, btn) {
  // نحي active من كل الصفحات
  const pages = document.querySelectorAll(".main-page .page");
  pages.forEach((page) => page.classList.remove("active"));

  // نوري الصفحة المختارة بالclass
  const page = document.querySelector(`.main-page .${pageClass}`);
  if (page) page.classList.add("active");

  // نحي active من كل الأزرار
  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((b) => b.classList.remove("active"));

  // نحط active للزر اللي تكليك عليه
  btn.classList.add("active");
}

// إضافة الأحداث عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", () => {
  // التبويبات
  const tabButtons = document.querySelectorAll(".tab-btn");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const pageClass = btn.dataset.page;
      showPage(pageClass, btn);
    });
  });

  // عرض الصفحة الأولى افتراضياً
  if (tabButtons.length > 0) {
    const firstBtn = tabButtons[0];
    const pageClass = firstBtn.dataset.page;
    if (pageClass) {
      showPage(pageClass, firstBtn);
    }
  }

  // قائمة الكباب (القائمة المنسدلة)
  const kababIcons = document.querySelectorAll(".f-ic");

  kababIcons.forEach((icon) => {
    icon.addEventListener("click", (e) => {
      e.stopPropagation(); // منع انتشار الحدث

      const kababList = icon.nextElementSibling;
      const allLists = document.querySelectorAll(".kabab-list");

      // إغلاق جميع القوائم الأخرى
      allLists.forEach((list) => {
        if (list !== kababList) {
          list.style.display = "none";
        }
      });

      // فتح/إغلاق القائمة الحالية
      if (kababList.style.display === "block") {
        kababList.style.display = "none";
      } else {
        kababList.style.display = "block";
      }
    });
  });

  // إغلاق القائمة عند الضغط في أي مكان آخر
  document.addEventListener("click", () => {
    const allLists = document.querySelectorAll(".kabab-list");
    allLists.forEach((list) => {
      list.style.display = "none";
    });
  });
});
