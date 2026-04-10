import { GuildService } from '@/api/guildService';
import Link from 'next/link';
import { ArrowLeft, Shield, Users, Star, Calendar, MapPin, ExternalLink, Sword } from 'lucide-react';
import GuildMemberListClient from './GuildMemberListClient';

export default async function GuildDetailPage({
    params,
}: {
    params: Promise<{ name: string }>;
}) {
    const { name } = await params;
    const decodedName = decodeURIComponent(name);

    try {
        const data = await GuildService.getGuild(decodedName) as any;
        if (!data) throw new Error("No data returned");

        const members = data.members || {};

        const extractMembers = (rankObj: any, rankName: string) => {
            if (!rankObj) return [];
            return Object.entries(rankObj).map(([memberName, memberData]: [string, any]) => ({
                ...memberData,
                name: memberName,
                rank: rankName
            }));
        };

        const owner = extractMembers(members.owner, 'OWNER')[0];
        const allMembers = [
            ...extractMembers(members.owner, 'OWNER'),
            ...extractMembers(members.chief, 'CHIEF'),
            ...extractMembers(members.strategist, 'STRATEGIST'),
            ...extractMembers(members.captain, 'CAPTAIN'),
            ...extractMembers(members.recruiter, 'RECRUITER'),
            ...extractMembers(members.recruit, 'RECRUIT'),
        ].sort((a, b) => (b.contributed || 0) - (a.contributed || 0));

        return (
            <div className="global-container">

                <header className="global-header">

                    <Link href="/guilds" className="global-back-btn">
                        <ArrowLeft />
                    </Link>

                    <h1 className="global-title" title={data.name}>

                        <Shield />

                        {data.name} [{data.prefix}]
                    </h1>

                </header >

                <p className="guild-founded">

                    <Calendar />

                    Founded: {new Date(data.created).toLocaleDateString()}

                </p>


                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

                    <div className="guild-stat-card">

                        <div className="header">

                            <span className="label">
                                Level
                            </span>

                            <Star />

                        </div>

                        <div className="value">
                            {data.level}
                        </div>

                    </div>

                    <div className="guild-stat-card">

                        <div className="header">

                            <span className="label">
                                Territories
                            </span>

                            <MapPin />

                        </div>

                        <div className="value">
                            {data.territories}
                        </div>

                    </div>

                    <div className="guild-stat-card">

                        <div className="header">

                            <span className="label">
                                Members
                            </span>

                            <Users />

                        </div>

                        <div className="value">
                            {data.members?.total || 0}
                        </div>

                    </div>

                    <div className="guild-stat-card">

                        <div className="header">

                            <span className="label">
                                Wars
                            </span>

                            <Sword />

                        </div>

                        <div className="value">
                            {data.wars?.toLocaleString() || 0}
                        </div>

                    </div>

                </div>

                {owner && (

                    <div className="mb-12">

                        <header className="mb-6">

                            <span className="guild-leader-subtitle">
                                Guild Leadership
                            </span>

                            <h2 className="guild-leader-title">
                                The Leader
                            </h2>

                        </header>

                        <div className="guild-leader-card">

                            <div className="header">

                                <div className="relative shrink-0">

                                    <img
                                        src={`https://visage.surgeplay.com/full/96/${owner.uuid}`}
                                        className="h-24"
                                        alt={owner.name}
                                    />

                                    <div className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full ${owner.online ? 'bg-emerald-500' : 'bg-slate-300'}`} />

                                </div>

                                <div className="flex-1">

                                    <span className="owner-badge">
                                        OWNER
                                    </span>

                                    <h3 className="owner-name">
                                        {owner.name}
                                    </h3>

                                    {owner.online && owner.server && (
                                        <p className="owner-online">
                                            Online on {owner.server}
                                        </p>
                                    )}

                                    {!owner.online && (
                                        <p className="owner-offline">
                                            Last seen offline
                                        </p>
                                    )}

                                </div>

                            </div>

                            <div className="footer">

                                <div>

                                    <span className="contribution-label">
                                        Contribution
                                    </span>

                                    <span className="contribution-value">
                                        {owner.contributed?.toLocaleString() || 0}
                                    </span>

                                </div>

                                <Link
                                    href={`/player/${owner.uuid || owner.name}`}
                                    className="btn"
                                >
                                    <ExternalLink />
                                </Link>

                            </div>

                        </div>

                    </div>

                )}

                <GuildMemberListClient members={allMembers} totalCount={data.members?.total || 0} />

            </div >
        );

    } catch (error: any) {

        return (

            <div>
                Error
            </div>

        );

    }

}
