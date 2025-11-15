import express from "express";
import { createCampaign, getCampaignsByBrand, getAllCampaigns, updateCampaignStatus } from "../controllers/campaignController.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createCampaign);
router.get("/", authMiddleware, getCampaignsByBrand);
router.get("/all", authMiddleware, getAllCampaigns);
router.put('/:id/status', authMiddleware, updateCampaignStatus);

export default router;
