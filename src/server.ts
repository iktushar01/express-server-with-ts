import config from "./config/index.js";
import express, { Request, Response } from "express";
import initDB from "./config/db.js";
import logger from "./middleware/logger.js";
import { userRoutes } from "./modules/user/user.routes.js";
import { todoRoutes } from "./modules/todo/todo.routes.js";
import { authRoutes } from "./modules/auth/auth.routes.js";

const app = express();
const port = config.port;

// parser - must be before routes
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Handle text/plain content type (common Postman issue when Content-Type header is missing)
app.use(express.text({ type: 'text/plain', limit: '10mb' }));

// Middleware to parse text/plain body as JSON if it looks like JSON
app.use((req, res, next) => {
    if (typeof req.body === 'string' && req.body.trim().startsWith('{')) {
        try {
            req.body = JSON.parse(req.body);
        } catch (e) {
            // If parsing fails, leave it as string
        }
    }
    next();
});

// Error handler for JSON parsing errors
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    if (err instanceof SyntaxError && 'body' in err) {
        return res.status(400).json({
            success: false,
            message: 'Invalid JSON in request body',
            error: err.message
        });
    }
    next(err);
});

// Debug middleware to log requests
app.use((req, res, next) => {
    if (req.path.includes('/auth/login')) {
        console.log('=== DEBUG LOGIN REQUEST ===');
        console.log('Request method:', req.method);
        console.log('Request path:', req.path);
        console.log('Content-Type:', req.headers['content-type']);
        console.log('Body:', req.body);
        console.log('Body type:', typeof req.body);
        console.log('Body is undefined?', req.body === undefined);
        console.log('Body is null?', req.body === null);
        console.log('Body keys:', req.body ? Object.keys(req.body) : 'no body');
        console.log('==========================');
    }
    next();
});


initDB();


app.get("/", logger, (req: Request, res: Response) => {
  res.send("Hello Next Level Developers!");
});

// ========== USERS CRUD ==========
app.use("/users", userRoutes);

// ========== TODOS CRUD ==========
app.use("/todos", todoRoutes);

// ========== AUTH ROUTES ==========
app.use("/auth", authRoutes);

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
