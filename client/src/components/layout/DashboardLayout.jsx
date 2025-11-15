import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Outlet, Link, useLocation } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import { BarChart2, User, CalendarDays, Settings } from 'lucide-react';

const DashboardLayout = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    const navIcons = {
        Dashboard: <BarChart2 className="w-5 h-5 mr-2" />,
        Campaigns: <User className="w-5 h-5 mr-2" />,
    };

    const navLinks = [
        ...(user?.role === 'influencer'
            ? [{ label: 'Dashboard', to: `/${user?.role}/dashboard` }]
            : []),
        { label: 'Campaigns', to: `/${user?.role}/campaigns` },
    ];

    return (
        <div className="flex min-h-screen text-white bg-[#0f0f0f] font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-[#111111] p-6 flex flex-col justify-between">
                <div>
                    {/* Logo */}
                    <h1 className="text-2xl font-bold text-white mb-10 flex items-center gap-2">
                        <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-2 rounded-lg">
                            <BarChart2 className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-extrabold">
                            Link<span className="text-purple-500">Fluence</span>
                        </span>
                    </h1>

                    {/* Nav Links */}
                    <nav className="space-y-2">
                        {navLinks.map((link) => {
                            const isActive = location.pathname === link.to;
                            return (
                                <Link
                                    key={link.to}
                                    to={link.to}
                                    className={`flex items-center px-4 py-2 rounded-lg transition font-medium ${isActive
                                        ? 'bg-purple-600 text-white'
                                        : 'text-gray-300 hover:bg-[#1a1a1a]'
                                        }`}
                                >
                                    {navIcons[link.label]}
                                    {link.label}
                                </Link>
                            );
                        })}
                    </nav>
                </div>


            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8">
                <header className="mb-8 flex justify-between items-center border-b border-[#222] pb-4">
                    <h2 className="text-2xl font-bold text-white"></h2>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-right">
                                <p className="font-medium">{user?.name}</p>
                                <p className="text-gray-400 text-xs capitalize">{user?.role}</p>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="text-sm px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                        >
                            Logout
                        </button>
                    </div>
                </header>


                <Outlet />
            </main>
        </div>
    );
};

export default DashboardLayout;
