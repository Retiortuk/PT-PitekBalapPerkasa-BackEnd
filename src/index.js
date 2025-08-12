import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import productRoutes from "./routes/productRoutes.js";
import userRoute from "./routes/userRoute.js";
import kandangRoutes from "./routes/kandangRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes nya
app.use("/products", productRoutes);
app.use("/users", userRoute);
app.use("/kandang", kandangRoutes);

app.get("/", (req, res) => {
    res.send("API Sedang Berjalan...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server jalan di port ${PORT}`));