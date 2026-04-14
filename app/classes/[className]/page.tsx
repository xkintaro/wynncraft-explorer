'use client';

import { useState, useEffect, useMemo, use } from 'react';

import { ChevronLeft, ChevronRight, Shield, Book, Star, ArrowLeft, Loader2, Sparkles, X } from 'lucide-react';

import Link from 'next/link';

import { AbilityService } from '@/api/abilityService';

import { ClassService } from '@/api/classService';

import { RARITY_COLORS, CLASS_CONFIG } from '@/lib/constants';

import { stripHtml, stripColorCodes, getNodeColorTw, getArchetypeStyle } from '@/lib/utils';

import ConnectorSvg from '@/components/ConnectorSvg';

interface TreeData {
    archetypes: Record<string, any>;
    pages: Record<string, Record<string, any>>;
}

interface AspectTier {
    threshold: number;
    description: string[];
}

interface AspectData {
    name: string;
    icon: any;
    rarity: string;
    tiers: Record<string, AspectTier>;
}

export default function ClassUnifiedPage({ params }: { params: Promise<{ className: string }> }) {
    const { className } = use(params);

    const [loading, setLoading] = useState(true);
    const [treeData, setTreeData] = useState<TreeData | null>(null);
    const [mapData, setMapData] = useState<Record<string, any> | null>(null);
    const [aspectsData, setAspectsData] = useState<Record<string, any> | null>(null);
    const [classData, setClassData] = useState<any | null>(null);
    const [error, setError] = useState<string | null>(null);

    const pageNumbers = useMemo(() => mapData ? Object.keys(mapData).map(Number).sort((a, b) => a - b) : [1], [mapData]);

    const [currentPage, setCurrentPage] = useState(1);
    const [hoveredAbilityId, setHoveredAbilityId] = useState<string | null>(null);
    const [selectedAbilityIds, setSelectedAbilityIds] = useState<string[]>([]);
    const [activeTab, setActiveTab] = useState<'archetypes' | 'tree' | 'aspects'>('archetypes');

    useEffect(() => {
        let isMounted = true;
        setLoading(true);

        Promise.all([
            AbilityService.getTree(className),
            AbilityService.getMap(className),
            AbilityService.getAspects(className),
            ClassService.getClass(className)
        ]).then(([tree, map, aspects, cls]) => {
            if (!isMounted) return;
            setTreeData(tree as TreeData);
            const mapDataCasted = map as Record<string, any>;
            setMapData(mapDataCasted);
            setAspectsData(aspects as Record<string, any>);
            setClassData(cls);

            const pNums = Object.keys(mapDataCasted || {}).map(Number).sort((a, b) => a - b);
            if (pNums.length > 0) setCurrentPage(pNums[0]);

            setLoading(false);
        }).catch(err => {
            if (!isMounted) return;
            setError(err instanceof Error ? err.message : 'Unknown error');
            setLoading(false);
        });

        return () => { isMounted = false; };
    }, [className]);

    if (loading) {

        return (

            <div className="min-h-screen flex items-center justify-center flex-col gap-4 text-amber-500">

                <Loader2 className="w-12 h-12 animate-spin" />

                <p className="text-xs uppercase tracking-widest font-black">
                    Loading...
                </p>

            </div>

        );

    }

    if (error || !treeData || !mapData || !aspectsData || !classData) {
        return (
            <div>
                Error
            </div>
        );
    }

    return (
        <div className="global-container">

            <header className="global-header">

                <Link href="/classes" className="global-back-btn">

                    <ArrowLeft />

                </Link>

                <h1 className="global-title">
                    {(() => {
                        const config = CLASS_CONFIG[className.toUpperCase()] || CLASS_CONFIG.WARRIOR;
                        const Icon = config.icon;
                        return <Icon className={config.textColor} />;
                    })()}

                    {classData.name}

                </h1>

            </header>

            <p className="text-xl font-medium text-black/50 italic leading-relaxed max-w-4xl mb-12">
                {classData.lore}
            </p>


            <div className="flex flex-col gap-4 mb-12">

                <div className="flex flex-wrap items-center gap-4">

                    <button
                        onClick={() => setActiveTab('archetypes')}
                        className={`flex items-center gap-3 px-8 py-3 text-xs font-black uppercase tracking-[0.2em] transition-all cursor-pointer
                                    ${activeTab === 'archetypes'
                                ? 'bg-emerald-400 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1 -translate-x-1'
                                : 'bg-white text-black/50 border-2 border-black/5 hover:border-black hover:text-black'}`}
                    >

                        <Sparkles className={`w-4 h-4 ${activeTab === 'archetypes' ? 'text-black' : 'text-emerald-500/40'}`} />

                        Archetypes

                    </button>

                    <button
                        onClick={() => setActiveTab('tree')}
                        className={`flex items-center gap-3 px-8 py-3 text-xs font-black uppercase tracking-[0.2em] transition-all cursor-pointer
                                    ${activeTab === 'tree'
                                ? 'bg-amber-400 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1 -translate-x-1'
                                : 'bg-white text-black/50 border-2 border-black/5 hover:border-black hover:text-black'}`}
                    >

                        <Book className={`w-4 h-4 ${activeTab === 'tree' ? 'text-black' : 'text-amber-500/40'}`} />

                        Ability Tree

                    </button>

                    <button
                        onClick={() => setActiveTab('aspects')}
                        className={`flex items-center gap-3 px-8 py-3 text-xs font-black uppercase tracking-[0.2em] transition-all cursor-pointer
                                    ${activeTab === 'aspects'
                                ? 'bg-violet-400 text-black border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1 -translate-x-1'
                                : 'bg-white text-black/50 border-2 border-black/5 hover:border-black hover:text-black'}`}
                    >

                        <Shield className={`w-4 h-4 ${activeTab === 'aspects' ? 'text-black' : 'text-violet-500/40'}`} />

                        Aspects

                    </button>

                </div>

            </div>

            {
                activeTab === 'archetypes' && (
                    <ArchetypesModuleView archetypes={treeData.archetypes} classArchetypes={classData.archetypes} />
                )
            }

            {
                activeTab === 'tree' && (
                    <TreeModuleView
                        treeData={treeData}
                        mapData={mapData}
                        currentPage={currentPage}
                        setCurrentPage={setCurrentPage}
                        pageNumbers={pageNumbers}
                        hoveredAbilityId={hoveredAbilityId}
                        setHoveredAbilityId={setHoveredAbilityId}
                        selectedAbilityIds={selectedAbilityIds}
                        setSelectedAbilityIds={setSelectedAbilityIds}
                    />
                )
            }

            {
                activeTab === 'aspects' && (
                    <AspectsModuleView aspects={aspectsData} />
                )
            }

        </div>

    );

}

