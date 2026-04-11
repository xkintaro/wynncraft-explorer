'use client';

import { useState, useEffect, useMemo, use } from 'react';

import { ChevronLeft, ChevronRight, Shield, Book, Star, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

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
                <p className="text-xs uppercase tracking-widest font-black">Loading...</p>
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
                        archetypes
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

        </div >

    );

}

function AspectsModuleView({ aspects }: { aspects: Record<string, AspectData> }) {

    const aspectEntries = Object.entries(aspects || {});

    if (aspectEntries.length === 0) {
        return <div>There are no Aspects for this class yet.</div>;
    }

    return (

        <div className="grid grid-cols-3 gap-8">

            {['mythic', 'legendary', 'fabled'].map(rarity => {

                const filtered = aspectEntries.filter(([, a]) => a.rarity === rarity);
                if (filtered.length === 0) return null;
                const colors = RARITY_COLORS[rarity] || RARITY_COLORS.fabled;

                return (

                    <div key={rarity} className="flex flex-col gap-4">

                        <h4 className={`text-xs font-black uppercase tracking-[0.3em] flex items-center gap-3 ${colors.text} mb-2`}>

                            <div className={`w-2 h-2 rounded-full ${colors.bg} border border-current`} />

                            {rarity}

                            <span className={`${colors.text} ml-auto`}>
                                ({filtered.length})
                            </span>

                        </h4>

                        {filtered.map(([key, aspect]) => {

                            const tierEntries = Object.entries(aspect.tiers || {}).sort(([a], [b]) => Number(a) - Number(b));

                            return (

                                <div key={key} className={`border-2 ${colors.border} ${colors.bg} p-6 h-fit flex flex-col`}>

                                    <div className="mb-5 pb-4 border-b border-black">

                                        <h3 className="text-2xl font-jersey text-black uppercase tracking-wider mb-2 leading-none">
                                            {aspect.name}
                                        </h3>

                                        <span className={`text-[8px] px-2 py-0.5 ${colors.badge} uppercase tracking-[0.2em] font-black block w-fit`}>
                                            {rarity}
                                        </span>

                                    </div>

                                    <div className="space-y-4 flex-1">

                                        {tierEntries.map(([tier, tierData]) => (

                                            <div key={tier} className="border border-black p-3 flex gap-3">

                                                <div className="shrink-0 text-center w-10">

                                                    <span className="text-xs text-black/50 uppercase tracking-widest text-nowrap mb-0.5">
                                                        Tier {tier}
                                                    </span>

                                                    <div className={`text-sm font-black ${colors.text}`}>
                                                        {tierData.threshold}
                                                    </div>

                                                </div>

                                                <div className="border-l border-black pl-3">

                                                    {tierData.description.map((line: string, i: number) => {

                                                        const cleaned = stripHtml(line);

                                                        if (!cleaned) return null;

                                                        return (
                                                            <p key={i} className="text-xs text-black/50 leading-relaxed font-medium">
                                                                {cleaned}
                                                            </p>
                                                        );

                                                    })}

                                                </div>

                                            </div>

                                        ))}

                                    </div>

                                </div>

                            );

                        })}

                    </div>

                );

            })}

        </div>

    );

}

