import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Button from '../Button';

const SettingToggle = ({ label, description, value, onChange }) => (
    <div className="flex items-center justify-between py-6 border-b border-neutral-100 last:border-0 hover:bg-neutral-50/50 px-4 transition-colors rounded-2xl group">
        <div className="space-y-1">
            <span className="font-bold text-sm text-neutral-800 transition-colors group-hover:text-orange-500">{label}</span>
            <p className="text-xs text-neutral-400">{description}</p>
        </div>
        <button
            onClick={onChange}
            className={`w-14 h-7 rounded-full transition-all duration-300 relative ${value ? 'bg-orange-500 shadow-inner' : 'bg-neutral-200'}`}
        >
            <motion.div
                animate={{ x: value ? 28 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-5 h-5 bg-white rounded-full shadow-lg absolute top-1"
            />
        </button>
    </div>
);

const NotificationSettings = ({ initialSettings, onSave }) => {
    const [settings, setSettings] = useState(initialSettings || {
        rideRequests: true,
        paymentAlerts: true,
        promotions: false,
        securityAlerts: true,
        rideUpdates: true
    });
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (initialSettings) {
            setSettings(initialSettings);
        }
    }, [initialSettings]);

    const handleToggle = (setting) => {
        setSettings(prev => ({
            ...prev,
            [setting]: !prev[setting]
        }));
    };

    const handleSave = async () => {
        setIsSaving(true);
        await onSave(settings);
        setIsSaving(false);
    };

    return (
        <div className="space-y-4">
            <div className="bg-neutral-50/50 rounded-3xl overflow-hidden border border-neutral-100">
                <SettingToggle
                    label="Ride Requests"
                    description="Get notified when there are rides near you"
                    value={settings.rideRequests}
                    onChange={() => handleToggle('rideRequests')}
                />
                <SettingToggle
                    label="Payment Alerts"
                    description="Instant notification for every transaction"
                    value={settings.paymentAlerts}
                    onChange={() => handleToggle('paymentAlerts')}
                />
                <SettingToggle
                    label="Promotional Offers"
                    description="Exclusive discounts and new feature updates"
                    value={settings.promotions}
                    onChange={() => handleToggle('promotions')}
                />
                <SettingToggle
                    label="Security Alerts"
                    description="Alerts for unusual login attempts"
                    value={settings.securityAlerts}
                    onChange={() => handleToggle('securityAlerts')}
                />
            </div>
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-8">
                <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    text={isSaving ? "Saving..." : "Save Preferences"}
                    classes="bg-orange-500 text-white py-4 px-10 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-lg shadow-orange-500/20 hover:bg-orange-600 transition-all disabled:opacity-50"
                />
            </motion.div>
        </div>
    );
};

export default NotificationSettings;




