import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import kandangRoutes from "./routes/kandangRoutes.js";
import stokRoutes from "./routes/stokRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// Routes nya
app.use("/users", userRoute);
app.use("/kandang", kandangRoutes);
app.use("/stok", stokRoutes);

app.get("/", (req, res) => {
    res.send("API Sedang Berjalan...");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log(`Server jalan di port ${PORT}`));