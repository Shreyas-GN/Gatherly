'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Users, Calendar, CheckCircle2, LayoutDashboard, Loader2 } from 'lucide-react';

export default function Dashboard() {
  const [events, setEvents] = useState<any[]>([]);
  const [volunteers, setVolunteers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL;

        // Fetch events with Edge Caching & SSG revalidation
        const resEvents = await fetch(`${apiUrl}/events`, { 
          cache: 'force-cache',
          next: { revalidate: 60 }
        });
        if (resEvents.ok) {
          const dataE = await resEvents.json();
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
          const pureEvents = (dataE.events || []).filter((e: any) => !dummyIds.has(e.event_id));
          setEvents(pureEvents);
        }

        // Fetch volunteers with Edge Caching
        const resVols = await fetch(`${apiUrl}/volunteers`, {
          cache: 'force-cache',
          next: { revalidate: 60 }
        });
        if (resVols.ok) {
          const dataV = await resVols.json();
          setVolunteers(dataV.volunteers || []);
        }
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const totalEvents = events.length;
  const openEvents = events.filter(e => e.status === 'OPEN').length;
  const filledEvents = events.filter(e => e.status === 'FILLED').length;
  const totalVolunteers = volunteers.length;

  const upcomingEvents = [...events].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()).slice(0, 2);
  const topVolunteers = [...volunteers].sort((a, b) => (b.total_events || 0) - (a.total_events || 0)).slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Welcome back! Here's what's happening today.</p>
        </div>
        <Link
          href="/events/create"
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg flex items-center gap-2 font-medium transition-all shadow-sm shadow-orange-500/20 active:scale-[0.98]"
        >
          <Plus size={18} />
          Create Event
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Events" value={loading ? "-" : totalEvents.toString()} icon={LayoutDashboard} color="orange" />
        <StatCard title="Open Events" value={loading ? "-" : openEvents.toString()} icon={Calendar} color="yellow" />
        <StatCard title="Filled Events" value={loading ? "-" : filledEvents.toString()} icon={CheckCircle2} color="green" />
        <StatCard title="Total Volunteers" value={loading ? "-" : totalVolunteers.toString()} icon={Users} color="sky" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 min-h-[300px]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                📅 Upcoming Events
              </h2>
              <Link href="/events" className="text-sm text-orange-500 hover:text-orange-600 font-medium">
                View all
              </Link>
            </div>

            {loading ? (
              <div className="flex justify-center items-center h-48 text-gray-400">
                <Loader2 size={24} className="animate-spin text-orange-400" />
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                <p>No upcoming events.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map(evt => (
                  <div key={evt.event_id} className="border border-gray-100 rounded-xl p-5 hover:border-orange-500/50 hover:shadow-md transition-all group bg-gray-50/50 hover:bg-white cursor-pointer select-none relative overflow-hidden">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 transition-colors ${evt.status === 'OPEN' ? 'bg-yellow-400 group-hover:bg-orange-500' : 'bg-green-500'}`}></div>

                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-orange-600 transition-colors uppercase">{evt.name}</h3>
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded">{evt.slots_filled}/{evt.slots_total} slots</span>
                        <span className={`border text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-sm ${evt.status === 'OPEN' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-green-50 text-green-700 border-green-200'}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${evt.status === 'OPEN' ? 'bg-yellow-500 animate-pulse' : 'bg-green-500'}`}></span>
                          {evt.status}
                        </span>
                      </div>
                    </div>

                    <div className="text-sm text-gray-500 space-y-1.5 mb-4">
                      <p className="flex items-center gap-2">
                        <Calendar size={14} className="text-gray-400" />
                        {evt.date} · {evt.location}
                      </p>
                      <p className="flex items-center gap-2">
                        <Users size={14} className="text-gray-400" />
                        Skills: {Array.isArray(evt.skills_needed) ? evt.skills_needed.join(', ') : 'Any'}
                      </p>
                    </div>

                    <div>
                      <Link href={`/events/${evt.event_id}`} className="inline-flex items-center text-sm font-medium text-sky-500 hover:text-sky-600 group-hover:underline decoration-sky-500 underline-offset-4">
                        View Details &rarr;
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-8 min-h-[300px]">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              🏆 Top Volunteers
            </h2>

            {loading ? (
              <div className="flex justify-center items-center h-48 text-gray-400">
                <Loader2 size={24} className="animate-spin text-orange-400" />
              </div>
            ) : topVolunteers.length === 0 ? (
              <div className="text-center py-12 text-gray-500 text-sm">
                <p>No volunteers registered yet.</p>
              </div>
            ) : (
              <div className="space-y-5">
                {topVolunteers.map((vol, i) => {
                  const colors = [
                    { bg: 'bg-orange-100', text: 'text-orange-600' },
                    { bg: 'bg-sky-100', text: 'text-sky-600' },
                    { bg: 'bg-green-100', text: 'text-green-600' },
                    { bg: 'bg-gray-100', text: 'text-gray-600' }
                  ];
                  const c = colors[i % colors.length];
                  const initials = vol.name.substring(0, 2).toUpperCase();

                  return (
                    <VolunteerRow
                      key={vol.volunteer_id}
                      initials={initials}
                      name={vol.name}
                      count={vol.total_events || 0}
                      bg={c.bg}
                      text={c.text}
                    />
                  )
                })}
              </div>
            )}

            <div className="mt-8 pt-6 border-t border-gray-100">
              <Link href="/volunteers" className="w-full block text-center py-2 text-sm font-medium text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
                See All Volunteers
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color }: { title: string, value: string, icon: any, color: 'orange' | 'yellow' | 'green' | 'sky' }) {
  const colorMap = {
    orange: 'border-l-orange-500 text-orange-500 bg-orange-50',
    yellow: 'border-l-yellow-500 text-yellow-600 bg-yellow-50',
    green: 'border-l-green-500 text-green-600 bg-green-50',
    sky: 'border-l-sky-500 text-sky-600 bg-sky-50'
  };

  const bgIcons = colorMap[color];

  return (
    <div className={`bg-white rounded-xl shadow-[0_2px_8px_-4px_rgba(0,0,0,0.1)] border border-gray-200 p-6 border-l-4 ${bgIcons.split(' ')[0]} hover:translate-y-[-2px] transition-transform duration-300`}>
      <div className="flex justify-between items-start mb-2">
        <div className="text-sm font-semibold text-gray-500 uppercase tracking-wider">{title}</div>
        <div className={`p-2 rounded-lg ${bgIcons.split(' ')[2]} ${bgIcons.split(' ')[1]}`}>
          <Icon size={18} strokeWidth={2.5} />
        </div>
      </div>
      <div className="text-4xl font-bold text-gray-900">{value}</div>
    </div>
  );
}

function VolunteerRow({ initials, name, count, bg, text }: { initials: string, name: string, count: number, bg: string, text: string }) {
  return (
    <div className="flex justify-between items-center group">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full ${bg} ${text} flex items-center justify-center font-bold shadow-sm group-hover:scale-110 transition-transform`}>
          {initials}
        </div>
        <span className="font-medium text-gray-900">{name}</span>
      </div>
      <span className="text-sm font-semibold bg-gray-50 text-gray-500 px-2 py-1 rounded">{count} events</span>
    </div>
  );
}
