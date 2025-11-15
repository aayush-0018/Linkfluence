import Campaign from "../models/Campaign.js";
import Application from '../models/Application.js';

export const createCampaign = async (req, res) => {
    try {
        console.log(req);
        const campaign = await Campaign.create({
            ...req.body,
            brand: req.user._id
        });
        res.status(201).json(campaign);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};


export const getCampaignsByBrand = async (req, res) => {
    try {
        const { status, minBudget, maxBudget, search, startDate, endDate } = req.query;

        const query = {
            brand: req.user._id,
        };

        if (status) {
            query.status = status;
        }

        if (minBudget || maxBudget) {
            query.budget = {};
            if (minBudget) query.budget.$gte = Number(minBudget);
            if (maxBudget) query.budget.$lte = Number(maxBudget);
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
            ];
        }

        if (startDate || endDate) {
            query.startDate = {};
            if (startDate) query.startDate.$gte = new Date(startDate);
            if (endDate) query.startDate.$lte = new Date(endDate);
        }

        const campaigns = await Campaign.find(query).populate("brand", "name email role");

        res.status(200).json(campaigns);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};


export const getAllCampaigns = async (req, res) => {
    try {
        const { status, minBudget, maxBudget, search, startDate, endDate } = req.query;

        const query = {};

        if (status) {
            query.status = status;
        }

        if (minBudget || maxBudget) {
            query.budget = {};
            if (minBudget) query.budget.$gte = Number(minBudget);
            if (maxBudget) query.budget.$lte = Number(maxBudget);
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        if (startDate || endDate) {
            query.startDate = {};
            if (startDate) query.startDate.$gte = new Date(startDate);
            if (endDate) query.startDate.$lte = new Date(endDate);
        }

        const campaigns = await Campaign.find(query).populate("brand", "name email role");

        let updatedCampaigns = campaigns;

        if (req.user.role === 'influencer') {
            updatedCampaigns = await Promise.all(
                campaigns.map(async (campaign) => {
                    const hasApplied = await Application.exists({
                        influencer: req.user.id,
                        campaign: campaign._id,
                    });
                    return {
                        ...campaign.toObject(),
                        hasApplied: !!hasApplied,
                    };
                })
            );
        }

        res.status(200).json(updatedCampaigns);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

export const updateCampaignStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['Active', 'Cancelled', 'Completed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const campaign = await Campaign.findOneAndUpdate(
            { _id: id, brand: req.user._id },
            { status },
            { new: true }
        );

        if (!campaign) {
            return res.status(404).json({ message: 'Campaign not found or not authorized' });
        }

        res.status(200).json(campaign);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};




