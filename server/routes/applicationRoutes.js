import express from "express";
import { createApplication, getApplicationsForCampaign } from "../controllers/applicationController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { updateApplicationStatus } from "../controllers/applicationController.js";

const router = express.Router();

router.post("/", authMiddleware, createApplication);
router.get("/campaign/:campaignId", getApplicationsForCampaign)
router.put('/:applicationId/status', updateApplicationStatus);


export default router;
