import { Pool } from "pg";
import configs from ".";

// DB
export const pool = new Pool({
    connectionString: `${configs.connectionString}`,
  });
  
  // INIT DB
  const initDB = async () => {
    try {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS users(
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          role VARCHAR(50) NOT NULL,
          email VARCHAR(150) UNIQUE NOT NULL,
          password TEXT NOT NULL,
          age INT,
          phone VARCHAR(15),
          address TEXT,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);
  
      await pool.query(`
        CREATE TABLE IF NOT EXISTS todos(
          id SERIAL PRIMARY KEY,
          user_id INT REFERENCES users(id) ON DELETE CASCADE,
          title VARCHAR(200) NOT NULL,
          description TEXT,
          completed BOOLEAN DEFAULT false,
          due_date DATE,
          created_at TIMESTAMP DEFAULT NOW(),
          updated_at TIMESTAMP DEFAULT NOW()
        )
      `);
      console.log("Database initialized successfully");
    } catch (err: any) {
      const errorMessage = err.message || err.toString() || "Unknown error";
      console.error("Database initialization error:", errorMessage);
      if (err.code === "ECONNREFUSED") {
        console.error("❌ Cannot connect to PostgreSQL database.");
        console.error("   Please ensure:");
        console.error("   1. PostgreSQL is running");
        console.error("   2. CONNECTION_STR is set correctly in .env file");
        console.error("   3. Database credentials are correct");
      } else {
        console.error("Please check your database configuration in .env file");
      }
    }
  };

  export default initDB;