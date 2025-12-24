let nav_item = document.querySelectorAll(".nav-item");
let page = document.querySelectorAll(".page");
nav_item.forEach((item) => {
  item.addEventListener("click", () => {
    nav_item.forEach((i) => i.classList.remove("active"));
    page.forEach((p) => p.classList.remove("active"));
    item.classList.add("active");
    let sel_page = item.getAttribute("data-page");
    document.getElementById(sel_page).classList.add("active");
  });
});
