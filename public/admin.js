const API_BASE = 'http://localhost:3000';

function showPage(pageClass, btn) {
  const pages = document.querySelectorAll(".main-page .page");
  pages.forEach((page) => page.classList.remove("active"));

  const page = document.querySelector(`.main-page .${pageClass}`);
  if (page) page.classList.add("active");

  const buttons = document.querySelectorAll(".tab-btn");
  buttons.forEach((b) => b.classList.remove("active"));

  btn.classList.add("active");
  
  // Load stats when overview page is shown
  if (pageClass === 'overview-page') {
    hydrateDashboard();
  }
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
  
  // Attach modal event listeners
  attachModalEventListeners();
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

if (addBtn && overlay && popup) {
  addBtn.addEventListener("click", () => {
    overlay.classList.add("active");
    popup.classList.add("active");
  });
}

if (close_btn && overlay && popup) {
  close_btn.addEventListener("click", () => {
    overlay.classList.remove("active");
    popup.classList.remove("active");
  });
}

if (overlay) {
  overlay.addEventListener("click", () => {
    overlay.classList.remove("active");
    if (popup) popup.classList.remove("active");
    const employeePopup = document.getElementById("add-employee-popup");
    if (employeePopup) employeePopup.classList.remove("active");
    const taskPopup = document.getElementById("add-task-popup");
    if (taskPopup) taskPopup.classList.remove("active");
  });
}

// Add Employee popup
const addEmployeeBtn = document.getElementById("add-employee-btn");
const addEmployeePopup = document.getElementById("add-employee-popup");
const closeEmployeeBtn = document.getElementById("close_employee_btn");
const addEmployeeForm = document.getElementById("add-employee-form");
const employeesTableBody = document.getElementById("employees-table-body");

if (addEmployeeBtn && addEmployeePopup) {
  addEmployeeBtn.addEventListener("click", () => {
    if (overlay) overlay.classList.add("active");
    addEmployeePopup.classList.add("active");
  });
}

if (closeEmployeeBtn && addEmployeePopup) {
  closeEmployeeBtn.addEventListener("click", () => {
    if (overlay) overlay.classList.remove("active");
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
    if (overlay) overlay.classList.remove("active");
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
    if (overlay) overlay.classList.add("active");
    addTaskPopup.classList.add("active");
  });
}

if (closeTaskBtn && addTaskPopup) {
  closeTaskBtn.addEventListener("click", () => {
    if (overlay) overlay.classList.remove("active");
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
    if (overlay) overlay.classList.remove("active");
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

if (dropArea && fileInput) {
  dropArea.addEventListener("click", () => {
    fileInput.click();
  });
}

if (fileInput && preview && text) {
  fileInput.addEventListener("change", () => {
    const file = fileInput.files[0];
    if (file && file.type.startsWith("image/")) {
      preview.src = URL.createObjectURL(file);
      preview.style.display = "block";
      text.style.display = "none";
    }
  });
}

async function load_plants(search = "") {
  try {
    const res = await fetch(`${API_BASE}/plants?search=${encodeURIComponent(search)}`);
    if (!res.ok) throw new Error('Failed to fetch plants');
    
    const plants = await res.json();
    const tableBody = document.getElementById("plant-table-body");
    if (!tableBody) return;
    
    tableBody.innerHTML = "";

    if (plants.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:20px;">No plants found</td></tr>`;
      return;
    }

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
          <td>${plant.name || '-'}</td>
          <td>${plant.category || '-'}</td>
          <td>$${plant.price || '0'}</td>
          <td>${plant.quantity || 0}</td>
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
  } catch (error) {
    console.error('Error loading plants:', error);
    const tableBody = document.getElementById("plant-table-body");
    if (tableBody) {
      tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;color:red;">Error loading plants</td></tr>`;
    }
  }
}

async function loadPlantCount() {
  try {
    const res = await fetch(`${API_BASE}/plants/count`);
    if (!res.ok) throw new Error('Failed to fetch count');
    
    const data = await res.json();
    const countElem = document.getElementById("plant_count");
    if (countElem) {
      countElem.textContent = `${data.total || 0}`;
    }
  } catch (error) {
    console.error('Error loading plant count:', error);
  }
}
async function loadUsers() {
  try {
    const res = await fetch(`${API_BASE}/custo`);
    if (!res.ok) throw new Error('Failed to fetch customers');
    
    const data = await res.json();
    const count_user = document.getElementById("customer_count");
    if (count_user) {
      count_user.textContent = `${data.total || 0}`;
    }
  } catch (error) {
    console.error('Error loading users:', error);
  }
}
function deletePlant(id) {
  if (confirm("Are you sure you want to delete this plant?")) {
    fetch(`${API_BASE}/plant/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(data => {
        load_plants();
        loadPlantCount();
      })
      .catch(err => console.error('Delete error:', err));
  }
}
const search_inp = document.getElementById("search_inp");

if (search_inp) {
  search_inp.addEventListener("input", function () {
    const value = this.value;
    load_plants(value);
  });
}
async function load_employees() {
  try {
    const res = await fetch(`${API_BASE}/getemplyee`);
    if (!res.ok) throw new Error('Failed to fetch employees');
    
    const employees = await res.json();
    const employee_body = document.getElementById("employees-table-body");
    if (!employee_body) return;

    employee_body.innerHTML = "";
    
    if (employees.length === 0) {
      employee_body.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:20px;">No employees found</td></tr>`;
      return;
    }

    employees.forEach((employee) => {
      const statusClass = employee.status == "active" ? "delivered" : "processing";
      const statusText = employee.status || 'Unknown';
      
      const row = `<tr>
        <td>${employee.name || '-'}</td>
        <td>${employee.role || '-'}</td>
        <td>${employee.email || '-'}</td>
        <td><span class="badge badge--${statusClass}">${statusText}</span></td>
        <td>
          <button type="button" class="edit-ic" onclick="edit_employee(${employee.employee_id})" title="Edit">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button type="button" class="del-ic" onclick="delete_employee(${employee.employee_id})" title="Delete">
            <i class="fa-solid fa-trash"></i>
          </button>
        </td>
      </tr>`;
      employee_body.innerHTML += row;
    });
  } catch (error) {
    console.error('Error loading employees:', error);
  }
}
/* showing nav search */
document.addEventListener("DOMContentLoaded", () => {
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
});

// ========== Orders Management ==========
async function loadOrders(status = 'pending') {
  try {
    const res = await fetch(`${API_BASE}/api/admin/orders?status=${status}`);
    if (!res.ok) throw new Error('Failed to fetch orders');
    
    const orders = await res.json();
    const tableBody = document.getElementById("orders-table-body");
    if (!tableBody) return;
    
    tableBody.innerHTML = "";

    if (orders.length === 0) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;padding:20px;">No ${status} orders found</td></tr>`;
      return;
    }

    orders.forEach((order) => {
      const formattedDate = formatOrderDate(order.order_date);
      const statusClass = getStatusClass(order.status);
      
      const row = `
        <tr>
          <td>${order.order_id}</td>
          <td>${order.customer_name}</td>
          <td>${formattedDate}</td>
          <td><span class="badge ${statusClass}">${order.status}</span></td>
          <td>
            <button class="view-details-btn" onclick="viewOrderDetails(${order.order_id})" style="background: var(--green); color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
              <i class="bi bi-eye"></i> View Details
            </button>
          </td>
        </tr>
      `;
      tableBody.innerHTML += row;
    });
  } catch (error) {
    console.error('Error loading orders:', error);
    const tableBody = document.getElementById("orders-table-body");
    if (tableBody) {
      tableBody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:red;">Error loading orders</td></tr>`;
    }
  }
}

function formatOrderDate(dateStr) {
  const date = new Date(dateStr);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

function getStatusClass(status) {
  switch (status.toLowerCase()) {
    case 'pending':
      return 'badge--processing';
    case 'completed':
      return 'badge--delivered';
    case 'canceled':
      return 'badge--pending'; // using pending class for canceled, or we can add a new class
    default:
      return 'badge--processing';
  }
}

// ========== View Order Details Function ==========
async function viewOrderDetails(orderId) {
  try {
    // Show loading state
    const modal = document.getElementById('order-modal');
    const modalBody = document.querySelector('.modal-body');
    const originalContent = modalBody.innerHTML;
    
    modalBody.innerHTML = `
      <div class="loading-container" style="text-align: center; padding: 40px;">
        <div class="loading-spinner" style="display: inline-block; width: 40px; height: 40px; border: 4px solid #f3f3f3; border-top: 4px solid var(--green); border-radius: 50%; animation: spin 1s linear infinite; margin-bottom: 20px;"></div>
        <p style="color: #666; font-size: 16px;">Loading order details...</p>
      </div>
    `;
    
    modal.style.display = 'block';
    
    const res = await fetch(`${API_BASE}/api/admin/orders/${orderId}/details`);
    if (!res.ok) throw new Error('Failed to fetch order details');
    
    const data = await res.json();
    const { order, items } = data;
    
    // Restore original content structure (remove loading)
    modalBody.innerHTML = `
      <!-- Order Info Section -->
      <div class="order-info-section">
        <div class="order-id-display">
          <span class="order-label">Order ID:</span>
          <span id="modal-order-id" class="order-value">#--</span>
        </div>
      </div>

      <!-- Customer Info Section -->
      <div class="customer-info-section">
        <h4>Customer Information</h4>
        <div class="customer-details">
          <div class="customer-field">
            <span class="field-label">Name:</span>
            <span id="modal-customer-name" class="field-value">--</span>
          </div>
          <div class="customer-field">
            <span class="field-label">Phone:</span>
            <span id="modal-customer-phone" class="field-value">--</span>
          </div>
        </div>
      </div>

      <!-- Order Items Section -->
      <div class="order-items-section">
        <h4>Order Items</h4>
        <div class="items-table-container">
          <table class="order-items-table">
            <thead>
              <tr>
                <th>Plant Name</th>
                <th>Quantity</th>
                <th>Unit Price</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody id="modal-order-items">
              <!-- Order items will be populated here -->
            </tbody>
          </table>
        </div>
      </div>
    `;
    
    // Now populate the data with safety checks
    const orderIdElement = document.getElementById('modal-order-id');
    const customerNameElement = document.getElementById('modal-customer-name');
    const customerPhoneElement = document.getElementById('modal-customer-phone');
    const itemsTableBody = document.getElementById('modal-order-items');
    const totalAmountElement = document.getElementById('modal-total-amount');
    
    if (orderIdElement) orderIdElement.textContent = `#${order.order_id}`;
    if (customerNameElement) customerNameElement.textContent = order.full_name;
    if (customerPhoneElement) customerPhoneElement.textContent = order.phone || 'Not provided';
    
    if (itemsTableBody) {
      itemsTableBody.innerHTML = '';
      
      let totalOrderPrice = 0;
      
      items.forEach((item) => {
        const unitPrice = Number(item.unit_price);
        const subtotal = Number(item.subtotal);
        totalOrderPrice += subtotal;
        
        const row = `
          <tr>
            <td class="plant-name">${item.plant_name}</td>
            <td class="quantity">${item.quantity}</td>
            <td class="unit-price">$${unitPrice.toFixed(2)}</td>
            <td class="subtotal">$${subtotal.toFixed(2)}</td>
          </tr>
        `;
        itemsTableBody.innerHTML += row;
      });
      
      if (totalAmountElement) totalAmountElement.textContent = `$${totalOrderPrice.toFixed(2)}`;
    }
    
  } catch (error) {
    console.error('Error loading order details:', error);
    
    // Show error in modal
    const modalBody = document.querySelector('.modal-body');
    if (modalBody) {
      modalBody.innerHTML = `
        <div class="error-container" style="text-align: center; padding: 40px; color: #d32f2f;">
          <i class="bi bi-exclamation-triangle" style="font-size: 48px; margin-bottom: 20px;"></i>
          <h3 style="margin-bottom: 10px;">Failed to Load Order Details</h3>
          <p style="color: #666;">Please try again later.</p>
          <button onclick="closeOrderModal()" style="margin-top: 20px; padding: 10px 20px; background: var(--green); color: white; border: none; border-radius: 5px; cursor: pointer;">Close</button>
        </div>
      `;
    }
    
    const modal = document.getElementById('order-modal');
    if (modal) modal.style.display = 'block';
  }
}

// ========== Close Order Modal Function ==========
function closeOrderModal() {
  const modal = document.getElementById('order-modal');
  modal.style.display = 'none';
}

// ========== Print Order Function ==========
function printOrder() {
  const printContent = document.querySelector('.modal-container').innerHTML;
  const originalContent = document.body.innerHTML;
  
  document.body.innerHTML = `
    <div style="padding: 20px; font-family: Arial, sans-serif;">
      <h2 style="color: var(--green); text-align: center; margin-bottom: 30px;">Order Receipt</h2>
      ${printContent}
    </div>
  `;
  
  window.print();
  document.body.innerHTML = originalContent;
  
  // Re-attach event listeners after restoring content
  attachModalEventListeners();
}

// ========== Attach Modal Event Listeners ==========
function attachModalEventListeners() {
  // Close modal when clicking the X button
  const closeBtn = document.getElementById('close-order-modal');
  if (closeBtn) {
    closeBtn.onclick = closeOrderModal;
  }
  
  // Close modal when clicking the Close button in footer
  const closeFooterBtn = document.getElementById('close-modal-btn');
  if (closeFooterBtn) {
    closeFooterBtn.onclick = closeOrderModal;
  }
  
  // Close modal when clicking outside (on backdrop)
  const modal = document.getElementById('order-modal');
  if (modal) {
    modal.onclick = function(event) {
      if (event.target === modal) {
        closeOrderModal();
      }
    };
  }
  
  // Print button
  const printBtn = document.getElementById('print-order-btn');
  if (printBtn) {
    printBtn.onclick = printOrder;
  }
}

async function loadHistory() {
  try {
    // Fetch completed orders
    const completedRes = await fetch(`${API_BASE}/api/admin/orders?status=completed`);
    if (!completedRes.ok) throw new Error('Failed to fetch completed orders');
    const completedOrders = await completedRes.json();

    // Fetch canceled orders
    const canceledRes = await fetch(`${API_BASE}/api/admin/orders?status=cancelled`);
    if (!canceledRes.ok) throw new Error('Failed to fetch canceled orders');
    const canceledOrders = await canceledRes.json();

    const allHistoryOrders = [...completedOrders, ...canceledOrders].sort((a, b) => new Date(b.order_date) - new Date(a.order_date));

    const historyCards = document.getElementById("history-cards");
    if (!historyCards) return;

    if (allHistoryOrders.length === 0) {
      historyCards.innerHTML = `<div style="text-align:center;padding:40px;color:#666;font-size:14px;">No completed or canceled orders found</div>`;
      return;
    }

    let html = '';

    allHistoryOrders.forEach((order) => {
      const formattedDate = formatOrderDate(order.order_date);
      const statusClass = order.status.toLowerCase() === 'completed' ? 'completed' : 'canceled';

      html += `
        <div class="history-card ${statusClass}">
          <div class="history-card-header">
            <p class="history-order-id">#${order.order_id}</p>
            <span class="history-status">${order.status}</span>
          </div>
          <p class="history-customer-name">${order.customer_name}</p>
          <p class="history-date">${formattedDate}</p>
          <div class="history-card-footer">
            <button class="view-details-btn" onclick="viewOrderDetails(${order.order_id})">
              <i class="bi bi-eye"></i> View Details
            </button>
          </div>
        </div>
      `;
    });

    historyCards.innerHTML = html;
  } catch (error) {
    console.error('Error loading history:', error);
    const historyCards = document.getElementById("history-cards");
    if (historyCards) {
      historyCards.innerHTML = `<div style="text-align:center;color:red;padding:40px;font-size:14px;">Error loading order history</div>`;
    }
  }
}

// Close modal
document.addEventListener("DOMContentLoaded", () => {
  const modal = document.getElementById("order-modal");
  const closeBtn = document.getElementById("close-order-modal");
  const closeModalBtn = document.getElementById("close-modal-btn");
  
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      if (modal) modal.style.display = "none";
    });
  }
  
  if (closeModalBtn) {
    closeModalBtn.addEventListener("click", () => {
      if (modal) modal.style.display = "none";
    });
  }
  
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.style.display = "none";
      }
    });
  }
  
  // History drawer
  const historyBtn = document.getElementById("his-btn");
  const historyDrawer = document.getElementById("history-drawer");
  const historyOverlay = document.getElementById("history-drawer-overlay");
  const closeHistoryDrawerBtn = document.getElementById("close-history-drawer");

  if (historyBtn) {
    historyBtn.addEventListener("click", async () => {
      await loadHistory();
      if (historyDrawer) historyDrawer.classList.add("active");
      if (historyOverlay) historyOverlay.classList.add("active");
    });
  }

  if (closeHistoryDrawerBtn) {
    closeHistoryDrawerBtn.addEventListener("click", () => {
      if (historyDrawer) historyDrawer.classList.remove("active");
      if (historyOverlay) historyOverlay.classList.remove("active");
    });
  }

  if (historyOverlay) {
    historyOverlay.addEventListener("click", () => {
      if (historyDrawer) historyDrawer.classList.remove("active");
      if (historyOverlay) historyOverlay.classList.remove("active");
    });
  }
  
  // Load orders when orders tab is clicked
  const ordersTab = document.querySelector('[data-page="orders-page"]');
  if (ordersTab) {
    ordersTab.addEventListener("click", () => {
      setTimeout(() => loadOrders('pending'), 100); // Small delay to ensure page is shown
    });
  }

  // Load stats and alerts on page load
  hydrateDashboard();
});

