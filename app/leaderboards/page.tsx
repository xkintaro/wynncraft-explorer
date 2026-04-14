import { LeaderboardService } from '@/api/leaderboardsService';

import Link from 'next/link';

import {
    Trophy,
    ChevronRight,
    ArrowLeft
} from 'lucide-react';

export default async function LeaderboardsPage() {

    const data = await LeaderboardService.getTypes();

    return (

        <div className="global-container">

            <header className="global-header">

                <Link
                    href="/"
                    className="global-back-btn"
                >

                    <ArrowLeft />

                </Link>

                <h1 className="global-title">

                    <Trophy className="leaderboard-icon" />

                    Leaderboards

                </h1>

            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">

                {data.map((type) => {

                    const displayName = type.replace(/([A-Z])/g, ' $1').trim();

                    return (

                        <Link
                            key={type}
                            href={`/leaderboards/${type}`}
                            className="leaderboard-card"
                        >

                            <div>

                                <div className="icon">
                                    <Trophy />
                                </div>

                                <h3 className="title">
                                    {displayName}
                                </h3>

                            </div>

                            <div className="btn">

                                View Category

                                <ChevronRight />

                            </div>

                        </Link>

                    );

                })}

            </div>

        </div>

    );

}