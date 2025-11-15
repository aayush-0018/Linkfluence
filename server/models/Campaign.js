import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    brand: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    startDate: Date,
    endDate: Date,
    budget: Number,
    status: {
        type: String,
        enum: ["Active", "Pending", "Completed"],
        default: "Active"
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Campaign", campaignSchema);
