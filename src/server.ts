import express, { Request, Response } from "express";
import { Pool } from "pg";
import dotenv from "dotenv";
import path from "path";

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), ".env") });

// Create Express app
const app = express();
const port = 5000;

// Middleware
app.use(express.json());

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.CONNECTION_STRING,
});

// Initialize DB
const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) UNIQUE NOT NULL,
      age INT,
      phone VARCHAR(15),
      address TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      user_id INT REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      is_completed BOOLEAN DEFAULT false,
      due_date DATE,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );
  `);
};

// Start server only after DB is ready
const startServer = async () => {
  try {
    await initDB();
    console.log("Database initialized");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (err) {
    console.error("Error initializing database:", err);
  }
};

startServer();

// Test route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello!");
});

// Users CRUD - Create
app.post("/users", async (req: Request, res: Response) => {
  const { name, email, age } = req.body;

  if (!name || !email) {
    return res.status(400).json({
      success: false,
      message: "Name and Email are required",
    });
  }

  try {
    const result = await pool.query(
      `INSERT INTO users(name, email, age) VALUES($1, $2, $3) RETURNING *`,
      [name, email, age || null]
    );

    res.status(201).json({
      success: true,
      message: "Data inserted successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
    console.log(req.body);
  }
});
