import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import OtherNav from './VerifiedNav';
import Button from './Button';

const SidebarButton = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`w-full text-left px-4 py-3 rounded-md mb-2 ${active ? 'bg-yellow-400 text-black' : 'hover:bg-gray-100 text-white/90'}`}
  >
    {children}
  </button>
);

const KilometersChart = ({ monthly = [120, 180, 210, 150, 200, 260] }) => {
  const max = Math.max(...monthly, 1);
  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-3">Monthly Kilometers</h3>
      <div className="flex items-end gap-2 h-32">
        {monthly.map((val, i) => (
          <div key={i} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-yellow-400 rounded-t" style={{ height: `${(val / max) * 100}%` }} />
            <div className="text-xs mt-2 text-gray-500">M{i + 1}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const WalletPanel = ({ balance = 0 }) => (
  <div className="p-4 bg-white rounded shadow">
    <h3 className="font-semibold mb-2">Wallet</h3>
    <div className="text-3xl font-bold">₦{balance.toLocaleString()}</div>
    <div className="mt-3 flex gap-3">
      <Button text={'Withdraw'} classes={'bg-black text-white py-2 px-4 rounded'} />
      <Button text={'Top up'} classes={'bg-yellow-400 text-black py-2 px-4 rounded'} />
    </div>
  </div>
);

const Journeys = ({ items = [] }) => (
  <div className="p-4 bg-white rounded shadow">
    <h3 className="font-semibold mb-3">Recent Journeys</h3>
    {items.length === 0 ? (
      <div className="text-sm text-gray-500">No recent journeys</div>
    ) : (
      <ul className="space-y-2">
        {items.map((j, idx) => (
          <li key={idx} className="p-2 border rounded flex justify-between items-center">
            <div>
              <div className="font-medium">{j.from} → {j.to}</div>
              <div className="text-sm text-gray-500">{j.km} km • {j.date}</div>
            </div>
            <div className="text-sm">₦{j.fare}</div>
          </li>
        ))}
      </ul>
    )}
  </div>
);

const AvailablePassengers = ({ list = [], navigate }) => {
  const handleAcceptRide = () => {
    // In real app, this would accept the ride and navigate to tracking
    navigate('/incoming-ride-request');
  };

  return (
    <div className="p-4 bg-white rounded shadow">
      <h3 className="font-semibold mb-3">Available Passengers</h3>
      {list.length === 0 ? (
        <div className="text-sm text-gray-500">No available passengers nearby</div>
      ) : (
        <ul className="space-y-2">
          {list.map((p) => (
            <li key={p.id} className="p-2 border rounded flex items-center justify-between">
              <div>
                <div className="font-medium">{p.name}</div>
                <div className="text-sm text-gray-500">{p.location || 'Unknown'}</div>
              </div>
              <Button text={'Accept'} classes={'bg-black text-white py-1 px-3 rounded'} onClick={() => handleAcceptRide(p)} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const Riderdash = () => {
  const { role, user } = useSelector((s) => s.verifiedUser || {});
  const ridersNearby = useSelector((s) => s.getRide?.ridersNearby || []);
  const navigate = useNavigate();

  const [view, setView] = useState('overview');
  const [online, setOnline] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const locationIntervalRef = useRef(null);

  // Check if rider profile exists on component mount
  useEffect(() => {
    const checkRiderProfile = async () => {
      try {
        const token = localStorage.getItem('nvcr_tk');
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await fetch('/api/rider/get-details', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          // If rider profile doesn't exist, redirect to setup
          navigate('/rider-profile-setup');
          return;
        }
      } catch (error) {
        console.error('Error checking rider profile:', error);
        navigate('/rider-profile-setup');
      }
    };

    checkRiderProfile();
  }, [navigate]);

  // Function to update rider location
  const updateLocation = async (latitude, longitude, isAvailable) => {
    try {
      const token = localStorage.getItem('nvcr_tk');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch('/api/rider/update-location', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ latitude, longitude, isAvailable })
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 404 && errorData.message.includes('Rider profile not found')) {
          throw new Error('Rider profile not found. Please complete your rider profile setup first.');
        }
        throw new Error(errorData.message || 'Failed to update location');
      }

      const data = await response.json();
      console.log('Location updated:', data);
    } catch (error) {
      console.error('Error updating location:', error);
      setLocationError('Failed to update location: ' + error.message);
    }
  };

  // Function to get current location
  const getCurrentLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      console.log('Requesting location permission...');
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log('Location obtained:', position.coords);
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => {
          console.error('Geolocation error:', error);
          let errorMessage = 'Unable to retrieve location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user. Please enable location permissions.';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable.';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out.';
              break;
            default:
              errorMessage = 'An unknown error occurred while retrieving location.';
              break;
          }
          reject(new Error(errorMessage));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    });
  };

  // Function to start location tracking
  const startLocationTracking = async () => {
    try {
      console.log('Starting location tracking...');
      setLocationError(null);
      const location = await getCurrentLocation();
      console.log('Initial location:', location);
      await updateLocation(location.latitude, location.longitude, true);

      // Set up periodic location updates every 1 minute
      locationIntervalRef.current = setInterval(async () => {
        try {
          console.log('Updating location periodically...');
          const currentLocation = await getCurrentLocation();
          await updateLocation(currentLocation.latitude, currentLocation.longitude, true);
        } catch (error) {
          console.error('Error during periodic location update:', error);
        }
      }, 60000);

      console.log('Location tracking started successfully');
    } catch (error) {
      console.error('Error starting location tracking:', error);
      setLocationError(error.message);
      setOnline(false);
    }
  };

  // Function to stop location tracking
  const stopLocationTracking = async () => {
    if (locationIntervalRef.current) {
      clearInterval(locationIntervalRef.current);
      locationIntervalRef.current = null;
    }

    try {
      // Update location one final time with isAvailable: false
      const location = await getCurrentLocation();
      await updateLocation(location.latitude, location.longitude, false);
    } catch (error) {
      console.error('Error stopping location tracking:', error);
    }
  };

  // Handle online/offline toggle
  const handleOnlineToggle = async () => {
    const token = localStorage.getItem('nvcr_tk');
    if (!token) {
      setLocationError('You must be logged in to use this feature');
      return;
    }

    const newOnlineState = !online;
    console.log('Toggling online state to:', newOnlineState);
    setOnline(newOnlineState);

    if (newOnlineState) {
      await startLocationTracking();
    } else {
      await stopLocationTracking();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (locationIntervalRef.current) {
        clearInterval(locationIntervalRef.current);
      }
    };
  }, []);

  const totalKm = 12450; // placeholder - production should come from API
  const monthlyKm = [1200, 900, 1400, 1100, 1300, 1600];
  const walletBalance = user?.wallet || 45000;
  const journeys = [
    { from: 'Ikeja', to: 'Yaba', km: 12, date: '2025-12-01', fare: 2400 },
    { from: 'Lekki', to: 'Ajah', km: 18, date: '2025-12-03', fare: 3600 },
  ];

  return (
    <div className="min-h-screen">
      <Navbar userrole={role} nav={<OtherNav userrole={role} />} profilePic={user?.profilePic} />

      <div className="mt-24 px-8">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="w-full md:w-[300px] bg-black text-white rounded p-4">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-300">Rider</div>
                <div className="text-xl font-bold text-orange-400">{user?.firstname || 'Driver'}</div>
                <div className="text-sm text-gray-400">{role || 'rider'}</div>
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="text-xs text-gray-400">Status</div>
                <div 
                  onClick={handleOnlineToggle}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full cursor-pointer transition-colors duration-200 ${
                    online ? 'bg-green-500' : 'bg-gray-600'
                  }`}
                >
                  <span className="sr-only">Toggle online status</span>
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-200 ${
                      online ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </div>
                <div className="text-xs text-gray-300">{online ? 'Online' : 'Offline'}</div>
              </div>
            </div>

            <SidebarButton active={view === 'overview'} onClick={() => setView('overview')}>Overview</SidebarButton>
            <SidebarButton active={view === 'kilometers'} onClick={() => setView('kilometers')}>Kilometers</SidebarButton>
            <SidebarButton active={view === 'wallet'} onClick={() => setView('wallet')}>Wallet</SidebarButton>
            <SidebarButton active={view === 'journeys'} onClick={() => setView('journeys')}>Journeys</SidebarButton>
            <SidebarButton active={view === 'available'} onClick={() => setView('available')}>Available Passengers</SidebarButton>

            <div className="mt-6">
              <div className="text-xs text-gray-400">Total kilometers</div>
              <div className="text-2xl font-bold">{totalKm.toLocaleString()} km</div>
            </div>
          </aside>

          <main className="flex-1 space-y-4">
            {view === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <KilometersChart monthly={monthlyKm} />
                <WalletPanel balance={walletBalance} />
              </div>
            )}

            {view === 'kilometers' && (
              <KilometersChart monthly={monthlyKm} />
            )}

            {view === 'wallet' && (
              <WalletPanel balance={walletBalance} />
            )}

            {view === 'toggle' && (
              <div className="p-4 bg-white rounded shadow">
                <h3 className="font-semibold mb-3">Online Status Control</h3>
                <div className="text-sm text-gray-600 mb-4">
                  Use the toggle switch in the sidebar (top right) to go online or offline.
                </div>
                {locationError && (
                  <div className="mb-3 p-2 bg-red-100 text-red-700 rounded text-sm">
                    {locationError}
                  </div>
                )}
                <div className="flex items-center gap-4 p-3 bg-gray-50 rounded">
                  <div className={`w-4 h-4 rounded-full ${online ? 'bg-green-500' : 'bg-gray-400'}`} />
                  <div className="font-medium">{online ? 'Online' : 'Offline'}</div>
                </div>
                {online && (
                  <div className="mt-3 text-sm text-green-600">
                    📍 Location tracking active - updating every 30 seconds
                  </div>
                )}
                {!online && (
                  <div className="mt-3 text-sm text-gray-500">
                    Go online to start receiving ride requests and enable location tracking
                  </div>
                )}
              </div>
            )}

            {view === 'journeys' && (
              <Journeys items={journeys} />
            )}

            {view === 'available' && (
              <AvailablePassengers list={ridersNearby} navigate={navigate} />
            )}
          </main>
        </div>
      </div>
    </div>
  );
};



export default Riderdash