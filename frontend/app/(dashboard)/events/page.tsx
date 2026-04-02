'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Users, Plus, Star, Loader2 } from 'lucide-react';

export default function EventsPage() {
    const [events, setEvents] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchEvents() {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || '/api/v1';
                const res = await fetch(`${apiUrl}/events`);
                const data = await res.json();

                const dummyIds = new Set([
                    'EVT_20260311_B57196', 'EVT_20260320_088211', 'EVT_20260320_23F6AE',
                    'EVT_20260320_2FDE17', 'EVT_20260320_30B2AA', 'EVT_20260320_32E6E8',
                    'EVT_20260320_39B896', 'EVT_20260320_44AF37', 'EVT_20260320_4FF42A',
                    'EVT_20260320_5A8889', 'EVT_20260320_66E881', 'EVT_20260320_7A06DC',
                    'EVT_20260320_8FF6C8', 'EVT_20260320_9B101C', 'EVT_20260320_A99FAA',
                    'EVT_20260320_B4E845', 'EVT_20260320_B51D75', 'EVT_20260320_C6DFDB',
                    'EVT_20260320_C77320', 'EVT_20260320_CB124F', 'EVT_20260320_D51088',
                    'EVT_20260320_E3B711', 'EVT_20260320_E40712'
                ]);

                if (data.status === 'success') {
                    const pureEvents = (data.events || []).filter((e: any) => !dummyIds.has(e.event_id));
                    setEvents(pureEvents);
                } else {
                    const pureEvents = (data.events || []).filter((e: any) => !dummyIds.has(e.event_id));
                    setEvents(pureEvents);
                }
            } catch (err: any) {
                console.error('Failed to load events:', err);
                setError('Could not load events. Make sure your local API is running.');
            } finally {
                setLoading(false);
            }
        }

        fetchEvents();
    }, []);

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">All Events</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and view all your community events</p>
                </div>
                <Link
                    href="/events/create"
                    className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm shadow-orange-500/20 active:scale-[0.98]"
                >
                    <Plus size={18} />
                    Create Event
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden min-h-[50vh]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center p-12 text-gray-500">
                        <Loader2 size={32} className="animate-spin text-orange-500 mb-4" />
                        <p>Loading your events...</p>
                    </div>
                ) : error ? (
                    <div className="p-8 text-center text-red-500 bg-red-50/50">
                        <p>{error}</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="p-12 text-center flex flex-col items-center">
                        <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center text-orange-500 mb-4">
                            <Calendar size={32} />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">No events found</h3>
                        <p className="text-gray-500 mb-6 max-w-sm">You haven't created any events yet! Get started by setting up your first gathering.</p>
                        <Link
                            href="/events/create"
                            className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
                        >
                            Create your first event
                        </Link>
                    </div>
                ) : (
                    <ul className="divide-y divide-gray-100">
                        {events.map((evt) => (
                            <li key={evt.event_id} className="p-6 hover:bg-gray-50 transition-colors group cursor-pointer relative">
                                <Link href={`/events/${evt.event_id}`} className="absolute inset-0 z-0"></Link>
                                <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4 pointer-events-none">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shrink-0">
                                            <Star size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-base font-semibold text-gray-900 group-hover:text-orange-600 transition-colors uppercase">{evt.name}</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-500 mt-1">
                                                <span className="flex items-center gap-1.5"><Calendar size={14} /> {evt.date} · {evt.time}</span>
                                                <span className="flex items-center gap-1.5"><Users size={14} /> {evt.slots_filled}/{evt.slots_total} Volunteers</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 self-end sm:self-auto">
                                        {evt.status === 'OPEN' ? (
                                            <span className="bg-yellow-50 text-yellow-700 border border-yellow-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse"></span>
                                                OPEN
                                            </span>
                                        ) : (
                                            <span className="bg-green-50 text-green-700 border border-green-200 text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
                                                FILLED
                                            </span>
                                        )}
                                        <span className="text-sky-500 font-medium text-sm group-hover:text-sky-600 group-hover:underline decoration-sky-500 underline-offset-4 pointer-events-auto">
                                            View Details &rarr;
                                        </span>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
