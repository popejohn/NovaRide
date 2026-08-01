import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import Button from './Button';
import api from '../services/axios';
import { FaWallet, FaCreditCard, FaMoneyBillWave, FaArrowUp, FaArrowDown, FaHistory, FaPlus, FaExchangeAlt, FaReceipt, FaMinus, FaArrowLeft } from 'react-icons/fa';
import SidebarButton from './Profile/SidebarButton';
import { PaystackButton } from 'react-paystack';

const Motion = motion;

// Wrapper component for PaystackButton with fixed amount
const AddMoneyButtonWrapper = ({ userEmail, setWalletBalance, setTransactions }) => {
    const token = localStorage.getItem('nvcr_tk');
    const defaultAmount = 5000; // Default amount in Naira

    return (
        <PaystackButton
            className="bg-orange-500 text-white font-black uppercase tracking-widest text-[10px] py-4 px-8 rounded-2xl shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all flex items-center justify-center gap-2"
            text="Add Money"
            email={userEmail || `user_${Date.now()}@novacrest.local`}
            amount={defaultAmount * 100} // in kobo
            publicKey="pk_test_26f1b45d2f2c179ed904deee64e9fe8c60ff8fc4"
            reference={(new Date()).getTime().toString()}
            onSuccess={async (transaction) => {
                try {
                    await api.post('/paystack/verify-wallet-funding', {
                        reference: transaction.reference
                    }, {
                        headers: { Authorization: `Bearer ${token}` }
                    });

                    toast.success('Wallet funded successfully!');
                    const refreshRes = await api.get('/user/wallet-data', {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    setWalletBalance(refreshRes.data.walletBalance);
                    setTransactions(refreshRes.data.transactions);
                } catch (verifyError) {
                    console.error('Verification failed:', verifyError);
                    toast.error('Payment verification failed. Please contact support.');
                }
            }}
            onClose={() => {
                toast.info('Payment cancelled.');
            }}
        />
    );
};

const WithdrawButtonWrapper = ({ walletBalance, setWalletBalance, setTransactions }) => {
    const [amount, setAmount] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleWithdraw = async () => {
        const amountToWithdraw = Number(amount);

        if (!amount || Number.isNaN(amountToWithdraw) || amountToWithdraw <= 0) {
            toast.error('Please enter a valid amount.');
            return;
        }

        if (amountToWithdraw > walletBalance) {
            toast.error(`Insufficient balance. You can only withdraw up to ₦${walletBalance.toLocaleString()}`);
            return;
        }

        try {
            setIsSubmitting(true);
            const token = localStorage.getItem('nvcr_tk');
            await api.post('/paystack/withdraw', {
                amount: amountToWithdraw
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            toast.success(`Withdrawal request submitted successfully! You will receive ₦${amountToWithdraw.toLocaleString()} within 1-3 business days.`);
            setShowModal(false);
            setAmount('');

            const refreshRes = await api.get('/user/wallet-data', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            setWalletBalance(refreshRes.data.walletBalance);
            setTransactions(refreshRes.data.transactions);
        } catch (error) {
            console.error('Withdrawal error:', error);
            toast.error(error?.response?.data?.message || 'Withdrawal failed. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setShowModal(true)}
                className="bg-white text-neutral-900 font-black uppercase tracking-widest text-[10px] py-4 px-8 rounded-2xl shadow-lg hover:bg-neutral-100 transition-colors border border-neutral-200 focus:outline-none focus:ring-2 focus:ring-orange-500/40"
            >
                <span className="flex items-center gap-2"><FaMinus className="text-[10px]" /> Withdraw</span>
            </button>

            {showModal && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/60 backdrop-blur-sm p-4"
                    onClick={(event) => {
                        if (event.target === event.currentTarget) {
                            setShowModal(false);
                        }
                    }}
                >
                    <div className="w-full max-w-md rounded-[2rem] bg-white p-6 shadow-2xl border border-neutral-100 relative z-10">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">Withdraw</p>
                                <h3 className="text-xl font-black text-neutral-900 tracking-tight">Enter amount</h3>
                            </div>
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="text-neutral-400 hover:text-neutral-700 text-xl leading-none"
                                aria-label="Close withdrawal modal"
                            >
                                ×
                            </button>
                        </div>

                        <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400 mb-2">Amount (₦)</label>
                        <input
                            type="number"
                            min="100"
                            step="100"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            placeholder="1000"
                            className="w-full rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-neutral-900 outline-none focus:border-orange-500"
                        />

                        <div className="mt-6 flex gap-3">
                            <button
                                type="button"
                                onClick={() => setShowModal(false)}
                                className="flex-1 rounded-2xl border border-neutral-200 bg-white px-4 py-3 text-[10px] font-black uppercase tracking-widest text-neutral-700"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleWithdraw}
                                disabled={isSubmitting}
                                className="flex-1 rounded-2xl bg-orange-500 px-4 py-3 text-[10px] font-black uppercase tracking-widest text-white disabled:opacity-60"
                            >
                                {isSubmitting ? 'Submitting...' : 'Confirm'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

const TransactionItem = ({ transaction }) => {
  const isIncoming = transaction.type === 'credit' || transaction.type === 'funding';
  
  return (
    <Motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-5 bg-white/50 backdrop-blur-sm border border-neutral-100 rounded-2xl hover:bg-white hover:border-orange-500/30 transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${isIncoming ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'} group-hover:scale-110 transition-transform`}>
          {isIncoming ? (
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
      <div className={`text-sm font-black tracking-tighter ${isIncoming ? 'text-green-600' : 'text-red-600'}`}>
        {isIncoming ? '+' : '-'} ₦{transaction.amount.toLocaleString()}
      </div>
    </Motion.div>
  );
};

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
        const response = await api.get('/user/wallet-data', {
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
    .filter(t => t.type === 'credit' || t.type === 'funding')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpent = transactions
    .filter(t => t.type === 'debit' || t.type === 'withdrawal')
    .reduce((sum, t) => sum + t.amount, 0);

  const getRoleDisplay = () => {
    switch (user?.role) {
      case 'rider': return 'Rider';
      case 'installment': return 'Installment Customer';
      default: return 'Passenger';
    }
  };

  const navigate = useNavigate();

  const normalizedRoles = Array.isArray(user?.role)
    ? user.role
    : user?.role
      ? [user.role]
      : [];
  const canWithdraw = normalizedRoles.includes('rider');

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
                      <div className="flex justify-between items-center gap-4 flex-wrap">
                        <div className="flex items-center gap-4">
                          <Motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate('/bookride')}
                            className="p-3 bg-neutral-100 hover:bg-neutral-200 rounded-xl transition-all text-neutral-700 font-black"
                            title="Back to Booking"
                          >
                            <FaArrowLeft className="text-lg" />
                          </Motion.button>
                          <div>
                            <h3 className="text-2xl font-black text-neutral-900 tracking-tight">Wallet Overview</h3>
                            <p className="text-sm text-neutral-500 mt-1">Monitor your earnings and spending status.</p>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          {canWithdraw && (
                            <WithdrawButtonWrapper walletBalance={walletBalance} setWalletBalance={setWalletBalance} setTransactions={setTransactions} />
                          )}
                          <div>
                            <AddMoneyButtonWrapper userEmail={user?.email} setWalletBalance={setWalletBalance} setTransactions={setTransactions} />
                          </div>
                        </div>
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




