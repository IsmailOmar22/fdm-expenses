import 'dotenv/config';
import express from 'express';
import mysql from 'mysql2/promise';
import multer from 'multer';
import path from 'path';
import cors from 'cors';
import fs from 'fs';

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:5185'],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database Connection
const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'expense_claims',
  port: parseInt(process.env.DB_PORT || '3306'),
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// File Upload Configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = process.env.UPLOAD_DIR || './uploads';
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|pdf/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only JPEG, JPG, PNG, and PDF files are allowed!'));
    }
  }
});

// Serve uploaded files
app.use('/uploads', express.static(process.env.UPLOAD_DIR || 'uploads'));

// Validation Middleware
const validateClaimInput = (req, res, next) => {
  const required = ['title', 'expense_type', 'expense_date', 'email', 'amount'];
  const missing = required.filter(field => !req.body[field]);
  
  if (missing.length > 0) {
    return res.status(400).json({
      error: `Missing required fields: ${missing.join(', ')}`,
      required_fields: required
    });
  }
  
  if (isNaN(parseFloat(req.body.amount))) {
    return res.status(400).json({ error: "Amount must be a number" });
  }
  
  next();
};

// API Endpoints
app.post('/api/claims', upload.single('receipt'), validateClaimInput, async (req, res) => {
  try {
    const { title, expense_type, expense_date, description, email, amount } = req.body;
    const receipt_path = req.file ? req.file.path : null;

    const [result] = await pool.execute(
      `INSERT INTO claims 
      (title, expense_type, expense_date, description, email, amount, receipt_path) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [title, expense_type, expense_date, description, email, parseFloat(amount), receipt_path]
    );

    res.status(201).json({ 
      success: true, 
      claimId: result.insertId 
    });
  } catch (error) {
    console.error('Error submitting claim:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to submit claim',
      details: error.message 
    });
  }
});

app.get('/api/claims', async (req, res) => {
    try {
      const [claims] = await pool.execute(`
        SELECT 
          c.id,
          c.title,
          c.expense_type,
          c.amount,
          c.status,
          DATE_FORMAT(c.expense_date, '%Y-%m-%d') as expense_date,
          DATE_FORMAT(c.submission_date, '%Y-%m-%d %H:%i:%s') as submission_date,
          c.description,
          c.email,
          c.receipt_path,
          t.type_name
        FROM claims c
        LEFT JOIN expense_types t ON c.expense_type = t.id
        ORDER BY c.submission_date DESC
      `);
      
      // Return in consistent format
      res.json({
        success: true,
        data: claims
      });
    } catch (error) {
      console.error('Error fetching claims:', error);
      res.status(500).json({ 
        success: false,
        error: 'Failed to fetch claims',
        details: error.message 
      });
    }
  });

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📁 Upload directory: ${path.resolve(process.env.UPLOAD_DIR || 'uploads')}`);
});