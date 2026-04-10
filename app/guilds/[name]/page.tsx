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

                    <StatBox
                        label="Level"
                        value={data.level}
                        icon={<Star className="size-4 text-black" />}
                    />

                    <StatBox
                        label="Territories"
                        value={data.territories}
                        icon={<MapPin className="size-4 text-black" />}
                    />

                    <StatBox
                        label="Members"
                        value={`${data.members?.total || 0}`}
                        icon={<Users className="size-4 text-black" />}
                    />

                    <StatBox
                        label="Wars"
                        value={data.wars?.toLocaleString() || 0}
                        icon={<Sword className="size-4 text-black" />}
                    />

                </div>

                {owner && (

                    <div className="mb-12">

                        <header className="mb-6">

                            <span className="text-[10px] font-black uppercase tracking-widest text-black/50 block mb-1">
                                Guild Leadership</span>

                            <h2 className="text-4xl font-jersey uppercase tracking-wider">
                                The Leader
                            </h2>

                        </header>

                        <div className="relative max-w-md p-8 border-4 border-black bg-white sm:shadow-retro-lg transition-all sm:hover:shadow-none sm:hover:translate-x-1 sm:hover:translate-y-1">

                            <div className="flex items-center gap-6">

                                <div className="relative shrink-0">

                                    <img
                                        src={`https://visage.surgeplay.com/full/96/${owner.uuid}`}
                                        className="h-24"
                                        alt={owner.name}
                                    />

                                    <div className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-white rounded-full ${owner.online ? 'bg-emerald-500' : 'bg-slate-300'}`} />

                                </div>

                                <div className="flex-1">

                                    <span className="text-[10px] font-black uppercase px-2 py-0.5 bg-black text-white border border-black mb-2 inline-block tracking-widest">
                                        OWNER
                                    </span>

                                    <h3 className="text-4xl font-jersey uppercase tracking-wider mb-1 leading-none">
                                        {owner.name}
                                    </h3>

                                    {owner.online && owner.server && (
                                        <p className="text-[10px] font-black text-emerald-600 tracking-[0.2em] uppercase">
                                            Online on {owner.server}
                                        </p>
                                    )}

                                    {!owner.online && (
                                        <p className="text-[10px] font-black text-black/20 tracking-[0.2em] uppercase italic">
                                            Last seen offline
                                        </p>
                                    )}

                                </div>

                            </div>

                            <div className="mt-8 pt-6 border-t-2 border-black border-dashed flex items-center justify-between">

                                <div>

                                    <span className="text-xs font-black uppercase text-black/50 block">
                                        Contribution
                                    </span>

                                    <span className="font-jersey text-2xl">
                                        {owner.contributed?.toLocaleString() || 0}
                                    </span>

                                </div>

                                <Link
                                    href={`/player/${owner.uuid || owner.name}`}
                                    className="h-10 w-10 border-2 border-black flex items-center justify-center hover:bg-black hover:text-white transition-all"
                                >
                                    <ExternalLink className="w-4 h-4" />
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

function StatBox({ label, value, icon }: { label: string, value: any, icon: React.ReactNode }) {
    return (

        <div className="relative border-2 border-black bg-white p-6 shadow-retro-sm">

            <div className="flex items-center justify-between mb-4">

                <span className="text-xs font-black uppercase text-black/50 tracking-widest">
                    {label}
                </span>

                {icon}

            </div>

            <div className="font-jersey text-4xl uppercase leading-none">
                {value}
            </div>

        </div>

    );

}

