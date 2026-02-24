import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import Button from './Button';
import axios from 'axios';
import { FaWallet, FaCreditCard, FaMoneyBillWave, FaArrowUp, FaArrowDown, FaHistory } from 'react-icons/fa';

const SidebarButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-3 rounded-md mb-2 ${active ? 'bg-yellow-400 text-black' : 'hover:bg-gray-100 text-white/90'}`}
  >
    {children}
  </button>
);

const TransactionItem = ({ transaction }) => (
  <div className="flex items-center justify-between p-4 border-b border-gray-200 hover:bg-gray-50">
    <div className="flex items-center space-x-3">
      <div className={`p-2 rounded-full ${transaction.type === 'credit' ? 'bg-green-100' : 'bg-red-100'}`}>
        {transaction.type === 'credit' ? (
          <FaArrowDown className="text-green-600" />
        ) : (
          <FaArrowUp className="text-red-600" />
        )}
      </div>
      <div>
        <div className="font-medium">{transaction.description}</div>
        <div className="text-sm text-gray-500">{new Date(transaction.createdAt).toLocaleDateString()}</div>
        <div className="text-xs text-gray-400">{transaction.reference}</div>
      </div>
    </div>
    <div className={`font-semibold ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
      {transaction.type === 'credit' ? '+' : '-'}₦{transaction.amount.toLocaleString()}
    </div>
  </div>
);

const Wallet = () => {
  const { user } = useSelector(state => state.verifiedUser);
  const [activeTab, setActiveTab] = useState('overview');
  const [walletBalance, setWalletBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      try {
        const token = localStorage.getItem('nvcr_tk');
        const response = await axios.get('/api/user/wallet-data', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setWalletBalance(response.data.walletBalance);
        setTransactions(response.data.transactions);
      } catch (error) {
        console.error('Error fetching wallet data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWalletData();
  }, []);

  // Calculate stats from transactions for overview
  const totalEarned = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const getUserRole = () => {
    // This would come from user state/role
    return user?.role || 'passenger';
  };

  const getRoleDisplay = () => {
    const role = getUserRole();
    switch (role) {
      case 'rider': return 'Rider';
      case 'installment': return 'Installment Customer';
      default: return 'Passenger';
    }
  };

  return (
    <div className="min-h-screen">
      <Navbar userrole={getUserRole()} userverified={true} profilePic="/placeholderProfile.jpg" nav={<OtherNav userrole={getUserRole()} />} />

      <div className="mt-24 px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="col-span-1 bg-black text-white rounded p-4">
            <div className="mb-6">
              <div className="text-sm text-gray-300">{getRoleDisplay()}</div>
              <div className="text-xl font-bold text-orange-400">{user?.firstname || 'User'}</div>
              <div className="text-sm text-gray-400">Wallet Balance</div>
            </div>

            <SidebarButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')}>
              <FaWallet className="inline mr-2" /> Overview
            </SidebarButton>
            <SidebarButton active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')}>
              <FaHistory className="inline mr-2" /> Transactions
            </SidebarButton>
            <SidebarButton active={activeTab === 'cards'} onClick={() => setActiveTab('cards')}>
              <FaCreditCard className="inline mr-2" /> Payment Methods
            </SidebarButton>

            <div className="mt-6 p-3 bg-yellow-400 text-black rounded-lg">
              <div className="text-sm">Available Balance</div>
              <div className="text-2xl font-bold">₦{walletBalance.toLocaleString()}</div>
            </div>
          </aside>

          <main className="col-span-1 md:col-span-3 space-y-4">
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Balance Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-6 bg-white rounded shadow">
                    <div className="flex items-center space-x-3">
                      <FaWallet className="text-2xl text-yellow-600" />
                      <div>
                        <div className="text-sm text-gray-500">Current Balance</div>
                        <div className="text-2xl font-bold">₦{walletBalance.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded shadow">
                    <div className="flex items-center space-x-3">
                      <FaMoneyBillWave className="text-2xl text-green-600" />
                      <div>
                        <div className="text-sm text-gray-500">Total Earned</div>
                        <div className="text-2xl font-bold text-green-600">₦{totalEarned.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 bg-white rounded shadow">
                    <div className="flex items-center space-x-3">
                      <FaCreditCard className="text-2xl text-red-600" />
                      <div>
                        <div className="text-sm text-gray-500">Total Spent</div>
                        <div className="text-2xl font-bold text-red-600">₦{totalSpent.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="p-6 bg-white rounded shadow">
                  <h3 className="font-semibold mb-4">Quick Actions</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button
                      text="Add Money"
                      classes="bg-yellow-400 text-black py-3 px-4 rounded hover:bg-yellow-500 w-full"
                    />
                    <Button
                      text="Withdraw"
                      classes="bg-gray-200 text-black py-3 px-4 rounded hover:bg-gray-300 w-full"
                    />
                    <Button
                      text="Transfer"
                      classes="bg-gray-200 text-black py-3 px-4 rounded hover:bg-gray-300 w-full"
                    />
                    <Button
                      text="Pay Bills"
                      classes="bg-gray-200 text-black py-3 px-4 rounded hover:bg-gray-300 w-full"
                    />
                  </div>
                </div>

                {/* Recent Transactions */}
                <div className="p-6 bg-white rounded shadow">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-semibold">Recent Transactions</h3>
                    <button
                      onClick={() => setActiveTab('transactions')}
                      className="text-yellow-600 hover:text-yellow-700 text-sm"
                    >
                      View All
                    </button>
                  </div>
                  <div className="space-y-2">
                    {transactions.slice(0, 5).map((transaction) => (
                      <TransactionItem key={transaction._id} transaction={transaction} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'transactions' && (
              <div className="p-6 bg-white rounded shadow">
                <h3 className="font-semibold mb-4">Transaction History</h3>
                <div className="space-y-0">
                  {transactions.map((transaction) => (
                    <TransactionItem key={transaction._id} transaction={transaction} />
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'cards' && (
              <div className="space-y-4">
                <div className="p-6 bg-white rounded shadow">
                  <h3 className="font-semibold mb-4">Payment Methods</h3>
                  <div className="space-y-4">
                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FaCreditCard className="text-2xl text-blue-600" />
                          <div>
                            <div className="font-medium">**** **** **** 1234</div>
                            <div className="text-sm text-gray-500">Expires 12/27</div>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs">Primary</span>
                      </div>
                    </div>

                    <div className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FaWallet className="text-2xl text-yellow-600" />
                          <div>
                            <div className="font-medium">Maruwa Wallet</div>
                            <div className="text-sm text-gray-500">Instant payments</div>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">Active</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    text="Add New Payment Method"
                    classes="w-full bg-yellow-400 text-black py-3 px-4 rounded hover:bg-yellow-500"
                  />
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Wallet;