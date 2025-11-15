import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { predictApplication } from '../../services/mlService';
import axios from 'axios';
import { ArrowLeft, Instagram, Youtube, ExternalLink, MessageSquare } from 'lucide-react';

function CampaignApplicants() {
    const navigate = useNavigate();
    const { campaignId } = useParams();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const res = await axios.get(`http://localhost:8000/api/applications/campaign/${campaignId}`);
                const appsWithPrediction = await Promise.all(
                    res.data.map(async (app) => {
                        console.log("Format", app);
                        const prediction = await predictApplication({
                            campaignBudget: app.campaign?.budget,
                            proposedRate: app.proposedRate,
                            instagramFollowers: app.instagramFollowers,
                            youtubeSubscribers: app.youtubeSubscribers,
                            contentIdeaQuality: app.contentIdea,
                            previousWorkExperience: app.previousWork
                        });
                        console.log(prediction);
                        return { ...app, suggestedStatus: prediction?.acceptanceProbability };
                    })
                );
                setApplications(appsWithPrediction);
            } catch (err) {
                console.error('Error fetching applications:', err);
            } finally {
                setLoading(false);
            }
        };

        if (campaignId) {
            fetchApplications();
        }
    }, [campaignId]);

    const handleStatusChange = async (applicationId, newStatus) => {
        console.log(applicationId, newStatus);
        try {
            setUpdating(true);
            await axios.put(`http://localhost:8000/api/applications/${applicationId}/status`, {
                status: newStatus,
            });
            // Update locally without refetch
            setApplications((prev) =>
                prev.map((app) =>
                    app._id === applicationId ? { ...app, status: newStatus } : app
                )
            );
        } catch (err) {
            console.error('Failed to update status:', err);
        } finally {
            setUpdating(false);
        }
    };

    if (loading) return <div className="text-white p-6">Loading applicants...</div>;
    console.log(applications);

    return (
        <div className="space-y-6 p-6">
            {/* Back Button */}
            <div className="mb-8">
                <button
                    onClick={() => navigate('/brand/campaigns')}
                    className="flex items-center text-gray-400 hover:text-gray-200 transition-colors mb-6"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Campaigns
                </button>

                {/* Header */}
                <div className="bg-[#1a1a1a] rounded-xl border border-[#333] p-6">
                    <h1 className="text-2xl font-semibold mb-2 text-white">Applicants</h1>
                    <p className="text-gray-400 text-sm">Total Applicants: {applications.length}</p>
                </div>
            </div>

            {/* Applicants List */}
            <div className="space-y-6">
                {applications.length === 0 ? (
                    <p className="text-gray-400">No applications yet.</p>
                ) : (
                    applications.map((applicant) => (
                        <div
                            key={applicant._id}
                            className="bg-[#1a1a1a] rounded-xl border border-[#333] overflow-hidden"
                        >
                            {/* Card Top */}
                            <div className="p-6">
                                <div className="flex items-start gap-4">
                                    {/* Profile Pic */}
                                    <img
                                        src={applicant.influencer?.profilePic || 'https://cdn.vectorstock.com/i/500p/97/68/account-avatar-dark-mode-glyph-ui-icon-vector-44429768.jpg'}
                                        alt={applicant.influencer?.email}
                                        className="w-16 h-16 rounded-full object-cover"
                                    />

                                    {/* Info */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-4">
                                            {/* Left */}
                                            <div>
                                                <h3 className="text-lg font-semibold text-white">{applicant.influencer?.name}</h3>
                                                <div className="flex items-center gap-4 mt-2">
                                                    {applicant?.instagramFollowers && (
                                                        <a
                                                            href={`https://instagram.com/${applicant.instagramHandle}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className="flex items-center gap-1 text-sm text-gray-400 hover:text-purple-400 transition-colors"
                                                        >
                                                            <Instagram className="w-4 h-4" />
                                                            {applicant.instagramFollowers} Followers
                                                        </a>
                                                    )}
                                                    {applicant.youtubeSubscribers && (
                                                        <div className="flex items-center gap-1 text-sm text-gray-400">
                                                            <Youtube className="w-4 h-4" />
                                                            {applicant.youtubeSubscribers} Subscribers
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* Status */}
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium
    ${applicant.status === 'accepted'
                                                        ? 'bg-green-900 text-green-400'
                                                        : applicant.status === 'rejected'
                                                            ? 'bg-red-900 text-red-400'
                                                            : 'bg-yellow-900 text-yellow-400'
                                                    }`}
                                            >
                                                {applicant?.status}
                                            </span>

                                            {applicant.suggestedStatus && (
                                                <p className="text-sm text-purple-400 mt-1">
                                                    Suggested Decision: {applicant.suggestedStatus}%
                                                </p>
                                            )}

                                        </div>

                                        {/* Details */}
                                        <div className="space-y-4">
                                            <div>
                                                <h4 className="text-sm font-medium text-white mb-1">Content Idea</h4>
                                                <p className="text-gray-400 text-sm">{applicant.contentIdea}</p>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-medium text-white mb-1">Previous Work</h4>
                                                {applicant.previousWork ? (
                                                    <div className="flex items-center gap-2">
                                                        <p className="text-gray-400 text-sm">{applicant.previousWork}</p>
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-sm">No previous work links</p>
                                                )}
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-medium text-white mb-1">Proposed Rate</h4>
                                                <p className="text-white font-semibold text-sm">
                                                    ₹{applicant.proposedRate}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="p-4 bg-[#222] border-t border-[#333] flex justify-end gap-4">
                                {/* <button className="flex items-center gap-2 bg-[#333] hover:bg-[#444] text-white py-2 px-4 rounded-lg text-sm">
                                    <MessageSquare size={18} />
                                    Message
                                </button> */}

                                {applicant.status === 'accepted' ? (
                                    <button
                                        disabled
                                        className="bg-green-700 text-white py-2 px-4 rounded-lg text-sm cursor-not-allowed opacity-70"
                                    >
                                        Accepted
                                    </button>
                                ) : applicant.status === 'rejected' ? (
                                    <button
                                        disabled
                                        className="bg-gray-600 text-white py-2 px-4 rounded-lg text-sm cursor-not-allowed opacity-70"
                                    >
                                        Declined
                                    </button>
                                ) : (
                                    <>
                                        <button
                                            disabled={updating}
                                            onClick={() => handleStatusChange(applicant._id, 'rejected')}
                                            className="bg-[#444] hover:bg-[#555] text-white py-2 px-4 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Decline
                                        </button>
                                        <button
                                            disabled={updating}
                                            onClick={() => handleStatusChange(applicant._id, 'accepted')}
                                            className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            Accept
                                        </button>
                                    </>
                                )}
                            </div>

                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default CampaignApplicants;
