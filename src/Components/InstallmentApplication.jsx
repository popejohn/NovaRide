import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import Button from './Button';
import Input from './Input';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaCar, FaCalculator, FaFileContract } from 'react-icons/fa';
import { toast } from 'react-toastify';

const InstallmentApplication = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.verifiedUser);

  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [installmentPlan, setInstallmentPlan] = useState(null);

  // Mock vehicle data
  const availableVehicles = [
    {
      id: 1,
      name: 'Toyota Camry 2024',
      price: 8500000,
      image: '/placeholderProfile.jpg',
      specs: {
        engine: '2.5L 4-Cylinder',
        transmission: 'Automatic',
        fuelType: 'Petrol',
        mileage: '0 km'
      }
    },
    {
      id: 2,
      name: 'Honda Civic 2024',
      price: 7200000,
      image: '/placeholderProfile.jpg',
      specs: {
        engine: '2.0L 4-Cylinder',
        transmission: 'CVT',
        fuelType: 'Petrol',
        mileage: '0 km'
      }
    },
    {
      id: 3,
      name: 'Nissan Altima 2024',
      price: 6800000,
      image: '/placeholderProfile.jpg',
      specs: {
        engine: '2.5L 4-Cylinder',
        transmission: 'CVT',
        fuelType: 'Petrol',
        mileage: '0 km'
      }
    }
  ];

  const installmentPlans = [
    { months: 12, interestRate: 8.5, monthlyPayment: (price) => Math.round((price * (1 + 0.085)) / 12) },
    { months: 24, interestRate: 10.5, monthlyPayment: (price) => Math.round((price * (1 + 0.105)) / 24) },
    { months: 36, interestRate: 12.5, monthlyPayment: (price) => Math.round((price * (1 + 0.125)) / 36) },
    { months: 48, interestRate: 14.5, monthlyPayment: (price) => Math.round((price * (1 + 0.145)) / 48) }
  ];

  const formik = useFormik({
    initialValues: {
      downPayment: '',
      preferredTenure: '',
      employmentLetter: null,
      bankStatement: null,
      additionalDocuments: null,
      termsAccepted: false
    },
    validationSchema: Yup.object({
      downPayment: Yup.number().min(0, 'Down payment cannot be negative').min(500000, 'Minimum down payment is ₦500,000').required('Down payment is required'),
      preferredTenure: Yup.number().oneOf([12, 24, 36, 48]).required('Please select a payment tenure'),
      termsAccepted: Yup.boolean().oneOf([true], 'You must accept the terms and conditions')
    }),
    onSubmit: async (values) => {
      if (!selectedVehicle) {
        toast.error('Please select a vehicle');
        return;
      }

      try {
        const token = localStorage.getItem('nvcr_tk');
        const applicationData = {
          vehicle: selectedVehicle,
          installmentPlan: installmentPlan,
          application: values
        };

        await api.post('/user/installment-application', applicationData, {
          headers: { 'Authorization': `Bearer ${token}` }
        });

        toast.success('Application submitted successfully! Your vehicle dashboard is now active.');
        navigate('/installment-dashboard');
      } catch (error) {
        console.error('Application submission error:', error);
        if (error.response?.status !== 401) {
          toast.error('Failed to submit application. Please try again.');
        }
      }
    }
  });

  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
    setInstallmentPlan(null);
  };

  const handlePlanSelect = (plan) => {
    if (selectedVehicle) {
      setInstallmentPlan({
        ...plan,
        monthlyPayment: plan.monthlyPayment(selectedVehicle.price),
        totalAmount: Math.round(selectedVehicle.price * (1 + plan.interestRate / 100))
      });
    }
  };

  const handleFileChange = (event, fieldName) => {
    const file = event.target.files[0];
    if (file) {
      formik.setFieldValue(fieldName, file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar userrole="installment" userverified={true} profilePic="/placeholderProfile.jpg" nav={<OtherNav userrole="installment" />} />

      <div className="mt-24 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Vehicle Installment Application</h1>
            <p className="text-gray-600">Choose your dream car and apply for installment purchase</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Vehicle Selection */}
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-4">Select Your Vehicle</h2>
                <div className="space-y-4">
                  {availableVehicles.map(vehicle => (
                    <div
                      key={vehicle.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${selectedVehicle?.id === vehicle.id
                        ? 'border-yellow-400 bg-yellow-50'
                        : 'border-gray-200 hover:border-yellow-300'
                        }`}
                      onClick={() => handleVehicleSelect(vehicle)}
                    >
                      <div className="flex items-center space-x-4">
                        <img src={vehicle.image} alt={vehicle.name} className="w-20 h-20 rounded-lg object-cover" />
                        <div className="flex-1">
                          <h3 className="font-semibold text-lg">{vehicle.name}</h3>
                          <p className="text-2xl font-bold text-yellow-600">₦{vehicle.price.toLocaleString()}</p>
                          <div className="text-sm text-gray-600 mt-1">
                            <p>Engine: {vehicle.specs.engine}</p>
                            <p>Transmission: {vehicle.specs.transmission}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Installment Plans */}
              {selectedVehicle && (
                <div>
                  <h2 className="text-xl font-semibold mb-4">Choose Installment Plan</h2>
                  <div className="space-y-3">
                    {installmentPlans.map(plan => (
                      <div
                        key={plan.months}
                        className={`border rounded-lg p-4 cursor-pointer transition-all ${installmentPlan?.months === plan.months
                          ? 'border-yellow-400 bg-yellow-50'
                          : 'border-gray-200 hover:border-yellow-300'
                          }`}
                        onClick={() => handlePlanSelect(plan)}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <h3 className="font-semibold">{plan.months} Months</h3>
                            <p className="text-sm text-gray-600">{plan.interestRate}% Interest Rate</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-lg">₦{plan.monthlyPayment(selectedVehicle.price).toLocaleString()}</p>
                            <p className="text-sm text-gray-500">per month</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Application Form */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold mb-6">Application Details</h2>

              {selectedVehicle && installmentPlan && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <h3 className="font-semibold mb-2">Selected Package</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Vehicle:</strong> {selectedVehicle.name}</p>
                    <p><strong>Price:</strong> ₦{selectedVehicle.price.toLocaleString()}</p>
                    <p><strong>Tenure:</strong> {installmentPlan.months} months</p>
                    <p><strong>Monthly Payment:</strong> ₦{installmentPlan.monthlyPayment.toLocaleString()}</p>
                    <p><strong>Total Amount:</strong> ₦{installmentPlan.totalAmount.toLocaleString()}</p>
                  </div>
                </div>
              )}

              <form onSubmit={formik.handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Down Payment (₦)"
                    type="number"
                    value={formik.values.downPayment}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    name="downPayment"
                    placeholder="500000"
                    min="0"
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Preferred Tenure</label>
                    <select
                      name="preferredTenure"
                      value={formik.values.preferredTenure}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      className="w-full px-4 py-2 rounded-lg border border-gray-300 outline-0 shadow-md focus:ring-1 focus:ring-yellow-400"
                    >
                      <option value="">Select Tenure</option>
                      <option value="12">12 Months</option>
                      <option value="24">24 Months</option>
                      <option value="36">36 Months</option>
                      <option value="48">48 Months</option>
                    </select>
                  </div>
                </div>

                {/* Document Uploads */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Employment Letter</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, 'employmentLetter')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Bank Statement (Last 3 months)</label>
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={(e) => handleFileChange(e, 'bankStatement')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-yellow-400"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Additional Documents (Optional)</label>
                    <input
                      type="file"
                      multiple
                      accept=".pdf,.doc,.docx,.jpg,.png"
                      onChange={(e) => handleFileChange(e, 'additionalDocuments')}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-yellow-400"
                    />
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div className="flex items-start space-x-3">
                  <input
                    type="checkbox"
                    name="termsAccepted"
                    checked={formik.values.termsAccepted}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    className="mt-1"
                  />
                  <div className="text-sm">
                    <label className="font-medium text-gray-700">I agree to the </label>
                    <a href="#" className="text-yellow-600 hover:text-yellow-700">Terms and Conditions</a>
                    <label className="font-medium text-gray-700"> and </label>
                    <a href="#" className="text-yellow-600 hover:text-yellow-700">Privacy Policy</a>
                  </div>
                </div>

                <Button
                  type="submit"
                  text="Submit Application"
                  classes="w-full bg-yellow-400 text-black py-3 px-4 rounded font-semibold hover:bg-yellow-500 disabled:opacity-50"
                  disabled={!formik.isValid || !selectedVehicle || !installmentPlan}
                />
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstallmentApplication;