function AspectsModuleView({ aspects }: { aspects: Record<string, AspectData> }) {

    const aspectEntries = Object.entries(aspects || {});

    return (

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8 items-start">

            {['mythic', 'legendary', 'fabled'].map(rarity => {

                const filtered = aspectEntries.filter(([, a]) => a.rarity === rarity);
                if (filtered.length === 0) return null;
                const colors = RARITY_COLORS[rarity] || RARITY_COLORS.fabled;

                return (

                    <div key={rarity}>


                        <h4 className={`text-2xl font-jersey uppercase tracking-[0.2em] flex items-center text-center justify-center gap-3 mb-6 ${colors.text}`}>

                            <Sparkles className="size-6" />

                            {rarity}

                            <span className='ml-1'>
                                ({filtered.length})
                            </span>

                        </h4>


                        <div className="flex flex-col gap-8">

                            {filtered.map(([key, aspect]) => {

                                const tierEntries = Object.entries(aspect.tiers || {}).sort(([a], [b]) => Number(a) - Number(b));

                                return (

                                    <div key={key} className="group">

                                        <div className="relative bg-white border-4 border-black flex flex-col h-full overflow-hidden lg:shadow-retro-lg lg:hover:shadow-none transition-all hover:translate-x-1 hover:translate-y-1">

                                            <div className={`h-2.5 w-full border-b-4    -black ${colors.bg}`} />

                                            <div className="p-4 sm:p-6 2xl:p-8">

                                                <div className="mb-8">

                                                    <h3 className="text-4xl font-jersey text-black uppercase tracking-wider mb-2 leading-none group-hover:underline">
                                                        {aspect.name}
                                                    </h3>

                                                    <div className="flex items-center gap-3">

                                                        <span className={`text-xs px-2.5 py-1 ${colors.badge} uppercase tracking-widest font-bold border-2`}>
                                                            {rarity}
                                                        </span>

                                                        <div className="h-0.5 flex-1 bg-black/5" />

                                                    </div>

                                                </div>

                                                <div className="space-y-6">

                                                    {tierEntries.map(([tier, tierData]) => (

                                                        <div key={tier}>

                                                            <div className="flex items-center justify-between gap-1 mb-3 border-b-2 border-dashed border-black/20 pb-2">

                                                                <div className={`size-10 border-2 border-black/50 flex items-center justify-center text-sm font-bold bg-white z-10 shrink-0 ${colors.text}`}>
                                                                    {tier}
                                                                </div>

                                                                <div className="flex gap-2 items-center justify-end">

                                                                    <span className="text-xs font-bold text-black/50 uppercase">
                                                                        Threshold:
                                                                    </span>

                                                                    <span className={`text-lg font-jersey ${colors.text}`}>
                                                                        {tierData.threshold}
                                                                    </span>

                                                                </div>


                                                            </div>

                                                            <div className="bg-black/5 p-4 border-r-4 border-black/10">

                                                                {tierData.description.map((line: string, i: number) => {

                                                                    const cleaned = stripHtml(line);

                                                                    if (!cleaned) return null;

                                                                    return (
                                                                        <p key={i} className="text-xs text-black/50 leading-relaxed font-bold italic mb-1.5 last:mb-0">
                                                                            {cleaned}
                                                                        </p>
                                                                    );

                                                                })}

                                                            </div>

                                                        </div>

                                                    ))}

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                );

                            })}

                        </div>

                    </div>

                );

            })}

        </div>

    );

}

