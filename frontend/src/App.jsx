import { Routes, Route, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Toaster } from '@/components/ui/toaster';
import ChatBubble from '@/components/chatbot/ChatBubble';
import { useRef, useState } from 'react';
import { ScrollContext } from '@/context/ScrollContext';
import { ConfigProvider, theme } from 'antd';

import HomePage from '@/pages/HomePage';
import AuthLayout from '@/pages/auth/AuthLayout';
import SignInPage from '@/pages/auth/SignInPage';
import SignUpPage from '@/pages/auth/SignUpPage';
import OAuthSuccessRedirect from '@/pages/OAuthSuccessRedirect';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import DashboardPage from '@/pages/DashboardPage';
import FeaturesPage from '@/pages/FeaturesPage';
import AccountPage from '@/pages/AccountPage';
import SigiriyaPage from '@/pages/destinations/Sigiriya';
import WeligamaPage from './pages/destinations/Weligama';
import EllaPage from '@/pages/destinations/Ella';
import YalaPage from '@/pages/destinations/Yala';
import MirissaPage from '@/pages/destinations/Mirissa';
import ColomboPage from '@/pages/destinations/Colombo';
import KandyPage from './pages/destinations/Kandy';
import PolonnaruwaPage from '@/pages/destinations/Polonnaruwa';
import Planner from './pages/Planner';
import BusinessPage from './pages/BusinessPage';


export default function App() {
  console.log('App component rendering');
  const location = useLocation();
  const mainRef = useRef(null);

  const scrollToTop = () => {
    if (mainRef.current) {
      mainRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <ScrollContext.Provider value={{ scrollToTop }}>
      <Helmet>
        <title>TripMate - Your AI Guide to Sri Lanka</title>
      </Helmet>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main ref={mainRef} className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            {/* Add more destination routes as needed */}
            {/* Auth Routes */}
            <Route path="/destinations/sigiriya" element={<SigiriyaPage />} />
            <Route path="/destinations/weligama" element={<WeligamaPage />} />
            <Route path="/destinations/ella" element={<EllaPage />} />
            <Route path="/destinations/yala" element={<YalaPage />} />
            <Route path="/destinations/mirissa" element={<MirissaPage />} />
            <Route path="/destinations/colombo" element={<ColomboPage />} />
            <Route path="/destinations/kandy" element={<KandyPage />} />
            <Route path="/destinations/polonnaruwa" element={<PolonnaruwaPage />} />
            <Route path="/oauth-success" element={<OAuthSuccessRedirect />} />
            <Route path="/business" element={<BusinessPage/>}/>
            

            <Route element={<AuthLayout />}>
              <Route path="/auth/signin" element={<SignInPage />} />
              <Route path="/auth/signup" element={<SignUpPage />} />
            </Route>
            <Route
              path="/dashboard"
              element={<ProtectedRoute><DashboardPage /></ProtectedRoute>}
            />
            <Route
              path="/features"
              element={<ProtectedRoute><FeaturesPage /></ProtectedRoute>}
            />
            <Route
              path="/account"
              element={<ProtectedRoute><AccountPage /></ProtectedRoute>}
            />
            <Route
              path="/planner"
              element={<ProtectedRoute><Planner /></ProtectedRoute>}
            />
          </Routes>
        </main>
        <Footer />
      </div>
      <Toaster />
      <ChatBubble />
    </ScrollContext.Provider>
  );
}
