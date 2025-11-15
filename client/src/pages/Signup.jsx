import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signupUser } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const rotatingTexts = [
    "Manage your influencer campaigns seamlessly.",
    "Connect with top brands effortlessly.",
    "Organize impactful events with ease."
];

const Signup = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', role: '' });
    const [currentText, setCurrentText] = useState(0);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error } = useSelector((state) => state.auth);

    // Text Rotator Logic
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentText((prev) => (prev + 1) % rotatingTexts.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const res = await dispatch(signupUser(formData));
        if (res.meta.requestStatus === 'fulfilled') {
            const role = res.payload.user.role;
            if (role === 'influencer') navigate('/influencer/dashboard');
            else if (role === 'brand') navigate('/brand/campaigns');
            else if (role === 'event_organizer') navigate('/dashboard/event');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-[#1f1c2c] to-[#928dab] text-white px-4">
            <form
                onSubmit={handleSubmit}
                className="bg-[#1a1a1a] p-10 rounded-2xl shadow-2xl w-full max-w-lg"
            >
                <div className="text-center mb-8">
                    <h2 className="text-4xl font-bold mb-2 text-white">
                        Join <span className="text-purple-500">Link</span>
                        <span className="text-pink-500">Fluence</span>
                    </h2>
                    <p className="text-gray-400 transition-all duration-500 ease-in-out">
                        {rotatingTexts[currentText]}
                    </p>
                </div>

                {error && (
                    <p className="bg-red-500 text-white p-3 rounded-lg mb-6 text-center">
                        {error}
                    </p>
                )}

                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full p-4 mb-4 rounded-lg bg-[#2a2a2a] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                />

                <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full p-4 mb-4 rounded-lg bg-[#2a2a2a] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full p-4 mb-6 rounded-lg bg-[#2a2a2a] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-purple-500"
                    required
                />

                <select
                    name="role"
                    onChange={handleChange}
                    className="w-full p-4 mb-6 rounded-lg bg-[#2a2a2a] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-purple-500"
                    defaultValue=""
                >
                    <option value="" disabled>
                        Select Role
                    </option>
                    <option value="influencer">Influencer</option>
                    <option value="brand">Brand</option>
                </select>

                <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-500 text-white py-4 rounded-xl font-semibold hover:opacity-90 transition duration-300"
                    disabled={loading}
                >
                    {loading ? 'Signing up...' : 'Create Account'}
                </button>

                <p className="mt-6 text-center text-sm text-gray-400">
                    Already have an account?{" "}
                    <a href="/login" className="text-purple-400 hover:underline">
                        Log in
                    </a>
                </p>
            </form>
        </div>
    );
};

export default Signup;
