'use client';

import { useState } from 'react';
import { Save, User, Bell, Shield, Database, Loader2 } from 'lucide-react';

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState(false);

    // default empty settings state
    const [settings, setSettings] = useState({
        name: '',
        email: '',
        emailNotifications: true,
        smsNotifications: false,
        autoApprove: true,
        timezone: 'Asia/Kolkata',
    });

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setSaved(false);

        // Simulate saving settings (since there's no actual backend Lambda for settings)
        setTimeout(() => {
            setLoading(false);
            setSaved(true);
            setTimeout(() => setSaved(false), 3000); // hide success message after 3 seconds
        }, 1000);
    };

    return (
        <div className="space-y-8 animate-in fade-in duration-500 pb-12">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
                <p className="text-sm text-gray-500 mt-1">Manage your platform preferences and configurations.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* Settings Navigation Sidebar */}
                <div className="lg:col-span-1 space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium bg-orange-50 text-orange-600 rounded-lg transition-colors text-left">
                        <User size={18} />
                        General Profile
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors text-left">
                        <Bell size={18} />
                        Notifications
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors text-left">
                        <Shield size={18} />
                        Security
                    </button>
                    <button className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 rounded-lg transition-colors text-left">
                        <Database size={18} />
                        API & Webhooks
                    </button>
                </div>

                {/* Settings Form Area */}
                <div className="lg:col-span-3 space-y-6">
                    <form onSubmit={handleSave} className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-lg font-semibold text-gray-900">General Profile</h2>
                            <p className="text-sm text-gray-500 mt-1">Update your basic information and core settings.</p>
                        </div>

                        <div className="p-6 space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Account Name</label>
                                    <input
                                        type="text"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm outline-none transition-all"
                                        value={settings.name}
                                        onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium text-gray-700 mb-1 block">Admin Email</label>
                                    <input
                                        type="email"
                                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm outline-none transition-all"
                                        value={settings.email}
                                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-sm font-medium text-gray-700 mb-1 block">Timezone</label>
                                <select
                                    className="w-full sm:w-1/2 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm outline-none transition-all"
                                    value={settings.timezone}
                                    onChange={(e) => setSettings({ ...settings, timezone: e.target.value })}
                                >
                                    <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                                    <option value="America/New_York">America/New_York (EST)</option>
                                    <option value="Europe/London">Europe/London (GMT)</option>
                                </select>
                            </div>

                            <div className="pt-6 border-t border-gray-100">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                                <div className="space-y-4">
                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <div className="flex items-center h-5">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500 cursor-pointer"
                                                checked={settings.emailNotifications}
                                                onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                                            />
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-900 block">Email Alerts</span>
                                            <span className="text-sm text-gray-500">Receive an email when a new volunteer registers or confirms an event.</span>
                                        </div>
                                    </label>

                                    <label className="flex items-start gap-3 cursor-pointer">
                                        <div className="flex items-center h-5">
                                            <input
                                                type="checkbox"
                                                className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500 cursor-pointer"
                                                checked={settings.smsNotifications}
                                                onChange={(e) => setSettings({ ...settings, smsNotifications: e.target.checked })}
                                            />
                                        </div>
                                        <div>
                                            <span className="text-sm font-medium text-gray-900 block">SMS Alerts</span>
                                            <span className="text-sm text-gray-500">Get text messages for critical alerts (like event cancellations).</span>
                                        </div>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gray-50/50 p-6 border-t border-gray-100 flex items-center justify-between rounded-b-xl">
                            <div className="text-sm flex items-center">
                                {saved && (
                                    <span className="text-green-600 bg-green-50 px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5">
                                        <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                                        Settings saved successfully
                                    </span>
                                )}
                            </div>
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm shadow-orange-500/20 active:scale-[0.98] disabled:opacity-70"
                            >
                                {loading ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                                {loading ? 'Saving...' : 'Save Settings'}
                            </button>
                        </div>
                    </form>

                </div>
            </div>
        </div>
    );
}