function StatBarLine({ value, max, label }: { value: number; max: number; label: string }) {

    return (

        <div className="flex items-center gap-4">

            <span className="text-xs font-bold uppercase tracking-widest text-black/50 w-16 shrink-0">
                {label}
            </span>

            <div className="flex-1 flex gap-1.5">

                {[...Array(max)].map((_, i) => (

                    <div
                        key={i}
                        className={`h-2 flex-1 border border-black/20 ${i < value ? 'bg-amber-400 shadow-[inset_0px_1px_1px_rgba(255,255,255,0.4)]' : 'bg-black/5'}`}
                    />
                ))}

            </div>

        </div>

    );

}

function ArchetypesModuleView({ archetypes, classArchetypes }: { archetypes: Record<string, any>; classArchetypes: Record<string, any> }) {

    const archEntries = Object.entries(archetypes || {});

    return (

        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">

            {archEntries.map(([key, arch]) => {

                const cleanName = stripHtml(arch.name);
                const cleanDesc = stripHtml(arch.description);
                const archStyle = getArchetypeStyle(cleanName);

                const classArchKey = Object.keys(classArchetypes || {}).find(k => {
                    const cleanClassApiName = stripColorCodes(classArchetypes[k].name).toLowerCase().trim();
                    const cleanTreeApiName = stripHtml(arch.name).toLowerCase().trim();
                    return k.toLowerCase() === cleanTreeApiName || cleanClassApiName === cleanTreeApiName;
                });

                const detailedStats = classArchKey ? classArchetypes[classArchKey] : null;

                return (

                    <div key={key} className="group relative bg-white border-4 border-black p-6 2xl:p-8 flex flex-col transition-all hover:shadow-retro-lg hover:-translate-x-1 hover:-translate-y-1">

                        <div className={`absolute top-0 left-0 w-full h-2 ${archStyle.bg} border-b-4 border-black`} />

                        <div className="flex items-center gap-6 mb-8 mt-4 relative z-10">

                            <div className="size-18 border-4 border-black bg-white flex items-center justify-center shrink-0 shadow-retro-sm transition-transform group-hover:rotate-3">

                                <img
                                    src={`https://cdn.wynncraft.com/nextgen/abilities/2.1/archetype/${arch.icon?.name || arch.icon?.value?.name || ''}_active.png`}
                                    alt={cleanName}
                                    className="size-12 object-contain"
                                />

                            </div>

                            <div className="flex-1">

                                <h3 className={`text-2xl font-jersey uppercase tracking-wider leading-none mb-1 ${archStyle.text}`}>
                                    {cleanName}
                                </h3>

                                <p className="text-xs font-bold uppercase tracking-widest text-black/50">
                                    {stripHtml(arch.shortDescription)}
                                </p>

                            </div>

                        </div>

                        {detailedStats && (

                            <div className="z-10 mb-8 p-6 border-2 border-black relative overflow-hidden">

                                <div className={`absolute top-0 left-0 w-1 h-full ${archStyle.bg}`} />

                                <div className="flex justify-between items-center mb-5 pb-3 border-b border-black/10">

                                    <div className={`w-2 h-2 rounded-full ${archStyle.bg}`} />

                                    <div className="flex items-center gap-1">

                                        {[...Array(detailedStats.difficulty || 0)].map((_, i) => (
                                            <Star key={`d-filled-${i}`} className="w-3 h-3 fill-amber-400 text-amber-400" />
                                        ))}

                                        {[...Array(Math.max(0, (detailedStats.max || 3) - (detailedStats.difficulty || 0)))].map((_, i) => (
                                            <Star key={`d-empty-${i}`} className="w-3 h-3 text-black/10" />
                                        ))}

                                    </div>

                                </div>

                                <div className="space-y-3.5">
                                    <StatBarLine value={detailedStats.damage} max={3} label="Damage" />
                                    <StatBarLine value={detailedStats.defence} max={3} label="Defence" />
                                    <StatBarLine value={detailedStats.range} max={3} label="Range" />
                                    <StatBarLine value={detailedStats.speed} max={3} label="Speed" />
                                </div>

                            </div>

                        )}

                        {cleanDesc.split('\n').filter(Boolean).map((desc, i) => (

                            <p key={i} className="text-xs leading-relaxed font-semibold text-black/50 italic">
                                {desc}
                            </p>

                        ))}

                    </div>

                );

            })}

        </div>
    );
}

