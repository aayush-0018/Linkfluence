import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: String,
    email: { type: String, required: true, unique: true },
    password: String,
    role: { type: String, enum: ["influencer", "brand", "event_organizer"] },
    income: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model("User", userSchema);
