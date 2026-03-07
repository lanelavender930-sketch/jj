const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// اتصال قاعدة البيانات
const db = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
}).promise();

// اختبار الاتصال بقاعدة البيانات
const testConnection = async () => {
    try {
        const [rows] = await db.query('SELECT 1 + 1 AS result');
        console.log('✅ MySQL connected with Node.js/Express');
    } catch (error) {
        console.error('❌ Error connecting: ', error.message);
    }
};
testConnection();

// ========== Routes ==========

// الصفحة الرئيسية (أضف هذا الكود)
app.get('/', (req, res) => {
    res.json({ 
        message: 'مرحباً بك في API مشتل النباتات',
        status: 'Backend شغال ✅',
        endpoints: {
            products: '/api/products',
            productById: '/api/products/:id',
            auth: '/api/auth'
        }
    });
});

// جلب كل المنتجات
app.get('/api/products', async (req, res) => {
  try {
    const [products] = await db.query('SELECT * FROM products');
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// جلب منتج محدد
app.get('/api/products/:id', async (req, res) => {
  try {
    const [product] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
    
    if (product.length === 0) {
      return res.status(404).json({ message: 'المنتج غير موجود' });
    }
    
    res.json(product[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// جلب منتج معين
app.get('/api/products/:id', async (req, res) => {
    try {
        const [product] = await db.query('SELECT * FROM products WHERE id = ?', [req.params.id]);
        if (product.length === 0) {
            return res.status(404).json({ message: 'المنتج غير موجود' });
        }
        res.json(product[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// تشغيل السيرفر
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});