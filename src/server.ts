import config from "./config/index.js";
import express, { Request, Response } from "express";
import initDB from "./config/db.js";
import logger from "./middleware/logger.js";
import { userRoutes } from "./modules/user/user.routes.js";
import { todoRoutes } from "./modules/todo/todo.routes.js";

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
app.use("/todos", todoRoutes);

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
