import { Request, Response } from "express";
import { pool } from "../../config/db";
import { userService } from "./user.service";

const createUser = async (req: Request, res: Response) => {
    const { name, email } = req.body;
  
    try {
      const result = await userService.createUser( name, email );
  
      res.status(201).json({
        success: true,
        message: "Data Inserted Successfully",
        data: result.rows[0],
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

const getUsers = async (req: Request, res: Response) => {
    try {
      const result = await pool.query(`SELECT * FROM users`);
  
      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: result.rows,
      });
    } catch (err: any) {
      res.status(500).json({
        success: false,
        message: err.message,
      });
    }
  }

export const userControllers = {
    createUser,
    getUsers,
}