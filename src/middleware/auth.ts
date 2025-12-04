// higher order function return a function
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const auth = () =>{
    return (req: Request, res: Response, next: NextFunction) => {
        const token = req.headers.authorization;
        if(!token){
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
                debug: {
                    token: token,
                    headers: req.headers,
                }
            });
        }

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET as string);
            // Attach decoded token to request for use in routes
            (req as any).user = decoded;
            console.log({AuthToken : token});
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