function StatBarLine({ value, max, label }: { value: number; max: number; label: string }) {
    return (
        <div className="flex items-center gap-4">
            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40 w-16 shrink-0">
                {label}
            </span>
            <div className="flex-1 flex gap-1.5">
                {[...Array(max)].map((_, i) => (
                    <div
                        key={i}
                        className={`h-2 flex-1 border border-black/20 relative overflow-hidden transition-all duration-500
                            ${i < value ? 'bg-amber-400 shadow-[inset_0px_1px_1px_rgba(255,255,255,0.4)]' : 'bg-black/5'}`}
                    >
                        {i < value && (
                            <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
                        )}
                    </div>
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

                                    <div className={`w-2 h-2 rounded-full ${archStyle.bg} animate-pulse`} />

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
        <div className="flex flex-col gap-8 relative">

            <div className="w-full border-2 border-black p-8 relative flex items-center justify-center">

                <div
                    className="relative shrink-0 pointer-events-auto"
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
                                    opacity: 0.2
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
                                className="absolute flex items-center justify-center cursor-pointer transition-all duration-200 group z-20"
                                style={{ left: x, top: y, width: CELL, height: CELL }}
                                onMouseEnter={() => setHoveredAbilityId(logicId)}
                                onMouseLeave={() => setHoveredAbilityId(null)}
                                onClick={() => handleNodeClick(logicId)}
                            >

                                <div className={`w-full h-full flex items-center justify-center ${isSelected ? `border-2` : ''}`}>

                                    <img
                                        src={`https://cdn.wynncraft.com/nextgen/abilities/2.1/nodes/${iconName}_active.png`}
                                        className="w-10 h-10 object-contain"
                                    />

                                </div>

                                {treeLogic && (

                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-50 w-72 bg-white">

                                        <div className="border border-black shadow-2xl relative overflow-hidden p-5">

                                            <div className={`absolute top-0 left-0 w-full h-1 ${colors.bg} border-b-2 ${colors.border}`} />


                                            <div className="flex items-start gap-3 mb-3 relative z-10">

                                                <div className={`w-10 h-10 border-2 ${colors.border} ${colors.bg} flex items-center justify-center shrink-0 shadow-lg`}>

                                                    <img
                                                        src={`https://cdn.wynncraft.com/nextgen/abilities/2.1/nodes/${iconName}_active.png`}
                                                        className="w-6 h-6 object-contain"
                                                    />

                                                </div>

                                                <div className="flex-1">

                                                    <h3 className="text-lg font-jersey uppercase tracking-wider leading-tight mb-1">
                                                        {stripHtml(treeLogic.name || logicId)}
                                                    </h3>

                                                    <div className="flex gap-2 text-[8px] uppercase tracking-widest mt-1">
                                                        <span className="px-1.5 py-0.5 border border-black">Page {currentPage}</span>
                                                        {treeLogic.slot && (
                                                            <span className="px-1.5 py-0.5 border border-black">Slot {treeLogic.slot}</span>
                                                        )}
                                                    </div>

                                                </div>

                                            </div>

                                            {treeLogic.description && (
                                                <div className="space-y-1 mb-3 border-l-2 border-black pl-3">
                                                    {treeLogic.description.map((line: string, idx: number) => {
                                                        if (line === '</br>' || line === '<br>' || line === '<br/>') return <div key={idx} className="h-1" />;
                                                        const cleaned = stripHtml(line);
                                                        if (!cleaned) return null;
                                                        return <p key={idx} className="text-[10px] text-black leading-relaxed font-medium">{cleaned}</p>;
                                                    })}
                                                </div>
                                            )}

                                            {treeLogic.requirements && Object.keys(treeLogic.requirements).length > 0 && (

                                                <div className="border border-black p-2 mb-3">
                                                    <span className="text-[8px] text-amber-500/80 font-black uppercase tracking-widest block mb-1">Requirements</span>
                                                    <div className="space-y-1">
                                                        {Object.entries(treeLogic.requirements).map(([reqKey, val]) => (
                                                            <div key={reqKey} className="flex justify-between items-center px-2 py-1 text-[9px]">
                                                                <span className="text-black/40 uppercase tracking-widest">{reqKey.replace(/_/g, ' ')}</span>
                                                                {reqKey.toLowerCase() === 'node' ? (
                                                                    <button onClick={(e) => { e.stopPropagation(); handleNavigatePath(String(val)); }} className="text-amber-500 font-black ml-2 text-right hover:text-amber-600 hover:underline cursor-pointer uppercase">
                                                                        {getAbilityNameById(String(val))}
                                                                    </button>
                                                                ) : (
                                                                    <span className="text-amber-400 font-bold ml-2 text-right">
                                                                        {typeof val === 'object' && val !== null
                                                                            ? `${(val as any).name} (x${(val as any).amount})`
                                                                            : String(val)}
                                                                    </span>
                                                                )}
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                            )}

                                            {(treeLogic.links?.filter(Boolean).length > 0 || treeLogic.locks?.filter(Boolean).length > 0) && (

                                                <div className="flex flex-col gap-1 pt-2 border-t border-Requirements
">
                                                    {treeLogic.links?.filter(Boolean).length > 0 && (
                                                        <div>
                                                            <span className="text-[7px] text-green-400 uppercase tracking-widest mb-1 block font-black">Links</span>
                                                            <div className="flex flex-wrap gap-1">
                                                                {treeLogic.links.filter(Boolean).map((l: string) => (
                                                                    <span key={l} className="text-[8px] px-1.5 py-0.5 bg-green-500/10 border border-green-500/20 text-green-400 font-medium">
                                                                        {getAbilityNameById(l)}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}

                                                    {treeLogic.locks?.filter(Boolean).length > 0 && (
                                                        <div>
                                                            <span className="text-[7px] text-red-500 uppercase tracking-widest mb-1 block mt-1.5 font-black">Conflicts</span>
                                                            <div className="flex flex-wrap gap-1">
                                                                {treeLogic.locks.filter(Boolean).map((l: string) => (
                                                                    <span key={l} className="text-[8px] px-1.5 py-0.5 bg-red-500/10 border border-red-500/20 text-red-400 font-medium line-through">
                                                                        {getAbilityNameById(l)}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                            )}

                                        </div>

                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 z-30">

                                            <div className="w-3 h-3 rotate-45 border-r border-b border-black bg-white" />

                                        </div>

                                    </div>

                                )}

                            </div>

                        );

                    })}

                </div>

            </div>

            <div className="flex items-center justify-center w-full gap-2 z-20">

                <button
                    onClick={() => setCurrentPage(p => Math.max(pageNumbers[0], p - 1))}
                    disabled={currentPage === pageNumbers[0]}
                    className="w-8 h-8 border border-black flex items-center justify-center not-disabled:hover:bg-black/10 disabled:opacity-20 transition-all not-disabled:cursor-pointer bg-white"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>

                <div className="flex items-center gap-1.5 px-2">
                    {pageNumbers.map(pageNum => (
                        <button
                            key={pageNum}
                            onClick={() => setCurrentPage(pageNum)}
                            className={`w-8 h-8 flex items-center justify-center text-xs font-black transition-all ${pageNum === currentPage
                                ? 'bg-amber-400 text-black border border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5 pointer-events-none'
                                : 'bg-black/5 text-black/50 border border-transparent hover:bg-black/10 cursor-pointer'
                                }`}
                        >
                            {pageNum}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setCurrentPage(p => Math.min(pageNumbers[pageNumbers.length - 1], p + 1))}
                    disabled={currentPage === pageNumbers[pageNumbers.length - 1]}
                    className="w-8 h-8 border border-black flex items-center justify-center not-disabled:hover:bg-black/10 disabled:opacity-20 transition-all not-disabled:cursor-pointer bg-white"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>

            </div>

            {selectedAbilityIds.length > 0 ? (
                <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {selectedAbilityIds.map(selectedId => {
                        let logic = null;
                        for (const pageData of Object.values(treeData.pages)) {
                            if (pageData[selectedId]) {
                                logic = pageData[selectedId];
                                break;
                            }
                        }
                        if (!logic) return null;

                        return (
                            <div key={selectedId} className="border-2 border-black shadow-2xl relative overflow-hidden bg-white h-fit">
                                <div className={`absolute top-0 left-0 w-full h-1 ${getNodeColorTw(logic.icon?.value?.name || '').bg} border-b-2 ${getNodeColorTw(logic.icon?.value?.name || '').border}`} />
                                <div className="p-6 relative z-10">
                                    <div className="flex items-start justify-between mb-5">
                                        <div className="flex gap-4">
                                            <div className={`w-12 h-12 border-2 ${getNodeColorTw(logic.icon?.value?.name || '').border} ${getNodeColorTw(logic.icon?.value?.name || '').bg} flex items-center justify-center shrink-0 shadow-lg`}>
                                                <img
                                                    src={`https://cdn.wynncraft.com/nextgen/abilities/2.1/nodes/${logic.icon?.value?.name || 'abilityTree.nodeWhite'}_active.png`}
                                                    alt=""
                                                    className="w-8 h-8 object-contain"
                                                    onError={(e) => { (e.target as HTMLImageElement).src = 'https://cdn.wynncraft.com/nextgen/abilities/2.1/nodes/abilityTree.nodeWhite_active.png'; }}
                                                />
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-jersey text-black uppercase tracking-wider leading-tight mb-1">
                                                    {stripHtml(logic.name)}
                                                </h3>
                                                <div className="flex gap-2 text-[8px] uppercase tracking-widest mt-1">
                                                    {logic.slot && (
                                                        <span className="bg-black/10 text-black/60 px-1.5 py-0.5 border border-black/5">Slot {logic.slot}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <button onClick={() => handleNodeClick(selectedId)} className="w-6 h-6 border border-black flex items-center justify-center hover:bg-black/10 transition-colors shrink-0">
                                            <span className="text-xs font-black">&times;</span>
                                        </button>
                                    </div>
                                    <div className="space-y-1 mb-5 border-l-2 border-black/10 pl-3">
                                        {logic.description?.map((line: string, i: number) => {
                                            if (line === '</br>' || line === '<br>' || line === '<br/>') return <div key={i} className="h-2" />;
                                            const cleaned = stripHtml(line);
                                            if (!cleaned) return null;
                                            return <p key={i} className="text-xs text-black/50 leading-relaxed font-medium">{cleaned}</p>;
                                        })}
                                    </div>
                                    {logic.requirements && Object.keys(logic.requirements).length > 0 && (
                                        <div className="border border-black p-3 mb-4">
                                            <span className="text-[9px] text-amber-500/80 font-black uppercase tracking-widest block mb-2">Requirements</span>
                                            <div className="space-y-1">
                                                {Object.entries(logic.requirements).map(([reqKey, val]) => (
                                                    <div key={reqKey} className="flex justify-between items-center bg-black/5 px-2 py-1 text-[10px]">
                                                        <span className="text-black/40 uppercase tracking-widest font-bold">{reqKey.replace(/_/g, ' ')}</span>
                                                        {reqKey.toLowerCase() === 'node' ? (
                                                            <button onClick={() => handleNavigatePath(String(val))} className="text-amber-500 font-black ml-4 text-right hover:text-amber-600 hover:underline cursor-pointer uppercase">
                                                                {getAbilityNameById(String(val))}
                                                            </button>
                                                        ) : (
                                                            <span className="text-amber-500 font-bold ml-4 text-right">
                                                                {typeof val === 'object' && val !== null ? `${(val as any).name} (x${(val as any).amount})` : String(val)}
                                                            </span>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    {(logic.links?.filter(Boolean).length > 0 || logic.locks?.filter(Boolean).length > 0) && (
                                        <div className="flex flex-col gap-2">
                                            {logic.links?.filter(Boolean).length > 0 && (
                                                <div>
                                                    <span className="text-[8px] text-green-500 uppercase tracking-widest mb-1 block font-black">Links</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {logic.links.filter(Boolean).map((l: string) => (
                                                            <button key={l} onClick={() => handleNavigatePath(l)} className="text-[9px] px-2 py-0.5 bg-green-500/10 border border-green-500/20 text-green-600 font-black hover:bg-green-500/20 transition-colors uppercase tracking-wider text-left cursor-pointer">
                                                                {getAbilityNameById(l)}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                            {logic.locks?.filter(Boolean).length > 0 && (
                                                <div>
                                                    <span className="text-[8px] text-red-500 uppercase tracking-widest mb-1 block mt-2 font-black">Conflicts</span>
                                                    <div className="flex flex-wrap gap-1">
                                                        {logic.locks.filter(Boolean).map((l: string) => (
                                                            <button key={l} onClick={() => handleNavigatePath(l)} className="text-[9px] px-2 py-0.5 bg-red-500/10 border border-red-500/20 text-red-600 font-black hover:bg-red-500/20 transition-colors uppercase tracking-wider line-through decoration-red-600/50 text-left cursor-pointer">
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
                        );
                    })}
                </div>
            ) : (
                <div className="w-full border-2 border-dashed border-black flex flex-col items-center justify-center p-12 text-center">

                    <Book className="w-12 h-12 mb-4 opacity-50 text-black" />

                    <p className="text-sm uppercase tracking-widest font-black text-black">
                        Select abilities
                    </p>

                    <p className="text-xs mt-2 text-black/50 font-medium leading-relaxed">
                        Click on nodes to compare mechanics, requirements, and connections side by side.
                    </p>

                </div>
            )}


        </div>

    );

}
