'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';

const SKILLS = ['Photography', 'Coordination', 'Technical', 'Social Media', 'Physical Labor', 'Public Speaking'];

export default function CreateEvent() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        name: '',
        description: '',
        date: '',
        time: '',
        location: '',
        slots_total: '',
        skills_needed: [] as string[],
        organiser_email: ''
    });

    const handleSkillToggle = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills_needed: prev.skills_needed.includes(skill)
                ? prev.skills_needed.filter(s => s !== skill)
                : [...prev.skills_needed, skill]
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        // Validate skills
        if (formData.skills_needed.length === 0) {
            setError('Please select at least one skill.');
            setLoading(false);
            return;
        }

        try {
            // Add your lambda backend endpoint here via .env or hardcode for now
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'YOUR_API_GATEWAY_URL';

            const payload = {
                name: formData.name,
                description: formData.description,
                date: formData.date,
                time: formData.time,
                location: formData.location,
                slots_total: parseInt(formData.slots_total),
                skills_needed: formData.skills_needed,
                organiser_email: formData.organiser_email
            };

            // Making real API call 
            const res = await fetch(`${apiUrl}/events`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Failed to create event');

            setSuccess('Event created successfully! Invitations have been sent.');
            setTimeout(() => {
                router.push('/dashboard');
            }, 2000);

        } catch (err: any) {
            setError(err.message || 'An error occurred while creating the event.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            <div className="flex items-center gap-4">
                <Link
                    href="/dashboard"
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Create New Event</h1>
                    <p className="text-sm text-gray-500 mt-1">Set up a new volunteer opportunity</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                <form onSubmit={handleSubmit} className="p-8 max-w-2xl space-y-8">

                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-900 pb-2 border-b border-gray-100">
                            Event Details
                        </h2>

                        {/* Event Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Event Name *</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm outline-none transition-all"
                                placeholder="Enter your event title"
                                value={formData.name}
                                onChange={e => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        {/* Description */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Description</label>
                            <textarea
                                rows={3}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm outline-none transition-all resize-y"
                                placeholder="Describe the purpose of your event"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 block">Date *</label>
                                <input
                                    required
                                    type="date"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm outline-none transition-all"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-700 block">Time *</label>
                                <input
                                    required
                                    type="time"
                                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm outline-none transition-all"
                                    value={formData.time}
                                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Location *</label>
                            <input
                                required
                                type="text"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm outline-none transition-all"
                                placeholder="e.g. Auditorium, Downtown Park"
                                value={formData.location}
                                onChange={e => setFormData({ ...formData, location: e.target.value })}
                            />
                        </div>

                        {/* Slots */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Total Slots *</label>
                            <input
                                required
                                type="number"
                                min="1"
                                className="w-full sm:w-1/2 px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm outline-none transition-all"
                                placeholder="How many people needed?"
                                value={formData.slots_total}
                                onChange={e => setFormData({ ...formData, slots_total: e.target.value })}
                            />
                        </div>

                        {/* Skills */}
                        <div className="space-y-3">
                            <label className="text-sm font-medium text-gray-700 block">Skills Needed *</label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {SKILLS.map(skill => (
                                    <label key={skill} className="flex items-center gap-3 p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                                        <input
                                            type="checkbox"
                                            className="w-4 h-4 text-orange-500 rounded border-gray-300 focus:ring-orange-500"
                                            checked={formData.skills_needed.includes(skill)}
                                            onChange={() => handleSkillToggle(skill)}
                                        />
                                        <span className="text-sm font-medium text-gray-700">{skill}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 block">Organiser Email *</label>
                            <input
                                required
                                type="email"
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white shadow-sm outline-none transition-all"
                                placeholder="organiser@example.com"
                                value={formData.organiser_email}
                                onChange={e => setFormData({ ...formData, organiser_email: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                        <div className="flex-1">
                            {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg inline-block">{error}</p>}
                            {success && <p className="text-sm text-green-600 bg-green-50 px-3 py-2 rounded-lg inline-block">{success}</p>}
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-lg font-medium transition-all shadow-sm shadow-orange-500/20 active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none flex items-center gap-2"
                        >
                            {loading && <Loader2 size={18} className="animate-spin" />}
                            {loading ? 'Creating...' : 'Create Event & Invite'}
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
