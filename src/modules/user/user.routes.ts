import  express  from "express";
import { userControllers } from "./user.controller";
const router = express.Router();

router.post("/", userControllers.createUser);
router.get("/", userControllers.getUsers);
  

  export const userRoutes = router;