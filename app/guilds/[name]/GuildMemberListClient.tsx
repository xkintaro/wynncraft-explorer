'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react';

interface Member {
    name: string;
    rank: string;
    uuid: string;
    contributed: number;
    online: boolean;
    server?: string;
}

export default function GuildMemberListClient({ members, totalCount }: { members: Member[], totalCount: number }) {
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 15;

    const filteredMembers = useMemo(() => {
        if (!search) return members;
        const s = search.toLowerCase();
        return members.filter(m =>
            m.name.toLowerCase().includes(s) ||
            m.rank.toLowerCase().includes(s)
        );
    }, [members, search]);

    const paginatedMembers = useMemo(() => {
        const start = (currentPage - 1) * pageSize;
        return filteredMembers.slice(start, start + pageSize);
    }, [filteredMembers, currentPage]);

    const totalPages = Math.ceil(filteredMembers.length / pageSize);

    return (
        <div className="flex flex-col gap-6">

            <header className="flex flex-col md:flex-row items-center justify-between gap-4">

                <h2 className="guild-roster-title">
                    Guild Roster
                </h2>

                <div className="flex items-center gap-4">

                    <span className="guild-total-members">
                        TOTAL: {totalCount}
                    </span>

                    {filteredMembers.length !== totalCount && (

                        <span className="guild-matched-members">
                            MATCHED: {filteredMembers.length}
                        </span>

                    )}

                </div>

            </header>

            <div className="guild-search-bar">

                <Search />

                <input
                    type="text"
                    placeholder="SEARCH MEMBER NAME OR RANK..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setCurrentPage(1);
                    }}
                />

            </div>

            {
                filteredMembers.length === 0 ? (

                    <div className="guild-empty">
                        No members found matching your search
                    </div>

                ) : (

                    <>

                        <div className="global-table-wrapper">

                            <table >

                                <thead>

                                    <tr>

                                        <th>
                                            Rank
                                        </th>

                                        <th>
                                            Name
                                        </th>

                                        <th>
                                            Contribution
                                        </th>

                                    </tr>

                                </thead>

                                <tbody>

                                    {paginatedMembers.map((member) => (

                                        <tr key={member.uuid}>

                                            <td>

                                                <span className="guild-rank-badge">
                                                    {member.rank}
                                                </span>

                                            </td>

                                            <td>

                                                <Link href={`/player/${member.uuid || member.name}`} className="flex items-center gap-3">

                                                    <img
                                                        src={`https://visage.surgeplay.com/bust/32/${member.uuid}`}
                                                        className="table-avatar"
                                                        alt={member.name}
                                                    />

                                                    <span className="table-username">
                                                        {member.name}
                                                    </span>

                                                </Link>

                                            </td>

                                            <td>
                                                {member.contributed?.toLocaleString() || 0}
                                            </td>

                                        </tr>

                                    ))}

                                </tbody>

                            </table>

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
                                    Page {currentPage} <span className="text-black/20">/</span> {totalPages}
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
                )
            }

        </div >

    );

}
