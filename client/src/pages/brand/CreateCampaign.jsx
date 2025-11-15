import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon } from 'lucide-react';

const CreateCampaign = () => {
    const [form, setForm] = useState({
        name: '',
        description: '',
        startDate: '',
        endDate: '',
        budget: '',
    });

    const { token } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:8000/api/campaigns', form, {
                headers: { Authorization: `Bearer ${token}` },
            });
            navigate('/brand/campaigns');
        } catch (err) {
            alert(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div className="max-w-3xl mx-auto px-6 py-10 text-white">
            <button
                onClick={() => navigate('/brand/campaigns')}
                className="text-sm text-purple-500 hover:underline mb-6"
            >
                ← Back to Campaigns
            </button>

            <h1 className="text-3xl font-bold mb-2">Create New Campaign</h1>
            <p className="text-gray-400 mb-8">
                Launch a new campaign and connect with the perfect influencers for your brand
            </p>

            <form onSubmit={handleSubmit} className="bg-[#151515] p-6 rounded-xl border border-[#2a2a2a] space-y-6">
                <div>
                    <label className="block text-sm font-semibold mb-1">Campaign Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        placeholder="Campaign name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full bg-[#1a1a1a] text-white border border-[#2a2a2a] px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1">Campaign Description</label>
                    <textarea
                        name="description"
                        rows={4}
                        placeholder="Describe your campaign objectives and requirements..."
                        value={form.description}
                        onChange={handleChange}
                        className="w-full bg-[#1a1a1a] text-white border border-[#2a2a2a] px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-600"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold mb-1">Start Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                name="startDate"
                                value={form.startDate}
                                onChange={handleChange}
                                className="w-full bg-[#1a1a1a] text-white border border-[#2a2a2a] px-4 py-3 rounded-md pr-10"
                            />
                            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold mb-1">End Date</label>
                        <div className="relative">
                            <input
                                type="date"
                                name="endDate"
                                value={form.endDate}
                                onChange={handleChange}
                                className="w-full bg-[#1a1a1a] text-white border border-[#2a2a2a] px-4 py-3 rounded-md pr-10"
                            />
                            <CalendarIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold mb-1">Campaign Budget</label>
                    <div className="relative">
                        <input
                            type="number"
                            name="budget"
                            placeholder="5000"
                            value={form.budget}
                            onChange={handleChange}
                            className="w-full bg-[#1a1a1a] text-white border border-[#2a2a2a] px-4 py-3 rounded-md pr-10"
                        />
                        <span className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">$</span>
                    </div>
                </div>

                <div className="flex justify-end items-center gap-4 pt-4">
                    <button
                        type="button"
                        onClick={() => navigate('/brand/campaigns')}
                        className="text-sm text-gray-400 hover:text-white"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-gradient-to-tr from-purple-600 to-indigo-500 text-white px-6 py-2 rounded-md hover:opacity-90 text-sm font-medium"
                    >
                        Create Campaign
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCampaign;
