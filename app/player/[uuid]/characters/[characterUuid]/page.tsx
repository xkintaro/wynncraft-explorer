import { PlayerService } from '@/api/playerService';

import Link from 'next/link';

import {
    ArrowLeft,
    Shield,
    Sword,
    Target,
    Flame,
    ScrollText,
    Skull,
    Gem,
    ChevronRight,
    Activity,
    Hammer,
} from 'lucide-react';

import { SKILL_CONFIG } from '@/lib/constants';

import { getClassConfig } from '@/lib/utils';

export default async function CharacterDetailPage({

    params

}: {

    params: Promise<{ uuid: string; characterUuid: string }>

}) {

    const { uuid, characterUuid } = await params;

    const [charFull, playerData] = await Promise.all([

        PlayerService.getCharacterFull(uuid, characterUuid),

        PlayerService.getPlayer(uuid).catch(() => null) as Promise<any>,

    ]);

    const charData = charFull.character;

    const classType = charData?.type?.toLowerCase();

    if (!charData) throw new Error('Character not found');

    const config = getClassConfig(charData.type);

    const Icon = config.icon;

    const playerUsername = (playerData as any)?.username || uuid;

    const playerUuid = (playerData as any)?.uuid || uuid;

    const gamemodes = charData.gamemode || [];

    const isHardcore = gamemodes.includes('hardcore');

    const isIronman = gamemodes.includes('ironman');

    const isCraftsman = gamemodes.includes('craftsman');

    const isHunted = gamemodes.includes('hunted');

    const skillPoints = charData.skillPoints || {};

    const totalSkillPoints = Object.values(skillPoints).reduce(

        (sum: number, val: any) => sum + (typeof val === 'number' ? val : 0), 0

    );

    const completedQuests = charData.quests || [];

    const questCount = completedQuests.length;

    const professions = charData.professions || {};

    const dungeons = charData.dungeons || {};

    const raids = charData.raids || {};

    return (
        <div className="max-w-6xl mx-auto py-12 px-8">

            <nav className="mb-8 flex items-center gap-2 text-sm font-medium text-black/50">

                <Link href="/">
                    Home
                </Link>

                <ChevronRight className="w-4 h-4" />

                <Link href={`/player/${uuid}`}>
                    {playerUsername}
                </Link>

                <ChevronRight className="w-4 h-4" />

                <span className={config.textColor}>
                    {charData.nickname || charData.type}
                </span>

            </nav>

            <div className="relative rounded-[2.5rem] overflow-hidden mb-10 shadow-2xl">

                <div className={`absolute inset-0 bg-linear-to-br ${config.gradient} opacity-90`} />

                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgyNTUsMjU1LDI1NSwwLjA4KSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-50" />

                <div className="relative z-10 p-10 flex flex-col md:flex-row items-center gap-8">

                    <div className="relative shrink-0">

                        <img
                            src={`https://visage.surgeplay.com/full/350/${playerUuid}`}
                            alt={playerUsername}
                            className="h-72 drop-shadow-2xl"
                        />

                        <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-xl">

                            <Icon className="w-9 h-9" style={{ color: config.color }} />

                        </div>

                    </div>

                    <div className="flex-1 text-white text-center md:text-left">

                        <div className="flex items-center gap-3 mb-2 justify-center md:justify-start flex-wrap">

                            <span className="text-xs font-black text-white/50 uppercase tracking-[0.3em]">
                                {charData.type}
                            </span>

                            {charData.reskin && (

                                <span className="bg-white/20 text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest backdrop-blur-sm">
                                    {charData.reskin}
                                </span>

                            )}

                            {isHardcore && (

                                <span className="bg-red-600/30 text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest backdrop-blur-sm flex items-center gap-1.5">

                                    <Skull className="w-3 h-3" />

                                    Hardcore

                                </span>

                            )}

                            {isIronman && (

                                <span className="bg-amber-600/30 text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest backdrop-blur-sm flex items-center gap-1.5">

                                    <Shield className="w-3 h-3" />

                                    Ironman

                                </span>

                            )}

                            {isCraftsman && (

                                <span className="bg-emerald-600/30 text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest backdrop-blur-sm flex items-center gap-1.5">

                                    <Hammer className="w-3 h-3" />

                                    Craftsman

                                </span>

                            )}

                            {isHunted && (

                                <span className="bg-orange-600/30 text-white px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest backdrop-blur-sm flex items-center gap-1.5">

                                    <Target className="w-3 h-3" />

                                    Hunted

                                </span>

                            )}

                        </div>

                        <h1 className="text-7xl font-jersey uppercase tracking-wider leading-none mb-3">
                            {charData.nickname || charData.type}
                        </h1>

                        <p className="text-white/60 text-sm font-bold uppercase tracking-wider mb-6">
                            {playerUsername}'s Character
                        </p>

                        <div className="max-w-md mx-auto md:mx-0">

                            <div className="flex items-end justify-between mb-2">

                                <span className="text-5xl font-jersey leading-none">
                                    Lv.{charData.level}
                                </span>

                                <span className="text-lg font-bold text-white/40">
                                    {charData.xpPercent || 0}%
                                </span>

                            </div>

                            <div className="w-full h-3 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm">

                                <div
                                    className="h-full bg-white/60 rounded-full transition-all duration-1000 relative"
                                    style={{ width: `${charData.xpPercent || 0}%` }}
                                >

                                    <div className="absolute inset-0 bg-white/30 animate-pulse rounded-full" />

                                </div>

                            </div>

                            <p className="text-white/40 text-sm font-medium mt-1.5">
                                {charData.xp} XP • Total Level: {charData.totalLevel}
                            </p>

                        </div>

                    </div>

                    <Link
                        href={`/player/${uuid}`}
                        className="absolute top-6 right-6 bg-white/10 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white/10 text-white font-bold text-xs uppercase tracking-widest hover:bg-white/20 transition-all flex items-center gap-2"
                    >

                        <ArrowLeft className="w-4 h-4" />

                        Back

                    </Link>

                </div>

            </div>

            <div className="space-y-8">

                <div className="border border-black p-10">

                    <div className="flex items-center justify-between mb-5">

                        <h3 className="text-2xl font-jersey flex items-center gap-3 uppercase tracking-wide">

                            <Activity className="w-6 h-6" style={{ color: config.color }} />

                            Skill Points

                        </h3>

                        <span className="bg-black text-white px-4 py-2 text-xs font-black uppercase tracking-widest">
                            TOTAL: {totalSkillPoints}
                        </span>

                    </div>

                    <div className="space-y-4">

                        {Object.entries(SKILL_CONFIG).map(([key, info]) => {

                            const value = skillPoints[key] || 0;

                            const maxPoints = 150;

                            const percent = (value / maxPoints) * 100;

                            const SkillIcon = info.icon;

                            return (

                                <div key={key}>

                                    <div className="flex items-center justify-between mb-1">

                                        <div className="flex items-center gap-2">

                                            <SkillIcon className="w-4 h-4" style={{ color: info.color }} />

                                            <span className="text-sm font-bold text-black/50 uppercase tracking-wider">
                                                {info.label}
                                            </span>

                                        </div>

                                        <span className="font-jersey text-xl text-black">{value}</span>

                                    </div>

                                    <div className="w-full h-2 bg-white overflow-hidden">

                                        <div
                                            className="h-full transition-all duration-1000"
                                            style={{
                                                width: `${Math.min(100, percent)}%`,
                                                background: info.color
                                            }}
                                        />

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                </div>

                <div className="border border-black p-10">

                    <h3 className="text-2xl font-jersey flex items-center gap-3 uppercase tracking-wide mb-5">

                        <Sword className="w-6 h-6 text-rose-500" />

                        General Stats

                    </h3>

                    <div className="grid grid-cols-4 gap-4">

                        <MiniStat
                            label="Mobs Killed"
                            value={charData.mobsKilled}
                        />

                        <MiniStat
                            label="Deaths"
                            value={charData.deaths}
                        />

                        <MiniStat
                            label="PvP Kills"
                            value={charData.pvp?.kills}
                        />

                        <MiniStat
                            label="PvP Deaths"
                            value={charData.pvp?.deaths}
                        />

                        <MiniStat
                            label="Wars"
                            value={charData.wars}
                        />

                        <MiniStat
                            label="Chests Found"
                            value={charData.chestsFound}
                        />

                        <MiniStat
                            label="Playtime"
                            value={charData.playtime ? `${charData.playtime}h` : null}
                        />

                        <MiniStat
                            label="Blocks Walked"
                            value={charData.blocksWalked}
                        />

                        <MiniStat
                            label="Logins"
                            value={charData.logins}
                        />

                        <MiniStat
                            label="Discoveries"
                            value={charData.discoveries}
                        />

                        <MiniStat
                            label="World Events"
                            value={charData.worldEvents}
                        />

                        <MiniStat
                            label="Caves"
                            value={charData.caves}
                        />

                        <MiniStat
                            label="Lootruns"
                            value={charData.lootruns}
                        />

                        <MiniStat
                            label="Content Completion"
                            value={charData.contentCompletion}
                        />

                        <MiniStat
                            label="Items Identified"
                            value={charData.itemsIdentified}
                        />

                        <MiniStat
                            label="Pre-Economy"
                            value={charData.preEconomy}
                        />

                    </div>

                    {charData.pvp?.kills !== undefined && charData.pvp?.deaths !== undefined && (

                        <div className="mt-4 p-4 bg-rose-50 border border-rose-100 text-center">

                            <p className="text-[9px] font-black text-rose-400 uppercase tracking-widest">
                                PvP K/D
                            </p>

                            <p className="text-3xl font-jersey text-rose-600 leading-none">

                                {charData.pvp.deaths > 0
                                    ? (charData.pvp.kills / charData.pvp.deaths).toFixed(2)
                                    : charData.pvp.kills || '0'}

                            </p>

                        </div>

                    )}

                </div>

                {Object.keys(professions).length > 0 && (

                    <div className="border border-black p-10">

                        <h3 className="text-2xl font-jersey flex items-center gap-3 uppercase tracking-wide mb-5">

                            <Gem className="w-6 h-6 text-emerald-500" />

                            Professions

                        </h3>

                        <div className="grid grid-cols-2 gap-4">

                            {Object.entries(professions).map(([name, data]: [string, any]) => {

                                const level = data?.level || 0;

                                const xpPercent = data?.xpPercent || 0;

                                return (

                                    <div key={name} className={`p-5 border ${config.bgAccent} ${config.borderAccent}`}>

                                        <div className="flex items-center justify-between mb-3">

                                            <span className="text-sm font-black text-black uppercase tracking-wider">
                                                {name}
                                            </span>

                                            <span className="text-2xl font-jersey text-black">
                                                Lv.{level}
                                            </span>

                                        </div>

                                        <div className="w-full h-2 bg-white overflow-hidden">

                                            <div
                                                className={`h-full bg-linear-to-r ${config.gradient}`}
                                                style={{ width: `${xpPercent}%` }}
                                            />

                                        </div>

                                        <p className="text-xs text-black/50 mt-3">
                                            {xpPercent}% XP
                                        </p>

                                    </div>

                                );

                            })}

                        </div>

                    </div>

                )}

                {dungeons && Object.keys(dungeons.list || {}).length > 0 && (

                    <div className="border border-black p-10">

                        <div className="flex items-center justify-between mb-5">

                            <h3 className="text-2xl font-jersey flex items-center gap-3 uppercase tracking-wide">

                                <Flame className="w-6 h-6 text-red-500" />

                                Dungeons

                            </h3>

                            <span className="bg-black text-white px-4 py-2 text-xs font-black uppercase tracking-widest">
                                TOTAL: {dungeons.total || 0}
                            </span>

                        </div>

                        <div className="grid grid-cols-2 gap-4">

                            {Object.entries(dungeons.list || {}).map(([name, count]: [string, any]) => (

                                <div key={name} className="flex items-center justify-between p-5 border border-black">

                                    <span className="font-bold text-black">
                                        {name}
                                    </span>

                                    <span className="font-jersey text-2xl text-black/50">
                                        {count}
                                    </span>

                                </div>

                            ))}

                        </div>

                    </div>

                )}

                {raids && Object.keys(raids.list || {}).length > 0 && (

                    <div className="border border-black p-10">

                        <div className="flex items-center justify-between mb-5">

                            <h3 className="text-2xl font-jersey flex items-center gap-3 uppercase tracking-wide">

                                <Shield className="w-6 h-6 text-purple-500" />

                                Raids

                            </h3>

                            <span className="bg-black text-white px-4 py-2 text-xs font-black uppercase tracking-widest">
                                TOTAL: {raids.total || 0}
                            </span>

                        </div>

                        <div className="grid grid-cols-2 gap-3">

                            {Object.entries(raids.list || {}).map(([name, count]: [string, any]) => (

                                <div key={name} className="flex items-center justify-between p-5 border border-black">

                                    <span className="font-bold text-black">
                                        {name}
                                    </span>

                                    <span className="font-jersey text-2xl text-black/50">
                                        {count}
                                    </span>

                                </div>

                            ))}
                        </div>

                    </div>
                )}

                {questCount > 0 && (

                    <div className="border border-black p-10">

                        <div className="flex items-center justify-between mb-5">

                            <h3 className="text-2xl font-jersey flex items-center gap-3 uppercase tracking-wide">

                                <ScrollText className="w-6 h-6 text-blue-500" />

                                Quests

                            </h3>

                            <span className="bg-black text-white px-4 py-2 text-xs font-black uppercase tracking-widest">
                                TOTAL: {questCount}
                            </span>

                        </div>

                        <div className="flex flex-wrap gap-2">

                            {completedQuests.map((quest: string, i: number) => (

                                <span
                                    key={i}
                                    className="border border-black px-4 py-2 text-xs font-semibold"
                                >

                                    {quest}

                                </span>

                            ))}

                        </div>

                    </div>

                )}

            </div>

        </div>
    );

}

function MiniStat({ label, value }: { label: string; value: any }) {

    return (

        <div className="p-4 border border-black text-center">

            <p className="text-xs font-black text-black/50 uppercase">
                {label}
            </p>

            <p className="text-2xl font-jersey text-black leading-none">
                {value !== undefined && value !== null ? value ?? value : '—'}
            </p>

        </div>

    );
}