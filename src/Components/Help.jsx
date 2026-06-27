import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEnvelope, FaPhone, FaComments } from 'react-icons/fa';
import { HiChevronDown, HiChevronUp } from 'react-icons/hi2';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
const Help = () => {
  const user = useSelector(state => state.verifiedUser.user);
  const userRoles = useSelector(state => state.verifiedUser.role);
  const isAuthenticated = useSelector(state => state.verifiedUser.isAuthenticated);
  const [activeFaq, setActiveFaq] = useState(null);
  const faqs = [
    {
      question: "How do I request a ride on Nova Crest?",
      answer: "Navigate to the home screen (or 'Book a Ride' in the navigation bar) and enter your pickup and destination coordinates/locations. Our matching engine will search for available riders nearby, showing you live statuses."
    },
    {
      question: "What installment options are available for purchasing a vehicle?",
      answer: "We offer vehicle ownership plans where you can purchase a maruwa or bike on installment. Navigate to 'Own a maruwa' in the dashboard, complete your installments profile, BVN/NIN verification, upload documents, and choose a plan."
    },
    {
      question: "How does wallet funding work?",
      answer: "You can fund your user/driver wallet directly inside the application using our integrated Paystack payment gateway. Go to your 'Wallet' tab, choose fund, and complete the transaction securely."
    },
    {
      question: "Can I contact my assigned rider directly?",
      answer: "Yes, once a rider accepts your ride, you will be taken to the Live Tracking screen where you can view their name, rating, vehicle detail, phone number, and their real-time location."
    },
    {
      question: "How secure is my personal and payment data?",
      answer: "All personal information and BVN/NIN verification data are encrypted. Card processing is handled securely by Paystack (a PCI-DSS compliant payment provider) and is never stored on our local servers."
    }
  ];
  const toggleFaq = (index) => {
    if (activeFaq === index) {
      setActiveFaq(null);
    } else {
      setActiveFaq(index);
    }
  };
  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-orange-500 selection:text-white">
      {/* Navigation */}
      <Navbar
        userrole={userRoles}
        userverified={isAuthenticated}
        profilePic={user?.profilePic || "/placeholderProfile.jpg"}
        nav={<OtherNav userrole={userRoles} userverified={isAuthenticated} />}
      />
      <div className="mt-28 px-4 md:px-8 pb-16">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter italic mb-4">
                Support <span className="text-orange-500">Center</span>
              </h1>
              <p className="text-sm text-neutral-400 font-bold uppercase tracking-widest max-w-xl mx-auto">
                Have questions or need assistance? We're available 24/7 to keep your journey smooth.
              </p>
            </motion.div>
          </div>
          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {/* Email Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-center flex flex-col items-center hover:bg-white/10 transition-colors"
            >
              <div className="w-16 h-16 bg-orange-500/10 rounded-2xl flex items-center justify-center text-orange-500 border border-orange-500/20 mb-6">
                <FaEnvelope className="text-2xl" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight italic mb-3">Email Support</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-6 flex-grow">
                Send an email for business inquiries, documentation issues, or detailed technical assistance.
              </p>
              <a
                href="mailto:novacrestmultico@gmail.com"
                className="bg-orange-500 hover:bg-orange-600 text-white font-black uppercase tracking-widest text-xs py-3 px-6 rounded-full transition-colors"
              >
                novacrestmultico@gmail.com
              </a>
            </motion.div>
            {/* Phone Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-center flex flex-col items-center hover:bg-white/10 transition-colors"
            >
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-500 border border-blue-500/20 mb-6">
                <FaPhone className="text-2xl" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight italic mb-3">Direct Call</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-6 flex-grow">
                Speak directly with one of our support agents for immediate ride or account assistance.
              </p>
              <a
                href="tel:+2349033438300"
                className="bg-blue-500 hover:bg-blue-600 text-white font-black uppercase tracking-widest text-xs py-3 px-6 rounded-full transition-colors"
              >
                +234 903 343 8300
              </a>
            </motion.div>
            {/* Live Chat Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white/5 border border-white/10 rounded-[2.5rem] p-8 text-center flex flex-col items-center hover:bg-white/10 transition-colors"
            >
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center text-green-500 border border-green-500/20 mb-6">
                <FaComments className="text-2xl" />
              </div>
              <h3 className="text-xl font-black uppercase tracking-tight italic mb-3">Live Chat</h3>
              <p className="text-sm text-neutral-400 leading-relaxed mb-6 flex-grow">
                Initiate a live support conversation directly inside the app with an online administrator.
              </p>
              <button
                onClick={() => {
                  const chatBtn = document.getElementById('floating-chat-trigger');
                  if (chatBtn) chatBtn.click();
                }}
                className="bg-green-500 hover:bg-green-600 text-white font-black uppercase tracking-widest text-xs py-3 px-6 rounded-full transition-colors"
              >
                Start Live Chat
              </button>
            </motion.div>
          </div>
          {/* FAQs Accordion */}
          <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tighter italic mb-8 text-center md:text-left">
              Frequently Asked <span className="text-orange-500">Questions</span>
            </h2>
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border-b border-white/10 pb-4 last:border-0"
                >
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full flex items-center justify-between text-left py-3 focus:outline-none group"
                  >
                    <span className="font-bold text-sm md:text-base uppercase tracking-tight text-neutral-200 group-hover:text-white transition-colors">
                      {faq.question}
                    </span>
                    <span className="text-orange-500 text-lg">
                      {activeFaq === index ? <HiChevronUp /> : <HiChevronDown />}
                    </span>
                  </button>
                  <AnimatePresence initial={false}>
                    {activeFaq === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-sm text-neutral-400 leading-relaxed pt-2 pb-4">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Help;