// ========== Hydrate Dashboard Function ==========
async function hydrateDashboard() {
  try {
    const res = await fetch(`${API_BASE}/api/admin/dashboard-summary`);
    if (!res.ok) throw new Error('Failed to fetch dashboard summary');
    
    const data = await res.json();
    
    // Update Overview Cards
    updateDashboardCards(data.counters);
    
    // Update Alerts
    updateDashboardAlerts(data.inventoryAlerts, data.urgentAlerts);

    // Update Recent Orders
    updateRecentOrders(data.recentOrders, data.counters.pendingOrders);
    
  } catch (error) {
    console.error('Error hydrating dashboard:', error);
  }
}

function updateDashboardCards(counters) {
  // Format currency (DA)
  const currencyFormatter = new Intl.NumberFormat('en-DZ', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 2
  });

  const totalRevenueElem = document.getElementById('total_revenue');
  if (totalRevenueElem) {
    totalRevenueElem.textContent = currencyFormatter.format(counters.totalRevenue || 0).replace('DZD', 'DA');
  }

  const totalOrdersElem = document.getElementById('total_orders');
  if (totalOrdersElem) {
    totalOrdersElem.textContent = counters.totalOrders || 0;
  }

  const pendingOrdersElem = document.getElementById('pending_orders');
  if (pendingOrdersElem) {
    pendingOrdersElem.textContent = counters.pendingOrders || 0;
  }
}

