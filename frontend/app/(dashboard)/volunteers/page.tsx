'use client';

import { useState, useEffect } from 'react';
import { Search, Plus, Mail, Target, BarChart2, Loader2 } from 'lucide-react';

export default function VolunteersPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSkill, setFilterSkill] = useState('All');

    const [volunteers, setVolunteers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Form State
    const [formData, setFormData] = useState({ name: '', email: '', skills: [] as string[] });
    const [registering, setRegistering] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const ALL_SKILLS = ['Photography', 'Coordination', 'Public Speaking', 'Technical', 'Physical Labor'];

    const fetchVolunteers = async () => {
        try {
            setLoading(true);
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const res = await fetch(`${apiUrl}/volunteers`);
            if (res.ok) {
                const data = await res.json();
                setVolunteers(data.volunteers || []);
            }
        } catch (err) {
            console.error('Failed to load volunteers', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVolunteers();
    }, []);

    const handleSkillChange = (skill: string) => {
        setFormData(prev => ({
            ...prev,
            skills: prev.skills.includes(skill)
                ? prev.skills.filter(s => s !== skill)
                : [...prev.skills, skill]
        }));
    };

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setRegistering(true);
        setMessage(null);
        try {
            const apiUrl = process.env.NEXT_PUBLIC_API_URL;
            const res = await fetch(`${apiUrl}/volunteers`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || 'Failed to register');

            setMessage({ type: 'success', text: data.message || 'Volunteer registered.' });
            setFormData({ name: '', email: '', skills: [] }); // Reset form
            fetchVolunteers(); // Reload list
        } catch (err: any) {
            setMessage({ type: 'error', text: err.message });
        } finally {
            setRegistering(false);
        }
    };

    const filteredVolunteers = volunteers.filter(v => {
        const matchesSearch = v.name.toLowerCase().includes(searchTerm.toLowerCase()) || v.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSkill = filterSkill === 'All' || (v.skills || []).includes(filterSkill);
        return matchesSearch && matchesSkill;
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-12">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Volunteers Registry</h1>
                    <p className="text-sm text-gray-500 mt-1">Manage and register your community members</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* Main Roster List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
                        <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Search volunteers..."
                                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <select
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 bg-white"
                                value={filterSkill}
                                onChange={(e) => setFilterSkill(e.target.value)}
                            >
                                <option value="All">All Skills</option>
                                {ALL_SKILLS.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                        </div>

                        <div className="divide-y divide-gray-100 min-h-[300px]">
                            {loading ? (
                                <div className="flex justify-center items-center h-48 text-gray-400">
                                    <Loader2 size={24} className="animate-spin text-orange-400" />
                                </div>
                            ) : filteredVolunteers.length === 0 ? (
                                <div className="text-center py-12 text-gray-500">
                                    No volunteers found.
                                </div>
                            ) : (
                                filteredVolunteers.map(vol => (
                                    <div key={vol.volunteer_id} className="p-6 hover:bg-gray-50 transition-colors">
                                        <div className="flex items-start gap-4">
                                            <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center font-bold text-lg shrink-0">
                                                {vol.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div className="space-y-2 w-full">
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-lg font-semibold text-gray-900">{vol.name}</h3>
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded ${vol.status === 'ACTIVE' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                                        {vol.status || 'ACTIVE'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-col gap-1.5 text-sm text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        <Mail size={14} className="text-gray-400" />
                                                        {vol.email}
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Target size={14} className="text-gray-400 shrink-0" />
                                                        <span className="truncate">{(vol.skills || []).join(', ') || 'No skills listed'}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <BarChart2 size={14} className="text-gray-400" />
                                                        {vol.total_events || 0} events participated
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                {/* Quick Add Sidebar */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-50 rounded-xl border border-gray-200 p-6 sticky top-8">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 border-b border-gray-200 pb-2 flex items-center gap-2">
                            <Plus size={18} /> Register New Volunteer
                        </h2>
                        <form onSubmit={handleRegister} className="space-y-4">
                            <div>
                                <label className="text-xs font-medium text-gray-700 mb-1 block">Name *</label>
                                <input required type="text" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="Jane Doe" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-700 mb-1 block">Email *</label>
                                <input required type="email" className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:outline-none" placeholder="jane@example.com" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                            </div>
                            <div>
                                <label className="text-xs font-medium text-gray-700 mb-2 block">Skills</label>
                                <div className="space-y-2 bg-white p-3 border border-gray-200 rounded-lg max-h-48 overflow-y-auto">
                                    {ALL_SKILLS.map(skill => (
                                        <label key={skill} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer hover:bg-gray-50 p-1 rounded transition-colors">
                                            <input
                                                type="checkbox"
                                                className="form-checkbox h-4 w-4 text-orange-500 focus:ring-orange-500 border-gray-300 rounded"
                                                checked={formData.skills.includes(skill)}
                                                onChange={() => handleSkillChange(skill)}
                                            />
                                            {skill}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {message && (
                                <div className={`text-sm p-3 rounded-lg ${message.type === 'error' ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
                                    {message.text}
                                </div>
                            )}

                            <button disabled={registering} type="submit" className="w-full bg-orange-500 hover:bg-orange-600 active:scale-[0.98] disabled:opacity-70 text-white flex justify-center items-center gap-2 font-medium text-sm py-2.5 rounded-lg transition-all mt-2 shadow-sm shadow-orange-500/20">
                                {registering ? <Loader2 size={16} className="animate-spin" /> : 'Register Volunteer'}
                            </button>
                        </form>
                    </div>
                </div>

            </div>
        </div>
    );
}
