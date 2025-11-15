import { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";
import { useSelector } from "react-redux";
import { toast } from 'react-hot-toast';

const ApplicationFormModal = ({ campaignDetails, onClose, campaignId }) => {
    const { user, token } = useSelector((state) => state.auth);
    const [formData, setFormData] = useState({
        instagramFollowers: "",
        youtubeSubscribers: "",
        tiktokHandle: "",
        contentIdea: "",
        previousWork: "",
        proposedRate: "",
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        setErrors({ ...errors, [name]: "" }); // Clear error on change
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.instagramFollowers || isNaN(formData.instagramFollowers)) {
            newErrors.instagramFollowers = "Please enter a valid number of followers.";
        }
        if (!formData.youtubeSubscribers || isNaN(formData.youtubeSubscribers)) {
            newErrors.youtubeSubscribers = "Please enter a valid number of subscribers.";
        }
        if (!formData.contentIdea.trim()) {
            newErrors.contentIdea = "Content idea is required.";
        }
        if (!formData.previousWork.trim()) {
            newErrors.previousWork = "Previous work is required.";
        }
        if (!formData.proposedRate || isNaN(formData.proposedRate)) {
            newErrors.proposedRate = "Please enter a valid rate.";
        }
        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        console.log(formData);

        try {
            await axios.post(
                "http://localhost:8000/api/applications",
                {
                    ...formData,
                    campaign: campaignId,
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            toast.success("Application submitted!");
            onClose();
        } catch (err) {
            toast.error("Submission failed");
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#1a1a1a] text-white rounded-xl p-8 w-full max-w-3xl border-2 border-purple-600 shadow-[0_0_20px_rgba(147,51,234,0.5)] relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
                    <X size={20} />
                </button>

                <h2 className="text-xl font-semibold mb-1">Apply for Campaign</h2>
                <p className="text-sm text-gray-400 mb-6">
                    <span className="block">Campaign: {campaignDetails?.name}</span>
                    <span className="block">Brand: {campaignDetails?.brand}</span>
                </p>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Instagram Followers</label>
                                <input
                                    name="instagramFollowers"
                                    placeholder="e.g. 12000"
                                    value={formData.instagramFollowers}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-[#333] focus:outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                {errors.instagramFollowers && (
                                    <p className="text-red-400 text-sm mt-1">{errors.instagramFollowers}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm mb-1">YouTube Subscribers</label>
                                <input
                                    name="youtubeSubscribers"
                                    placeholder="e.g. 5000"
                                    value={formData.youtubeSubscribers}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-[#333]"
                                />
                                {errors.youtubeSubscribers && (
                                    <p className="text-red-400 text-sm mt-1">{errors.youtubeSubscribers}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Proposed Rate ($)</label>
                                <input
                                    type="number"
                                    name="proposedRate"
                                    placeholder="e.g. 1000"
                                    value={formData.proposedRate}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-[#333]"
                                />
                                {errors.proposedRate && (
                                    <p className="text-red-400 text-sm mt-1">{errors.proposedRate}</p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-1">Content Idea</label>
                                <textarea
                                    name="contentIdea"
                                    placeholder="Describe your content idea for this campaign..."
                                    value={formData.contentIdea}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-[#333] h-28"
                                />
                                {errors.contentIdea && (
                                    <p className="text-red-400 text-sm mt-1">{errors.contentIdea}</p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm mb-1">Previous Work Examples</label>
                                <textarea
                                    name="previousWork"
                                    placeholder="Share links to your previous similar content..."
                                    value={formData.previousWork}
                                    onChange={handleChange}
                                    className="w-full p-3 rounded-lg bg-[#2a2a2a] border border-[#333] h-28"
                                />
                                {errors.previousWork && (
                                    <p className="text-red-400 text-sm mt-1">{errors.previousWork}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end mt-6 gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="text-gray-400 hover:text-white px-4 py-2"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg flex items-center gap-2"
                        >
                            <span>Submit Application</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ApplicationFormModal;
