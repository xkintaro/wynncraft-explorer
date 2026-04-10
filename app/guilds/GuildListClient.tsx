'use client';

import { useState, useMemo } from 'react';

import Link from 'next/link';

import { ArrowLeft, Shield, Search, ChevronRight, Hash, ChevronLeft } from 'lucide-react';


interface GuildListItem {
    name: string;
    uuid: string;
    prefix: string;
}

export default function GuildListClient({ guilds }: { guilds: Record<string, { uuid: string; prefix: string }> }) {

    const [search, setSearch] = useState('');

    const [currentPage, setCurrentPage] = useState(1);

    const pageSize = 20;

    const guildEntries = useMemo(() => {
        return Object.entries(guilds).map(([name, info]) => ({
            name,
            uuid: info.uuid,
            prefix: info.prefix
        }));
    }, [guilds]);

    const filteredGuilds = useMemo(() => {
        if (!search) return guildEntries;
        const s = search.toLowerCase();
        return guildEntries.filter(g =>
            g.name.toLowerCase().includes(s) ||
            g.prefix.toLowerCase().includes(s)
        );
    }, [guildEntries, search]);

    const paginatedGuilds = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredGuilds.slice(start, start + pageSize);
    }, [filteredGuilds, currentPage]);

    const totalPages = Math.ceil(filteredGuilds.length / pageSize);

    return (
        <div className="global-container">

            <header className="global-header">

                <Link href="/" className="global-back-btn">
                    <ArrowLeft />
                </Link>

                <h1 className="global-title">

                    <Shield />

                    Guilds

                </h1>

            </header>

            <div className="flex flex-col gap-6 sm:gap-8">

                <div className="guild-search-bar">

                    <Search />

                    <input
                        type="text"
                        placeholder="SEARCH GUILD NAME OR PREFIX..."
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                    />

                </div>

                <div className="flex flex-col">

                    <span className="guild-result-count-label">
                        Result Count
                    </span>

                    <span className="guild-result-count">
                        {filteredGuilds.length}
                    </span>

                </div>

                {filteredGuilds.length === 0 ? (

                    <div className="guild-empty">
                        No guilds found matching your criteria
                    </div>

                ) : (

                    <>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">

                            {paginatedGuilds.map((guild) => (

                                <Link
                                    key={guild.uuid}
                                    href={`/guilds/${encodeURIComponent(guild.name)}`}
                                    className="guild-card"
                                >

                                    <div className="content">

                                        <div className="icon">

                                            <Hash />

                                        </div>

                                        <div>

                                            <h3 className="title">
                                                {guild.name}
                                            </h3>

                                            <span className="prefix">
                                                {guild.prefix}
                                            </span>

                                        </div>

                                    </div>

                                    <ChevronRight />


                                </Link>

                            ) as any)}

                        </div>

                        {totalPages > 1 && (

                            <div className="flex items-center justify-center gap-2">

                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(p => p - 1)}
                                    className="guild-pagination-btn"
                                >
                                    <ChevronLeft />
                                </button>

                                <div className="guild-pagination-info">
                                    Page {currentPage} <span>/</span> {totalPages}
                                </div>

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(p => p + 1)}
                                    className="guild-pagination-btn"
                                >
                                    <ChevronRight />
                                </button>

                            </div>

                        )}

                    </>

                )}

            </div >

        </div >
    );
}
