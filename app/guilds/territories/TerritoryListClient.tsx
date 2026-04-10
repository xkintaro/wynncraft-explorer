'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowLeft, MapPin, Search, ChevronRight, ChevronLeft } from 'lucide-react';

interface TerritoryItem {
    name: string;
    guild: {
        uuid: string;
        name: string;
        prefix: string;
    };
    acquired: string;
    location: {
        start: [number, number];
        end: [number, number];
    };
}

export default function TerritoryListClient({ territories }: { territories: TerritoryItem[] }) {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 21;

    const filteredTerritories = useMemo(() => {
        if (!search) return territories;
        const s = search.toLowerCase();
        return territories.filter(t =>
            t.name.toLowerCase().includes(s) ||
            t.guild.name.toLowerCase().includes(s) ||
            t.guild.prefix.toLowerCase().includes(s)
        );
    }, [territories, search]);

    const paginatedTerritories = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredTerritories.slice(start, start + pageSize);
    }, [filteredTerritories, currentPage, pageSize]);

    const totalPages = Math.ceil(filteredTerritories.length / pageSize);

    return (

        <div className="global-container">

            <header className="global-header">

                <Link href="/" className="global-back-btn">
                    <ArrowLeft />
                </Link>

                <h1 className="global-title">

                    <MapPin />

                    Territories

                </h1>

            </header>

            <div className="flex flex-col gap-6 sm:gap-8">

                <div className="guild-search-bar">

                    <Search />

                    <input
                        type="text"
                        placeholder="SEARCH TERRITORY OR GUILD..."
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
                        {filteredTerritories.length}
                    </span>

                </div>

                {filteredTerritories.length === 0 ? (

                    <div className="guild-empty">
                        No territories found matching your criteria
                    </div>

                ) : (

                    <>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {paginatedTerritories.map((territory) => (

                                <div key={territory.name} className="territory-card">

                                    <header className="header">

                                        <h3 className="title">
                                            {territory.name}
                                        </h3>

                                        <div className="icon">
                                            <MapPin />
                                        </div>

                                    </header>

                                    <div className="space-y-4">

                                        <div className="item">

                                            <span className="label">
                                                Owner
                                            </span>

                                            <Link
                                                href={`/guilds/${encodeURIComponent(territory.guild.name)}`}
                                                className="value"
                                            >
                                                {territory.guild.name} [{territory.guild.prefix}]
                                            </Link>

                                        </div>

                                        <div className="item">

                                            <span className="label">
                                                Acquired
                                            </span>

                                            <span className="value">
                                                {territory.acquired.split('T')[0]}
                                            </span>

                                        </div>

                                        <div className="item">

                                            <span className="label">
                                                Location
                                            </span>

                                            <span className="value">
                                                {territory.location.start[0]}, {territory.location.start[1]}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                        {totalPages > 1 && (

                            <div className="flex items-center justify-center gap-2">

                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => {
                                        setCurrentPage(p => p - 1);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="guild-pagination-btn"
                                >
                                    <ChevronLeft />
                                </button>

                                <div className="guild-pagination-info">
                                    Page {currentPage} <span>/</span> {totalPages}
                                </div>

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => {
                                        setCurrentPage(p => p + 1);
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                    }}
                                    className="guild-pagination-btn"
                                >
                                    <ChevronRight />
                                </button>

                            </div>

                        )}

                    </>

                )}

            </div>

        </div>

    );

}
