import { LeaderboardService } from '@/api/leaderboardsService';

import Link from 'next/link';

import {
    ArrowLeft,
    Trophy,
    ChevronRight,
} from 'lucide-react';

export default async function LeaderboardDetailPage({

    params

}: {

    params: Promise<{ type: string }>

}) {

    const { type } = await params;

    const displayName = type.replace(/([A-Z])/g, ' $1').trim().toUpperCase();

    const data: any = await LeaderboardService.getLeaderboard(type);

    const rawEntries = data || {};

    const entries: any[] = Object.entries(rawEntries)
        .filter(([key]) => !isNaN(parseInt(key)))
        .map(([pos, entry]: [string, any]) => ({
            ...entry,
            position: parseInt(pos)
        }))
        .sort((a, b) => a.position - b.position);

    const top3 = entries.slice(0, 3);

    const others = entries.slice(3);

    const isGuildType = type.toLowerCase().includes('guild');

    return (

        <div className="global-container">

            <header className="global-header">

                <Link
                    href="/leaderboards"
                    className="global-back-btn"
                >

                    <ArrowLeft />

                </Link>

                <h1 className="global-title" title={displayName}>

                    <Trophy className="leaderboard-icon" />

                    {displayName}

                </h1>

            </header >

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-12">

                {/* Rank 1 */}
                {top3[0] && (

                    <div className="order-1 xl:order-2 xl:scale-105">

                        <PodiumCard entry={top3[0]} rank={1} color="bg-amber-100 border-amber-400" type={type} />

                    </div>

                )}

                {/* Rank 2 */}
                {top3[1] && (

                    <div className="order-2 xl:order-1 xl:scale-90">

                        <PodiumCard entry={top3[1]} rank={2} color="bg-slate-200 border-slate-400" type={type} />

                    </div>

                )}

                {/* Rank 3 */}
                {top3[2] && (

                    <div className="order-3 xl:order-3 xl:scale-90">

                        <PodiumCard entry={top3[2]} rank={3} color="bg-orange-100 border-orange-400" type={type} />

                    </div>

                )}

            </div>

            {others.length > 0 && (

                <div className="global-table-wrapper">

                    <table>

                        <thead>

                            <tr>

                                <th>
                                    Rank
                                </th>

                                <th>
                                    Name
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {others.map((entry, idx) => (

                                <tr key={idx} >

                                    <td>
                                        #{entry.position}
                                    </td>

                                    <td>

                                        {isGuildType ? (

                                            <Link href={`/guilds/${encodeURIComponent(entry.name)}`} className="flex items-center gap-3">

                                                <span className="leaderboard-table-name">
                                                    {entry.name}
                                                </span>

                                            </Link>

                                        ) : (

                                            <Link href={`/player/${entry.uuid || entry.name}`} className="flex items-center gap-3">

                                                <img
                                                    src={`https://visage.surgeplay.com/bust/48/${entry.uuid}`}
                                                    className="table-avatar"
                                                    alt={entry.name}
                                                />

                                                <span className="table-username">
                                                    {entry.name}
                                                </span>

                                            </Link>

                                        )}

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>
            )}

        </div>

    );

}

function PodiumCard({ entry, rank, color, type }: { entry: any, rank: number, color: string, type: string }) {

    const isGuild = type.toLowerCase().includes('guild');

    const name = entry.name;

    const value = entry.level || entry.score;

    const xp = entry.metadata?.xp || entry.xp;

    return (

        <div className={`${color} podium-card`}>

            <div className="rank-badge">

                #{rank}

            </div>

            <div className="flex flex-col items-center text-center">

                {isGuild ? (

                    <div className="avatar-badge">

                        <div className="line" />

                        <Trophy />

                    </div>

                ) : (

                    <img
                        src={`https://visage.surgeplay.com/full/160/${entry.uuid}`}
                        className="avatar-user"
                        alt={name}
                    />

                )}

                <h3 className="title">
                    {name}
                </h3>

                {isGuild && (

                    <p className="prefix">
                        [{entry.prefix || '???'}]
                    </p>

                )}

                <div className="content">

                    <div className="item">

                        <span>
                            {isGuild ? 'Level' : 'Score'}
                        </span>

                        <span className="default">
                            {value}
                        </span>

                    </div>

                    {xp && (

                        <div className="item">

                            <span>
                                XP
                            </span>

                            <span className="xp">
                                {xp.toLocaleString('tr-TR')}
                            </span>

                        </div>
                    )}

                    {isGuild && (

                        <div className="item">

                            <span>
                                Territories
                            </span>

                            <span className="territories">
                                {entry.territories || 0}
                            </span>

                        </div>

                    )}

                </div>

                <Link
                    href={isGuild ? `/guilds/${encodeURIComponent(name)}` : `/player/${entry.uuid || entry.name}`}
                    className="btn"
                >

                    View {isGuild ? "Guild" : "Player"}

                    <ChevronRight />

                </Link>

            </div>

        </div>

    );

}

