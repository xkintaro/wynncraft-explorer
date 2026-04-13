"use client";

import { useState, useEffect } from 'react';
import { ClassService } from '@/api/classService';
import { NewsService } from '@/api/newsService';
import Link from 'next/link';
import SearchPlayer from '@/components/SearchPlayer';
import {
    Newspaper,
    Star,
    ArrowRight,
    Flame,
    Trophy,
    ExternalLink,
    Shell
} from 'lucide-react';
import { CLASS_CONFIG } from '@/lib/constants';

export default function Home() {
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

    return (
        <div className="global-container">

            <header className="global-header">

                <div className="inline-block border-4 border-black bg-amber-400 px-6 py-2 shadow-retro-lg -rotate-1 text-xl font-black uppercase tracking-[0.3em]">
                    Wynncraft v3
                </div>

            </header>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-12 text-black">

                <div className="md:col-span-8 space-y-16">

                    <SearchPlayer />

                    <section className="space-y-8">

                        <div className="flex items-center border-b-4 border-black pb-4">

                            <h2 className="text-5xl font-jersey text-black uppercase flex items-center gap-4">

                                <Newspaper className="w-8 h-8" />

                                News
                            </h2>

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

                                            Read News

                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform" />

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

                            <Shell className="w-8 h-8" />

                            <h2 className="text-5xl font-jersey text-black uppercase">
                                Classes
                            </h2>

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

                                        <div className="flex items-center justify-between gap-2">

                                            <div>

                                                <h3 className="text-3xl font-jersey text-black group-hover:text-white uppercase leading-none">
                                                    {info.name}
                                                </h3>

                                                <div className="flex gap-1 mt-1">

                                                    {[...Array(3)].map((_, i) => (

                                                        <Star
                                                            key={i}
                                                            className={`w-3 h-3 ${i < info.overallDifficulty ? 'fill-amber-400 text-amber-400' : 'text-black/10 fill-black/10 group-hover:text-white/10 group-hover:fill-white/10'}`}
                                                        />

                                                    ))}

                                                </div>

                                            </div>

                                            <div className="w-10 h-10 border-2 border-black group-hover:border-white bg-slate-50 group-hover:bg-white/10 flex items-center justify-center transition-all">

                                                {(() => {

                                                    const config = CLASS_CONFIG[key.toUpperCase()];
                                                    const Icon = config?.icon || Trophy;

                                                    return <Icon className="w-5 h-5 text-black group-hover:text-white" />;

                                                })()}

                                            </div>

                                        </div>

                                    </Link>

                                ))

                            )}

                        </div>

                    </section>

                    <div className="border-4 border-black bg-black p-8 text-white space-y-6 shadow-[12px_12px_0px_0px_rgba(245,158,11,1)]">

                        <Flame className="w-12 h-12 text-amber-500" />

                        <h3 className="text-5xl font-jersey uppercase leading-none">

                            Start
                            <br />
                            Exploring!

                        </h3>

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
