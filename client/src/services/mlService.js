import axios from "axios";

const ML_API_URL = "http://localhost:8001/predict";

export const predictApplication = async (applicationData) => {
    console.log("Data", applicationData);
    try {
        const response = await axios.post(ML_API_URL, applicationData);
        return response.data;
    } catch (error) {
        console.error("Error predicting application:", error);
        throw error;
    }
};