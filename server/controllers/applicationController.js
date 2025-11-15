import Application from "../models/Application.js";
import User from '../models/User.js';

export const createApplication = async (req, res) => {
    try {
        const { campaign, instagramFollowers, youtubeSubscribers, tiktokHandle, contentIdea, previousWork, proposedRate } = req.body;

        const application = await Application.create({
            campaign,
            influencer: req.user._id,
            instagramFollowers,
            youtubeSubscribers,
            tiktokHandle,
            contentIdea,
            previousWork,
            proposedRate,
        });

        res.status(201).json(application);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const getApplicationsForCampaign = async (req, res) => {
    console.log(req);
    const { campaignId } = req.params;
    console.log("campaignId", campaignId);

    try {
        const applications = await Application.find({ campaign: campaignId })
            .populate('campaign')
            .populate('influencer')
            .exec();
        console.log(applications);
        res.status(200).json(applications);
    } catch (error) {
        console.error('Error fetching applications:', error);
        res.status(500).json({ message: 'Server error fetching applications' });
    }
};

export const updateApplicationStatus = async (req, res) => {
    try {
        const { applicationId } = req.params;
        const { status } = req.body;
        if (!["pending", "accepted", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status value." });
        }
        const application = await Application.findById(applicationId)
            .populate('campaign')
            .populate('influencer');

        if (!application) {
            return res.status(404).json({ message: "Application not found." });
        }
        if (application.status === 'accepted' || application.status === 'rejected') {
            return res.status(400).json({ message: `Application already ${application.status}.` });
        }
        application.status = status;
        await application.save();
        if (status === 'accepted') {
            const influencer = await User.findById(application.influencer._id);
            if (influencer) {
                influencer.income += application.proposedRate;
                await influencer.save();
            }
        }
        res.status(200).json(application);
    } catch (error) {
        console.error("Error updating application status:", error);
        res.status(500).json({ message: "Server error updating application status." });
    }
};