function TreeModuleView({
    treeData,
    mapData,
    currentPage,
    setCurrentPage,
    pageNumbers,
    hoveredAbilityId,
    setHoveredAbilityId,
    selectedAbilityIds,
    setSelectedAbilityIds
}: {
    treeData: TreeData;
    mapData: Record<string, any>;
    currentPage: number;
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
    pageNumbers: number[];
    hoveredAbilityId: string | null;
    setHoveredAbilityId: React.Dispatch<React.SetStateAction<string | null>>;
    selectedAbilityIds: string[];
    setSelectedAbilityIds: React.Dispatch<React.SetStateAction<string[]>>;
}) {
    const CELL = 56;

    const handleNavigatePath = (targetIdOrName: string) => {
        if (!treeData || !treeData.pages) return;
        const searchStr = targetIdOrName.toLowerCase().trim();
        for (const [p, pageData] of Object.entries(treeData.pages)) {
            for (const [id, logic] of Object.entries(pageData)) {
                if (id.toLowerCase() === searchStr || (logic.name && stripHtml(logic.name).toLowerCase().trim() === searchStr)) {
                    setCurrentPage(Number(p));
                    setSelectedAbilityIds(prev => prev.includes(id) ? prev : [...prev, id]);
                    return;
                }
            }
        }
    };

    const getAbilityNameById = (id: string): string => {
        if (!treeData || !treeData.pages) return id;
        for (const pageData of Object.values(treeData.pages)) {
            if (pageData[id] && pageData[id].name) {
                return stripHtml(pageData[id].name);
            }
        }
        return id;
    };

    const handleNodeClick = (logicId: string) => {
        setSelectedAbilityIds(prev => prev.includes(logicId) ? prev.filter(id => id !== logicId) : [...prev, logicId]);
    };

    const { gridNodes, cols, rows, minX, minY } = useMemo(() => {
        if (!mapData || !treeData) return { gridNodes: [], cols: 0, rows: 0, minX: 0, minY: 0 };

        const rawMapNodes = (mapData[String(currentPage)] || []) as any[];

        let mX = Infinity, maX = -Infinity, mY = Infinity, maY = -Infinity;
        if (rawMapNodes.length > 0) {
            const xs = rawMapNodes.map(n => n.coordinates.x);
            const ys = rawMapNodes.map(n => n.coordinates.y);
            mX = Math.min(...xs);
            maX = Math.max(...xs);
            mY = Math.min(...ys);
            maY = Math.max(...ys);
        } else {
            mX = 1; maX = 9; mY = 1; maY = 6;
        }

        const nodes: any[] = [];
        const seen = new Set<string>();

        for (const mNode of rawMapNodes) {
            const key = `${mNode.type}-${mNode.coordinates.x},${mNode.coordinates.y}`;
            if (seen.has(key)) continue;
            seen.add(key);

            let unifiedNode: any = { ...mNode };

            if (mNode.type === 'ability') {
                const abilityId = mNode.meta.id || mNode.family?.[0];
                const treeLogic = treeData.pages[String(currentPage)]?.[abilityId];

                unifiedNode.logicId = abilityId;
                unifiedNode.treeLogic = treeLogic;
            }
            nodes.push(unifiedNode);
        }

        return {
            gridNodes: nodes,
            cols: maX - mX + 1,
            rows: maY - mY + 1,
            minX: mX,
            minY: mY
        };
    }, [currentPage, mapData, treeData]);

    return (

        <div className="flex flex-col gap-12 relative">

            <div className="w-full border-4 border-black relative bg-white lg:shadow-retro-lg flex items-center justify-center py-16 px-8">

                <div
                    className="relative shrink-0"
                    style={{
                        width: cols * CELL,
                        height: rows * CELL,
                    }}
                >

                    {gridNodes.filter((n: any) => n.type === 'connector').map((node: any, i: number) => {
                        const x = (node.coordinates.x - minX) * CELL;
                        const y = (node.coordinates.y - minY) * CELL;
                        const cType = typeof node.meta?.icon === 'string' ? node.meta.icon : 'connector_up_down';

                        return (
                            <div
                                key={`c-${i}`}
                                className="absolute flex items-center justify-center pointer-events-none"
                                style={{
                                    left: x + (CELL - 40) / 2,
                                    top: y + (CELL - 40) / 2,
                                    opacity: 0.15
                                }}
                            >
                                <ConnectorSvg
                                    type={cType}
                                    color="#000000"
                                />
                            </div>
                        );
                    })}

                    {gridNodes.filter((n: any) => n.type === 'ability').map((node: any, i: number) => {
                        const x = (node.coordinates.x - minX) * CELL;
                        const y = (node.coordinates.y - minY) * CELL;

                        const logicId = node.logicId;
                        const treeLogic = node.treeLogic;
                        const iconName = typeof node.meta.icon === 'object' ? node.meta.icon?.value?.name || '' : '';
                        const colors = getNodeColorTw(iconName);
                        const isSelected = selectedAbilityIds.includes(logicId);

                        return (

                            <div
                                key={`a-${i}`}
                                className="absolute flex items-center justify-center cursor-pointer group/node z-20"
                                style={{ left: x, top: y, width: CELL, height: CELL }}
                                onMouseEnter={() => setHoveredAbilityId(logicId)}
                                onMouseLeave={() => setHoveredAbilityId(null)}
                                onClick={() => handleNodeClick(logicId)}
                            >

                                <div className={`relative w-12 h-12 flex items-center justify-center transition-all transform ${isSelected ? 'animate-spin' : ''}`}>

                                    <img
                                        src={`https://cdn.wynncraft.com/nextgen/abilities/2.1/nodes/${iconName}_active.png`}
                                        className="w-10 h-10 object-contain relative z-10"
                                        alt={logicId}
                                    />

                                </div>

                                {treeLogic && (

                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 pointer-events-none opacity-0 group-hover/node:opacity-100 transition-all duration-300 z-50 w-[22rem] translate-y-2 group-hover/node:translate-y-0 text-left">

                                        <div className="bg-white border-2 border-black relative overflow-hidden p-6">

                                            <div className="flex items-start gap-4 mb-5">

                                                <div className={`w-14 h-14 border-2 border-black ${colors.bg} flex items-center justify-center shrink-0`}>

                                                    <img
                                                        src={`https://cdn.wynncraft.com/nextgen/abilities/2.1/nodes/${iconName}_active.png`}
                                                        className="w-10 h-10 object-contain"
                                                    />

                                                </div>

                                                <div className="flex-1">
                                                    <h3 className="text-2xl font-jersey uppercase tracking-wider leading-none mb-1 text-black">
                                                        {stripHtml(treeLogic.name || logicId)}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        <span className="text-[9px] px-2 py-0.5 border-2 border-black font-black uppercase tracking-widest bg-black/5">PAGE {currentPage}</span>
                                                        {treeLogic.slot && (
                                                            <span className="text-[9px] px-2 py-0.5 border-2 border-black font-black uppercase tracking-widest bg-amber-400 text-black">SLOT {treeLogic.slot}</span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">

                                                <div className="flex items-center gap-4 pt-4 border-t-2 border-black/5 border-dashed">

                                                    <div className="flex-1 flex items-center gap-2">

                                                        <div className={`size-2 rounded-full animate-pulse ${isSelected ? 'bg-emerald-500' : 'bg-black/10'}`} />

                                                        <span className="text-xs font-black uppercase tracking-widest">

                                                            {isSelected ? 'SELECTED' : 'AVAILABLE'}

                                                        </span>

                                                    </div>

                                                    <span className="text-xs font-black uppercase tracking-widest text-black/50">
                                                        CLICK TO PIN
                                                    </span>

                                                </div>

                                            </div>

                                        </div>

                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 z-60">

                                            <div className="w-4 h-4 rotate-45 border-r-2 border-b-2 border-black bg-white" />

                                        </div>

                                    </div>

                                )}

                            </div>

                        );

                    })}

                </div>

            </div>

            <div className="flex items-center justify-center gap-2">

                <button
                    onClick={() => setCurrentPage(p => Math.max(pageNumbers[0], p - 1))}
                    disabled={currentPage === pageNumbers[0]}
                    className="size-10 border-2 border-black flex items-center justify-center not-disabled:cursor-pointer bg-white not-disabled:transition-all not-disabled:hover:bg-black not-disabled:hover:text-white disabled:opacity-20 not-disabled:active:translate-y-0.5"
                >

                    <ChevronLeft className="size-5" />

                </button>

                <div className="flex items-center">

                    {pageNumbers.map(pageNum => (

                        <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`size-8 flex items-center justify-center text-sm font-bold transition-all
                                        ${pageNum === currentPage
                                    ? 'bg-black text-white'
                                    : 'hover:bg-black/10 text-black/40 cursor-pointer'
                                }`}
                        >

                            {pageNum}

                        </button>

                    ))}

                </div>

                <button
                    onClick={() => setCurrentPage(p => Math.min(pageNumbers[pageNumbers.length - 1], p + 1))}
                    disabled={currentPage === pageNumbers[pageNumbers.length - 1]}
                    className="size-10 border-2 border-black flex items-center justify-center not-disabled:cursor-pointer bg-white not-disabled:transition-all not-disabled:hover:bg-black not-disabled:hover:text-white disabled:opacity-20 not-disabled:active:translate-y-0.5"
                >

                    <ChevronRight className="size-5" />

                </button>

            </div>


            <div className="space-y-8">

                <div className="flex items-center gap-6">

                    <h2 className="text-4xl font-jersey uppercase tracking-wider text-black flex items-center gap-4">

                        Mechanics Compartment

                    </h2>

                    <div className="h-0.5 flex-1 bg-black/5" />


                    {selectedAbilityIds.length > 0 && (

                        <div className="flex flex-col gap-2 items-end ">

                            <div className="flex items-baseline gap-2">

                                <span className="text-3xl font-jersey leading-none">
                                    {selectedAbilityIds.length}
                                </span>

                                <span className="text-xs font-black uppercase tracking-widest text-black/50">
                                    Pinned Nodes
                                </span>

                            </div>

                            <button
                                onClick={() => setSelectedAbilityIds([])}
                                className="px-4 py-2 border-2 border-black text-xs font-black uppercase tracking-widest bg-white hover:bg-red-500 hover:text-white transition-all cursor-pointer"
                            >
                                Clear All
                            </button>

                        </div>

                    )}

                </div>

                {selectedAbilityIds.length > 0 ? (

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        {selectedAbilityIds.map(selectedId => {
                            let logic = null;
                            for (const pageData of Object.values(treeData.pages)) {
                                if (pageData[selectedId]) {
                                    logic = pageData[selectedId];
                                    break;
                                }
                            }
                            if (!logic) return null;

                            const nodeColors = getNodeColorTw(logic.icon?.value?.name || '');

                            return (
                                <div key={selectedId} className="group relative">

                                    <div className="relative border-4 border-black bg-white flex flex-col h-full">

                                        <div className={`h-2 w-full ${nodeColors.bg} border-b-4 border-black`} />

                                        <div className="p-8">

                                            <div className="flex items-start justify-between mb-8">

                                                <div className="flex gap-6">

                                                    <div className={`size-16 border-4 border-black ${nodeColors.bg} flex items-center justify-center shrink-0 shadow-retro-sm`}>

                                                        <img
                                                            src={`https://cdn.wynncraft.com/nextgen/abilities/2.1/nodes/${logic.icon?.value?.name || 'abilityTree.nodeWhite'}_active.png`}
                                                            className="w-10 h-10 object-contain"
                                                        />

                                                    </div>

                                                    <div>

                                                        <h3 className="text-2xl font-jersey text-black uppercase tracking-wider leading-none mb-2">
                                                            {stripHtml(logic.name)}
                                                        </h3>

                                                        <div className="flex gap-2">

                                                            <span className="text-xs font-black uppercase text-black/30 tracking-widest">
                                                                ID: {selectedId}
                                                            </span>

                                                        </div>

                                                    </div>

                                                </div>

                                                <button
                                                    onClick={() => handleNodeClick(selectedId)}
                                                    className="size-8 border-2 border-black flex items-center justify-center cursor-pointer hover:text-white transition-all group-hover:bg-red-500 group-hover:text-white group-hover:border-red-600"
                                                >

                                                    <span className="text-xl font-jersey">

                                                        <X className='size-4' />

                                                    </span>

                                                </button>

                                            </div>

                                            <div className="space-y-3 mb-8 bg-black/2 p-6 border-l-4 border-black/10">

                                                {logic.description?.map((line: string, i: number) => {

                                                    if (line === '</br>' || line === '<br>' || line === '<br/>') return <div key={i} className="h-1" />;

                                                    const cleaned = stripHtml(line);

                                                    if (!cleaned) return null;

                                                    return <p key={i} className="text-xs text-black/60 leading-relaxed font-bold tracking-tight italic">{cleaned}</p>;

                                                })}

                                            </div>

                                            {logic.requirements && Object.keys(logic.requirements).length > 0 && (

                                                <div className="border-2 border-black p-5 mb-8 relative">

                                                    <div className="absolute -top-3 left-4 bg-white px-3 text-xs font-black uppercase tracking-widest border-2 border-black">
                                                        Requirements
                                                    </div>

                                                    <div className="space-y-1.5 mt-2">

                                                        {Object.entries(logic.requirements).map(([reqKey, val]) => (

                                                            <div key={reqKey} className="flex justify-between items-center py-2 border-b border-black/5 last:border-0 text-xs">

                                                                <span className="text-black/40 uppercase tracking-widest font-black">

                                                                    {reqKey.replace(/_/g, ' ')}

                                                                </span>

                                                                {reqKey.toLowerCase() === 'node' ? (

                                                                    <button onClick={() => handleNavigatePath(String(val))} className="text-amber-500 font-black hover:underline uppercase tracking-wider">

                                                                        {getAbilityNameById(String(val))}

                                                                    </button>

                                                                ) : (

                                                                    <span className="text-amber-500 font-black uppercase tracking-wider">

                                                                        {typeof val === 'object' && val !== null ? `${(val as any).name} (x${(val as any).amount})` : String(val)}

                                                                    </span>

                                                                )}

                                                            </div>

                                                        ))}

                                                    </div>

                                                </div>

                                            )}

                                            {(logic.links?.filter(Boolean).length > 0 || logic.locks?.filter(Boolean).length > 0) && (

                                                <div className="flex flex-col gap-6">

                                                    {logic.links?.filter(Boolean).length > 0 && (

                                                        <div className="p-5 border-2 border-black bg-emerald-50 relative">

                                                            <div className="absolute -top-3 left-4 bg-white px-3 text-xs font-black uppercase tracking-widest border-2 border-black text-emerald-600">
                                                                Linked Extensions
                                                            </div>

                                                            <div className="flex flex-wrap gap-2 mt-2">

                                                                {logic.links.filter(Boolean).map((l: string) => (

                                                                    <button key={l} onClick={() => handleNavigatePath(l)} className="text-xs px-3 py-1.5 bg-white border-2 border-black hover:bg-emerald-500 hover:text-white font-black transition-all uppercase tracking-widest flex items-center gap-2">

                                                                        <div className="size-1.5 rounded-full bg-emerald-500" />

                                                                        {getAbilityNameById(l)}

                                                                    </button>

                                                                ))}

                                                            </div>
                                                        </div>
                                                    )}
                                                    {logic.locks?.filter(Boolean).length > 0 && (

                                                        <div className="p-5 border-2 border-black bg-red-50 relative">

                                                            <div className="absolute -top-3 left-4 bg-white px-3 text-xs font-black uppercase tracking-widest border-2 border-black text-red-600">
                                                                Conflict Warning
                                                            </div>

                                                            <div className="flex flex-wrap gap-2 mt-2">

                                                                {logic.locks.filter(Boolean).map((l: string) => (

                                                                    <button key={l} onClick={() => handleNavigatePath(l)} className="text-xs px-3 py-1.5 bg-white border-2 border-black hover:bg-red-500 hover:text-white font-black transition-all uppercase tracking-widest">

                                                                        {getAbilityNameById(l)}

                                                                    </button>

                                                                ))}

                                                            </div>

                                                        </div>
                                                    )}

                                                </div>

                                            )}

                                        </div>

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                ) : (

                    <div className="w-full border-4 border-dashed border-black/10 flex flex-col items-center justify-center py-24 text-center px-4">

                        <div className="size-20 border-4 border-black border-dashed rounded-full flex items-center justify-center mb-6 opacity-20">

                            <Book className="size-10 text-black" />

                        </div>

                        <h3 className="text-3xl font-jersey uppercase tracking-widest text-black/30 mb-2">
                            Awaiting Node Selection
                        </h3>

                        <p className="max-w-md text-xs font-black uppercase tracking-widest text-black/20 leading-loose">
                            Engage with the ability tree above to inspect intricate mechanics, verify stat requirements, and visualize prerequisite connections in this compartment.
                        </p>

                    </div>

                )}

            </div>

        </div>

    );

}

