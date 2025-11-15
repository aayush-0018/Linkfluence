
import User from "../models/User.js";
import Application from '../models/Application.js';

export const getMyCampaigns = async (req, res) => {
    try {
        const applications = await Application.find({
            influencer: req.user._id,
            status: 'accepted'
        })
            .populate({
                path: 'campaign',
                populate: {
                    path: 'brand',
                    model: 'User',
                }
            })
            .sort({ createdAt: -1 });

        const campaigns = applications.map(app => ({
            ...app.campaign._doc,
            applicationStatus: app.status
        }));

        console.log(campaigns);

        res.json(campaigns);
    } catch (err) {
        console.error('Error fetching campaigns for user:', err);
        res.status(500).json({ message: 'Server error' });
    }
};

export const getMe = async (req, res) => {
    try {
        const userId = req.user.id; // Set in auth middleware
        const user = await User.findById(userId).select("name email role income");

        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user:", error);
        res.status(500).json({ message: "Server error" });
    }
};
