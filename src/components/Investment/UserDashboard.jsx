import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useInvestment } from '../../context/InvestmentContext';

const UserDashboard = () => {
  const { user } = useAuth();
  const { userStats, investments, isWorkingDay } = useInvestment();

  const StatCard = ({ title, value, subtitle, color = "blue", icon }) => (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{title}</p>
          <p className={`text-lg sm:text-2xl font-bold text-${color}-600 truncate`}>{value}</p>
          {subtitle && <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">{subtitle}</p>}
        </div>
        <div className={`p-2 sm:p-3 bg-${color}-100 rounded-full flex-shrink-0`}>
          <div className={`text-${color}-600 text-lg sm:text-xl`}>{icon}</div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-700 rounded-xl p-4 sm:p-8 text-white">
        <h1 className="text-xl sm:text-3xl font-bold mb-2">Welcome back, {user?.name}!</h1>
        <p className="text-blue-100 mb-4 text-sm sm:text-base">Track your investment performance and earnings</p>
        <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
          <div className={`px-3 py-1 rounded-full text-xs sm:text-sm w-fit ${isWorkingDay() ? 'bg-green-500' : 'bg-red-500'}`}>
            {isWorkingDay() ? '🟢 Markets Open' : '🔴 Markets Closed (Weekend)'}
          </div>
          <div className="text-xs sm:text-sm text-blue-100">
            Member since: {new Date(user?.joinDate).toLocaleDateString()}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard
          title="Total Investment"
          value={`$${userStats.totalDeposit.toFixed(2)}`}
          color="blue"
          icon="💼"
        />
        <StatCard
          title="Total Earnings"
          value={`$${userStats.totalEarnings.toFixed(2)}`}
          subtitle={`${((userStats.totalEarnings / userStats.totalDeposit) * 100 || 0).toFixed(1)}% of investment`}
          color="green"
          icon="💰"
        />
        <StatCard
          title="Daily Profit"
          value={`$${userStats.dailyProfit.toFixed(2)}`}
          subtitle={isWorkingDay() ? "Today's earnings" : "Next working day"}
          color="purple"
          icon="📈"
        />
        <StatCard
          title="Referral Earnings"
          value={`$${userStats.referralEarnings.toFixed(2)}`}
          color="orange"
          icon="👥"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <StatCard
          title="Team Deposit"
          value={`$${userStats.teamDeposit.toFixed(2)}`}
          color="indigo"
          icon="🏆"
        />
        <StatCard
          title="Team Earnings"
          value={`$${userStats.teamEarnings.toFixed(2)}`}
          color="pink"
          icon="🎯"
        />
        <StatCard
          title="Profit Multiplier"
          value={`${userStats.profitMultiplier.toFixed(2)}x`}
          subtitle={`${((3 - userStats.profitMultiplier) * 100).toFixed(0)}% to cap`}
          color="yellow"
          icon="⚡"
        />
      </div>

      {/* Active Investments */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Active Investments</h2>
        {investments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">No investments yet</p>
            <p className="text-sm text-gray-400">Start investing to begin earning daily profits</p>
          </div>
        ) : (
          <div className="space-y-4">
            {investments.map((investment) => (
              <div key={investment.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-gray-900">{investment.plan?.name}</h3>
                    <p className="text-sm text-gray-600">
                      Invested: ${investment.amount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(investment.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-green-600">
                      ${investment.totalEarned.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600">
                      Daily: ${investment.dailyProfit.toFixed(2)}
                    </p>
                    <div className={`px-2 py-1 rounded-full text-xs ${
                      investment.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {investment.isActive ? 'Active' : 'Completed (3x)'}
                    </div>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Progress to 3x Cap</span>
                    <span>{((investment.totalEarned / investment.amount) * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${Math.min((investment.totalEarned / (investment.amount * 3)) * 100, 100)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Reinvest Option */}
      {userStats.canReinvest && (
        <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-xl p-6 text-white">
          <h3 className="text-xl font-bold mb-2">🎉 Congratulations!</h3>
          <p className="mb-4">You've reached the 3x profit cap on some investments. You can now reinvest!</p>
          <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            Reinvest Now
          </button>
        </div>
      )}

      {/* Referral Section */}
      {userStats.referralCode && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Referral Link</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">Share this link to earn commissions:</p>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={`https://sigmafx.com/register?ref=${userStats.referralCode}`}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
              />
              <button
                onClick={() => navigator.clipboard.writeText(`https://sigmafx.com/register?ref=${userStats.referralCode}`)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Copy
              </button>
            </div>
          </div>
          <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 text-center">
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Level 1</p>
              <p className="font-bold text-blue-600">8%</p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Level 2</p>
              <p className="font-bold text-green-600">4%</p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Level 3</p>
              <p className="font-bold text-purple-600">2%</p>
            </div>
            <div className="bg-orange-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600">Level 4</p>
              <p className="font-bold text-orange-600">1%</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;