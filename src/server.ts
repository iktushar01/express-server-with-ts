import config from "./config/index.js";
import express, { Request, Response, NextFunction } from "express";
import initDB, { pool } from "./config/db.js";
import logger from "./middleware/logger.js";
import { userRoutes } from "./modules/user/user.routes.js";

const app = express();
const port = config.port;

// parser
app.use(express.json());


initDB();


app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello Next Level Developers!");
});

// ========== USERS CRUD ==========

app.use("/users", userRoutes);

// ========== TODOS CRUD ==========

app.post("/todos", async (req: Request, res: Response) => {
  const { user_id, title } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO todos(user_id, title) VALUES($1, $2) RETURNING *`,
      [user_id, title]
    );

    res.status(201).json({
      success: true,
      message: "Todo created",
      data: result.rows[0],
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

app.get("/todos", async (req: Request, res: Response) => {
  try {
    const result = await pool.query(`SELECT * FROM todos`);

    res.status(200).json({
      success: true,
      message: "Todos retrieved successfully",
      data: result.rows,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
