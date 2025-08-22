import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useInvestment } from '../../context/InvestmentContext';

const DepositWithdraw = () => {
  const { user } = useAuth();
  const { userStats, isWorkingDay } = useInvestment();
  const [activeTab, setActiveTab] = useState('deposit');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
    if (!amount || parseFloat(amount) < 20) {
      alert('Minimum deposit is $20');
      return;
    }

    if (!isWorkingDay()) {
      alert('Deposits are only available Monday to Friday');
      return;
    }

    setLoading(true);
    // Mock deposit processing
    setTimeout(() => {
      alert(`Deposit of $${amount} initiated successfully! Processing fee: $1.00`);
      setAmount('');
      setLoading(false);
    }, 2000);
  };

  const handleWithdraw = async () => {
    const withdrawAmount = parseFloat(amount);
    
    if (!amount || withdrawAmount < 5) {
      alert('Minimum withdrawal is $5');
      return;
    }

    if (withdrawAmount > userStats.totalEarnings) {
      alert('Insufficient balance');
      return;
    }

    if (!isWorkingDay()) {
      alert('Withdrawals are only available Monday to Friday');
      return;
    }

    setLoading(true);
    // Mock withdrawal processing
    setTimeout(() => {
      alert(`Withdrawal of $${amount} requested successfully! Processing fee: $1.00. Request will be reviewed by admin.`);
      setAmount('');
      setLoading(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Deposit & Withdraw</h2>
        <div className="flex items-center justify-center space-x-2 mb-6">
          <div className={`px-3 py-1 rounded-full text-sm ${isWorkingDay() ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
            {isWorkingDay() ? '🟢 Available' : '🔴 Unavailable (Weekend)'}
          </div>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-medium mb-2">Total Investment</h3>
          <p className="text-2xl font-bold">${userStats.totalDeposit.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-medium mb-2">Available Balance</h3>
          <p className="text-2xl font-bold">${userStats.totalEarnings.toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <h3 className="text-lg font-medium mb-2">Daily Profit</h3>
          <p className="text-2xl font-bold">${userStats.dailyProfit.toFixed(2)}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="flex">
            <button
              onClick={() => setActiveTab('deposit')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'deposit'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              💳 Deposit
            </button>
            <button
              onClick={() => setActiveTab('withdraw')}
              className={`px-6 py-4 text-sm font-medium ${
                activeTab === 'withdraw'
                  ? 'border-b-2 border-green-500 text-green-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              💰 Withdraw
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'deposit' ? (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Make a Deposit</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Deposit Amount ($)
                    </label>
                    <input
                      type="number"
                      min="20"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter amount (min $20)"
                      disabled={!isWorkingDay()}
                    />
                  </div>

                  {amount && (
                    <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Deposit Amount:</span>
                        <span className="text-sm font-medium">${amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Processing Fee:</span>
                        <span className="text-sm font-medium">$1.00</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-sm font-medium text-gray-900">Total to Pay:</span>
                        <span className="text-sm font-bold text-blue-600">
                          ${(parseFloat(amount) + 1).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleDeposit}
                    disabled={!amount || parseFloat(amount) < 20 || loading || !isWorkingDay()}
                    className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {loading ? 'Processing...' : 'Deposit Now'}
                  </button>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Deposit Information</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Minimum deposit: $20</li>
                      <li>• Processing fee: $1.00</li>
                      <li>• Available: Monday to Friday only</li>
                      <li>• Auto & Manual deposit options available</li>
                      <li>• Funds reflect immediately after confirmation</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Request Withdrawal</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Withdrawal Amount ($)
                    </label>
                    <input
                      type="number"
                      min="5"
                      max={userStats.totalEarnings}
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      placeholder="Enter amount (min $5)"
                      disabled={!isWorkingDay()}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                      Available balance: ${userStats.totalEarnings.toFixed(2)}
                    </p>
                  </div>

                  {amount && (
                    <div className="bg-green-50 p-4 rounded-lg space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Withdrawal Amount:</span>
                        <span className="text-sm font-medium">${amount}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-600">Processing Fee:</span>
                        <span className="text-sm font-medium">$1.00</span>
                      </div>
                      <div className="flex justify-between border-t pt-2">
                        <span className="text-sm font-medium text-gray-900">You'll Receive:</span>
                        <span className="text-sm font-bold text-green-600">
                          ${Math.max(parseFloat(amount) - 1, 0).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleWithdraw}
                    disabled={!amount || parseFloat(amount) < 5 || parseFloat(amount) > userStats.totalEarnings || loading || !isWorkingDay()}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    {loading ? 'Processing...' : 'Request Withdrawal'}
                  </button>

                  <div className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-medium text-gray-900 mb-2">Withdrawal Information</h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>• Minimum withdrawal: $5</li>
                      <li>• Processing fee: $1.00</li>
                      <li>• Available: Monday to Friday only</li>
                      <li>• Manual processing by admin</li>
                      <li>• Processing time: 24-48 hours</li>
                      <li>• Only profits can be withdrawn</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Payment Methods */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Supported Payment Methods</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">🏦</div>
            <p className="text-sm font-medium">Bank Transfer</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">💳</div>
            <p className="text-sm font-medium">Credit Card</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">₿</div>
            <p className="text-sm font-medium">Bitcoin</p>
          </div>
          <div className="text-center p-4 border border-gray-200 rounded-lg">
            <div className="text-2xl mb-2">💰</div>
            <p className="text-sm font-medium">USDT</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepositWithdraw;