import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import Navbar from './Navbar';
import Nav from './Nav';
import OtherNav from './VerifiedNav';
import FooterSection from './FooterSection';
import Button from './Button';
import profilePic from '../assets/placeholderProfile.jpg';

// Icons
import {
  FaCarSide,
  FaMoneyBillWave,
  FaShieldAlt,
  FaUserTie,
  FaFileContract,
  FaCheckCircle,
  FaChevronDown,
  FaSearch,
  FaRoute,
  FaMapMarkerAlt,
  FaClock,
  FaWallet,
  FaHandshake,
  FaTools,
  FaArrowRight,
  FaQuestionCircle,
  FaIdCard,
} from 'react-icons/fa';
import { HiSparkles } from 'react-icons/hi2';
import { IoSpeedometerOutline } from 'react-icons/io5';

const FAQ = () => {
  const { user, role, isAuthenticated } = useSelector((state) => state.verifiedUser);
  const location = useLocation();

  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState(null);

  // Auto-scroll to hash when page loads or hash changes
  useEffect(() => {
    if (location.hash) {
      const elementId = location.hash.replace('#', '');
      const element = document.getElementById(elementId);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 150);
      }
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [location]);

  // Determine smart destination URLs
  const getRiderCtaDestination = () => {
    if (!isAuthenticated) return '/signup';
    if (role === 'rider') return '/riderdashboard';
    return '/rider-profile-setup';
  };

  const getInstallmentCtaDestination = () => {
    if (!isAuthenticated) return '/signup';
    if (role === 'installment') return '/installment-dashboard';
    return '/installment-profile-setup';
  };

  const faqData = [
    {
      category: 'rider',
      question: 'How do I start earning as a Nova rider?',
      answer:
        'To earn as a rider, sign up and choose the "Rider" role. Complete your profile by uploading your personal details, vehicle specifications, required documents (driver\'s license, vehicle registration, roadworthiness / LASDRI, and insurance), and link your bank account. Once verified, turn your status online on your Rider Dashboard to receive and accept trip requests.'
    },
    {
      category: 'rider',
      question: 'How are trip fares calculated and when do I receive payment?',
      answer:
        'Fares are automatically computed based on base fare, total distance (km), and estimated travel time from passenger pickup to destination coordinates. Payments are credited immediately into your in-app Nova Wallet upon marking a trip completed, and you can withdraw to your linked bank account anytime.'
    },
    {
      category: 'rider',
      question: 'What vehicle documents are mandatory for rider onboarding?',
      answer:
        'You must upload: (1) A valid Nigerian Driver\'s License, (2) Vehicle Registration proof, (3) Roadworthiness Certificate / LASDRI clearance, and (4) Valid Vehicle Insurance policy. All documents must be clear and unexpired.'
    },
    {
      category: 'rider',
      question: 'Can I set my own driving hours?',
      answer:
        'Yes! As an independent Nova rider, you have 100% flexibility. You choose when to go online, accept rides within your preferred operating zones, and take breaks whenever you wish.'
    },
    {
      category: 'installment',
      question: 'What is the Nova Maruwa Installment (Hire-Purchase) program?',
      answer:
        'Our installment program allows eligible drivers and aspiring entrepreneurs to acquire a brand-new or certified commercial tricycle (Maruwa) with an initial down payment starting from just ₦60,000. You make convenient weekly or monthly repayments over 12 to 24 months, after which 100% legal ownership is transferred to you.'
    },
    {
      category: 'installment',
      question: 'What are the requirements for the Two (2) Guarantors?',
      answer:
        'You must provide two reputable guarantors. Both guarantors must be gainfully employed or verified business owners with proof of address and valid government ID. Guarantor 1 must earn at least ₦300,000/month, and at least one guarantor must earn ₦500,000 or more per month.'
    },
    {
      category: 'installment',
      question: 'What packages and payment durations are available?',
      answer:
        'We offer three plans: (1) Nova Sprint (12 months) for fastest ownership with minimal total interest, (2) Nova Stability (18 months) for balanced, predictable monthly rates, and (3) Nova Friend (24 months) for maximum payment flexibility with the lowest monthly installment amount.'
    },
    {
      category: 'installment',
      question: 'Is insurance and vehicle maintenance included in the installment plan?',
      answer:
        'Yes. Every vehicle under the Nova installment plan comes pre-fitted with a tamper-proof GPS real-time tracker, comprehensive commercial insurance coverage, and scheduled maintenance support during the duration of your plan.'
    },
    {
      category: 'installment',
      question: 'Can I pay off my Maruwa installment plan earlier than scheduled?',
      answer:
        'Absolutely! Nova encourages early completion. There are zero penalties for early repayments, and completing early enables immediate transfer of all vehicle title deeds and registration directly to your name.'
    },
    {
      category: 'booking',
      question: 'How do passengers book a ride on Nova?',
      answer:
        'Enter your pickup and destination locations on the home screen or "Book a Ride" tab. The system will display the estimated distance, ETA, and fixed upfront fare. Confirm the request to be instantly matched with a top-rated nearby rider.'
    },
    {
      category: 'booking',
      question: 'Can I schedule a ride for later?',
      answer:
        'Yes. When booking, toggle the "Book for Later" option and select your desired date and pickup time. A verified rider will be dispatched ahead of your chosen schedule.'
    },
    {
      category: 'booking',
      question: 'What payment methods are supported for rides?',
      answer:
        'Passengers can pay seamlessly using their secure in-app Nova Wallet (funded via Paystack with cards, bank transfers, or USSD) or cash directly upon trip completion.'
    }
  ];

  const filteredFaqs = faqData.filter((item) => {
    const matchesCategory = activeCategory === 'all' || item.category === activeCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (index) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white selection:bg-orange-500 selection:text-white flex flex-col">
      {/* Dynamic Navbar */}
      <Navbar
        userrole={role}
        userverified={isAuthenticated}
        nav={isAuthenticated ? <OtherNav userrole={role} /> : <Nav userrole={role} userverified={isAuthenticated} />}
        profilePic={user?.profilePic || profilePic}
        button={
          <Link to={'/signup'}>
            <Button
              text={'Own a Ride'}
              classes={'font-bold text-white rounded-e-full rounded-s-full bg-black py-3 px-7 hover:scale-105'}
            />
          </Link>
        }
      />

      {/* Main Container */}
      <main className="flex-1 pt-24 md:pt-32 pb-20 px-4 sm:px-6 md:px-12 lg:px-20 max-w-7xl mx-auto w-full">
        {/* Hero Header */}
        <section className="text-center mb-16 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-black uppercase tracking-widest mb-6"
          >
            <HiSparkles className="text-sm" /> All you need to know
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-neutral-400 text-base md:text-xl max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Detailed blueprints for earning as a certified Nova Rider, acquiring commercial Maruwa in easy installments,
            and booking seamless rides.
          </motion.p>

          {/* Quick Jump Badges */}
          <div className="flex flex-wrap justify-center items-center gap-3 mt-8">
            <a
              href="#bearider"
              className="px-5 py-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-orange-500/50 hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <FaCarSide className="text-orange-500" /> Become a Rider
            </a>
            <a
              href="#installment"
              className="px-5 py-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-orange-500/50 hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <FaMoneyBillWave className="text-orange-500" /> Maruwa Installments
            </a>
            <a
              href="#bookride"
              className="px-5 py-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-orange-500/50 hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <FaRoute className="text-orange-500" /> How Booking Works
            </a>
            <a
              href="#general-faq"
              className="px-5 py-2.5 rounded-2xl bg-neutral-900 border border-neutral-800 hover:border-orange-500/50 hover:bg-neutral-800 text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2"
            >
              <FaQuestionCircle className="text-orange-500" /> Common FAQs
            </a>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 1: BECOME A RIDER (DRIVE & EARN) */}
        {/* ========================================================================= */}
        <section id="bearider" className="scroll-mt-28 mb-28">
          <div className="bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-10 md:p-14 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-orange-500/10 rounded-full blur-[90px] pointer-events-none" />

            {/* Header / Intro */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-10 border-b border-neutral-800/80">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black uppercase tracking-widest">
                  <FaCarSide /> Driver & Rider Empowerment
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                  Become a Nova Rider & <span className="text-orange-500">Earn Daily</span>
                </h2>
                <p className="text-neutral-400 font-medium text-sm sm:text-base leading-relaxed">
                  Join thousands of independent riders earning sustainable income on their own schedule. Connect with
                  passengers looking for rides across town and receive guaranteed instant wallet payouts for every completed trip.
                </p>
              </div>

              <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
                <Link to={getRiderCtaDestination()} className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 active:scale-95 text-white font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-orange-500/20 transition-all flex items-center justify-center gap-3 cursor-pointer">
                    Get Started as Rider <FaArrowRight />
                  </button>
                </Link>
              </div>
            </div>

            {/* How Earnings & Trips Work */}
            <div className="mt-12">
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-6 flex items-center gap-3">
                <FaRoute className="text-orange-500" /> How Ride Booking & Earnings Work
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-black text-lg">
                    1
                  </div>
                  <h4 className="text-base font-bold text-white uppercase tracking-wider">Ride Request Dispatch</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                    When nearby passengers order a ride, an incoming request triggers on your screen displaying pickup coordinates, destination, and upfront calculated fare.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-black text-lg">
                    2
                  </div>
                  <h4 className="text-base font-bold text-white uppercase tracking-wider">Pickup Navigation</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                    Accept the ride to unlock turn-by-turn GPS routing directly to the passenger's exact location. Passengers can view your real-time ETA on their live map.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-black text-lg">
                    3
                  </div>
                  <h4 className="text-base font-bold text-white uppercase tracking-wider">Trip Execution</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                    Pick up the passenger safely, start the trip in the app, and follow the optimized route to the destination while speed and distance are measured accurately.
                  </p>
                </div>

                <div className="p-6 rounded-3xl bg-neutral-900/60 border border-neutral-800 hover:border-neutral-700 transition-all space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-500 font-black text-lg">
                    4
                  </div>
                  <h4 className="text-base font-bold text-white uppercase tracking-wider">Instant Wallet Payout</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                    Upon completing the trip, your earnings are settled instantly into your in-app wallet balance. Transfer funds directly to your verified Nigerian bank account at any time.
                  </p>
                </div>
              </div>
            </div>

            {/* 4-Step Rider Onboarding Breakdown */}
            <div className="mt-14 pt-12 border-t border-neutral-800/80">
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-8 flex items-center gap-3">
                <FaIdCard className="text-orange-500" /> Complete Rider Registration & Setup Process
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Step 1 */}
                <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 flex gap-5 items-start">
                  <div className="p-3 bg-neutral-800 text-orange-400 rounded-2xl text-xl flex-shrink-0">
                    <FaUserTie />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-black text-orange-500 uppercase tracking-widest">Step 01</div>
                    <h4 className="text-lg font-bold text-white">Create Account & Personal Details</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Register on Nova by selecting the <strong>Rider</strong> role. Provide your full name, verified Nigerian phone number, email address, and capture a clear live facial profile photo.
                    </p>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 flex gap-5 items-start">
                  <div className="p-3 bg-neutral-800 text-orange-400 rounded-2xl text-xl flex-shrink-0">
                    <FaCarSide />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-black text-orange-500 uppercase tracking-widest">Step 02</div>
                    <h4 className="text-lg font-bold text-white">Vehicle Specifications</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Enter your vehicle manufacturer (e.g. Bajaj, TVS, Piaggio), vehicle model, manufacture year, official license plate number, color, and passenger seating capacity.
                    </p>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 flex gap-5 items-start">
                  <div className="p-3 bg-neutral-800 text-orange-400 rounded-2xl text-xl flex-shrink-0">
                    <FaFileContract />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-black text-orange-500 uppercase tracking-widest">Step 03</div>
                    <h4 className="text-lg font-bold text-white">Document Verification</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Upload legible images of your <strong>Valid Driver's License</strong>, <strong>Vehicle Registration Certificate</strong>, <strong>Roadworthiness / LASDRI Certificate</strong>, and active <strong>Vehicle Insurance</strong>.
                    </p>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="p-6 rounded-3xl bg-neutral-900/40 border border-neutral-800/80 flex gap-5 items-start">
                  <div className="p-3 bg-neutral-800 text-orange-400 rounded-2xl text-xl flex-shrink-0">
                    <FaWallet />
                  </div>
                  <div className="space-y-2">
                    <div className="text-xs font-black text-orange-500 uppercase tracking-widest">Step 04</div>
                    <h4 className="text-lg font-bold text-white">Bank Account & Payout Setup</h4>
                    <p className="text-xs text-neutral-400 leading-relaxed">
                      Enter your verified commercial bank name, 10-digit NUBAN account number, and account holder name. Once profile review passes, your driver dashboard is unlocked immediately.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Rider Benefits Cards */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-center space-y-2">
                <FaClock className="text-2xl text-orange-500 mx-auto" />
                <div className="text-sm font-bold text-white">Flexible Schedules</div>
                <div className="text-xs text-neutral-400">Drive when you want, earn at your pace</div>
              </div>
              <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-center space-y-2">
                <FaMoneyBillWave className="text-2xl text-orange-500 mx-auto" />
                <div className="text-sm font-bold text-white">Low Commission</div>
                <div className="text-xs text-neutral-400">Take home the highest share of trip fares</div>
              </div>
              <div className="p-5 rounded-2xl bg-neutral-900/80 border border-neutral-800 text-center space-y-2">
                <FaShieldAlt className="text-2xl text-orange-500 mx-auto" />
                <div className="text-sm font-bold text-white">24/7 Driver Support</div>
                <div className="text-xs text-neutral-400">Live emergency and in-app assistance</div>
              </div>
            </div>

            {/* Bottom CTA Bar */}
            <div className="mt-10 pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-neutral-400 text-xs font-bold uppercase tracking-wider text-center sm:text-left">
                Ready to hit the road and maximize your daily revenue?
              </div>
              <Link to={getRiderCtaDestination()}>
                <Button
                  text={'Get Started Now'}
                  classes={'font-black py-3 px-8 rounded-xl text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 text-xs uppercase tracking-widest cursor-pointer'}
                />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 2: MARUWA INSTALLMENTS (HIRE-PURCHASE) */}
        {/* ========================================================================= */}
        <section id="installment" className="scroll-mt-28 mb-28">
          <div className="bg-gradient-to-b from-neutral-900/90 to-neutral-950/90 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-10 md:p-14 relative overflow-hidden shadow-2xl">
            <div className="absolute -top-24 -left-24 w-80 h-80 bg-amber-500/10 rounded-full blur-[90px] pointer-events-none" />

            {/* Header / Intro */}
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8 pb-10 border-b border-neutral-800/80">
              <div className="space-y-3 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-widest">
                  <FaHandshake /> Asset Ownership Program
                </div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
                  Own Your Own Maruwa with <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">
                    ₦60,000 Down Payment
                  </span>
                </h2>
                <p className="text-neutral-400 font-medium text-sm sm:text-base leading-relaxed">
                  No predatory loan sharks. Nova offers a transparent, dignified hire-purchase model to help drivers and
                  entrepreneurs step into full commercial vehicle ownership with structured, stress-free repayment schedules.
                </p>
              </div>

              <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
                <Link to={getInstallmentCtaDestination()} className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto px-8 py-4 bg-amber-500 hover:bg-amber-600 active:scale-95 text-neutral-950 font-black text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-amber-500/20 transition-all flex items-center justify-center gap-3 cursor-pointer">
                    Apply for Installment <FaArrowRight />
                  </button>
                </Link>
              </div>
            </div>

            {/* Deposit & Core Requirements Highlights */}
            <div className="mt-12">
              <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white mb-6 flex items-center gap-3">
                <FaShieldAlt className="text-amber-500" /> Eligibility & Key Requirements
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Highlight 1: Downpayment */}
                <div className="p-8 rounded-[2rem] bg-neutral-900/80 border-2 border-amber-500/30 relative overflow-hidden space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center text-xl">
                    <FaMoneyBillWave />
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-amber-400">Initial Down Payment</div>
                  <div className="text-3xl font-black text-white">₦60,000</div>
                  <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                    A minimum security deposit of ₦60,000 is required upon application approval to allocate and prepare your vehicle for handover.
                  </p>
                </div>

                {/* Highlight 2: Two Guarantors */}
                <div className="p-8 rounded-[2rem] bg-neutral-900/80 border border-neutral-800 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-400 flex items-center justify-center text-xl">
                    <FaUserTie />
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-orange-400">Two (2) Guarantors</div>
                  <div className="text-xl font-bold text-white">Verified Working Adults</div>
                  <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                    Guarantor 1 must earn at least ₦300,000/month, and at least one guarantor must earn <strong>₦500,000+</strong> per month with verifiable employment and address.
                  </p>
                </div>

                {/* Highlight 3: Identity & Documentation */}
                <div className="p-8 rounded-[2rem] bg-neutral-900/80 border border-neutral-800 space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-neutral-800 text-neutral-300 flex items-center justify-center text-xl">
                    <FaIdCard />
                  </div>
                  <div className="text-xs font-black uppercase tracking-widest text-neutral-400">Verification IDs</div>
                  <div className="text-xl font-bold text-white">BVN, NIN & Govt ID</div>
                  <p className="text-xs text-neutral-400 font-medium leading-relaxed">
                    Standard 11-digit BVN and NIN validation, alongside an unexpired National ID, Driver's License, or International Passport.
                  </p>
                </div>
              </div>
            </div>

            {/* Installment Packages Breakdown */}
            <div className="mt-14 pt-12 border-t border-neutral-800/80">
              <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
                <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-white">
                  Choose Your Repayment Package
                </h3>
                <p className="text-xs sm:text-sm text-neutral-400 font-medium">
                  Tailored plans designed to match your earning capacity and target timeline to 100% legal ownership.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Plan 1: Nova Sprint */}
                <div className="p-8 rounded-[2.5rem] bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="inline-block px-3 py-1 rounded-full bg-neutral-800 text-[10px] font-black uppercase tracking-widest text-amber-400">
                      Fast Track
                    </div>
                    <h4 className="text-2xl font-black text-white">Nova Sprint</h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-amber-400">12</span>
                      <span className="text-xs font-black uppercase tracking-widest text-neutral-400">Months Duration</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                      Designed for highly focused, aggressive daily earners looking to finish payments and own their vehicle in record time.
                    </p>
                    <ul className="space-y-2.5 pt-2 border-t border-neutral-800 text-xs text-neutral-300 font-medium">
                      <li className="flex items-center gap-2">
                        <FaCheckCircle className="text-amber-400 flex-shrink-0" /> Lowest total interest rate
                      </li>
                      <li className="flex items-center gap-2">
                        <FaCheckCircle className="text-amber-400 flex-shrink-0" /> Quickest ownership transfer
                      </li>
                      <li className="flex items-center gap-2">
                        <FaCheckCircle className="text-amber-400 flex-shrink-0" /> Full tracker & insurance included
                      </li>
                    </ul>
                  </div>
                  <Link to={getInstallmentCtaDestination()} className="w-full">
                    <button className="w-full py-3 bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer">
                      Select Sprint
                    </button>
                  </Link>
                </div>

                {/* Plan 2: Nova Stability (Popular) */}
                <div className="p-8 rounded-[2.5rem] bg-gradient-to-b from-amber-500/10 via-neutral-900 to-neutral-900 border-2 border-amber-500 shadow-2xl shadow-amber-500/10 flex flex-col justify-between space-y-6 relative">
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-amber-500 text-neutral-950 font-black text-[10px] uppercase tracking-widest px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                  <div className="space-y-4">
                    <div className="inline-block px-3 py-1 rounded-full bg-amber-500/20 text-[10px] font-black uppercase tracking-widest text-amber-300">
                      Balanced Choice
                    </div>
                    <h4 className="text-2xl font-black text-white">Nova Stability</h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-amber-400">18</span>
                      <span className="text-xs font-black uppercase tracking-widest text-neutral-400">Months Duration</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                      The ideal balance between manageable monthly remittances and a timely completion timeline for steady drivers.
                    </p>
                    <ul className="space-y-2.5 pt-2 border-t border-neutral-800 text-xs text-neutral-300 font-medium">
                      <li className="flex items-center gap-2">
                        <FaCheckCircle className="text-amber-400 flex-shrink-0" /> Optimized monthly payment rate
                      </li>
                      <li className="flex items-center gap-2">
                        <FaCheckCircle className="text-amber-400 flex-shrink-0" /> Predictable, steady milestones
                      </li>
                      <li className="flex items-center gap-2">
                        <FaCheckCircle className="text-amber-400 flex-shrink-0" /> Full tracker & maintenance support
                      </li>
                    </ul>
                  </div>
                  <Link to={getInstallmentCtaDestination()} className="w-full">
                    <button className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-amber-500/20 cursor-pointer">
                      Select Stability
                    </button>
                  </Link>
                </div>

                {/* Plan 3: Nova Friend */}
                <div className="p-8 rounded-[2.5rem] bg-neutral-900/90 border border-neutral-800 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-6">
                  <div className="space-y-4">
                    <div className="inline-block px-3 py-1 rounded-full bg-neutral-800 text-[10px] font-black uppercase tracking-widest text-amber-400">
                      Maximum Ease
                    </div>
                    <h4 className="text-2xl font-black text-white">Nova Friend</h4>
                    <div className="flex items-baseline gap-1">
                      <span className="text-4xl font-black text-amber-400">24</span>
                      <span className="text-xs font-black uppercase tracking-widest text-neutral-400">Months Duration</span>
                    </div>
                    <p className="text-xs text-neutral-400 leading-relaxed font-medium">
                      Maximum comfort and lowest periodic payment amount, giving you ample room to cover living expenses comfortably.
                    </p>
                    <ul className="space-y-2.5 pt-2 border-t border-neutral-800 text-xs text-neutral-300 font-medium">
                      <li className="flex items-center gap-2">
                        <FaCheckCircle className="text-amber-400 flex-shrink-0" /> Lowest monthly installment strain
                      </li>
                      <li className="flex items-center gap-2">
                        <FaCheckCircle className="text-amber-400 flex-shrink-0" /> Flexible long-term partnership
                      </li>
                      <li className="flex items-center gap-2">
                        <FaCheckCircle className="text-amber-400 flex-shrink-0" /> Complete asset handover at term
                      </li>
                    </ul>
                  </div>
                  <Link to={getInstallmentCtaDestination()} className="w-full">
                    <button className="w-full py-3 bg-neutral-800 hover:bg-amber-500 hover:text-neutral-950 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all cursor-pointer">
                      Select Friend
                    </button>
                  </Link>
                </div>
              </div>
            </div>

            {/* Inclusions & Safety Guarantee */}
            <div className="mt-12 bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl text-lg flex-shrink-0">
                  <FaTools />
                </div>
                <div>
                  <h5 className="font-bold text-white text-sm">Servicing Support</h5>
                  <p className="text-[11px] text-neutral-400 mt-1">Scheduled routine technical maintenance checks.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl text-lg flex-shrink-0">
                  <FaShieldAlt />
                </div>
                <div>
                  <h5 className="font-bold text-white text-sm">Comprehensive Insurance</h5>
                  <p className="text-[11px] text-neutral-400 mt-1">Protection against accidents, theft, and third-party liabilities.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl text-lg flex-shrink-0">
                  <IoSpeedometerOutline />
                </div>
                <div>
                  <h5 className="font-bold text-white text-sm">Pre-fitted GPS Tracker</h5>
                  <p className="text-[11px] text-neutral-400 mt-1">24/7 anti-theft tracking and geo-fencing included.</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl text-lg flex-shrink-0">
                  <FaFileContract />
                </div>
                <div>
                  <h5 className="font-bold text-white text-sm">Ownership Transfer</h5>
                  <p className="text-[11px] text-neutral-400 mt-1">Full vehicle particulars legally transferred upon completion.</p>
                </div>
              </div>
            </div>

            {/* Bottom CTA Bar */}
            <div className="mt-10 pt-8 border-t border-neutral-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-neutral-400 text-xs font-bold uppercase tracking-wider text-center sm:text-left">
                Start your journey towards commercial vehicle ownership today.
              </div>
              <Link to={getInstallmentCtaDestination()}>
                <Button
                  text={'Get Started Now'}
                  classes={'font-black py-3 px-8 rounded-xl text-neutral-950 bg-amber-500 hover:bg-amber-400 shadow-lg shadow-amber-500/20 text-xs uppercase tracking-widest cursor-pointer'}
                />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 3: HOW RIDE BOOKING WORKS (SERVICES & SCHEDULE) */}
        {/* ========================================================================= */}
        <section id="bookride" className="scroll-mt-28 mb-28">
          <div className="bg-neutral-900/50 border border-neutral-800 rounded-[2.5rem] p-6 sm:p-10 md:p-14 relative overflow-hidden">
            <div id="services" className="scroll-mt-32" />
            <div id="later" className="scroll-mt-32" />

            <div className="max-w-3xl mb-12 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/30 text-orange-400 text-xs font-black uppercase tracking-widest">
                <FaMapMarkerAlt /> Passenger & Commuter Services
              </div>
              <h2 className="text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
                How Booking on Nova Works
              </h2>
              <p className="text-neutral-400 font-medium text-sm sm:text-base leading-relaxed">
                Whether you need an immediate ride across Lagos or want to schedule a trip for later, Nova provides quick, safe, and transparent rides at the best rates.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-neutral-950/80 border border-neutral-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-sm">
                  1
                </div>
                <h4 className="text-base font-bold text-white">Enter Locations</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Type your pickup address or use current GPS position, then select your destination. Nova shows distance, estimated time, and upfront transparent fare.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-neutral-950/80 border border-neutral-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-sm">
                  2
                </div>
                <h4 className="text-base font-bold text-white">Instant Matching & Live Map</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Nearby vetted drivers receive the trip request. View your assigned rider's name, rating, vehicle details, and live coordinates approaching your pickup point.
                </p>
              </div>

              <div className="p-6 rounded-3xl bg-neutral-950/80 border border-neutral-800 space-y-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 text-orange-400 flex items-center justify-center font-bold text-sm">
                  3
                </div>
                <h4 className="text-base font-bold text-white">Safe Ride & Cashless Payment</h4>
                <p className="text-xs text-neutral-400 leading-relaxed">
                  Enjoy your ride. Pay automatically via your in-app wallet or cash on completion, and rate your driver experience to maintain community safety standards.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-neutral-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-neutral-400 font-bold uppercase tracking-wider">
                Need to travel now? Book your ride in seconds.
              </div>
              <Link to={isAuthenticated ? '/bookride' : '/signup'}>
                <Button
                  text={'Book a Ride'}
                  classes={'font-black py-3 px-8 rounded-xl text-white bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 text-xs uppercase tracking-widest cursor-pointer'}
                />
              </Link>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* SECTION 4: FREQUENTLY ASKED QUESTIONS (ACCORDION & SEARCH) */}
        {/* ========================================================================= */}
        <section id="general-faq" className="scroll-mt-28">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
              Frequently Asked Questions
            </h2>
            <p className="text-neutral-400 text-sm font-medium">
              Have questions? Explore quick answers below or filter by category.
            </p>
          </div>

          {/* Search Bar & Category Filters */}
          <div className="max-w-3xl mx-auto mb-10 space-y-6">
            {/* Search Input */}
            <div className="relative">
              <FaSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 text-sm" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search topics (e.g., guarantors, deposit, driver license, wallet, earnings)..."
                className="w-full pl-12 pr-6 py-4 rounded-2xl bg-neutral-900 border border-neutral-800 focus:border-orange-500 focus:outline-none text-white text-sm placeholder-neutral-500 transition-all shadow-inner"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-neutral-400 hover:text-white px-2 py-1 bg-neutral-800 rounded-md cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Category Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              {[
                { id: 'all', label: 'All Questions' },
                { id: 'rider', label: 'Rider & Earnings' },
                { id: 'installment', label: 'Maruwa Installments' },
                { id: 'booking', label: 'Ride Booking & Trips' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-black uppercase tracking-wider transition-all cursor-pointer ${activeCategory === tab.id
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20 scale-105'
                    : 'bg-neutral-900 text-neutral-400 border border-neutral-800 hover:bg-neutral-800 hover:text-white'
                    }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Accordion FAQ Items */}
          <div className="max-w-3xl mx-auto space-y-4">
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((item, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.04 }}
                    className={`rounded-2xl border transition-all overflow-hidden ${isOpen
                      ? 'bg-neutral-900/90 border-orange-500/50 shadow-xl'
                      : 'bg-neutral-900/40 border-neutral-800/80 hover:border-neutral-700'
                      }`}
                  >
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="font-bold text-sm sm:text-base text-white leading-snug">
                        {item.question}
                      </span>
                      <div
                        className={`p-2 rounded-full transition-transform duration-300 ${isOpen ? 'bg-orange-500 text-white rotate-180' : 'bg-neutral-800 text-neutral-400'
                          }`}
                      >
                        <FaChevronDown className="text-xs" />
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-6 pb-6 pt-2 text-xs sm:text-sm text-neutral-400 font-medium leading-relaxed border-t border-neutral-800/50">
                            {item.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })
            ) : (
              <div className="text-center py-16 bg-neutral-900/30 rounded-3xl border border-neutral-800">
                <FaQuestionCircle className="text-4xl text-neutral-600 mx-auto mb-3" />
                <p className="text-neutral-400 font-bold text-sm">No questions match your query.</p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setActiveCategory('all');
                  }}
                  className="mt-4 px-4 py-2 bg-neutral-800 text-xs font-bold text-orange-400 rounded-xl hover:bg-neutral-700 transition-colors cursor-pointer"
                >
                  Reset filters
                </button>
              </div>
            )}
          </div>
        </section>

        {/* Global Bottom CTA Card */}
        <section className="mt-28 bg-gradient-to-r from-orange-600 via-orange-500 to-amber-500 rounded-[2.5rem] p-8 sm:p-12 md:p-16 text-center text-white relative overflow-hidden shadow-2xl">
          <div className="max-w-3xl mx-auto space-y-6 relative z-10">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-neutral-950">
              Ready to Take Control of Your Financial Future?
            </h2>
            <p className="text-neutral-950/80 font-bold text-sm sm:text-base leading-relaxed">
              Whether you want to earn daily as an active rider or own a Maruwa with our ₦60,000 down payment plan, Nova is built for your growth.
            </p>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4">
              <Link to={getRiderCtaDestination()} className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-neutral-950 text-white hover:bg-neutral-900 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all cursor-pointer">
                  Register as Rider
                </button>
              </Link>
              <Link to={getInstallmentCtaDestination()} className="w-full sm:w-auto">
                <button className="w-full sm:w-auto px-8 py-4 bg-white text-neutral-950 hover:bg-neutral-100 font-black text-xs uppercase tracking-widest rounded-2xl shadow-xl transition-all cursor-pointer">
                  Apply for Installment
                </button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <FooterSection />
    </div>
  );
};

export default FAQ;
