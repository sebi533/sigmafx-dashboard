import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const InvestmentContext = createContext();

export const useInvestment = () => {
  const context = useContext(InvestmentContext);
  if (!context) {
    throw new Error('useInvestment must be used within an InvestmentProvider');
  }
  return context;
};

export const InvestmentProvider = ({ children }) => {
  const { user } = useAuth();
  const [investments, setInvestments] = useState([]);
  const [userStats, setUserStats] = useState({
    totalDeposit: 0,
    totalEarnings: 0,
    dailyProfit: 0,
    referralEarnings: 0,
    teamDeposit: 0,
    teamEarnings: 0,
    currentProfit: 0,
    profitMultiplier: 0,
    canReinvest: false,
    referralCode: '',
    referrals: []
  });

  // Investment plans
  const investmentPlans = [
    { min: 20, max: 199, dailyMin: 1.5, dailyMax: 1.75, name: 'Starter Plan' },
    { min: 200, max: 799, dailyMin: 2.0, dailyMax: 2.5, name: 'Growth Plan' },
    { min: 800, max: 2999, dailyMin: 2.5, dailyMax: 3.5, name: 'Pro Plan' },
    { min: 3000, max: Infinity, dailyMin: 3.5, dailyMax: 4.0, name: 'Elite Plan' }
  ];

  // Rank rewards
  const rankRewards = [
    { userDeposit: 200, teamDeposit: 1000, reward: 20 },
    { userDeposit: 500, teamDeposit: 5000, reward: 100 },
    { userDeposit: 2000, teamDeposit: 15000, reward: 200 },
    { userDeposit: 4000, teamDeposit: 30000, reward: 500 },
    { userDeposit: 1000, teamDeposit: 100000, reward: 1000 }
  ];

  // Check working days (Monday to Friday)
  const isWorkingDay = () => {
    const today = new Date();
    const day = today.getDay();
    return day >= 1 && day <= 5; // Monday = 1, Friday = 5
  };

  // Calculate daily profit based on investment amount
  const calculateDailyProfit = (amount) => {
    const plan = investmentPlans.find(p => amount >= p.min && amount <= p.max);
    if (!plan) return 0;
    
    const randomRate = plan.dailyMin + Math.random() * (plan.dailyMax - plan.dailyMin);
    return (amount * randomRate) / 100;
  };

  // Get investment plan for amount
  const getInvestmentPlan = (amount) => {
    return investmentPlans.find(p => amount >= p.min && amount <= p.max);
  };

  // Calculate referral commission
  const calculateReferralCommission = (amount, level) => {
    const rates = [8, 4, 2, 1]; // Level 1-4 commission rates
    return (amount * rates[level - 1]) / 100;
  };

  // Add new investment
  const addInvestment = (amount) => {
    if (!user || amount < 20) return false;

    const newInvestment = {
      id: Date.now().toString(),
      amount: amount,
      date: new Date().toISOString(),
      dailyProfit: calculateDailyProfit(amount),
      totalEarned: 0,
      isActive: true,
      plan: getInvestmentPlan(amount)
    };

    setInvestments(prev => [...prev, newInvestment]);
    
    // Update user stats
    setUserStats(prev => ({
      ...prev,
      totalDeposit: prev.totalDeposit + amount,
      referralCode: prev.referralCode || `SIGMA${user.id || Date.now()}`
    }));

    return true;
  };

  // Process daily profits (called on component mount and periodically)
  const processDailyProfits = () => {
    if (!isWorkingDay()) return;

    setInvestments(prev => prev.map(investment => {
      if (!investment.isActive) return investment;

      const newTotalEarned = investment.totalEarned + investment.dailyProfit;
      const profitMultiplier = newTotalEarned / investment.amount;

      // Check if reached 3x cap
      if (profitMultiplier >= 3) {
        return {
          ...investment,
          totalEarned: investment.amount * 3,
          isActive: false
        };
      }

      return {
        ...investment,
        totalEarned: newTotalEarned
      };
    }));
  };

  // Calculate total stats
  useEffect(() => {
    if (investments.length === 0) return;

    const totalDeposit = investments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalEarnings = investments.reduce((sum, inv) => sum + inv.totalEarned, 0);
    const dailyProfit = investments
      .filter(inv => inv.isActive)
      .reduce((sum, inv) => sum + inv.dailyProfit, 0);

    const avgMultiplier = totalDeposit > 0 ? totalEarnings / totalDeposit : 0;
    const canReinvest = investments.some(inv => !inv.isActive && (inv.totalEarned / inv.amount) >= 3);

    setUserStats(prev => ({
      ...prev,
      totalDeposit,
      totalEarnings,
      dailyProfit,
      currentProfit: totalEarnings,
      profitMultiplier: avgMultiplier,
      canReinvest
    }));
  }, [investments]);

  const value = {
    investments,
    userStats,
    investmentPlans,
    rankRewards,
    isWorkingDay,
    addInvestment,
    processDailyProfits,
    calculateDailyProfit,
    getInvestmentPlan
  };

  return (
    <InvestmentContext.Provider value={value}>
      {children}
    </InvestmentContext.Provider>
  );
};