import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import Button from './Button';
import { FaCar, FaCalculator, FaClock, FaMoneyBillWave, FaChartLine } from 'react-icons/fa';

const SidebarButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-3 rounded-md mb-2 ${active ? 'bg-yellow-400 text-black' : 'hover:bg-gray-100 text-white/90'}`}
  >
    {children}
  </button>
);

const PaymentProgress = ({ totalAmount, paidAmount, nextPaymentDate }) => {
  const progress = (paidAmount / totalAmount) * 100;
  const remainingAmount = totalAmount - paidAmount;
  const daysUntilPayment = Math.ceil((new Date(nextPaymentDate) - new Date()) / (1000 * 60 * 60 * 24));

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-3">Payment Progress</h3>
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Progress</span>
            <span>{progress.toFixed(1)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">₦{paidAmount.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Paid</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">₦{remainingAmount.toLocaleString()}</div>
            <div className="text-sm text-gray-500">Remaining</div>
          </div>
        </div>

        <div className="bg-yellow-50 p-3 rounded-lg">
          <div className="flex items-center space-x-2">
            <FaClock className="text-yellow-600" />
            <div>
              <div className="font-medium">Next Payment Due</div>
              <div className="text-sm text-gray-600">
                {daysUntilPayment > 0 ? `${daysUntilPayment} days left` : 'Overdue'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const VehicleDetails = ({ vehicle }) => (
  <div className="p-4 bg-white rounded shadow">
    <h3 className="font-semibold mb-3">Your Vehicle</h3>
    <div className="flex items-center space-x-4">
      <img src={vehicle.image} alt={vehicle.name} className="w-20 h-20 rounded-lg object-cover" />
      <div>
        <h4 className="font-semibold text-lg">{vehicle.name}</h4>
        <p className="text-gray-600">Plate: {vehicle.plateNumber}</p>
        <p className="text-gray-600">Color: {vehicle.color}</p>
      </div>
    </div>

    <div className="mt-4 space-y-2">
      <div className="flex justify-between">
        <span className="text-gray-600">Engine:</span>
        <span>{vehicle.specs.engine}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Transmission:</span>
        <span>{vehicle.specs.transmission}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Fuel Type:</span>
        <span>{vehicle.specs.fuelType}</span>
      </div>
      <div className="flex justify-between">
        <span className="text-gray-600">Mileage:</span>
        <span>{vehicle.specs.mileage}</span>
      </div>
    </div>
  </div>
);

const FinanceCalculator = ({ installment }) => {
  const [extraPayment, setExtraPayment] = useState(0);
  const [newTenure, setNewTenure] = useState(installment.remainingMonths);

  const calculateNewSchedule = () => {
    const remainingPrincipal = installment.totalAmount - installment.paidAmount;
    const newMonthlyPayment = (remainingPrincipal + extraPayment) / newTenure;
    const totalNewAmount = installment.paidAmount + (newMonthlyPayment * newTenure);

    return {
      newMonthlyPayment: Math.round(newMonthlyPayment),
      totalNewAmount: Math.round(totalNewAmount),
      savings: Math.round(installment.totalAmount - totalNewAmount)
    };
  };

  const calculation = calculateNewSchedule();

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-3">Finance Calculator</h3>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Extra Payment (₦)</label>
          <input
            type="number"
            value={extraPayment}
            onChange={(e) => setExtraPayment(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-yellow-400"
            placeholder="0"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">New Tenure (Months)</label>
          <input
            type="number"
            value={newTenure}
            onChange={(e) => setNewTenure(Number(e.target.value))}
            min="1"
            max={installment.remainingMonths}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-1 focus:ring-yellow-400"
          />
        </div>

        <div className="bg-gray-50 p-3 rounded-lg space-y-2">
          <div className="flex justify-between">
            <span className="text-sm">New Monthly Payment:</span>
            <span className="font-semibold">₦{calculation.newMonthlyPayment.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm">New Total Amount:</span>
            <span className="font-semibold">₦{calculation.totalNewAmount.toLocaleString()}</span>
          </div>
          <div className="flex justify-between text-green-600">
            <span className="text-sm">Potential Savings:</span>
            <span className="font-semibold">₦{calculation.savings.toLocaleString()}</span>
          </div>
        </div>

        <Button
          text="Apply Changes"
          classes="w-full bg-yellow-400 text-black py-2 px-4 rounded hover:bg-yellow-500"
        />
      </div>
    </div>
  );
};

const PaymentHistory = ({ payments }) => (
  <div className="p-4 bg-white rounded shadow">
    <h3 className="font-semibold mb-3">Payment History</h3>
    {payments.length === 0 ? (
      <div className="text-sm text-gray-500">No payments yet</div>
    ) : (
      <div className="space-y-2">
        {payments.map((payment, idx) => (
          <div key={idx} className="flex justify-between items-center p-2 border rounded">
            <div>
              <div className="font-medium">₦{payment.amount.toLocaleString()}</div>
              <div className="text-sm text-gray-500">{payment.date}</div>
            </div>
            <div className={`px-2 py-1 rounded text-xs ${
              payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
            }`}>
              {payment.status}
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

const InstallmentDashboard = () => {
  const { user } = useSelector(state => state.verifiedUser);

  const [view, setView] = useState('overview');

  // Mock installment data
  const installmentData = {
    vehicle: {
      id: 1,
      name: 'Toyota Camry 2024',
      plateNumber: 'ABC 123 XY',
      color: 'White',
      image: '/placeholderProfile.jpg',
      specs: {
        engine: '2.5L 4-Cylinder',
        transmission: 'Automatic',
        fuelType: 'Petrol',
        mileage: '1,250 km'
      }
    },
    installment: {
      totalAmount: 9200000,
      paidAmount: 3680000,
      remainingMonths: 24,
      monthlyPayment: 184000,
      nextPaymentDate: '2025-01-15',
      startDate: '2024-01-15',
      endDate: '2026-01-15'
    },
    payments: [
      { amount: 184000, date: '2024-12-15', status: 'completed' },
      { amount: 184000, date: '2024-11-15', status: 'completed' },
      { amount: 184000, date: '2024-10-15', status: 'completed' },
      { amount: 184000, date: '2024-09-15', status: 'completed' },
      { amount: 184000, date: '2024-08-15', status: 'pending' }
    ]
  };

  return (
    <div className="min-h-screen">
      <Navbar userrole="installment" userverified={true} profilePic="/placeholderProfile.jpg" nav={<OtherNav userrole="installment" />} />

      <div className="mt-24 px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <aside className="col-span-1 bg-black text-white rounded p-4">
            <div className="mb-6">
              <div className="text-sm text-gray-300">Installment Customer</div>
              <div className="text-xl font-bold text-orange-400">{user?.firstname || 'Customer'}</div>
              <div className="text-sm text-gray-400">Vehicle Owner</div>
            </div>

            <SidebarButton active={view === 'overview'} onClick={() => setView('overview')}>Overview</SidebarButton>
            <SidebarButton active={view === 'vehicle'} onClick={() => setView('vehicle')}>Vehicle Details</SidebarButton>
            <SidebarButton active={view === 'payments'} onClick={() => setView('payments')}>Payment History</SidebarButton>
            <SidebarButton active={view === 'calculator'} onClick={() => setView('calculator')}>Finance Calculator</SidebarButton>

            <div className="mt-6">
              <div className="text-xs text-gray-400">Monthly Payment</div>
              <div className="text-2xl font-bold">₦{installmentData.installment.monthlyPayment.toLocaleString()}</div>
            </div>
          </aside>

          <main className="col-span-1 md:col-span-3 space-y-4">
            {view === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <PaymentProgress
                  totalAmount={installmentData.installment.totalAmount}
                  paidAmount={installmentData.installment.paidAmount}
                  nextPaymentDate={installmentData.installment.nextPaymentDate}
                />
                <VehicleDetails vehicle={installmentData.vehicle} />

                <div className="md:col-span-2 p-4 bg-white rounded shadow">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Installment Summary</h3>
                    <div className="text-sm text-gray-500">
                      {installmentData.installment.remainingMonths} months remaining
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-lg font-bold text-blue-600">₦{installmentData.installment.totalAmount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Total Amount</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-green-600">₦{installmentData.installment.paidAmount.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Amount Paid</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-red-600">₦{(installmentData.installment.totalAmount - installmentData.installment.paidAmount).toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Amount Left</div>
                    </div>
                    <div className="text-center">
                      <div className="text-lg font-bold text-yellow-600">{installmentData.installment.remainingMonths}</div>
                      <div className="text-xs text-gray-500">Months Left</div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {view === 'vehicle' && (
              <VehicleDetails vehicle={installmentData.vehicle} />
            )}

            {view === 'payments' && (
              <PaymentHistory payments={installmentData.payments} />
            )}

            {view === 'calculator' && (
              <FinanceCalculator installment={installmentData.installment} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default InstallmentDashboard;