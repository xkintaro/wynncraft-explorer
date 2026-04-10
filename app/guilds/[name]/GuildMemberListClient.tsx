'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight, ExternalLink, Hash } from 'lucide-react';

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

    const getRankStyles = (rank: string) => {
        switch (rank) {
            case 'OWNER': return 'bg-black text-white border-black';
            case 'CHIEF': return 'bg-white border-black text-black font-black';
            default: return 'bg-white border-black text-black/40';
        }
    };

    return (
        <div className="flex flex-col gap-6">

            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b-2 border-black">

                <h2 className="text-4xl font-jersey uppercase tracking-wider">
                    Guild Roster
                </h2>

                <div className="flex items-center gap-4">

                    <span className="text-[10px] font-black uppercase text-black/40 tracking-widest leading-none">
                        TOTAL: {totalCount}
                    </span>

                    {filteredMembers.length !== totalCount && (
                        <span className="text-[10px] font-black uppercase text-amber-600 tracking-widest leading-none">
                            MATCHED: {filteredMembers.length}
                        </span>
                    )}

                </div>

            </header>

            <div className="relative group">

                <div className="absolute inset-0 bg-black translate-x-1 translate-y-1 group-focus-within:translate-x-1.5 group-focus-within:translate-y-1.5 transition-transform" />

                <div className="relative border-2 border-black bg-white flex items-center px-4">

                    <Search className="w-4 h-4 text-black/20 mr-3" />

                    <input
                        type="text"
                        placeholder="SEARCH MEMBER NAME OR RANK..."
                        className="w-full py-3 text-xs font-black uppercase tracking-widest bg-transparent outline-none placeholder:text-black/30"
                        value={search}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setCurrentPage(1);
                        }}
                    />

                </div>

            </div>

            <div className="border-2 border-black overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">

                <div className="overflow-x-auto">

                    <table className="w-full text-left bg-white min-w-[600px]">

                        <thead>

                            <tr className="bg-black text-white text-[10px] font-black uppercase tracking-widest">

                                <th className="p-4 border-r border-white/20">
                                    Rank
                                </th>

                                <th className="p-4 border-r border-white/20">
                                    Name
                                </th>

                                <th className="p-4 border-r border-white/20 text-right">
                                    Contribution
                                </th>

                                <th className="p-4 text-right">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody className="divide-y-2 divide-black">

                            {paginatedMembers.map((member) => (

                                <tr key={member.uuid} className="group hover:bg-slate-50 transition-colors">

                                    <td className="p-4 border-r-2 border-black">

                                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 border border-black ${getRankStyles(member.rank)}`}>
                                            {member.rank}
                                        </span>

                                    </td>

                                    <td className="p-4 border-r-2 border-black">

                                        <div className="flex items-center gap-3">

                                            <div className="relative shrink-0">

                                                <img
                                                    src={`https://visage.surgeplay.com/bust/32/${member.uuid}`}
                                                    className="w-8 h-8 border border-black bg-slate-100"
                                                    alt={member.name}
                                                />

                                                <div className={`absolute -bottom-1 -right-1 w-3 h-3 border-2 border-white rounded-full ${member.online ? 'bg-emerald-500' : 'bg-slate-300'}`} />

                                            </div>

                                            <div className="flex flex-col">

                                                <span className="font-bold uppercase tracking-tight leading-none mb-1">
                                                    {member.name}
                                                </span>

                                                {member.online && member.server && (
                                                    <span className="text-[8px] font-black text-emerald-600 tracking-widest">
                                                        {member.server}
                                                    </span>
                                                )}

                                            </div>

                                        </div>

                                    </td>

                                    <td className="p-4 border-r-2 border-black text-right font-jersey text-xl text-black/40 group-hover:text-black">
                                        {member.contributed?.toLocaleString() || 0}
                                    </td>

                                    <td className="p-4 text-right">

                                        <Link
                                            href={`/player/${member.uuid || member.name}`}
                                            className="inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest hover:text-amber-500 transition-colors"
                                        >
                                            PROFILE <ExternalLink className="w-3 h-3" />
                                        </Link>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </div>

            {totalPages > 1 && (

                <div className="flex items-center justify-center gap-2 mt-4">

                    <button
                        disabled={currentPage === 1}
                        onClick={() => setCurrentPage(p => p - 1)}
                        className="w-10 h-10 border-2 border-black flex items-center justify-center disabled:opacity-20 hover:bg-black hover:text-white transition-all font-black"
                    >
                        <ChevronLeft className="w-4 h-4" />
                    </button>

                    <div className="border-2 border-black px-4 h-10 flex items-center gap-4 bg-white font-black text-xs uppercase tracking-widest">
                        Page {currentPage} <span className="text-black/20">/</span> {totalPages}
                    </div>

                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => setCurrentPage(p => p + 1)}
                        className="w-10 h-10 border-2 border-black flex items-center justify-center disabled:opacity-20 hover:bg-black hover:text-white transition-all font-black"
                    >
                        <ChevronRight className="w-4 h-4" />
                    </button>

                </div>

            )}

            {filteredMembers.length === 0 && (

                <div className="py-12 border-2 border-black border-dashed flex flex-col items-center justify-center text-black/20 uppercase font-black tracking-widest text-sm">
                    No members found matching your search
                </div>

            )}

        </div>

    );

}
