import { Request, Response } from "express";
import { authService } from "./auth.service";

const loginUser = async (req: Request, res: Response) => {
    try {
        // Debug logging
        console.log('Login request - Body:', req.body);
        console.log('Login request - Body type:', typeof req.body);
        console.log('Login request - Content-Type:', req.headers['content-type']);

        if (!req.body || (typeof req.body === 'object' && Object.keys(req.body).length === 0)) {
            return res.status(400).json({
                success: false,
                message: "Request body is missing or empty",
                debug: {
                    body: req.body,
                    contentType: req.headers['content-type']
                }
            });
        }

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: "Email and password are required",
            });
        }

        const result = await authService.loginUser(email, password);

        if (!result) {
            return res.status(401).json({
                success: false,
                message: "Invalid email or password",
            });
        }

        res.status(200).json({
            success: true,
            message: "Login successful",
            data: result,
        });
    } catch (err: any) {
        res.status(500).json({
            success: false,
            message: err.message,
        });
    }
}

export const authControllers = {
    loginUser
}