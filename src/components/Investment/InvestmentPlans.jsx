import React, { useState } from 'react';
import { useInvestment } from '../../context/InvestmentContext';

const InvestmentPlans = () => {
  const { investmentPlans, addInvestment, isWorkingDay } = useInvestment();
  const [selectedAmount, setSelectedAmount] = useState('');
  const [showDepositModal, setShowDepositModal] = useState(false);

  const handleInvest = (amount) => {
    const numAmount = parseFloat(amount);
    if (numAmount >= 20) {
      addInvestment(numAmount);
      setShowDepositModal(false);
      setSelectedAmount('');
      alert('Investment successful! Your daily profits will start from the next working day.');
    } else {
      alert('Minimum investment is $20');
    }
  };

  const getSelectedPlan = () => {
    const amount = parseFloat(selectedAmount);
    return investmentPlans.find(plan => amount >= plan.min && amount <= plan.max);
  };

  const calculateEstimatedDaily = () => {
    const amount = parseFloat(selectedAmount);
    const plan = getSelectedPlan();
    if (plan && amount) {
      const avgRate = (plan.dailyMin + plan.dailyMax) / 2;
      return (amount * avgRate) / 100;
    }
    return 0;
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Investment Plans</h2>
        <p className="text-gray-600 mb-2">Choose your investment plan and start earning daily profits</p>
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className={`px-3 py-1 rounded-full text-sm ${isWorkingDay() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isWorkingDay() ? '🟢 Online' : '🔴 Offline (Weekend)'}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {investmentPlans.map((plan, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden">
            <div className={`h-2 ${index === 0 ? 'bg-blue-500' : index === 1 ? 'bg-green-500' : index === 2 ? 'bg-purple-500' : 'bg-gold-500'}`}></div>
            <div className="p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{plan.name}</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-600">Investment Range</span>
                  <p className="text-lg font-semibold text-gray-900">
                    ${plan.min} - {plan.max === Infinity ? '∞' : `$${plan.max}`}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Daily Profit</span>
                  <p className="text-lg font-semibold text-green-600">
                    {plan.dailyMin}% - {plan.dailyMax}%
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Cap Limit</span>
                  <p className="text-sm text-gray-900">3x of investment</p>
                </div>
                <div>
                  <span className="text-sm text-gray-600">Working Days</span>
                  <p className="text-sm text-gray-900">Monday - Friday</p>
                </div>
              </div>
              <button
                onClick={() => setShowDepositModal(true)}
                className="mt-4 w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2 px-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-colors duration-200"
              >
                Invest Now
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Investment Modal */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Make Investment</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Investment Amount ($)
                </label>
                <input
                  type="number"
                  min="20"
                  value={selectedAmount}
                  onChange={(e) => setSelectedAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter amount (min $20)"
                />
              </div>

              {selectedAmount && getSelectedPlan() && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Plan:</span>
                    <span className="text-sm font-medium">{getSelectedPlan().name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Daily Profit Range:</span>
                    <span className="text-sm font-medium text-green-600">
                      {getSelectedPlan().dailyMin}% - {getSelectedPlan().dailyMax}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Estimated Daily:</span>
                    <span className="text-sm font-medium text-green-600">
                      ${calculateEstimatedDaily().toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Cap Limit:</span>
                    <span className="text-sm font-medium">
                      ${(parseFloat(selectedAmount) * 3).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Processing Fee:</span>
                    <span className="text-sm font-medium">$1.00</span>
                  </div>
                </div>
              )}

              <div className="flex space-x-4 mt-6">
                <button
                  onClick={() => {
                    setShowDepositModal(false);
                    setSelectedAmount('');
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleInvest(selectedAmount)}
                  disabled={!selectedAmount || parseFloat(selectedAmount) < 20}
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-green-500 to-teal-600 text-white rounded-lg hover:from-green-600 hover:to-teal-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm Investment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvestmentPlans;