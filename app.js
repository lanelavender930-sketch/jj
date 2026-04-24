const express = require("express");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();

// ========== Middleware ==========
app.use(cors());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// ========== Database Connection ==========
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "broo123",
  database: process.env.DB_NAME || "mydb",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error connecting to database:", err.message);
    return;
  }
  console.log("✅ MySQL connected with Node.js/Express");
});

// ========== Root Route ==========
app.get("/", (req, res) => {
  res.json({
    message: "مرحباً بك في API مشتل النباتات",
    status: "Backend شغال ✅",
    endpoints: {
      admin: "/admin",
      plants: "/plants",
      products: "/api/products",
      productById: "/api/products/:id",
      customers: "/custo",
      employees: "/getemplyee",
      tasks: "/tasks",
    },
  });
});

// ========== Admin Routes ==========
app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/public/admin.html");
});

app.post("/admin", (req, res) => {
  const { name, category, price, quantity, image } = req.body;
  const sql = `INSERT INTO plant (name, category, price, quantity, image) VALUES (?, ?, ?, ?, ?)`;
  db.query(sql, [name, category, price, quantity, image], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Database Error ❌");
    }
    res.redirect("/admin");
  });
});

// ========== Plant Routes ==========
app.get("/plants/count", (req, res) => {
  const sql = "SELECT COUNT(*) AS total FROM plant";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send("Database Error");
    res.json({ total: result[0].total });
  });
});

app.get("/plants", (req, res) => {
  const search = req.query.search;
  let sql = "SELECT * FROM plant";
  if (search) {
    sql += " WHERE name LIKE ? OR category LIKE ?";
    db.query(sql, [`%${search}%`, `%${search}%`], (err, result) => {
      if (err) return res.status(500).send("Database Error");
      res.json(result);
    });
  } else {
    db.query(sql, (err, result) => {
      if (err) return res.status(500).send("Database Error");
      res.json(result);
    });
  }
});

app.delete("/plant/:id", (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM plant WHERE plant_id = ?";
  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Error deleting plant" });
    }
    res.json({ message: "Plant deleted successfully" });
  });
});

// ========== Customer Routes ==========
app.get("/custo", (req, res) => {
  const sql = "SELECT COUNT(*) AS total FROM customer";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send("Database Error");
    res.json({ total: result[0].total });
  });
});

// ========== Employee Routes ==========
app.get("/getemplyee", (req, res) => {
  const sql = "SELECT * FROM employee";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send("Database Error");
    res.json(result);
  });
});

// ========== Task Routes ==========
app.get("/tasks", (req, res) => {
  const sql = "SELECT * FROM task";
  db.query(sql, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: "Database Error" });
    }
    res.json(result);
  });
});

app.post("/tasks", (req, res) => {
  const { title, assigned, job_type, due_date, due_time } = req.body;
  if (!title || !assigned || !job_type || !due_date) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  const sql = `INSERT INTO task (title, assigned, job_type, due_date, due_time) VALUES (?, ?, ?, ?, ?)`;
  db.query(
    sql,
    [title, assigned, job_type, due_date, due_time || "16:00"],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Database Error" });
      }
      res.status(201).json({ task_id: result.insertId });
    },
  );
});

