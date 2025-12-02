import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const configs = {
    port: process.env.PORT || 5000,
    connectionString: process.env.CONNECTION_STRING || "",
}

export default configs;