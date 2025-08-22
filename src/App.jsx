import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { InvestmentProvider } from './context/InvestmentContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import UserDashboard from './components/Investment/UserDashboard';
import InvestmentPlans from './components/Investment/InvestmentPlans';
import DepositWithdraw from './components/Investment/DepositWithdraw';
import ReferralSystem from './components/Investment/ReferralSystem';
import AdminPanel from './components/Admin/AdminPanel';

const MainApp = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p>Loading Sigma Fx...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return authMode === 'login' ? (
      <LoginForm onToggle={() => setAuthMode('register')} />
    ) : (
      <RegisterForm onToggle={() => setAuthMode('login')} />
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <UserDashboard />;
      case 'invest':
        return <InvestmentPlans />;
      case 'deposit':
        return <DepositWithdraw />;
      case 'referral':
        return <ReferralSystem />;
      case 'admin':
        return <AdminPanel />;
      default:
        return <UserDashboard />;
    }
  };

  return (
    <InvestmentProvider>
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Header activeTab={activeTab} setActiveTab={setActiveTab} />
        <div className="flex flex-1">
          <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
          <main className="flex-1 p-3 sm:p-6 overflow-auto mobile-scroll">
            {renderContent()}
          </main>
        </div>
      </div>
    </InvestmentProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

export default App;