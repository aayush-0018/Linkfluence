import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import { Toaster } from 'react-hot-toast';
import DashboardLayout from './components/layout/DashboardLayout';
import InfluencerHome from './pages/influencer/InfluencerHome';
import ProtectedRoute from './components/ProtectedRoute';
import CampaignList from './components/CampaignList';
import CreateCampaign from './pages/brand/CreateCampaign';
import './index.css';
import ApplicationForm from './pages/influencer/applicationForm';
import CampaignApplicants from './pages/brand/CampaignApplicants';

const App = () => {
  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            color: '#fff',
            border: '1px solid #9333ea',
          },
        }}
      />
      <Router>
        <Routes>
          <Route path="/" element={<Signup />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/influencer"
            element={
              <ProtectedRoute allowedRoles={['influencer']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<InfluencerHome />} />
            <Route path="campaigns" element={<CampaignList />} />
            <Route path="apply" element={<ApplicationForm />} />
          </Route>

          <Route
            path="/brand"
            element={
              <ProtectedRoute allowedRoles={['brand']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route path="campaigns/create" element={<CreateCampaign />} />
            <Route path="campaigns" element={<CampaignList />} />
            <Route path="campaign/:campaignId" element={<CampaignApplicants />} />
          </Route>
        </Routes>
      </Router>
    </>
  );
};

export default App;
