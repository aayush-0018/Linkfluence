import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
    campaign: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Campaign",
        required: true,
    },
    influencer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    instagramFollowers: Number,
    youtubeSubscribers: Number,
    contentIdea: String,
    previousWork: String,
    proposedRate: Number,
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected"],
        default: "pending",
    },
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);
