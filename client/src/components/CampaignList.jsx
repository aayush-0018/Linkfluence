import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { BadgePlus, Filter } from 'lucide-react';
import ApplicationFormModal from '../pages/influencer/applicationForm';

const CampaignList = () => {
    const navigate = useNavigate();
    const [campaigns, setCampaigns] = useState([]);
    const [campaignsAll, setCampaignsAll] = useState([]);
    const { user, token } = useSelector((state) => state.auth);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCampaign, setSelectedCampaign] = useState(null);

    const [filters, setFilters] = useState({
        status: '',
        minBudget: '',
        maxBudget: '',
        search: ''
    });
    const [showFilters, setShowFilters] = useState(false);

    useEffect(() => {
        const fetchCampaigns = async () => {
            try {
                const res = await axios.get('http://localhost:8000/api/campaigns', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const res1 = await axios.get('http://localhost:8000/api/campaigns/all', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setCampaignsAll(res1.data);
                setCampaigns(res.data);
            } catch (err) {
                console.error('Error fetching campaigns:', err);
            }
        };

        fetchCampaigns();
    }, [token]);

    const handleApplyClick = (campaign) => {
        setSelectedCampaign(campaign);
        setIsModalOpen(true);
    };

    const handlegetApplicants = (campaign) => {
        navigate(`/brand/campaign/${campaign._id}`);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const applyFilters = async () => {
        try {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.minBudget) params.append('minBudget', filters.minBudget);
            if (filters.maxBudget) params.append('maxBudget', filters.maxBudget);
            if (filters.search) params.append('search', filters.search);

            const res1 = await axios.get(`http://localhost:8000/api/campaigns/all?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            const res = await axios.get(`http://localhost:8000/api/campaigns/?${params.toString()}`, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setCampaigns(res.data);
            setCampaignsAll(res1.data);
        } catch (err) {
            console.error('Error applying filters:', err);
        }
    };

    const handleStatusChange = async (campaignId, newStatus) => {
        try {
            await axios.put(
                `http://localhost:8000/api/campaigns/${campaignId}/status`,
                { status: newStatus },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setCampaigns((prevCampaigns) =>
                prevCampaigns.map((c) =>
                    c._id === campaignId ? { ...c, status: newStatus } : c
                )
            );
        } catch (err) {
            console.error('Failed to update status:', err);
        }
    };

    const statusColors = {
        Active: 'bg-emerald-600 text-white',
        Cancelled: 'bg-red-600 text-white',
        Completed: 'bg-green-500 text-white',
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-10 text-white">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <div>
                    <h1 className="text-3xl font-bold mb-1">Campaigns</h1>
                    {user?.role === 'influencer' && (
                        <p className="text-gray-400 text-sm">
                            Explore available campaigns, apply with your ideas, and manage your applications
                        </p>
                    )}

                    {user?.role === 'brand' && (
                        <p className="text-gray-400 text-sm">
                            Create and manage campaigns, review influencer applications, and track engagement
                        </p>
                    )}
                </div>
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleFilterChange}
                        placeholder="Search campaigns..."
                        className="flex-1 bg-[#1a1a1a] text-sm text-white px-4 py-2 rounded-md border border-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className="bg-[#2a2a2a] px-4 py-2 rounded-md flex items-center gap-2 hover:bg-[#343434]"
                    >
                        <Filter size={16} />
                        Filters
                    </button>
                    {user?.role === "brand" && (
                        <Link
                            to="/brand/campaigns/create"
                            className="bg-gradient-to-tr from-purple-600 to-indigo-500 hover:opacity-90 px-4 py-2 rounded-md text-white text-sm font-semibold"
                        >
                            + Create Campaign
                        </Link>
                    )}
                </div>
            </div>

            {showFilters && (
                <div className="w-full bg-[#1f1f1f] p-4 rounded-lg mt-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                        <label className="text-gray-400 block mb-1">Status</label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="w-full bg-[#151515] border border-[#2a2a2a] rounded px-3 py-2 text-white"
                        >
                            <option value="">All</option>
                            <option value="Active">Active</option>
                            <option value="Cancelled">Cancelled</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-gray-400 block mb-1">Min Budget</label>
                        <input
                            type="number"
                            name="minBudget"
                            value={filters.minBudget}
                            onChange={handleFilterChange}
                            className="w-full bg-[#151515] border border-[#2a2a2a] rounded px-3 py-2 text-white"
                        />
                    </div>
                    <div>
                        <label className="text-gray-400 block mb-1">Max Budget</label>
                        <input
                            type="number"
                            name="maxBudget"
                            value={filters.maxBudget}
                            onChange={handleFilterChange}
                            className="w-full bg-[#151515] border border-[#2a2a2a] rounded px-3 py-2 text-white"
                        />
                    </div>
                    <div className="flex flex-col justify-end">
                        <button
                            onClick={applyFilters}
                            className="bg-gradient-to-tr from-purple-600 to-indigo-500 hover:opacity-90 text-white px-4 py-2 rounded-md mt-1"
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            )}

            {/* Influencer view */}
            {user?.role === "influencer" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
                    {campaignsAll?.length > 0 ? (
                        campaignsAll.map((campaign) => (
                            <div key={campaign._id} className="bg-[#151515] p-6 rounded-xl border border-[#2a2a2a] hover:border-purple-500 transition-all shadow-md flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <h2 className="text-lg font-semibold">{campaign.name}</h2>
                                        <span className={`text-xs px-3 py-1 rounded-full font-medium ${statusColors[campaign.status] || 'bg-gray-600 text-white'}`}>
                                            {campaign.status}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-300 space-y-1">
                                        <p><span className="text-gray-400">Brand:</span> {campaign?.brand.name}</p>
                                        <p><span className="text-gray-400">Email:</span> {campaign.brand.email}</p>
                                        <p><span className="text-gray-400">Budget:</span> ${campaign.budget.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex justify-end items-center mt-6 text-sm text-gray-400">
                                    {!campaign.hasApplied ? (
                                        <button
                                            onClick={() => handleApplyClick(campaign)}
                                            className="bg-gradient-to-tr from-purple-600 to-indigo-500 text-white px-4 py-1.5 rounded-md text-sm hover:opacity-90"
                                        >
                                            Apply Now
                                        </button>
                                    ) : (
                                        <span className="text-sm text-gray-400 italic">Already Applied</span>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-sm mt-4">No campaigns found.</p>
                    )}
                </div>
            )}

            {/* Brand view */}
            {user?.role === "brand" && (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-8">
                    {campaigns?.length > 0 ? (
                        campaigns.map((campaign) => (
                            <div key={campaign._id} className="bg-[#151515] p-6 rounded-xl border border-[#2a2a2a] hover:border-purple-500 transition-all shadow-md flex flex-col justify-between">
                                <div>
                                    <div className="flex justify-between items-start mb-3">
                                        <h2 className="text-lg font-semibold">{campaign.name}</h2>
                                        <select
                                            value={campaign.status}
                                            onChange={(e) => handleStatusChange(campaign._id, e.target.value)}
                                            className={`text-xs px-2 py-1 rounded-full font-medium ${statusColors[campaign.status] || 'bg-gray-600 text-white'} bg-transparent border border-gray-500`}
                                        >
                                            <option value="Active">Active</option>
                                            <option value="Cancelled">Cancelled</option>
                                            <option value="Completed">Completed</option>
                                        </select>
                                    </div>
                                    <div className="text-sm text-gray-300 space-y-1">
                                        <p><span className="text-gray-400">Brand:</span> {campaign.brand.name}</p>
                                        <p><span className="text-gray-400">Email:</span> {campaign.brand.email}</p>
                                        <p><span className="text-gray-400">Budget:</span> ${campaign.budget.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex justify-end items-center mt-6 text-sm text-gray-400">
                                    <button
                                        onClick={() => handlegetApplicants(campaign)}
                                        className="bg-gradient-to-tr from-purple-600 to-indigo-500 text-white px-4 py-1.5 rounded-md text-sm hover:opacity-90"
                                    >
                                        View Applications
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-400 text-sm mt-4">No campaigns found.</p>
                    )}
                </div>
            )}

            {isModalOpen && selectedCampaign && (
                <ApplicationFormModal
                    campaignId={selectedCampaign._id}
                    campaignDetails={{
                        name: selectedCampaign.name,
                        brand: selectedCampaign.brand.name,
                    }}
                    onClose={() => {
                        setSelectedCampaign(null);
                        setIsModalOpen(false);
                    }}
                />
            )}
        </div>
    );
};

export default CampaignList;
