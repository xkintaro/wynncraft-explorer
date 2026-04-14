import { PlayerService } from '@/api/playerService';

import Link from 'next/link';

import {
    Shield,
    Clock,
    Calendar,
    Globe,
    Sword,
    Trophy,
    Box,
    Compass,
    Flame,
    Zap,
    ScrollText,
    Map as MapIcon,
    Users,
    Sparkles,
    TrendingUp,
    Crown,
    Crosshair,
    Target,
    ChevronRight,
    Skull,
    Gem,
    ArrowUpRight,
    Swords,
    MapPin
} from 'lucide-react';

import React from 'react';

import { RANK_CONFIG } from '@/lib/constants';

import { getClassConfig } from '@/lib/utils';

export default async function PlayerPage({

    params

}: {

    params: Promise<{ uuid: string }>

}) {

    const { uuid } = await params;

    const profileData = await PlayerService.getFullProfile(uuid);

    const playerData: any = profileData.player;

    const charactersData: any = profileData.characters;

    const guildData: any = profileData.guild;

    if (!playerData) throw new Error('Player not found');

    const characterEntries = charactersData ? Object.entries(charactersData) : [];

    const totalCharacters = characterEntries.length;

    const highestLevelChar = characterEntries.reduce((best: any, [, char]: any) => {
        if (!best || char.level > best.level) return char;
        return best;
    }, null);

    const lastJoin = playerData.lastJoin ? new Date(playerData.lastJoin) : null;

    const now = new Date();

    const diffMs = lastJoin ? now.getTime() - lastJoin.getTime() : 0;

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    const diffDays = Math.floor(diffHours / 24);

    const lastSeenText = playerData.online
        ? 'Online'
        : diffDays > 0
            ? `${diffDays} ${diffDays === 1 ? 'day' : 'days'} ago`
            : diffHours > 0
                ? `${diffHours} ${diffHours === 1 ? 'hour' : 'hours'} ago`
                : 'Recently';

    const firstJoin = playerData.firstJoin ? new Date(playerData.firstJoin) : null;

    const yearsPlayed = firstJoin ? Math.floor((now.getTime() - firstJoin.getTime()) / (1000 * 60 * 60 * 24 * 365)) : 0;

    const isVeteran = yearsPlayed >= 2;

    const classStats: Record<string, { count: number; totalLevel: number; maxLevel: number; totalXp: number }> = {};

    characterEntries.forEach(([, char]: any) => {

        const type = char.type || 'UNKNOWN';

        if (!classStats[type]) {
            classStats[type] = { count: 0, totalLevel: 0, maxLevel: 0, totalXp: 0 };
        }

        classStats[type].count++;

        classStats[type].totalLevel += char.level || 0;

        classStats[type].maxLevel = Math.max(classStats[type].maxLevel, char.level || 0);

        classStats[type].totalXp += char.xp || 0;

    });

    const highestChar = characterEntries.reduce((best: [string, any] | null, entry: [string, any]) => {

        const [, char] = entry;

        if (!best || char.level > best[1].level) return entry;

        return best;

    }, null as [string, any] | null);

    const totalLevelsInRadar = characterEntries.reduce((sum, [, char]: any) => sum + (char.level || 0), 0);

    const memberCount = guildData?.members ? Object.values(guildData.members).reduce((sum: number, rank: any) => {

        if (typeof rank === 'object' && rank !== null) {

            return sum + Object.keys(rank).length;

        }

        return sum;

    }, 0) : '??';

    const playerRank = playerData.guild?.rank || 'RECRUIT';

    const rankConfig = RANK_CONFIG[playerRank] || RANK_CONFIG.RECRUIT;

    return (

        <div className="max-w-6xl mx-auto py-12 px-8">

            <header className="mb-10 relative">

                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">

                    <div className="flex items-center gap-6">

                        <div className="relative group">

                            <div className="absolute -inset-1 bg-linear-to-r from-amber-500 via-orange-500 to-rose-500 rounded-3xl blur-md opacity-25 animate-pulse" />

                            <div className="relative w-28 h-28 bg-white rounded-3xl flex items-center justify-center p-2 shadow-sm border border-slate-100 overflow-hidden">

                                <img
                                    src={`https://visage.surgeplay.com/bust/256/${playerData.uuid}`}
                                    alt={playerData.username}
                                    className="w-full h-full object-contain"
                                />

                            </div>

                            <div className={`absolute -bottom-2 -right-2 w-9 h-9 rounded-2xl flex items-center justify-center border-4 border-slate-50 shadow-sm ${playerData.online ? 'bg-green-500' : 'bg-slate-400'}`}>

                                <div className={`w-2.5 h-2.5 bg-white rounded-full ${playerData.online ? 'animate-pulse' : ''}`} />

                            </div>

                        </div>

                        <div>

                            <div className="flex items-center gap-3 mb-1.5 flex-wrap">

                                <div className="flex flex-col">

                                    <h1 className="text-6xl font-jersey text-slate-900 tracking-wide uppercase leading-none">
                                        {playerData.username}
                                    </h1>

                                    {playerData.nickname && (
                                        <p className="text-sm font-bold text-slate-400 mt-1 uppercase tracking-widest italic">
                                            &quot;{playerData.nickname}&quot;
                                        </p>
                                    )}

                                </div>

                                <div className="flex gap-2">

                                    <span className="bg-amber-100 text-amber-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border border-amber-200">
                                        {playerData.rank}
                                    </span>

                                    {isVeteran && (

                                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border border-purple-200 flex items-center gap-1.5">

                                            <Crown className="w-3 h-3" />

                                            {yearsPlayed} Year

                                        </span>

                                    )}

                                    {playerData.supportRank && (

                                        <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-widest border border-emerald-200">

                                            {playerData.supportRank}

                                        </span>

                                    )}

                                </div>

                            </div>

                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-slate-500 text-sm font-medium">

                                <span className="flex items-center gap-2">

                                    <Globe className={`w-4 h-4 ${playerData.online ? 'text-green-400' : 'text-slate-400'}`} />

                                    {playerData.online ? `${playerData.server} Server` : lastSeenText}

                                </span>

                                <span className="flex items-center gap-2">

                                    <Calendar className="w-4 h-4 text-slate-400" />

                                    First Join: {firstJoin ? firstJoin.toLocaleDateString('tr-TR') : '??'}

                                </span>

                                <span className="flex items-center gap-2">

                                    <Users className="w-4 h-4 text-slate-400" />

                                    {totalCharacters} Characters

                                </span>

                            </div>

                        </div>

                    </div>

                </div>

            </header>

            {guildData && (

                <div className="mb-10 relative border-2 border-black bg-white p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">

                    <div className="flex items-start justify-between mb-8">

                        <div className="flex items-center gap-6">

                            <div className="w-20 h-20 border-2 border-black bg-amber-400 flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">

                                <Shield className="w-10 h-10 text-black" />

                            </div>

                            <div>

                                <p className="text-xs font-black text-black/40 uppercase tracking-[0.2em] mb-1">
                                    Guild Profile
                                </p>

                                <h3 className="text-4xl font-jersey text-black uppercase tracking-wider leading-none">
                                    {guildData.name}
                                </h3>

                                {guildData.prefix && (

                                    <span className="text-lg font-jersey text-black/40 mt-1 inline-block">
                                        [{guildData.prefix}]
                                    </span>

                                )}

                            </div>

                        </div>

                        <div className={`px-6 py-3 border-2 border-black ${rankConfig.bg} shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}>

                            <p className="text-[10px] font-black text-white/60 uppercase tracking-widest">
                                Rank
                            </p>

                            <div className="flex items-center gap-2">

                                <p className="text-lg font-jersey text-white uppercase tracking-wider">
                                    {rankConfig.label}
                                </p>

                                {playerData.guild?.rankStars && (

                                    <span className="text-white text-xs tracking-tighter drop-shadow-sm">
                                        {playerData.guild.rankStars}
                                    </span>

                                )}

                            </div>

                        </div>

                    </div>

                    <div className="grid grid-cols-4 gap-4 mb-8">

                        <div className="border-2 border-black p-5 bg-white">

                            <Users className="w-6 h-6 text-blue-500 mb-3" />

                            <p className="text-xs font-black text-black/40 uppercase tracking-widest mb-1">
                                Members
                            </p>

                            <p className="text-3xl font-jersey text-black leading-none">
                                {memberCount}
                            </p>

                        </div>

                        <div className="border-2 border-black p-5 bg-white">

                            <TrendingUp className="w-6 h-6 text-emerald-500 mb-3" />

                            <p className="text-xs font-black text-black/40 uppercase tracking-widest mb-1">
                                Level
                            </p>

                            <p className="text-3xl font-jersey text-black leading-none">
                                {guildData.level || '??'}
                            </p>

                        </div>

                        <div className="border-2 border-black p-5 bg-white">

                            <Swords className="w-6 h-6 text-red-500 mb-3" />

                            <p className="text-xs font-black text-black/40 uppercase tracking-widest mb-1">
                                Wars
                            </p>

                            <p className="text-3xl font-jersey text-black leading-none">
                                {guildData.wars || '??'}
                            </p>

                        </div>

                        <div className="border-2 border-black p-5 bg-white">

                            <MapPin className="w-6 h-6 text-amber-500 mb-3" />

                            <p className="text-xs font-black text-black/40 uppercase tracking-widest mb-1">
                                Territories
                            </p>

                            <p className="text-3xl font-jersey text-black leading-none">
                                {guildData.territories || '??'}
                            </p>

                        </div>

                    </div>

                    <div className="flex items-center justify-between border-t-2 border-black pt-6">

                        <div className="flex items-center gap-3 text-black/40 text-sm font-black uppercase tracking-widest">

                            <Calendar className="w-4 h-4" />

                            <span>Founded: {guildData.created ? new Date(guildData.created).toLocaleDateString('tr-TR') : '??'}</span>

                        </div>

                        <Link
                            href={`/guilds/${encodeURIComponent(guildData.name)}`}
                            className="flex items-center gap-3 bg-black text-white px-6 py-3 border-2 border-black hover:bg-white hover:text-black transition-all font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none"
                        >

                            Guild Details

                            <ChevronRight className="w-4 h-4" />

                        </Link>

                    </div>

                </div>

            )}

            <div className="grid grid-cols-12 gap-8">

                <div className="col-span-4 space-y-8">

                    <div className="border border-black p-10">

                        <div className="relative z-10 flex flex-col items-center">

                            <img
                                src={`https://visage.surgeplay.com/full/400/${playerData.uuid}`}
                                className="h-80 drop-shadow-2xl pointer-events-none user-select-none"
                            />

                            <div className="mt-6 flex flex-col gap-4 w-full">

                                <div className="border border-black p-6 flex items-center justify-between">

                                    <div className="text-left">

                                        <p className="text-xs font-black text-black/50 uppercase tracking-widest mb-1">
                                            Total Level
                                        </p>

                                        <p className="text-3xl font-jersey text-black leading-none">
                                            {playerData.globalData?.totalLevel || '??'}
                                        </p>

                                    </div>

                                    <Trophy className="w-8 h-8 text-amber-500 opacity-20" />

                                </div>

                                <div className="border border-black p-6 flex items-center justify-between">

                                    <div className="text-left">

                                        <p className="text-xs font-black text-black/50 uppercase tracking-widest mb-1">
                                            Playtime
                                        </p>

                                        <p className="text-3xl font-jersey text-black leading-none">
                                            {Math.floor(playerData.playtime)} HOURS
                                        </p>

                                    </div>

                                    <Clock className="w-8 h-8 text-blue-500 opacity-20" />

                                </div>

                                <div className="border border-black p-6 flex items-center justify-between">

                                    <div className="text-left">

                                        <p className="text-xs font-black text-black/50 uppercase tracking-widest mb-1">
                                            Level / Hour
                                        </p>

                                        <p className="text-3xl font-jersey text-black leading-none">
                                            {playerData.playtime && playerData.globalData?.totalLevel
                                                ? (playerData.globalData.totalLevel / playerData.playtime).toFixed(1)
                                                : '??'}
                                        </p>

                                    </div>

                                    <TrendingUp className="w-8 h-8 text-indigo-500 opacity-20" />

                                </div>

                            </div>

                        </div>

                    </div>

                    <div className="border border-black p-10">

                        <h3 className="text-2xl font-jersey text-amber-500 mb-6 flex items-center gap-3 uppercase tracking-wide">

                            <Trophy className="w-6 h-6" />

                            Rankings

                        </h3>

                        <div className="space-y-4">

                            {Object.entries(playerData.ranking || {}).map(([key, value]: [string, any]) => {

                                return (

                                    <div key={key} className="flex items-center justify-between border-b border-black/10 pb-4 last:border-b-0 last:pb-0">

                                        <span className="text-black text-sm uppercase tracking-tight">

                                            {key.replace('Level', '').replace(/([A-Z])/g, ' $1').trim()}

                                        </span>

                                        <span className="font-jersey text-xl text-amber-500">
                                            #{value}
                                        </span>

                                    </div>

                                );

                            })}

                        </div>

                    </div>

                </div>

                <div className="col-span-8 space-y-8">

                    <div className="grid grid-cols-3 gap-4">

                        <StatCard
                            icon={<Sword className="text-red-500" />}
                            label="Mobs Killed"
                            value={playerData.globalData?.mobsKilled?.toLocaleString('tr-TR')}
                        />

                        <StatCard
                            icon={<ScrollText className="text-blue-500" />}
                            label="Completed Quests"
                            value={playerData.globalData?.completedQuests}
                        />

                        <StatCard
                            icon={<Box className="text-amber-500" />}
                            label="Chests Found"
                            value={playerData.globalData?.chestsFound?.toLocaleString('tr-TR')}
                        />

                        <StatCard
                            icon={<Compass className="text-emerald-500" />}
                            label="Content Completion"
                            value={playerData.globalData?.contentCompletion}
                        />

                        <StatCard
                            icon={<MapIcon className="text-indigo-500" />}
                            label="Caves Discovered"
                            value={playerData.globalData?.caves}
                        />

                        <StatCard
                            icon={<Zap className="text-orange-500" />}
                            label="World Events"
                            value={playerData.globalData?.worldEvents}
                        />

                        <StatCard
                            icon={<Shield className="text-rose-500" />}
                            label="Wars"
                            value={playerData.globalData?.wars}
                        />

                        <StatCard
                            icon={<Trophy className="text-purple-500" />}
                            label="Lootruns"
                            value={playerData.globalData?.lootruns}
                        />

                    </div>

                    <div className="border border-black p-10">

                        <h3 className="text-2xl font-jersey flex items-center gap-3 uppercase tracking-wide">

                            <Target className="w-6 h-6 text-indigo-500" />

                            Class Distribution

                        </h3>

                        <p className="text-sm text-black/50 font-medium mt-1">

                            {totalCharacters} characters • Total {totalLevelsInRadar} levels

                        </p>

                        {highestChar && (

                            <div className="my-4 bg-linear-to-br from-amber-50 to-orange-50 p-5 border border-black flex items-center gap-5">

                                <div className="w-14 h-14 rounded-2xl bg-linear-to-br from-amber-400 to-orange-500 flex items-center justify-center">

                                    <Trophy className="w-7 h-7 text-white" />

                                </div>

                                <div>

                                    <p className="text-[9px] font-black text-amber-600 uppercase tracking-[0.3em]">
                                        Strongest Character
                                    </p>

                                    <p className="text-2xl font-jersey text-slate-900 leading-none uppercase">

                                        {highestChar[1].nickname || highestChar[1].type} — Lv.{highestChar[1].level}

                                    </p>

                                    <p className="text-xs text-slate-500 font-medium mt-0.5">
                                        {highestChar[1].xp?.toLocaleString('tr-TR')} XP
                                    </p>

                                </div>

                            </div>

                        )}

                        <div className="space-y-4">


                            {Object.entries(classStats).map(([type, stats]) => {

                                const config = getClassConfig(type);

                                const Icon = config.icon;

                                const color = config.color;

                                const maxPossibleLevel = 120;

                                const percent = (stats.maxLevel / maxPossibleLevel) * 100;

                                return (

                                    <div
                                        key={type}
                                        className="border border-black p-5"
                                    >

                                        <div className="flex items-center justify-between mb-3">

                                            <div className="flex items-center gap-3">

                                                <div
                                                    className="w-10 h-10 rounded-xl flex items-center justify-center"
                                                    style={{ backgroundColor: `${color}15` }}
                                                >

                                                    <Icon className="w-5 h-5" style={{ color }} />

                                                </div>

                                                <div>

                                                    <p className="font-bold text-slate-800 text-sm uppercase tracking-wider">
                                                        {type}
                                                    </p>

                                                    <p className="text-xs text-slate-400">
                                                        {stats.count} characters
                                                    </p>

                                                </div>

                                            </div>

                                            <div className="text-right">

                                                <p className="text-2xl font-jersey text-slate-800 leading-none">
                                                    Lv.{stats.maxLevel}
                                                </p>

                                                <p className="text-[10px] font-bold text-slate-400 uppercase">
                                                    highest
                                                </p>

                                            </div>

                                        </div>

                                        <div className="w-full h-2 bg-slate-200/60 rounded-full overflow-hidden">

                                            <div
                                                className="h-full rounded-full transition-all duration-1000"
                                                style={{
                                                    width: `${percent}%`,
                                                    background: `linear-gradient(90deg, ${color}, ${color}99)`
                                                }}
                                            />

                                        </div>

                                    </div>

                                );

                            })}

                        </div>

                    </div>

                    {characterEntries.length > 0 && (

                        <div>

                            <div className="flex items-center justify-between mb-6">

                                <h3 className="text-2xl font-jersey flex items-center gap-3 uppercase tracking-wide">
                                    <Sparkles className="w-6 h-6 text-purple-500" />
                                    Characters
                                </h3>

                                <span className="bg-black text-white px-4 py-2 text-xs font-black uppercase tracking-widest">
                                    TOTAL: {totalCharacters}
                                </span>

                            </div>

                            <div className="grid grid-cols-2 gap-6">

                                {characterEntries.map(([charUuid, charData]: [string, any], index: number) => {

                                    const config = getClassConfig(charData.type);

                                    const CharacterIcon = config.icon;

                                    const xpPercent = charData.xpPercent || 0;

                                    const gamemodes = charData.gamemode || [];

                                    const isHardcore = gamemodes.includes('hardcore');

                                    const isIronman = gamemodes.includes('ironman');

                                    const isCraftsman = gamemodes.includes('craftsman');

                                    const isHunted = gamemodes.includes('hunted');

                                    const isActive = charUuid === playerData.activeCharacter;

                                    return (

                                        <div
                                            key={charUuid}
                                            className={`relative group border-2 border-black transition-all duration-300 overflow-hidden bg-white hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-1 hover:-translate-y-1`}
                                            style={{ animationDelay: `${index * 100}ms` }}
                                        >

                                            <div className={`h-2 bg-linear-to-r ${config.gradient} border-b-2 border-black`} />

                                            <div className="p-6">

                                                <div className="flex items-start justify-between mb-5">

                                                    <div className="flex items-center gap-4">

                                                        <div className={`relative w-14 h-14 border-2 border-black bg-linear-to-br ${config.gradient} flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>

                                                            <CharacterIcon className="w-7 h-7 text-white" />

                                                            {isActive && (
                                                                <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-green-500 rounded-full border-2 border-black flex items-center justify-center shadow-sm">

                                                                    <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />

                                                                </div>
                                                            )}

                                                        </div>

                                                        <div>

                                                            <div className="flex items-center gap-2 mb-0.5">

                                                                <h4 className="text-2xl font-jersey text-black uppercase tracking-wide leading-none">

                                                                    {charData.nickname || charData.type}

                                                                </h4>

                                                                {isActive && (

                                                                    <span className="bg-black text-white px-2 py-0.5 text-[9px] font-black uppercase tracking-widest">
                                                                        Active
                                                                    </span>

                                                                )}

                                                            </div>

                                                            {charData.reskin && (

                                                                <span className="text-xs font-bold text-black/40 uppercase tracking-wider">
                                                                    {charData.reskin}
                                                                </span>

                                                            )}

                                                        </div>

                                                    </div>

                                                    <div className="flex gap-1.5">

                                                        {isHardcore && (

                                                            <div className="w-8 h-8 border-2 border-black bg-red-100 flex items-center justify-center" title="Hardcore">

                                                                <Skull className="w-4 h-4 text-red-600" />

                                                            </div>

                                                        )}

                                                        {isIronman && (

                                                            <div className="w-8 h-8 border-2 border-black bg-amber-100 flex items-center justify-center" title="Ironman">

                                                                <Shield className="w-4 h-4 text-amber-700" />

                                                            </div>

                                                        )}

                                                        {isCraftsman && (

                                                            <div className="w-8 h-8 border-2 border-black bg-blue-100 flex items-center justify-center" title="Craftsman">

                                                                <Gem className="w-4 h-4 text-blue-600" />

                                                            </div>

                                                        )}

                                                        {isHunted && (

                                                            <div className="w-8 h-8 border-2 border-black bg-purple-100 flex items-center justify-center" title="Hunted">

                                                                <Crosshair className="w-4 h-4 text-purple-600" />

                                                            </div>

                                                        )}

                                                    </div>

                                                </div>

                                                <div className="mb-5">

                                                    <div className="flex items-end justify-between mb-2">

                                                        <div className="flex items-baseline gap-2">

                                                            <span className="text-5xl font-jersey text-black leading-none">
                                                                Lv.{charData.level}
                                                            </span>

                                                            <span className="text-sm font-bold text-black/40">
                                                                / 106
                                                            </span>

                                                        </div>

                                                        <span className={`text-sm font-black ${config.textColor}`}>{xpPercent}%</span>

                                                    </div>

                                                    <div className="w-full h-3 border-2 border-black bg-slate-100 overflow-hidden">

                                                        <div
                                                            className={`h-full bg-linear-to-r ${config.gradient} transition-all duration-1000 ease-out relative`}
                                                            style={{ width: `${xpPercent}%` }}
                                                        >

                                                            <div className="absolute inset-0 bg-white/20 animate-pulse" />

                                                        </div>

                                                    </div>

                                                    {charData.xp !== undefined && (

                                                        <p className="text-xs text-black/40 mt-1.5 uppercase font-black tracking-widest">
                                                            {charData.xp?.toLocaleString('tr-TR')} XP
                                                        </p>

                                                    )}

                                                </div>

                                                <div className="flex items-center gap-3 mb-4">

                                                    <div className={`flex-1 border-2 border-black p-3 text-center`}>

                                                        <p className="text-[9px] font-black text-black/40 uppercase tracking-widest mb-0.5">
                                                            Total Lv.
                                                        </p>

                                                        <p className="text-xl font-jersey text-black leading-none">
                                                            {charData.totalLevel}
                                                        </p>

                                                    </div>

                                                    {charData.wars !== undefined && (

                                                        <div className={`flex-1 border-2 border-black p-3 text-center`}>

                                                            <p className="text-[9px] font-black text-black/40 uppercase tracking-widest mb-0.5">
                                                                Wars
                                                            </p>

                                                            <p className="text-xl font-jersey text-black leading-none">
                                                                {charData.wars}
                                                            </p>

                                                        </div>
                                                    )}

                                                    {charData.mobsKilled !== undefined && (

                                                        <div className={`flex-1 border-2 border-black p-3 text-center`}>

                                                            <p className="text-[9px] font-black text-black/40 uppercase tracking-widest mb-0.5">
                                                                Kills
                                                            </p>

                                                            <p className="text-xl font-jersey text-black leading-none">
                                                                {charData.mobsKilled?.toLocaleString('tr-TR')}
                                                            </p>

                                                        </div>
                                                    )}

                                                </div>

                                                <Link
                                                    href={`/player/${uuid}/characters/${charUuid}`}
                                                    className={`flex items-center justify-between w-full p-4 border-2 border-black transition-all duration-300 group/link bg-black text-white hover:bg-white hover:text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none translate-y-0 active:translate-y-1 active:translate-x-1`}
                                                >

                                                    <div className="flex items-center gap-3">

                                                        <ArrowUpRight className="w-5 h-5" />

                                                        <span className="text-sm font-bold uppercase tracking-wider">
                                                            View Details
                                                        </span>

                                                    </div>

                                                    <ChevronRight className="w-5 h-5 transition-transform group-hover/link:translate-x-1" />

                                                </Link>

                                            </div>

                                        </div>

                                    );

                                })}

                            </div>

                        </div>

                    )}

                    {playerData.globalData?.dungeons && (

                        <div className="border border-black p-10">

                            <div className="flex items-center justify-between mb-5">

                                <h3 className="text-2xl font-jersey flex items-center gap-3 uppercase tracking-wide">

                                    <Flame className="w-6 h-6 text-red-500" />

                                    Dungeons

                                </h3>

                                <span className="bg-black text-white px-4 py-2 text-xs font-black uppercase tracking-widest">
                                    TOTAL: {playerData.globalData?.dungeons?.total}
                                </span>

                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                {Object.entries(playerData.globalData?.dungeons?.list || {}).map(([name, count]: [string, any]) => {

                                    return (

                                        <div key={name} className="flex items-center justify-between p-5 border border-black">

                                            <span className="font-bold text-black">
                                                {name}
                                            </span>

                                            <span className="font-jersey text-2xl text-black/50">
                                                {count}
                                            </span>

                                        </div>

                                    );

                                })}

                            </div>

                        </div>

                    )}

                    {playerData.globalData?.raids && (

                        <div className="border border-black p-10">

                            <div className="flex items-center justify-between mb-5">

                                <h3 className="text-2xl font-jersey flex items-center gap-3 uppercase tracking-wide">

                                    <Shield className="w-6 h-6 text-purple-500" />

                                    Raids

                                </h3>

                                <span className="bg-black text-white px-4 py-2 text-xs font-black uppercase tracking-widest">
                                    TOTAL: {playerData.globalData?.raids?.total}
                                </span>

                            </div>

                            <div className="grid grid-cols-2 gap-4">

                                {Object.entries(playerData.globalData?.raids?.list || {}).map(([name, count]: [string, any]) => (

                                    <div key={name} className="flex items-center justify-between p-5 border border-black">

                                        <span className="font-bold text-black ">
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

                    {playerData.globalData?.pvp && (

                        <div className="border border-black p-10">

                            <h3 className="text-2xl font-jersey flex items-center gap-3 uppercase tracking-wide mb-5">

                                <Sword className="w-6 h-6 text-rose-500" />

                                Pvp Stats

                            </h3>

                            <div className="grid grid-cols-3 gap-4">

                                <div className="p-5 text-center border border-black">

                                    <p className="text-xs font-black text-black/50 uppercase tracking-widest mb-1">
                                        Kills
                                    </p>

                                    <p className="text-3xl font-jersey text-black leading-none">
                                        {playerData.globalData.pvp?.kills || 0}
                                    </p>

                                </div>

                                <div className="p-5 text-center border border-black">

                                    <p className="text-xs font-black text-black/50 uppercase tracking-widest mb-1">
                                        Deaths
                                    </p>

                                    <p className="text-3xl font-jersey text-black leading-none">
                                        {playerData.globalData.pvp?.deaths || 0}
                                    </p>

                                </div>

                                <div className="p-5 text-center border border-black">

                                    <p className="text-xs font-black text-black/50 uppercase tracking-widest mb-1">
                                        K/D Ratio
                                    </p>

                                    <p className="text-3xl font-jersey text-black leading-none">

                                        {playerData.globalData.pvp?.deaths > 0
                                            ? (playerData.globalData.pvp.kills / playerData.globalData.pvp.deaths).toFixed(2)
                                            : playerData.globalData.pvp?.kills || '0'}

                                    </p>

                                </div>

                            </div>

                        </div>

                    )}

                    <div className="border border-black p-10">

                        <div className="flex items-center justify-between mb-5">

                            <h3 className="text-2xl font-jersey flex items-center gap-3 uppercase tracking-wide">

                                <Users className="w-6 h-6 text-emerald-500" />

                                Guild Raids

                            </h3>

                            <span className="bg-black text-white px-4 py-2 text-xs font-black uppercase tracking-widest">
                                TOTAL: {playerData.globalData?.guildRaids?.total}
                            </span>

                        </div>

                        <div className="grid grid-cols-2 gap-4">

                            {Object.entries(playerData.globalData?.guildRaids?.list || {}).map(([name, count]: [string, any]) => (

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

                </div>

            </div>

        </div>

    );

}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: any }) {

    return (

        <div className="p-6 border border-black">

            <div className="mb-4">
                {icon}
            </div>

            <p className="text-xs font-black text-black/50 uppercase tracking-widest mb-1">
                {label}
            </p>

            <p className="text-3xl font-jersey text-black leading-none">
                {value !== undefined ? value : '??'}
            </p>

        </div>

    );

}
