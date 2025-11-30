import express, {Request, Response} from 'express';
import {Pool} from "pg";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({path: path.join(process.cwd(), '.env')});


// Create an Express application
const app = express()
const port = 5000;



// Middleware to parse JSON bodies
app.use(express.json());
// app.use(express.urlencoded({ extended: true }));


// PostgreSQL connection pool
const pool = new Pool({
  connectionString: `${process.env.CONNECTION_STRING}`,
});

const initDB = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL ,
    age INT,
    phone VARCHAR(15),
    address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
    );
  `)

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
    `)

}

// Initialize the database
initDB().then(() => {
  console.log("Database initialized");
}).catch((err) => {
  console.error("Error initializing database:", err);
});

// Test route
app.get('/', (req: Request, res: Response) => {
  res.send('Hello!')
})

//users CRUD
app.post("/users", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO users(name, email) VALUES($1, $2) RETURNING *`,
      [name, email]
    );
    // console.log(result.rows[0]);
    res.status(201).json({
      success: false,
      message: "Data Instered Successfully",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});



// Start the server
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
