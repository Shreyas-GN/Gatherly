'use client';

import Link from 'next/link';
import { ArrowRight, Users, Zap, CheckCircle2, Calendar, MapPin, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function LandingPage() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) return null; // Avoid hydration mismatch on initial render

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-sky-50 font-sans selection:bg-orange-500 selection:text-white">

            {/* Header */}
            <header className="fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-lg border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-lg shadow-sm shadow-orange-500/20">
                            G
                        </div>
                        <span className="text-xl font-bold text-gray-900 tracking-tight">Gatherly</span>
                    </div>
                    <nav className="flex items-center gap-6">
                        <Link href="/dashboard" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block transition-colors">
                            Dashboard
                        </Link>
                        <Link href="/events/create" className="text-sm font-medium text-gray-600 hover:text-gray-900 hidden sm:block transition-colors">
                            Create Event
                        </Link>
                        <Link
                            href="/dashboard"
                            className="bg-gray-900 hover:bg-gray-800 text-white px-5 py-2 rounded-full text-sm font-medium transition-all active:scale-95 shadow-sm"
                        >
                            Log In
                        </Link>
                    </nav>
                </div>
            </header>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-6 sm:pt-40 sm:pb-24">
                <div className="max-w-5xl mx-auto text-center space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">

                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100/50 border border-orange-200 text-orange-600 text-sm font-medium mb-4">
                        <Sparkles size={14} className="text-orange-500" />
                        <span>The new standard for community events</span>
                    </div>

                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
                        Bring the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">right people</span> <br className="hidden sm:block" />
                        together, instantly.
                    </h1>

                    <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto font-medium">
                        Gatherly is a modern, cloud-native volunteer management platform that automates event coordination, skill-matching, and RSVP tracking.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                        <Link
                            href="/dashboard"
                            className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 outline-none text-white px-8 py-4 rounded-full text-lg font-medium transition-all active:scale-[0.98] shadow-xl shadow-orange-500/20 flex items-center justify-center gap-2"
                        >
                            Open Dashboard <ArrowRight size={20} />
                        </Link>
                        <Link
                            href="/events/create"
                            className="w-full sm:w-auto bg-white hover:bg-gray-50 text-gray-900 border border-gray-200 px-8 py-4 rounded-full text-lg font-medium transition-all active:scale-[0.98] shadow-sm flex items-center justify-center gap-2"
                        >
                            Create an Event
                        </Link>
                    </div>

                    {/* Dashboard Preview Graphic */}
                    <div className="mt-16 relative mx-auto max-w-4xl pt-8 hidden md:block">
                        <div className="absolute inset-0 bg-gradient-to-t from-orange-50 via-transparent to-transparent z-10 top-1/2 rounded-b-3xl pointer-events-none"></div>
                        <div className="relative rounded-2xl border border-gray-200 bg-white/50 backdrop-blur-sm shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300 mx-auto">
                            {/* Fake UI Header */}
                            <div className="h-10 border-b border-gray-100 bg-gray-50/80 flex items-center px-4 gap-2">
                                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                                <div className="w-3 h-3 rounded-full bg-green-400"></div>
                            </div>
                            {/* Fake UI Content */}
                            <div className="p-8 grid grid-cols-3 gap-6 bg-white/80">
                                <div className="col-span-1 space-y-4">
                                    <div className="h-24 rounded-xl bg-orange-50 border border-orange-100 flex p-4 flex-col justify-between">
                                        <div className="w-20 h-4 bg-orange-200 rounded animate-pulse"></div>
                                        <div className="w-12 h-6 bg-orange-300 rounded animate-pulse"></div>
                                    </div>
                                    <div className="h-32 rounded-xl bg-sky-50 border border-sky-100 p-4 flex flex-col gap-3">
                                        <div className="w-full h-3 bg-sky-200 rounded animate-pulse"></div>
                                        <div className="w-4/5 h-3 bg-sky-200 rounded animate-pulse"></div>
                                        <div className="w-2/5 h-3 bg-sky-200 rounded animate-pulse"></div>
                                    </div>
                                </div>
                                <div className="col-span-2 space-y-4">
                                    <div className="h-12 rounded-xl border border-gray-100 bg-gray-50 flex items-center px-4">
                                        <div className="w-1/3 h-4 bg-gray-200 rounded animate-pulse"></div>
                                    </div>
                                    <div className="h-44 rounded-xl border border-gray-100 bg-white shadow-sm p-4 relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-4"><div className="w-12 h-4 bg-green-100 rounded-full"></div></div>
                                        <div className="w-1/4 h-5 bg-gray-200 rounded mb-6 animate-pulse"></div>
                                        <div className="w-full h-16 bg-gray-50 rounded-lg flex items-center px-4 gap-4">
                                            <div className="w-8 h-8 rounded-full bg-orange-100"></div>
                                            <div className="w-32 h-4 bg-gray-200 rounded"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* Features Section */}
            <section className="py-24 bg-white border-y border-gray-100 relative">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16 space-y-4 animate-in fade-in duration-700">
                        <h2 className="text-3xl font-bold text-gray-900">Coordinate chaos flawlessly.</h2>
                        <p className="text-gray-500 max-w-2xl mx-auto">Everything you need to orchestrate events, match volunteers with required skills, and automate communications in one place.</p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 relative z-10">

                        {/* Feature 1 */}
                        <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:shadow-orange-500/5 transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-xl bg-orange-100 text-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Zap size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Automated Workflows</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Never send a manual email again. Gatherly's n8n integration instantly dispatches invites, RSVP trackers, and reminder notifications completely autonomously.
                            </p>
                        </div>

                        {/* Feature 2 */}
                        <div className="p-8 rounded-2xl bg-sky-50/50 border border-sky-100 hover:shadow-xl hover:shadow-sky-500/5 transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <Users size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Intelligent Matching</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Our lambda servers instantly cross-reference your required event skills against the volunteer registry, inviting only the most qualified candidates.
                            </p>
                        </div>

                        {/* Feature 3 */}
                        <div className="p-8 rounded-2xl bg-gray-50 border border-gray-100 hover:shadow-xl hover:shadow-green-500/5 transition-all duration-300 group">
                            <div className="w-12 h-12 rounded-xl bg-green-100 text-green-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                <CheckCircle2 size={24} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-3">Real-time S3 Tracking</h3>
                            <p className="text-gray-500 leading-relaxed">
                                Every RSVP click writes instantly to the backend S3 Data Lake, updating your visual dashboard capacities and volunteer statuses in real time.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 bg-gray-900 text-gray-400 text-center">
                <div className="flex items-center justify-center gap-2 mb-4 opacity-50">
                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center text-white font-bold text-xs">
                        G
                    </div>
                </div>
                <p>&copy; 2026 Gatherly. Built for Modern Communities.</p>
            </footer>
        </div>
    );
}