function updateDashboardAlerts(inventoryAlerts, urgentAlerts) {
  const alertsContainer = document.getElementById('alerts-container');
  if (!alertsContainer) return;
  
  // Keep the header h3 and p, remove existing al-block
  const headers = Array.from(alertsContainer.children).filter(el => el.tagName === 'H3' || el.tagName === 'P');
  alertsContainer.innerHTML = '';
  headers.forEach(h => alertsContainer.appendChild(h));
  
  let alertsCount = 0;

  // Urgent Alerts (Orders pending from today)
  if (urgentAlerts > 0) {
    alertsCount++;
    const urgentDiv = document.createElement('div');
    urgentDiv.className = 'al-block critical';
    urgentDiv.innerHTML = `
      <i class="fa-solid fa-circle-exclamation" style="font-size:24px;"></i>
      <div>
        <h3 style="color:#ef4444;">Urgent: New Orders</h3>
        <p>You have ${urgentAlerts} new order(s) placed today awaiting fulfillment.</p>
      </div>
      <button onclick="document.querySelector('[data-page=\\'orders-page\\']').click()">view</button>
    `;
    alertsContainer.appendChild(urgentDiv);
  }

  // Inventory Alerts (Low Stock)
  if (inventoryAlerts && inventoryAlerts.length > 0) {
    const lowStockCount = inventoryAlerts.length;
    const maxDisplay = 3;
    const toDisplay = inventoryAlerts.slice(0, maxDisplay);

    toDisplay.forEach(alert => {
      alertsCount++;
      const warningDiv = document.createElement('div');
      warningDiv.className = 'al-block warning';
      warningDiv.innerHTML = `
        <i class="fa-regular fa-clock" style="font-size:24px;"></i>
        <div>
          <h3 style="color:#f59e0b;">Low Stock: ${alert.name}</h3>
          <p>Only ${alert.quantity} unit(s) remaining in inventory.</p>
        </div>
        <button onclick="document.querySelector('[data-page=\\'products-page\\']').click()">restock</button>
      `;
      alertsContainer.appendChild(warningDiv);
    });

    if (lowStockCount > maxDisplay) {
      const seeMoreDiv = document.createElement('div');
      seeMoreDiv.style.textAlign = 'center';
      seeMoreDiv.style.marginTop = '10px';
      seeMoreDiv.innerHTML = `<a href="#" onclick="document.querySelector('[data-page=\\'products-page\\']').click(); return false;" style="color: var(--green); font-weight: 600; text-decoration: none;">See more (${lowStockCount - maxDisplay} additional low stock items)</a>`;
      alertsContainer.appendChild(seeMoreDiv);
    }
  }

  // If no alerts at all
  if (alertsCount === 0) {
    const safeDiv = document.createElement('div');
    safeDiv.className = 'al-block safe';
    safeDiv.innerHTML = `
      <i class="fa-regular fa-circle-check" style="font-size:24px; color:var(--green);"></i>
      <div>
        <h3>All clear!</h3>
        <p>No inventory or urgent alerts at this time.</p>
      </div>
    `;
    alertsContainer.appendChild(safeDiv);
  }
}

