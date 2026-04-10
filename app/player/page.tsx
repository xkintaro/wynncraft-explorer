'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, ArrowRight } from 'lucide-react';

export default function PlayerSearchPage() {
    const [search, setSearch] = useState('');
    const router = useRouter();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (search.trim()) {
            router.push(`/player/${search.trim()}`);
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-24 px-8">

            <div className="relative group max-w-2xl mx-auto w-full">

                <div className="absolute inset-0 bg-black translate-x-3 translate-y-3 group-focus-within:translate-x-4 group-focus-within:translate-y-4 transition-transform duration-300" />

                <form
                    onSubmit={handleSearch}
                    className="relative border-4 border-black bg-white p-2 flex items-stretch gap-2"
                >
                    <div className="flex-1 flex items-center px-6">
                        <Search className="w-6 h-6 text-black/20 mr-4" />
                        <input
                            type="text"
                            placeholder="Type username or UUID..."
                            className="w-full py-6 text-xl font-black uppercase tracking-widest bg-transparent outline-none placeholder:text-black/10 text-black"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            autoFocus
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-black text-white px-10 flex items-center justify-center hover:bg-white hover:text-black border-2 border-black transition-all group/btn"
                    >
                        <span className="text-xs font-black uppercase tracking-[0.2em] mr-3">
                            Search
                        </span>

                        <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-2 transition-transform" />

                    </button>

                </form>

            </div>

        </div>
    );
}

