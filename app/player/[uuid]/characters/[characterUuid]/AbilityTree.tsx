'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Lock, Unlock } from 'lucide-react';
import { NODE_STYLES } from '@/lib/constants';
import { getNodeStyle, getNodeIcon, stripHtml, formatAbilityId } from '@/lib/utils';
import ConnectorSvg from '@/components/ConnectorSvg';

interface AbilityTreeProps {
    abilityMap: Record<string, any[]>;
    abilityTreeData?: any;
    unlockedAbilities?: string[];
    classType: string;
    classColor: string;
}

export default function AbilityTree({ abilityMap, abilityTreeData, unlockedAbilities = [], classColor }: AbilityTreeProps) {
    const pages = Object.keys(abilityMap).sort((a, b) => Number(a) - Number(b));
    const [currentPage, setCurrentPage] = useState(0);

    if (pages.length === 0) return null;

    const pageKey = pages[currentPage];
    const nodes = abilityMap[pageKey] || [];

    const treeInfo: Record<string, { name: string; description: string }> = {};
    if (abilityTreeData?.pages) {
        for (const [, pageAbilities] of Object.entries(abilityTreeData.pages) as [string, any][]) {
            for (const [abilityId, abilityData] of Object.entries(pageAbilities) as [string, any][]) {
                const rawName = abilityData.name || abilityId;
                const cleanName = stripHtml(rawName);
                const rawDesc = Array.isArray(abilityData.description)
                    ? abilityData.description.map((d: string) => stripHtml(d)).filter((d: string) => d.length > 0).join('\n')
                    : '';
                treeInfo[abilityId.toLowerCase()] = { name: cleanName, description: rawDesc };
            }
        }
    }

    const seen = new Set<string>();
    const uniqueNodes = nodes.filter((node: any) => {
        const key = `${node.type}-${node.coordinates.x}-${node.coordinates.y}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
    });

    const xs = uniqueNodes.map((n: any) => n.coordinates.x);
    const ys = uniqueNodes.map((n: any) => n.coordinates.y);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const cols = maxX - minX + 1;
    const rows = maxY - minY + 1;

    const allAbilities: string[] = [];
    for (const page of Object.values(abilityMap)) {
        for (const node of page as any[]) {
            if (node.type === 'ability' && node.meta?.id && !allAbilities.includes(node.meta.id)) {
                allAbilities.push(node.meta.id);
            }
        }
    }
    const unlockedSet = new Set(unlockedAbilities.map(a => a.toLowerCase()));
    const totalUnlocked = allAbilities.filter(a => unlockedSet.has(a.toLowerCase())).length;

    const CELL = 48;

    return (
        <div className="space-y-6">

            <div className="flex items-center justify-end">

                <span className="text-sm font-bold" style={{ color: classColor }}>
                    {totalUnlocked} / {allAbilities.length}
                </span>

            </div>

            <div className="relative">

                <div
                    className="relative mx-auto"
                    style={{ width: cols * CELL, height: rows * CELL }}
                >

                    <div
                        className="absolute inset-0 opacity-[0.04]"
                        style={{
                            backgroundImage: `radial-gradient(circle, ${classColor} 1px, transparent 1px)`,
                            backgroundSize: `${CELL}px ${CELL}px`,
                        }}
                    />

                    {uniqueNodes
                        .filter((n: any) => n.type === 'connector')
                        .map((node: any, i: number) => {
                            const x = (node.coordinates.x - minX) * CELL;
                            const y = (node.coordinates.y - minY) * CELL;
                            const cType = node.meta?.icon || 'connector_up_down';
                            const families = node.family || [];
                            const isActive = families.some((f: string) => unlockedSet.has(f.toLowerCase()));

                            return (
                                <div
                                    key={`c-${i}`}
                                    className="absolute flex items-center justify-center"
                                    style={{
                                        left: x + (CELL - 40) / 2,
                                        top: y + (CELL - 40) / 2,
                                        opacity: isActive ? 1 : 0.2,
                                        transition: 'opacity 0.3s',
                                    }}
                                >
                                    <ConnectorSvg
                                        type={cType}
                                        color={isActive ? classColor : '#cbd5e1'}
                                        dashed={!isActive}
                                    />
                                </div>
                            );
                        })}

                    {uniqueNodes
                        .filter((n: any) => n.type === 'ability')
                        .map((node: any, i: number) => {
                            const x = (node.coordinates.x - minX) * CELL;
                            const y = (node.coordinates.y - minY) * CELL;
                            const abilityId = node.meta?.id || '';
                            const iconName = node.meta?.icon?.value?.name || '';
                            const isUnlocked = unlockedSet.has(abilityId.toLowerCase());
                            const style = getNodeStyle(iconName);
                            const isUltimate = iconName.includes('ultimate');
                            const NodeIcon = getNodeIcon(style);

                            const info = treeInfo[abilityId.toLowerCase()];
                            const displayName = info?.name || formatAbilityId(abilityId);
                            const description = info?.description || '';

                            const descLines = description.split('\n').filter((l: string) => l.trim().length > 0);
                            const shortDesc = descLines.slice(0, 3).join('\n');

                            return (
                                <div
                                    key={`ability-${i}`}
                                    className="absolute group"
                                    style={{ left: x, top: y, width: CELL, height: CELL, zIndex: 10 }}
                                >

                                    {isUnlocked && (
                                        <div
                                            className="absolute inset-1 rounded-2xl"
                                        />
                                    )}

                                    <div
                                        className={`absolute inset-1.5 rounded-xl border-2 flex items-center justify-center transition-all duration-300 cursor-pointer
                                            ${isUnlocked ? 'shadow-md hover:shadow-lg hover:scale-110' : 'opacity-35 scale-90 grayscale hover:opacity-50'}
                                            ${isUltimate ? 'inset-0.5 rounded-2xl border-[3px]' : ''}
                                        `}
                                        style={{
                                            background: isUnlocked ? (style.bg.includes('gradient') ? style.bg : style.bg) : '#f8fafc',
                                            borderColor: isUnlocked ? style.border : '#e2e8f0',
                                        }}
                                    >

                                        <NodeIcon
                                            className={`${isUltimate ? 'w-6 h-6' : 'w-4 h-4'}`}
                                            style={{ color: isUnlocked ? style.text : '#94a3b8' }}
                                        />

                                    </div>

                                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-200 z-100">

                                        <div
                                            className="rounded-2xl shadow-2xl border overflow-hidden"
                                            style={{
                                                minWidth: '220px',
                                                maxWidth: '300px',
                                                background: '#fff',
                                                borderColor: isUnlocked ? style.border : '#e2e8f0',
                                            }}
                                        >

                                            <div
                                                className="px-4 py-2.5 flex items-center justify-between gap-3"
                                                style={{
                                                    background: isUnlocked ? `${style.bg}` : '#f8fafc',
                                                    borderBottom: `1px solid ${isUnlocked ? style.border : '#e2e8f0'}`,
                                                }}
                                            >

                                                <div className="flex items-center gap-2 min-w-0">

                                                    {isUnlocked ? (
                                                        <Unlock className="w-3.5 h-3.5 shrink-0" style={{ color: style.text }} />
                                                    ) : (
                                                        <Lock className="w-3.5 h-3.5 shrink-0 text-slate-400" />
                                                    )}

                                                    <span className="font-bold text-sm truncate" style={{ color: isUnlocked ? style.text : '#64748b' }}>
                                                        {displayName}
                                                    </span>

                                                </div>

                                                <span
                                                    className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md whitespace-nowrap shrink-0"
                                                    style={{
                                                        background: isUnlocked ? `${style.border}22` : '#f1f5f9',
                                                        color: isUnlocked ? style.labelColor : '#94a3b8',
                                                    }}
                                                >
                                                    {style.label}
                                                </span>

                                            </div>

                                            {shortDesc && (
                                                <div className="px-4 py-2.5">
                                                    <p className="text-[11px] text-slate-500 leading-relaxed whitespace-pre-line line-clamp-4">
                                                        {shortDesc}
                                                    </p>
                                                </div>
                                            )}

                                        </div>

                                        <div className="absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2">

                                            <div
                                                className="w-3 h-3 rotate-45 border-r border-b"
                                                style={{
                                                    background: '#fff',
                                                    borderColor: isUnlocked ? style.border : '#e2e8f0',
                                                }}
                                            />

                                        </div>

                                    </div>

                                </div>

                            );
                        })}
                </div>

            </div>

            <div className="flex items-center justify-between">

                <button
                    onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0}
                    className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:bg-black/10"
                >
                    <ChevronLeft className="w-5 h-5 text-black/50" />
                </button>

                <div className="flex items-center gap-1.5">
                    {pages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentPage(idx)}
                            className={`w-8 h-8 rounded-lg text-xs font-black ${idx === currentPage ? 'text-white shadow-lg scale-110 cursor-default' : 'bg-black/5 text-black/50 cursor-pointer transition-all duration-300 hover:bg-black/10'
                                }`}
                            style={idx === currentPage ? { background: classColor } : {}}
                        >
                            {idx + 1}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setCurrentPage(Math.min(pages.length - 1, currentPage + 1))}
                    disabled={currentPage === pages.length - 1}
                    className="w-10 h-10 rounded-xl bg-black/5 flex items-center justify-center cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300 hover:bg-black/10"
                >
                    <ChevronRight className="w-5 h-5 text-black/50" />
                </button>

            </div>

        </div>
    );
}
