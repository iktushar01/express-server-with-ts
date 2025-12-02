import  express  from "express";
import { todoControllers } from "./todo.controller";
const router = express.Router();

router.post("/", todoControllers.createTodo);
router.get("/", todoControllers.getTodos);

export const todoRoutes = router;