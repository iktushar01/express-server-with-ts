// higher order function return a function
import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const auth = () =>{
    return (req: Request, res: Response, next: NextFunction) => {
        const authHeader = req.headers.authorization;
        
        if(!authHeader){
            return res.status(401).json({
                success: false,
                message: "Unauthorized - No token provided",
            });
        }

        // Extract token from "Bearer <token>" format
        const token = authHeader.startsWith('Bearer ') 
            ? authHeader.slice(7) 
            : authHeader;

        if(!token){
            return res.status(401).json({
                success: false,
                message: "Unauthorized - Invalid token format",
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            // Attach decoded token to request for use in routes

            (req as any).user = decoded;
            req.user = decoded as JwtPayload;
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired token",
            });
        }

    }
}

export default auth;