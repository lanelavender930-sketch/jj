const express = require("express");
const app = express();
const mysql = require("mysql2");
app.use(express.static("public"));
app.use(express.urlencoded());
app.use(express.json());
const db = mysql.createConnection({
  host: "localhost",
  user: "root", // المستخدم الافتراضي في MySQL هو root
  password: "broo123", // اتركها فارغة إذا لم تضع كلمة سر
  database: "mydb", // اسم قاعدة البيانات التي أنشأتها
});
db.connect((err) => {
  if (err) {
    console.log("error in database connecting");
    return;
  }
  console.log("database connected");
});

app.get("/admin", (req, res) => {
  res.sendFile(__dirname + "/public/admin.html");
});
app.post("/admin", (req, res) => {
  const { name, category, price, quantity, image } = req.body;
  const add_prod_sql = `INSERT INTO plant (name, category, price, quantity, image)
    VALUES (?, ?, ?, ?, ?)`;
  db.query(
    add_prod_sql,
    [name, category, price, quantity, image],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).send("Database Error ❌");
      }

      res.status(201).send("Plant Added Successfully ✅");
    },
  );
});
app.get("/plants/count", (req, res) => {
  const sql = "SELECT COUNT(*) AS total FROM plant";
  db.query(sql, (err, result) => {
    if (err) return res.status(500).send("Database Error");
    res.json({ total: result[0].total });
  });
});
app.get("/plants", (req, res) => {
  const sel_prod_sql = "select * from plant";
  db.query(sel_prod_sql, (err, result) => {
    if (err) return res.status(500).send("database error");
    res.json(result);
  });
});
app.listen(3000, () => {
  console.log("listening on port3000");
});