// ========== Admin Orders Routes ==========
app.get("/api/admin/orders", (req, res) => {
  const { status } = req.query;

  // Validate status parameter (case insensitive)
  const validStatuses = ['pending', 'completed', 'canceled', 'cancelled'];
  if (status && !validStatuses.includes(status.toLowerCase())) {
    return res.status(400).json({ error: "Invalid status. Must be one of: pending, completed, canceled" });
  }

  let sql = `
    SELECT o.order_id, c.full_name AS customer_name, o.order_date, o.status
    FROM orders o
    JOIN customer c ON o.customer_id = c.id
  `;

  const params = [];
  if (status) {
    // Use case-insensitive matching
    sql += ` WHERE LOWER(o.status) = LOWER(?)`;
    params.push(status);
  }

  sql += ` ORDER BY o.order_date DESC`;

  db.query(sql, params, (err, results) => {
    if (err) {
      console.error("Error fetching orders:", err.message);
      return res.status(500).json({
        error: "Failed to fetch orders",
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    }

    res.json(results);
  });
});

app.get("/api/admin/order-items/:orderId", (req, res) => {
  const orderId = req.params.orderId;
  
  // Validate orderId
  if (!orderId || isNaN(orderId)) {
    return res.status(400).json({ error: "Invalid order ID" });
  }
  
  const sql = `
    SELECT p.name AS plant_name, oi.quantity, oi.price AS unit_price
    FROM order_details oi
    JOIN plant p ON oi.plant_id = p.plant_id
    WHERE oi.order_id = ?
  `;
  
  db.query(sql, [orderId], (err, results) => {
    if (err) {
      console.error("Error fetching order items:", err.message);
      return res.status(500).json({ 
        error: "Failed to fetch order items", 
        details: process.env.NODE_ENV === 'development' ? err.message : undefined 
      });
    }
    
    res.json(results);
  });
});

// ========== Order Details API Route ==========
app.get("/api/admin/orders/:id/details", (req, res) => {
  const orderId = req.params.id;
  console.log('Order details request for ID:', orderId);
  
  // Validate orderId
  if (!orderId || isNaN(orderId)) {
    console.log('Invalid order ID:', orderId);
    return res.status(400).json({ error: "Invalid order ID" });
  }

  // First, get order and customer details
  const orderQuery = `
    SELECT o.order_id, o.order_date, o.status,
           c.full_name, c.phone, c.address
    FROM orders o
    JOIN customer c ON o.customer_id = c.id
    WHERE o.order_id = ?
  `;

  db.query(orderQuery, [orderId], (err, orderResults) => {
    if (err) {
      console.error("Error fetching order details:", err.message);
      return res.status(500).json({ 
        error: "Failed to fetch order details", 
        details: process.env.NODE_ENV === 'development' ? err.message : undefined 
      });
    }

    console.log('Order query results:', orderResults.length, 'rows');

    if (orderResults.length === 0) {
      console.log('No order found for ID:', orderId);
      return res.status(404).json({ error: "Order not found" });
    }

    const order = orderResults[0];
    console.log('Order found:', order);

    // Then, get order items
    const itemsQuery = `
      SELECT oi.quantity, oi.price AS unit_price, p.name AS plant_name,
             (oi.quantity * oi.price) AS subtotal
      FROM order_details oi
      JOIN plant p ON oi.plant_id = p.plant_id
      WHERE oi.order_id = ?
    `;

    db.query(itemsQuery, [orderId], (err, itemsResults) => {
      if (err) {
        console.error("Error fetching order items:", err.message);
        return res.status(500).json({ 
          error: "Failed to fetch order items", 
          details: process.env.NODE_ENV === 'development' ? err.message : undefined 
        });
      }

      console.log('Items query results:', itemsResults.length, 'rows');

      // Calculate total amount from items
      const totalAmount = itemsResults.reduce((sum, item) => sum + parseFloat(item.subtotal), 0);
      console.log('Calculated total:', totalAmount);

      const response = {
        order: {
          ...order,
          total_amount: totalAmount
        },
        items: itemsResults
      };
      
      console.log('Sending response:', JSON.stringify(response, null, 2));
      res.json(response);
    });
  });
});

// ========== Admin Stats API Route ==========
app.get("/api/admin/stats", (req, res) => {
  console.log('Stats API called');
  // Get all stats in parallel
  const queries = {
    totalPlants: "SELECT COUNT(*) AS count FROM plant",
    totalCustomers: "SELECT COUNT(*) AS count FROM customer",
    pendingOrders: "SELECT COUNT(*) AS count FROM orders WHERE LOWER(status) = 'pending'",
    totalOrders: "SELECT COUNT(*) AS count FROM orders",
    lowStockPlants: "SELECT name FROM plant WHERE quantity < 5",
    newOrdersToday: "SELECT COUNT(*) AS count FROM orders WHERE LOWER(status) = 'pending' AND DATE(order_date) = CURDATE()"
  };

  const results = {};

  // Execute all queries
  const queryPromises = Object.entries(queries).map(([key, sql]) => {
    return new Promise((resolve, reject) => {
      db.query(sql, (err, result) => {
        if (err) {
          console.error(`Error in ${key} query:`, err.message);
          reject(err);
        } else {
          if (key === 'lowStockPlants') {
            results[key] = result.map(row => row.name);
          } else {
            results[key] = result[0].count || 0;
          }
          resolve();
        }
      });
    });
  });

  Promise.all(queryPromises)
    .then(() => {
      // Build alerts array
      const alerts = [];

      // Low stock alerts
      if (results.lowStockPlants.length > 0) {
        results.lowStockPlants.forEach(plantName => {
          alerts.push({
            type: 'low_stock',
            message: `${plantName} is low on stock`,
            icon: '⚠️',
            priority: 'warning'
          });
        });
      }

      // New orders today alert
      if (results.newOrdersToday > 0) {
        alerts.push({
          type: 'new_orders',
          message: `${results.newOrdersToday} new order${results.newOrdersToday > 1 ? 's' : ''} today`,
          icon: '🔔',
          priority: 'info'
        });
      }

      const response = {
        overview: {
          totalPlants: results.totalPlants,
          totalCustomers: results.totalCustomers,
          pendingOrders: results.pendingOrders,
          totalOrders: results.totalOrders
        },
        alerts: alerts
      };

      res.json(response);
    })
    .catch(err => {
      console.error("Error fetching stats:", err.message);
      res.status(500).json({
        error: "Failed to fetch stats",
        details: process.env.NODE_ENV === 'development' ? err.message : undefined
      });
    });
});

// ========== Admin Dashboard Summary API Route ==========
app.get("/api/admin/dashboard-summary", async (req, res) => {
  try {
    const queries = {
      totalOrders: "SELECT COUNT(*) AS count FROM orders",
      pendingOrders: "SELECT COUNT(*) AS count FROM orders WHERE LOWER(status) = 'pending'",
      totalRevenue: "SELECT COALESCE(SUM(oi.quantity * oi.price), 0.00) AS total FROM order_details oi JOIN orders o ON oi.order_id = o.order_id WHERE LOWER(o.status) = 'completed'",
      inventoryAlerts: "SELECT name, quantity FROM plant WHERE quantity < 5",
      urgentAlerts: "SELECT COUNT(*) AS count FROM orders WHERE LOWER(status) = 'pending' AND DATE(order_date) = CURDATE()",
      recentOrders: `
        SELECT o.order_id, c.full_name AS customer_name, o.status, 
               COALESCE(SUM(oi.quantity * oi.price), 0) AS total_amount
        FROM orders o
        JOIN customer c ON o.customer_id = c.id
        LEFT JOIN order_details oi ON o.order_id = oi.order_id
        GROUP BY o.order_id
        ORDER BY o.order_date DESC
        LIMIT 4
      `
    };

    const results = {};

    const queryPromises = Object.entries(queries).map(([key, sql]) => {
      return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
          if (err) return reject(err);
          
          if (key === 'inventoryAlerts' || key === 'recentOrders') {
            results[key] = result;
          } else {
            results[key] = result[0].count !== undefined ? result[0].count : result[0].total;
          }
          resolve();
        });
      });
    });

    await Promise.all(queryPromises);

    res.json({
      counters: {
        totalOrders: results.totalOrders,
        pendingOrders: results.pendingOrders,
        totalRevenue: results.totalRevenue
      },
      inventoryAlerts: results.inventoryAlerts,
      urgentAlerts: results.urgentAlerts,
      recentOrders: results.recentOrders
    });

  } catch (err) {
    console.error("Error fetching dashboard summary:", err.message);
    res.status(500).json({ error: "Failed to fetch dashboard summary" });
  }
});

// ========== Customer API (Products) Routes ==========
app.get("/api/products", (req, res) => {
  const sql = "SELECT * FROM products";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

app.get("/api/products/:id", (req, res) => {
  const sql = "SELECT * FROM products WHERE id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) {
      return res.status(404).json({ message: "المنتج غير موجود" });
    }
    res.json(result[0]);
  });
});

// ========== Start Server ==========
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
