import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import Button from './Button';
import axios from 'axios';
import { FaWallet, FaCreditCard, FaMoneyBillWave, FaArrowUp, FaArrowDown, FaHistory, FaPlus, FaExchangeAlt, FaReceipt } from 'react-icons/fa';
import SidebarButton from './Profile/SidebarButton';
import { PaystackButton } from 'react-paystack';

const Motion = motion;

// We need a wrapper component or generic function for PaystackButton to dynamically get amount
const AddMoneyButtonWrapper = ({ setWalletBalance, setTransactions }) => {
    const amountStr = prompt("Enter amount to fund (₦):", "5000");
    const amountToFund = parseInt(amountStr, 10);
    
    if (!amountStr || isNaN(amountToFund) || amountToFund <= 0) {
        return (
            <Button
                onClick={() => alert("Please click again and enter a valid amount.")}
                text={<div className="flex items-center gap-2"><FaPlus className="text-[10px]" /> Add Money</div>}
                classes="bg-orange-500 text-white font-black uppercase tracking-widest text-[10px] py-4 px-8 rounded-2xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all"
            />
        );
    }

    const token = localStorage.getItem('nvcr_tk');

    return (
        <PaystackButton
            className="bg-orange-500 text-white font-black uppercase tracking-widest text-[10px] py-4 px-8 rounded-2xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
            text="Add Money"
            email={`user_${Date.now()}@novacrest.local`}
            amount={amountToFund * 100} // in kobo
            publicKey="pk_test_26f1b45d2f2c179ed904deee64e9fe8c60ff8fc4"
            reference={(new Date()).getTime().toString()}
            onSuccess={async (transaction) => {
                try {
                    await axios.post('/api/paystack/verify-wallet-funding', {
                        reference: transaction.reference
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    
                    alert("Wallet funded successfully!");
                    // refresh data
                    const refreshRes = await axios.get('/api/user/wallet-data', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setWalletBalance(refreshRes.data.walletBalance);
                    setTransactions(refreshRes.data.transactions);
                } catch (verifyError) {
                    console.error("Verification failed:", verifyError);
                    alert("Payment verification failed. Please contact support.");
                }
            }}
            onClose={() => {
                console.log("Payment cancelled.");
            }}
        />
    );
};

const TransactionItem = ({ transaction }) => (
  <Motion.div
    initial={{ opacity: 0, x: -10 }}
    animate={{ opacity: 1, x: 0 }}
    className="flex items-center justify-between p-5 bg-white/50 backdrop-blur-sm border border-neutral-100 rounded-2xl hover:bg-white hover:border-orange-500/30 transition-all group"
  >
    <div className="flex items-center gap-4">
      <div className={`p-3 rounded-xl ${transaction.type === 'credit' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} group-hover:scale-110 transition-transform`}>
        {transaction.type === 'credit' ? (
          <FaArrowDown className="text-sm" />
        ) : (
          <FaArrowUp className="text-sm" />
        )}
      </div>
      <div>
        <div className="font-bold text-neutral-800 text-sm tracking-tight">{transaction.description}</div>
        <div className="flex items-center gap-3 mt-0.5">
          <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
            {new Date(transaction.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
          </div>
          <div className="text-[10px] font-bold text-neutral-300">|</div>
          <div className="text-[10px] font-black uppercase tracking-widest text-neutral-300 truncate max-w-[120px]">
            {transaction.reference}
          </div>
        </div>
      </div>
    </div>
    <div className={`text-sm font-black tracking-tighter ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
      {transaction.type === 'credit' ? '+' : '-'} ₦{transaction.amount.toLocaleString()}
    </div>
  </Motion.div>
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

  const totalEarned = transactions
    .filter(t => t.type === 'credit')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter(t => t.type === 'debit')
    .reduce((sum, t) => sum + t.amount, 0);

  const getRoleDisplay = () => {
    switch (user?.role) {
      case 'rider': return 'Rider';
      case 'installment': return 'Installment Customer';
      default: return 'Passenger';
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50/50">
      <Navbar
        userrole={user?.role}
        userverified={true}
        profilePic={user?.profilePic || "/placeholderProfile.jpg"}
        nav={<OtherNav userrole={user?.role} />}
      />

      <div className="mt-20 pt-12 px-6 lg:px-20 pb-20">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-8">

          {/* Sidebar */}
          <aside className="w-full lg:w-80 space-y-6">
            <Motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-neutral-900 rounded-[2.5rem] p-8 text-center relative overflow-hidden shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-3xl -mr-16 -mt-16" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl -ml-12 -mb-12" />

              <div className="relative z-10">
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-500/80 mb-2">{getRoleDisplay()}</div>
                <div className="text-2xl font-black text-white tracking-tight mb-6">{user?.firstname || 'User'}</div>

                <div className="p-6 bg-white/5 backdrop-blur-md rounded-3xl border border-white/5 shadow-inner">
                  <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-2">Available Balance</div>
                  <div className="text-3xl font-black text-white tracking-tighter">₦{walletBalance.toLocaleString()}</div>
                </div>
              </div>
            </Motion.div>

            <div className="bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-4 border border-white/20 shadow-xl">
              <SidebarButton active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={FaWallet}>
                Overview
              </SidebarButton>
              <SidebarButton active={activeTab === 'transactions'} onClick={() => setActiveTab('transactions')} icon={FaHistory}>
                Transactions
              </SidebarButton>
              <SidebarButton active={activeTab === 'cards'} onClick={() => setActiveTab('cards')} icon={FaCreditCard}>
                Payments
              </SidebarButton>
            </div>
          </aside>

          {/* Main Content Area */}
          <main className="flex-1 bg-white/80 backdrop-blur-3xl rounded-[2.5rem] p-8 md:p-12 shadow-2xl border border-white/20 relative overflow-hidden">
            <div className="relative z-10">
              <AnimatePresence mode="wait">
                <Motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  {activeTab === 'overview' && (
                    <div className="space-y-10">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Wallet Overview</h3>
                          <p className="text-sm text-neutral-500 mt-1">Monitor your earnings and spending status.</p>
                        </div>
                        <Motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                          <AddMoneyButtonWrapper setWalletBalance={setWalletBalance} setTransactions={setTransactions} />
                        </Motion.div>
                      </div>

                      {/* Stat Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="group p-8 bg-neutral-900 rounded-[2.5rem] border border-neutral-800 shadow-2xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/5 rounded-full blur-3xl" />
                          <div className="relative z-10">
                            <div className="p-3 bg-green-500/10 rounded-2xl w-fit mb-4">
                              <FaMoneyBillWave className="text-green-500" />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Total Earned</div>
                            <div className="text-3xl font-black text-white tracking-tighter">₦{totalEarned.toLocaleString()}</div>
                          </div>
                        </div>

                        <div className="group p-8 bg-neutral-900 rounded-[2.5rem] border border-neutral-800 shadow-2xl relative overflow-hidden">
                          <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl" />
                          <div className="relative z-10">
                            <div className="p-3 bg-red-500/10 rounded-2xl w-fit mb-4">
                              <FaCreditCard className="text-red-500" />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mb-1">Total Spent</div>
                            <div className="text-3xl font-black text-white tracking-tighter">₦{totalSpent.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>

                      {/* Recent Activities */}
                      <div className="space-y-6">
                        <div className="flex justify-between items-center">
                          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 font-bold">Recent Activities</div>
                          <button onClick={() => setActiveTab('transactions')} className="text-[10px] font-black uppercase tracking-widest text-orange-500 hover:text-orange-600 transition-colors">View All History</button>
                        </div>
                        <div className="space-y-3">
                          {transactions.slice(0, 3).map((transaction) => (
                            <TransactionItem key={transaction._id} transaction={transaction} />
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'transactions' && (
                    <div className="space-y-8">
                      <div>
                        <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Transaction History</h3>
                        <p className="text-sm text-neutral-500 mt-1">A detailed list of all your financial activities.</p>
                      </div>
                      <div className="grid grid-cols-1 gap-3">
                        {transactions.map((transaction) => (
                          <TransactionItem key={transaction._id} transaction={transaction} />
                        ))}
                        {transactions.length === 0 && (
                          <div className="py-20 text-center">
                            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                              <FaHistory className="text-neutral-300 text-xl" />
                            </div>
                            <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400">No transactions recorded yet</div>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'cards' && (
                    <div className="space-y-10">
                      <div>
                        <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Payment Methods</h3>
                        <p className="text-sm text-neutral-500 mt-1">Manage your saved cards and payment sources.</p>
                      </div>

                      <div className="grid grid-cols-1 gap-6">
                        {/* Example Card */}
                        <Motion.div
                          whileHover={{ scale: 1.01 }}
                          className="p-8 bg-neutral-900 rounded-[2.5rem] border border-neutral-800 shadow-2xl relative overflow-hidden group"
                        >
                          <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl" />
                          <div className="flex items-center justify-between relative z-10">
                            <div className="flex items-center gap-6">
                              <div className="p-4 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5">
                                <FaCreditCard className="text-3xl text-orange-500" />
                              </div>
                              <div>
                                <div className="text-lg font-black text-white tracking-tighter">**** **** **** 1234</div>
                                <div className="text-[10px] font-black uppercase tracking-widest text-neutral-500 mt-1">Expires 12/27</div>
                              </div>
                            </div>
                            <div className="px-4 py-1.5 bg-green-500/10 text-green-500 rounded-full text-[10px] font-black uppercase tracking-widest">Primary</div>
                          </div>
                        </Motion.div>

                        <Motion.div
                          whileHover={{ scale: 1.01 }}
                          className="p-8 bg-white border border-neutral-100 rounded-[2.5rem] shadow-xl flex items-center justify-between group hover:border-orange-500/30 transition-all"
                        >
                          <div className="flex items-center gap-6">
                            <div className="p-4 bg-orange-50 rounded-2xl">
                              <FaWallet className="text-3xl text-orange-500" />
                            </div>
                            <div>
                              <div className="text-lg font-black text-neutral-900 tracking-tighter">Maruwa Wallet</div>
                              <div className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mt-1">Default payment source</div>
                            </div>
                          </div>
                          <div className="px-4 py-1.5 bg-neutral-100 text-neutral-500 rounded-full text-[10px] font-black uppercase tracking-widest">Active</div>
                        </Motion.div>

                        <Motion.button
                          whileHover={{ y: -5 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full py-6 bg-neutral-50 border-2 border-dashed border-neutral-200 rounded-[2.5rem] flex flex-col items-center gap-2 hover:bg-neutral-100 hover:border-orange-500/30 transition-all group"
                        >
                          <div className="p-2 bg-white rounded-full text-neutral-400 group-hover:text-orange-500 transition-colors shadow-sm">
                            <FaPlus />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-widest text-neutral-500 group-hover:text-neutral-900 transition-colors">Add New Payment Method</span>
                        </Motion.button>
                      </div>
                    </div>
                  )}
                </Motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
