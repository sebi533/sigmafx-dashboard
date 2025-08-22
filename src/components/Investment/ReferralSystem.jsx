import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useInvestment } from '../../context/InvestmentContext';

const ReferralSystem = () => {
  const { user } = useAuth();
  const { userStats, rankRewards } = useInvestment();

  const referralLevels = [
    { level: 1, commission: 8, color: 'blue' },
    { level: 2, commission: 4, color: 'green' },
    { level: 3, commission: 2, color: 'purple' },
    { level: 4, commission: 1, color: 'orange' }
  ];

  const mockReferrals = [
    { name: 'John Doe', email: 'john@example.com', deposit: 500, level: 1, commission: 40, date: '2024-12-15' },
    { name: 'Jane Smith', email: 'jane@example.com', deposit: 1200, level: 1, commission: 96, date: '2024-12-10' },
    { name: 'Mike Johnson', email: 'mike@example.com', deposit: 800, level: 2, commission: 32, date: '2024-12-08' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-700 rounded-xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Referral System</h1>
        <p className="text-indigo-100">Earn commissions by referring new investors</p>
      </div>

      {/* Referral Link */}
      {userStats.referralCode && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Your Referral Link</h3>
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={`https://sigmafx.com/register?ref=${userStats.referralCode}`}
                readOnly
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg bg-white text-sm"
              />
              <button
                onClick={() => {
                  navigator.clipboard.writeText(`https://sigmafx.com/register?ref=${userStats.referralCode}`);
                  alert('Referral link copied to clipboard!');
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                Copy Link
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600">
            Share this link with friends and earn commissions on their deposits up to 4 levels deep!
          </p>
        </div>
      )}

      {/* Commission Structure */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Commission Structure</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {referralLevels.map((level) => (
            <div key={level.level} className={`bg-${level.color}-50 p-4 rounded-lg text-center`}>
              <div className={`text-2xl font-bold text-${level.color}-600 mb-1`}>
                Level {level.level}
              </div>
              <div className={`text-lg font-semibold text-${level.color}-700`}>
                {level.commission}%
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Commission on deposits
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <h4 className="font-medium text-yellow-800 mb-2">How it works:</h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Earn 8% commission on direct referrals (Level 1)</li>
            <li>• Earn 4% commission on their referrals (Level 2)</li>
            <li>• Earn 2% commission on Level 3 referrals</li>
            <li>• Earn 1% commission on Level 4 referrals</li>
          </ul>
        </div>
      </div>

      {/* Rank Rewards */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Rank Rewards</h3>
        <p className="text-gray-600 mb-4">
          Achieve these milestones to earn bonus rewards automatically!
        </p>
        <div className="space-y-4">
          {rankRewards.map((reward, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-medium text-gray-900">
                    Personal: ${reward.userDeposit} + Team: ${reward.teamDeposit.toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    Reward: ${reward.reward} (automatically credited)
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm ${
                  userStats.totalDeposit >= reward.userDeposit && userStats.teamDeposit >= reward.teamDeposit
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {userStats.totalDeposit >= reward.userDeposit && userStats.teamDeposit >= reward.teamDeposit
                    ? 'Achieved' 
                    : 'Pending'}
                </div>
              </div>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-gray-600 mb-1">
                  <span>Progress</span>
                  <span>
                    ${Math.min(userStats.totalDeposit, reward.userDeposit)} / ${reward.userDeposit} personal, 
                    ${Math.min(userStats.teamDeposit, reward.teamDeposit)} / ${reward.teamDeposit.toLocaleString()} team
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${Math.min(
                        ((userStats.totalDeposit / reward.userDeposit) + (userStats.teamDeposit / reward.teamDeposit)) / 2 * 100, 
                        100
                      )}%` 
                    }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Referrals */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Recent Referrals</h3>
        {mockReferrals.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-2">No referrals yet</p>
            <p className="text-sm text-gray-400">Start sharing your referral link to earn commissions</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Referral
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Deposit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Level
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Commission
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {mockReferrals.map((referral, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{referral.name}</div>
                        <div className="text-sm text-gray-500">{referral.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">${referral.deposit}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        referral.level === 1 ? 'bg-blue-100 text-blue-800' :
                        referral.level === 2 ? 'bg-green-100 text-green-800' :
                        referral.level === 3 ? 'bg-purple-100 text-purple-800' :
                        'bg-orange-100 text-orange-800'
                      }`}>
                        Level {referral.level}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-green-600">${referral.commission}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {referral.date}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Referral Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-medium mb-2">Total Referrals</h3>
          <p className="text-3xl font-bold">{mockReferrals.length}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-medium mb-2">Referral Earnings</h3>
          <p className="text-3xl font-bold">${userStats.referralEarnings.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-medium mb-2">Team Deposit</h3>
          <p className="text-3xl font-bold">${userStats.teamDeposit.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default ReferralSystem;