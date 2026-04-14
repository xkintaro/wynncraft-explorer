"use client";

import React, { useState } from 'react';

import { useRouter } from 'next/navigation';

import { Search, Shield } from 'lucide-react';

export default function SearchPlayer() {

    const router = useRouter();

    const [searchQuery, setSearchQuery] = useState('');

    const handleSearch = (e: React.FormEvent) => {

        e.preventDefault();

        if (searchQuery.trim()) {

            router.push(`/player/${encodeURIComponent(searchQuery.trim())}`);

        }

    };

    return (

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

                            EXPLORE

                            <Search className="w-4 h-4" />

                        </button>

                    </form>

                </div>

                <p className="text-xs font-black text-black/30 uppercase tracking-widest">
                    * Search by player UUID or Username.
                </p>

            </div>

        </section>

    );

}
