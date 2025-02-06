import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import connectDB from "./config/db.js";
import routes from "./routes/index.js";
import { errorHandler, notFound } from "./middleware/errorMiddleware.js";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

connectDB();

const app = express();

app.use(express.json());
const corsOptions = {
    origin: ["http://localhost:5173"],
    methods: "GET,POST,PUT,DELETE,PATCH",
    allowedHeaders: "Content-Type,Authorization",
};
app.use(cors(corsOptions));
app.use(morgan("combined")); 

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.static(path.join(__dirname, 'dist')));

app.use("/api", routes);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


app.use(notFound);
app.use(errorHandler);

export default app;