function updateRecentOrders(recentOrders, pendingCount) {
  const pendingTextElem = document.getElementById('recent_pending_text');
  if (pendingTextElem) {
    pendingTextElem.textContent = `You have ${pendingCount || 0} order(s) pending shipment.`;
  }

  const tableBody = document.getElementById('recent_orders_body');
  if (!tableBody) return;

  tableBody.innerHTML = '';

  if (!recentOrders || recentOrders.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="4" style="text-align:center; padding:15px;">No recent orders</td></tr>';
    return;
  }

  const currencyFormatter = new Intl.NumberFormat('en-DZ', {
    style: 'currency',
    currency: 'DZD',
    minimumFractionDigits: 2
  });

  recentOrders.forEach(order => {
    const statusClass = getStatusClass(order.status);
    const formattedTotal = currencyFormatter.format(order.total_amount || 0).replace('DZD', 'DA');
    const row = `
      <tr>
        <td>#${order.order_id}</td>
        <td>${order.customer_name}</td>
        <td><span class="badge ${statusClass}">${order.status}</span></td>
        <td>${formattedTotal}</td>
      </tr>
    `;
    tableBody.innerHTML += row;
  });
}

// Start polling every 5 minutes (300,000 ms)
setInterval(() => {
  hydrateDashboard();
}, 300000);