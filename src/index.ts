import { app } from "./app";
import dotenv from "dotenv";
import connectDB from "./db";

declare global {
    namespace Express {
        export interface Request {
            // user?: User;
        }
    }
}

dotenv.config({
    path: "./.env",
});

const startServer = () => {
    const port = process.env.PORT;
    app.listen(port, () => {
        console.log("⚙️  Server is running on port: " + port);
    });
};

try {
    connectDB().then(() => {
        startServer();
    });
} catch (err) {
    console.log("DB connect error: ", err);
}
