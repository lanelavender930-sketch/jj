function showPage(pageClass, btn) {
  const pages = document.querySelectorAll(".main-page .page");
  pages.forEach((page) => page.classList.remove("active"));

  const page = document.querySelector(`.main-page .${pageClass}`);
  if (page) page.classList.add("active");

  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((b) => b.classList.remove("active"));

  btn.classList.add("active");
}

document.addEventListener("DOMContentLoaded", () => {
  // التبويبات
  const tabButtons = document.querySelectorAll(".tab-btn");

  tabButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const pageClass = btn.dataset.page;
      showPage(pageClass, btn);
    });
  });

  if (tabButtons.length > 0) {
    const firstBtn = tabButtons[0];
    const pageClass = firstBtn.dataset.page;
    if (pageClass) showPage(pageClass, firstBtn);
  }

  load_plants();
  loadPlantCount();
});

// kabab delegation
document.addEventListener("click", (e) => {
  const icon = e.target.closest(".f-ic");

  if (icon) {
    e.stopPropagation();
    const kababList = icon.nextElementSibling;
    const allLists = document.querySelectorAll(".kabab-list");

    allLists.forEach((list) => {
      if (list !== kababList) list.style.display = "none";
    });

    kababList.style.display =
      kababList.style.display === "block" ? "none" : "block";
    return;
  }

  document.querySelectorAll(".kabab-list").forEach((list) => {
    list.style.display = "none";
  });
});

const addBtn = document.getElementById("add-btn");
const overlay = document.getElementById("b-overlay");
const popup = document.querySelector(".popup_modul");
const close_btn = document.querySelector("#close_btn");

addBtn.addEventListener("click", () => {
  overlay.classList.add("active");
  popup.classList.add("active");
});

close_btn.addEventListener("click", () => {
  overlay.classList.remove("active");
  popup.classList.remove("active");
});

overlay.addEventListener("click", () => {
  overlay.classList.remove("active");
  popup.classList.remove("active");
});

const dropArea = document.getElementById("prod_img");
const fileInput = document.getElementById("fileInput");
const preview = document.getElementById("preview");
const text = document.getElementById("pr_txt");

dropArea.addEventListener("click", () => {
  fileInput.click();
});

fileInput.addEventListener("change", () => {
  const file = fileInput.files[0];
  if (file && file.type.startsWith("image/")) {
    preview.src = URL.createObjectURL(file);
    preview.style.display = "block";
    text.style.display = "none";
  }
});

async function load_plants() {
  const res = await fetch("/plants");
  const plants = await res.json();
  const tableBody = document.getElementById("plant-table-body");
  tableBody.innerHTML = "";

  plants.forEach((plant) => {
    let statusClass = "in-stack";
    let statusText = "in-stock";
    if (plant.quantity == 0) {
      statusClass = "out-of-stack";
      statusText = "out-of-stock";
    } else if (plant.quantity <= 10) {
      statusClass = "low-stack";
      statusText = "low-stock";
    }

    const row = `
      <tr>
        <td>${plant.name}</td>
        <td>${plant.category}</td>
        <td>$${plant.price}</td>
        <td>${plant.quantity}</td>
        <td><span class="badge ${statusClass}">${statusText}</span></td>
        <td>
          <div class="kabab-ic">
            <i class="f-ic fa-solid fa-ellipsis"></i>
            <ul class="kabab-list">
              <li><h3>Actions</h3></li>
              <li>
                <button class="edit-ic" onclick="editPlant(${plant.plant_id})">
                  <i class="fa-solid fa-pen-to-square"></i>
                  <p>Edit product</p>
                </button>
              </li>
              <li>
                <button class="upd-ic" onclick="updateStock(${plant.plant_id})">
                  <i class="fa-solid fa-box"></i>
                  <p>Update Stock</p>
                </button>
              </li>
              <hr />
              <li>
                <button class="del-ic" onclick="deletePlant(${plant.plant_id})">
                  <i class="fa-solid fa-trash"></i>
                  <p>Delete</p>
                </button>
              </li>
            </ul>
          </div>
        </td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

async function loadPlantCount() {
  const res = await fetch("/plants/count");
  const data = await res.json();
  const countElem = document.getElementById("plant_count");
  countElem.textContent = `${data.total}`;
}
