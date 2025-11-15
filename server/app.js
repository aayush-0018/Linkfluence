import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.js";
import campaignRoutes from "./routes/campaignRoutes.js";
import applicationRoutes from "./routes/applicationRoutes.js";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/campaigns", campaignRoutes)
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);

const PORT = process.env.PORT || 8000;


mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.error("MongoDB error:", err));
