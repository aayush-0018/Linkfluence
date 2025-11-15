import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSelector } from "react-redux";
import {
    DollarSign,
    Users,
    ArrowUpRight,
    ArrowDownRight,
} from "lucide-react";

const InfluencerHome = () => {
    const { token } = useSelector((state) => state.auth);
    const [userDetails, setUserDetails] = useState(null);
    const [recentCampaigns, setRecentCampaigns] = useState([]);

    useEffect(() => {
        const fetchMyDetails = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/users/me", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUserDetails(res.data);
            } catch (err) {
                console.error("Failed to fetch user data:", err);
            }
        };

        const fetchMyCampaigns = async () => {
            try {
                const res = await axios.get("http://localhost:8000/api/users/my-campaigns", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setRecentCampaigns(res.data);
            } catch (err) {
                console.error("Failed to fetch campaigns:", err);
            }
        };

        fetchMyDetails();
        fetchMyCampaigns();
    }, [token]);

    const stats = [
        {
            title: "Total Earnings",
            value: userDetails ? `$${userDetails.income}` : "--",
            change: "+12.5%",
            isPositive: true,
            icon: <DollarSign className="w-5 h-5" />,
        },
        {
            title: "Active Campaigns",
            value: recentCampaigns.length,
            change: "+8.2%",
            isPositive: true,
            icon: <Users className="w-5 h-5" />,
        },
    ];

    console.log(recentCampaigns);
    console.log(userDetails);

    return (
        <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <div
                        key={index}
                        className="bg-[#151515] rounded-2xl p-6 border border-[#2A2A2A] shadow-sm"
                    >
                        <div className="flex justify-between items-center">
                            <div className="w-10 h-10 rounded-lg bg-[#6F42C1]/20 flex items-center justify-center text-[#A685FA]">
                                {stat.icon}
                            </div>
                            {/* <span
                                className={`flex items-center text-sm font-medium ${stat.isPositive ? "text-green-500" : "text-red-500"
                                    }`}
                            >
                                {stat.isPositive ? (
                                    <ArrowUpRight className="w-4 h-4 mr-1" />
                                ) : (
                                    <ArrowDownRight className="w-4 h-4 mr-1" />
                                )}
                                {stat.change}
                            </span> */}
                        </div>
                        <div className="mt-4">
                            <p className="text-gray-400 text-sm">{stat.title}</p>
                            <p className="text-2xl font-semibold text-white mt-1">
                                {stat.value}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Campaigns */}
            <div className="bg-[#151515] rounded-2xl border border-[#2A2A2A]">
                <div className="p-6 border-b border-[#2A2A2A]">
                    <h2 className="text-xl font-semibold text-white">Recent Campaigns</h2>
                </div>
                <div className="p-6 overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead>
                            <tr className="text-gray-400">
                                <th className="pb-4">Campaign</th>
                                <th className="pb-4">Brand</th>
                                <th className="pb-4">Status</th>
                                <th className="pb-4">Start Date</th>
                                <th className="pb-4 text-right">Budget</th>
                            </tr>
                        </thead>
                        <tbody className="text-white">
                            {recentCampaigns.map((campaign, index) => (
                                <tr key={index} className="border-t border-[#2A2A2A]">
                                    <td className="py-4">{campaign.brand.name}</td>
                                    <td className="py-4">{campaign.name || "—"}</td>
                                    <td className="py-4">
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${campaign.status === "Active"
                                                ? "bg-green-900 text-green-400"
                                                : campaign.status === "Pending"
                                                    ? "bg-yellow-900 text-yellow-400"
                                                    : "bg-gray-700 text-gray-300"
                                                }`}
                                        >
                                            {campaign.status || "—"}
                                        </span>
                                    </td>
                                    <td className="py-4">
                                        {new Date(campaign.startDate).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 text-right">${campaign.budget}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InfluencerHome;
