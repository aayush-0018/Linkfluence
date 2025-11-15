import mongoose from 'mongoose';
import Application from '../models/Application.js';
import fs from 'fs';
import { Parser } from 'json2csv';
import Campaign from '../models/Campaign.js';
import User from '../models/User.js';
import dotenv from 'dotenv';

dotenv.config();

async function exportApplications() {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        const applications = await Application.find().populate('campaign').populate('influencer');

        const data = applications.map(app => ({
            campaignBudget: app.campaign?.budget || 0,
            proposedRate: app.proposedRate || 0,
            instagramHandle: app.instagramHandle || '',
            youtubeChannel: app.youtubeChannel || '',
            contentIdea: app.contentIdea || '',
            previousWork: app.previousWork || '',
            status: app.status || 'pending',
        }));

        const json2csvParser = new Parser();
        const csv = json2csvParser.parse(data);

        fs.writeFileSync('./applications.csv', csv);

        console.log('✅ Exported Applications to applications.csv');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
}

exportApplications();
