'use client';

import { use, useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    ArrowLeft, Calendar, MapPin,
    CheckCircle2, Clock, XCircle,
    Send, CheckSquare, Loader2
} from 'lucide-react';

export default function EventDetail({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();

    const [eventData, setEventData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchEventDetails() {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL;
                const res = await fetch(`${apiUrl}/events/${resolvedParams.id}`);
                if (!res.ok) {
                    throw new Error('Event not found or failed to load');
                }
                const data = await res.json();

                // Use structure specific to gatherly backend (get_event_detail.py)
                if (data.status === 'success') {
                    setEventData({
                        ...data.event,
                        confirmations: data.confirmations?.confirmations || []
                    });
                } else {
                    setEventData(data); // Fallback
                }
            } catch (err: any) {
                console.error('Fetch error:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchEventDetails();
    }, [resolvedParams.id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-gray-500 gap-4">
                <Loader2 size={32} className="animate-spin text-orange-500" />
                <p>Loading event details...</p>
            </div>
        );
    }

    if (error || !eventData) {
        return (
            <div className="text-center p-12 bg-red-50 text-red-600 rounded-xl max-w-lg mx-auto mt-12">
                <p className="font-semibold mb-2">Could not load event</p>
                <p className="text-sm">{error}</p>
                <Link href="/events" className="mt-4 inline-block underline underline-offset-4">Return to Events</Link>
            </div>
        );
    }

    const filledCount = eventData.slots_filled || 0;
    const totalCount = eventData.slots_total || 1;
    const filledPercent = Math.min((filledCount / totalCount) * 100, 100);

    const confirmed = eventData.volunteers_confirmed || [];
    const pending = eventData.volunteers_pending || [];
    const declined = eventData.volunteers_declined || [];

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            <div className="flex items-center gap-4">
                <Link
                    href="/events"
                    className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 capitalize">{eventData.name}</h1>
                    <p className="text-sm text-gray-500 mt-1">ID: {eventData.event_id}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Left Column: Details */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-4 sticky top-8">
                        <div className="flex items-center gap-3 text-gray-700">
                            <Calendar size={18} className="text-orange-500" />
                            <span className="font-medium">{eventData.date} · {eventData.time}</span>
                        </div>
                        <div className="flex items-center gap-3 text-gray-700">
                            <MapPin size={18} className="text-orange-500" />
                            <span className="font-medium">{eventData.location}</span>
                        </div>
                        <div className="pt-4 border-t border-gray-100 flex justify-between items-center">
                            <span className="text-sm font-medium text-gray-500">Status</span>
                            <span className={`border text-xs font-bold px-3 py-1.5 rounded-full flex items-center gap-1.5 shadow-sm ${eventData.status === 'OPEN' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                                <span className={`w-2 h-2 rounded-full ${eventData.status === 'OPEN' ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></span>
                                {eventData.status}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Right Column: Volunteers & Actions */}
                <div className="lg:col-span-2 space-y-6">

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4">Slots Progress</h2>

                        <div className="flex justify-between items-end mb-2">
                            <span className="text-3xl font-bold text-gray-900">{filledCount}<span className="text-lg text-gray-400 font-medium">/{totalCount}</span></span>
                            <span className="text-sm font-medium text-gray-500">filled</span>
                        </div>

                        <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-6 flex">
                            <div className={`h-full transition-all duration-1000 ${filledPercent === 100 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${filledPercent}%` }}></div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            <div className="bg-green-50 border border-green-100 rounded-lg p-3 text-center">
                                <div className="text-xs sm:text-sm font-semibold text-green-700 uppercase mb-1 flex flex-col sm:flex-row items-center justify-center gap-1">
                                    <CheckCircle2 size={14} className="mb-1 sm:mb-0" /> Confirmed
                                </div>
                                <div className="text-2xl font-bold text-green-700">{confirmed.length}</div>
                            </div>
                            <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-center">
                                <div className="text-xs sm:text-sm font-semibold text-gray-500 uppercase mb-1 flex flex-col sm:flex-row items-center justify-center gap-1">
                                    <Clock size={14} className="mb-1 sm:mb-0" /> Pending
                                </div>
                                <div className="text-2xl font-bold text-gray-700">{pending.length}</div>
                            </div>
                            <div className="bg-red-50 border border-red-100 rounded-lg p-3 text-center mt-4 sm:mt-0 col-span-2 sm:col-span-1">
                                <div className="text-xs sm:text-sm font-semibold text-red-700 uppercase mb-1 flex flex-col sm:flex-row items-center justify-center gap-1">
                                    <XCircle size={14} className="mb-1 sm:mb-0" /> Declined
                                </div>
                                <div className="text-2xl font-bold text-red-700">{declined.length}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">

                        <div>
                            <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <CheckCircle2 size={18} className="text-green-500" />
                                Confirmed Volunteers
                            </h3>
                            {confirmed.length === 0 ? (
                                <div className="text-sm text-gray-400 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-200">No confirmed volunteers yet.</div>
                            ) : (
                                <div className="border border-gray-100 rounded-lg divide-y divide-gray-100">
                                    {confirmed.map((vol: string) => (
                                        <div key={vol} className="p-3 flex items-center gap-3 bg-green-50/30">
                                            <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center font-bold text-sm">
                                                {vol.substring(0, 2)}
                                            </div>
                                            <div className="text-sm font-medium text-gray-900">{vol}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div>
                            <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Clock size={18} className="text-gray-400" />
                                Pending Responses
                            </h3>
                            {pending.length === 0 ? (
                                <div className="text-sm text-gray-400 p-3 bg-gray-50 rounded-lg border border-dashed border-gray-200">No pending responses.</div>
                            ) : (
                                <div className="border border-gray-100 rounded-lg divide-y divide-gray-100">
                                    {pending.map((vol: string) => (
                                        <div key={vol} className="p-3 flex items-center gap-3 bg-gray-50/50 opacity-70">
                                            <div className="w-8 h-8 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-sm shrink-0">
                                                {vol.substring(0, 2)}
                                            </div>
                                            <div className="text-sm font-medium text-gray-900 truncate">ID: {vol}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-100">
                            <button
                                onClick={() => alert("n8n Webhook Triggered: Reminders Sent!")}
                                className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2.5 rounded-lg flex justify-center items-center gap-2 font-medium transition-colors shadow-sm focus:ring-2 focus:ring-yellow-500 focus:ring-offset-1 active:scale-[0.98]"
                            >
                                <Send size={16} />
                                Send Manual Reminder
                            </button>
                            <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2.5 rounded-lg flex justify-center items-center gap-2 font-medium transition-colors border border-gray-200 focus:ring-2 focus:ring-gray-200 focus:ring-offset-1">
                                <CheckSquare size={16} />
                                Mark Complete
                            </button>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    );
}
