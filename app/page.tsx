"use client";

import React, { useState, useEffect } from 'react';
import { ClassService } from '@/api/classService';
import { NewsService } from '@/api/newsService';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
    Search,
    Zap,
    Newspaper,
    Star,
    ArrowRight,
    Flame,
    Trophy,
    ExternalLink,
    Shield
} from 'lucide-react';

export default function Home() {
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState('');
    const [classData, setClassData] = useState<any>(null);
    const [newsData, setNewsData] = useState<any[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchData() {
            try {
                const [classes, news] = await Promise.allSettled([
                    ClassService.getAll(),
                    NewsService.getLatest(),
                ]);

                if (classes.status === 'fulfilled') setClassData(classes.value);
                if (news.status === 'fulfilled') setNewsData(news.value as any[]);
            } catch (error) {
                console.error("Fetch error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            router.push(`/player/${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <div className="global-container">

            <header className="global-header">

                <div className="inline-block border-4 border-black bg-amber-400 px-6 py-2 shadow-retro-lg -rotate-1 text-xl font-black uppercase tracking-[0.3em]">
                    Wynncraft v3
                </div>

            </header>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-black">

                <div className="md:col-span-8 space-y-16">

                    <section className="relative">

                        <div className="absolute inset-0 bg-black translate-x-3 translate-y-3" />

                        <div className="relative border-4 border-black bg-white p-10 space-y-8">

                            <div className="flex items-center gap-4">

                                <div className="w-12 h-12 border-4 border-black bg-amber-400 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <Search className="w-6 h-6 text-black" />
                                </div>

                                <h2 className="text-5xl font-jersey uppercase tracking-wide">
                                    Explore Player
                                </h2>

                            </div>

                            <div className="border-4 border-black bg-slate-50 relative group">

                                <form onSubmit={handleSearch} className="flex flex-col sm:flex-row p-1">

                                    <div className="relative flex-1 flex items-center">

                                        <div className="absolute left-6 text-black/20 group-focus-within:text-amber-500 transition-colors">
                                            <Shield className="w-6 h-6" />
                                        </div>

                                        <input
                                            type="text"
                                            value={searchQuery}
                                            onChange={(e) => setSearchQuery(e.target.value)}
                                            required
                                            placeholder="PLAYER NAME OR UUID..."
                                            className="w-full bg-transparent py-6 pl-16 pr-6 outline-none font-black tracking-widest text-sm placeholder:text-black/10"
                                        />

                                    </div>

                                    <button
                                        type="submit"
                                        className="bg-black text-white px-12 py-4 font-black uppercase tracking-[0.2em] text-xs hover:bg-amber-400 hover:text-black transition-all flex items-center justify-center gap-3 cursor-pointer"
                                    >
                                        EXPLORE <Search className="w-4 h-4" />
                                    </button>

                                </form>

                            </div>

                            <p className="text-xs font-black text-black/30 uppercase tracking-widest">
                                * Search by player UUID or Username.
                            </p>

                        </div>

                    </section>

                    <section className="space-y-8">

                        <div className="flex items-center justify-between border-b-4 border-black pb-4">

                            <h2 className="text-5xl font-jersey text-black uppercase flex items-center gap-4">

                                <Newspaper className="w-8 h-8" />

                                News
                            </h2>

                            <Link href="/news" className="text-xs font-black uppercase tracking-widest hover:underline decoration-4 underline-offset-8">
                                All News
                            </Link>

                        </div>

                        <div className="space-y-6">
                            {loading ? (
                                [1, 2, 3].map(i => <div key={i} className="h-32 border-4 border-black bg-black/10 animate-pulse" />)
                            ) : (
                                newsData && newsData.slice(0, 3).map((newsItem: any, idx: number) => (
                                    <Link
                                        key={idx}
                                        href={newsItem.forumThread}
                                        target="_blank"
                                        className="group block border-4 border-black bg-white p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                                    >
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="bg-black text-white px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                                                {newsItem.date}
                                            </span>
                                            <ExternalLink className="w-5 h-5 text-black/20 group-hover:text-black transition-colors" />
                                        </div>
                                        <h3 className="text-4xl font-jersey text-black group-hover:text-amber-600 transition-colors uppercase leading-none mb-2">
                                            {newsItem.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-black/40 group-hover:text-black transition-colors">
                                            Read News <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </section>
                </div>

                <div className="md:col-span-4 space-y-12">

                    <section className="space-y-8">
                        <div className="flex items-center gap-4 border-b-4 border-black pb-4">
                            <Zap className="w-8 h-8 text-amber-500" />
                            <h2 className="text-5xl font-jersey text-black uppercase">Classes</h2>
                        </div>

                        <div className="grid grid-cols-1 gap-4">
                            {loading ? (
                                [1, 2, 3, 4, 5].map(i => <div key={i} className="h-16 border-2 border-black bg-slate-50 animate-pulse" />)
                            ) : (
                                classData && Object.entries(classData).map(([key, info]: [string, any]) => (
                                    <Link
                                        key={key}
                                        href={`/classes/${key}`}
                                        className="group border-2 border-black bg-white p-5 hover:bg-black transition-all"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <h3 className="text-3xl font-jersey text-black group-hover:text-white uppercase leading-none">
                                                    {info.name}
                                                </h3>
                                                <div className="flex gap-1 mt-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`w-3 h-3 ${i < info.overallDifficulty ? 'fill-amber-400 text-amber-400' : 'text-black/10 fill-black/10 group-hover:text-white/10 group-hover:fill-white/10'}`}
                                                        />
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="w-10 h-10 border-2 border-black group-hover:border-white bg-slate-50 group-hover:bg-white/10 flex items-center justify-center transition-all">
                                                <Trophy className="w-5 h-5 text-black group-hover:text-white" />
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </section>

                    <div className="border-4 border-black bg-slate-900 p-8 text-white space-y-6 shadow-[12px_12px_0px_0px_rgba(245,158,11,1)]">
                        <Flame className="w-12 h-12 text-amber-500 animate-pulse" />
                        <h3 className="text-5xl font-jersey uppercase leading-none">Start<br />Exploring!</h3>
                        <p className="text-xs font-bold uppercase tracking-widest text-white/50 leading-relaxed">
                            Access the most up-to-date data of the Wynncraft world. Track guild wars, regions, and player statistics instantly.
                        </p>
                        <div className="pt-4">
                            <Link href="/leaderboards" className="block w-full py-4 bg-amber-400 text-black text-center font-black uppercase tracking-widest text-xs hover:bg-white transition-colors border-2 border-transparent hover:border-black">
                                Check Leaderboards
                            </Link>
                        </div>
                    </div>

                </div>

            </div>

        </div>
    );
}