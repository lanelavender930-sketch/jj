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
  loadUsers();
  load_employees();
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
const popup = document.querySelector(".popup_modul:not(.popup_employee)");
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
  const employeePopup = document.getElementById("add-employee-popup");
  if (employeePopup) employeePopup.classList.remove("active");
  const taskPopup = document.getElementById("add-task-popup");
  if (taskPopup) taskPopup.classList.remove("active");
});

// Add Employee popup
const addEmployeeBtn = document.getElementById("add-employee-btn");
const addEmployeePopup = document.getElementById("add-employee-popup");
const closeEmployeeBtn = document.getElementById("close_employee_btn");
const addEmployeeForm = document.getElementById("add-employee-form");
const employeesTableBody = document.getElementById("employees-table-body");

if (addEmployeeBtn && addEmployeePopup) {
  addEmployeeBtn.addEventListener("click", () => {
    overlay.classList.add("active");
    addEmployeePopup.classList.add("active");
  });
}

if (closeEmployeeBtn && addEmployeePopup) {
  closeEmployeeBtn.addEventListener("click", () => {
    overlay.classList.remove("active");
    addEmployeePopup.classList.remove("active");
  });
}

if (addEmployeeForm && employeesTableBody) {
  addEmployeeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = document.getElementById("employee_name").value.trim();
    const role = document.getElementById("employee_role").value;
    const email = document.getElementById("employee_email").value.trim();
    const status = document.getElementById("employee_status").value;
    if (!name || !role || !email) return;
    const statusClass =
      status === "Active" ? "badge--delivered" : "badge--processing";
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${name}</td>
      <td>${role}</td>
      <td>${email}</td>
      <td><span class="badge ${statusClass}">${status}</span></td>
      <td>
        <button type="button" class="edit-ic" style="border:none;background:transparent;cursor:pointer;padding:4px 8px;" title="Edit"><i class="fa-solid fa-pen-to-square"></i></button>
        <button type="button" class="del-ic" style="border:none;background:transparent;cursor:pointer;padding:4px 8px;color:#ff2828;" title="Delete"><i class="fa-solid fa-trash"></i></button>
      </td>`;
    employeesTableBody.appendChild(row);
    addEmployeeForm.reset();
    overlay.classList.remove("active");
    addEmployeePopup.classList.remove("active");
  });
}

// Add Task popup
const addTaskBtn = document.getElementById("add-task-btn");
const addTaskPopup = document.getElementById("add-task-popup");
const closeTaskBtn = document.getElementById("close_task_btn");
const addTaskForm = document.getElementById("add-task-form");

if (addTaskBtn && addTaskPopup) {
  addTaskBtn.addEventListener("click", () => {
    overlay.classList.add("active");
    addTaskPopup.classList.add("active");
  });
}

if (closeTaskBtn && addTaskPopup) {
  closeTaskBtn.addEventListener("click", () => {
    overlay.classList.remove("active");
    addTaskPopup.classList.remove("active");
  });
}

if (addTaskForm) {
  addTaskForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("task_title").value.trim();
    const assigned = document.getElementById("task_assigned").value;
    const dueDate = document.getElementById("task_due_date").value;
    const dueTime = document.getElementById("task_due_time").value || "16:00";
    if (!title || !dueDate) return;
    const dueLabel = formatDueLabel(dueDate, dueTime);
    const todoColumn = document.querySelector(
      ".tasks-page .out-block .in-block",
    );
    const addTaskBtnEl = document.getElementById("add-task-btn");
    if (!todoColumn || !addTaskBtnEl) return;
    const card = document.createElement("div");
    card.className = "block";
    card.innerHTML = `<h3 class="in-h">${escapeHtml(title)}</h3><p class="p-tit task-assigned"><i class="fa-solid fa-user"></i> ${escapeHtml(assigned)}</p><p class="p-tit">Due: ${escapeHtml(dueLabel)}</p>`;
    todoColumn.insertBefore(card, addTaskBtnEl);
    addTaskForm.reset();
    document.getElementById("task_due_time").value = "16:00";
    overlay.classList.remove("active");
    addTaskPopup.classList.remove("active");
  });
}

function formatDueLabel(dateStr, timeStr) {
  const d = new Date(dateStr + "T" + (timeStr || "00:00"));
  const today = new Date();
  const isToday = d.toDateString() === today.toDateString();
  const datePart = isToday
    ? "Today"
    : d.toLocaleDateString(undefined, {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
  const timePart = timeStr
    ? new Date("2000-01-01T" + timeStr).toLocaleTimeString(undefined, {
        hour: "numeric",
        minute: "2-digit",
      })
    : "";
  return timePart ? `${datePart}, ${timePart}` : datePart;
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

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

async function load_plants(search = "") {
  const res = await fetch(`/plants?search=${search}`);
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
async function loadUsers() {
  const res = await fetch("/custo");
  const data = await res.json();
  const count_user = document.getElementById("customer_count");
  count_user.textContent = `${data.total}`;
}
function deletePlant(id) {
  if (confirm("Are you sure?")) {
    fetch(`/plant/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then(() => location.reload());
  }
}
const search_inp = document.getElementById("search_inp");

search_inp.addEventListener("input", function () {
  const value = this.value;
  load_plants(value);
});
async function load_employees() {
  const res = await fetch("/getemplyee");
  const employee = await res.json();
  const employee_body = document.getElementById("employees-table-body");

  employee.forEach((employee) => {
    if (employee.status == "active") {
      statusClass = "delivered";
    } else {
      statusClass = "processing";
    }
    row = `<tr>
                  <td>${employee.name}</td>
                  <td>${employee.role}</td>
                  <td>${employee.email}</td>
                  <td><span class="badge badge--${statusClass}">${employee.statu}</span></td>
                  <td>
                    <button type="button" class="edit-ic" oncklick="edit_employee(${employee.employee_id})"title="Edit">
                      <i class="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button type="button" class="del-ic" oncklick="delete_employee(${employee.employee_id})" title="Delete">
                      <i class="fa-solid fa-trash"></i>
                    </button>
                  </td>
                </tr>`;
    employee_body.innerHTML += row;
  });
}
