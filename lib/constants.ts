import {
    Sword,
    Wand2,
    Crosshair,
    Zap,
    Sparkles,
    Shield,
    Target,
    type LucideIcon,
} from 'lucide-react';

export interface ClassConfigItem {
    icon: LucideIcon;
    gradient: string;
    color: string;
    textColor: string;
    bgAccent: string;
    borderAccent: string;

    cardBorder: string;
    cardText: string;
    cardHover: string;
}

export const CLASS_CONFIG: Record<string, ClassConfigItem> = {
    WARRIOR: {
        icon: Sword,
        gradient: 'from-red-500 to-rose-600',
        color: '#ef4444',
        textColor: 'text-red-500',
        bgAccent: 'bg-red-50',
        borderAccent: 'border-red-100',
        cardBorder: 'border-amber-500/30',
        cardText: 'text-amber-400',
        cardHover: 'hover:border-amber-500/60',
    },
    ARCHER: {
        icon: Crosshair,
        gradient: 'from-green-500 to-emerald-600',
        color: '#22c55e',
        textColor: 'text-green-500',
        bgAccent: 'bg-green-50',
        borderAccent: 'border-green-100',
        cardBorder: 'border-emerald-500/30',
        cardText: 'text-emerald-400',
        cardHover: 'hover:border-emerald-500/60',
    },
    MAGE: {
        icon: Wand2,
        gradient: 'from-blue-500 to-indigo-600',
        color: '#3b82f6',
        textColor: 'text-blue-500',
        bgAccent: 'bg-blue-50',
        borderAccent: 'border-blue-100',
        cardBorder: 'border-violet-500/30',
        cardText: 'text-violet-400',
        cardHover: 'hover:border-violet-500/60',
    },
    ASSASSIN: {
        icon: Zap,
        gradient: 'from-purple-500 to-violet-600',
        color: '#a855f7',
        textColor: 'text-purple-500',
        bgAccent: 'bg-purple-50',
        borderAccent: 'border-purple-100',
        cardBorder: 'border-rose-500/30',
        cardText: 'text-rose-400',
        cardHover: 'hover:border-rose-500/60',
    },
    SHAMAN: {
        icon: Sparkles,
        gradient: 'from-amber-500 to-orange-600',
        color: '#f59e0b',
        textColor: 'text-amber-500',
        bgAccent: 'bg-amber-50',
        borderAccent: 'border-amber-100',
        cardBorder: 'border-cyan-500/30',
        cardText: 'text-cyan-400',
        cardHover: 'hover:border-cyan-500/60',
    },
};

export interface RankConfigItem {
    bg: string;
    label: string;
}

export const RANK_CONFIG: Record<string, RankConfigItem> = {
    OWNER: { bg: 'bg-amber-400', label: 'Leader' },
    CHIEF: { bg: 'bg-red-500', label: 'Chief' },
    STRATEGIST: { bg: 'bg-purple-500', label: 'Strategist' },
    CAPTAIN: { bg: 'bg-blue-500', label: 'Captain' },
    RECRUITER: { bg: 'bg-green-500', label: 'Recruiter' },
    RECRUIT: { bg: 'bg-slate-500', label: 'Recruit' },
};

export interface RarityColorItem {
    border: string;
    bg: string;
    text: string;
    badge: string;
}

export const RARITY_COLORS: Record<string, RarityColorItem> = {
    fabled: {
        border: 'border-red-500/40',
        bg: 'bg-red-500/5',
        text: 'text-red-400',
        badge: 'bg-red-500/10 text-red-400 border border-red-500/10',
    },
    legendary: {
        border: 'border-cyan-500/40',
        bg: 'bg-cyan-500/5',
        text: 'text-cyan-400',
        badge: 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/10',
    },
    mythic: {
        border: 'border-purple-500/40',
        bg: 'bg-purple-500/5',
        text: 'text-purple-400',
        badge: 'bg-purple-500/10 text-purple-400 border border-purple-500/10',
    },
};

export interface SkillConfigItem {
    label: string;
    icon: LucideIcon;
    color: string;
}

export const SKILL_CONFIG: Record<string, SkillConfigItem> = {
    strength: { label: 'Strength', icon: Sword, color: '#ef4444' },
    dexterity: { label: 'Dexterity', icon: Zap, color: '#22c55e' },
    intelligence: { label: 'Intelligence', icon: Wand2, color: '#3b82f6' },
    defense: { label: 'Defense', icon: Shield, color: '#f59e0b' },
    agility: { label: 'Agility', icon: Target, color: '#a855f7' },
};

export interface NodeStyleItem {
    bg: string;
    border: string;
    text: string;
    glow: string;
    label: string;
    labelColor: string;
    twBorder: string;
    twBg: string;
    twText: string;
    twGlow: string;
}

export const NODE_STYLES: Record<string, NodeStyleItem> = {
    nodeWhite: {
        bg: '#f1f5f9',
        border: '#cbd5e1',
        text: '#475569',
        glow: 'rgba(148,163,184,0.3)',
        label: 'Minor Upgrade',
        labelColor: '#94a3b8',
        twBorder: 'border-black/40',
        twBg: 'bg-black/10',
        twText: 'text-black/80',
        twGlow: 'shadow-black/20',
    },
    nodeYellow: {
        bg: '#fef9c3',
        border: '#facc15',
        text: '#854d0e',
        glow: 'rgba(250,204,21,0.4)',
        label: 'Passive Ability',
        labelColor: '#ca8a04',
        twBorder: 'border-yellow-500',
        twBg: 'bg-yellow-500/20',
        twText: 'text-yellow-400',
        twGlow: 'shadow-yellow-500/30',
    },
    nodePurple: {
        bg: '#f3e8ff',
        border: '#a855f7',
        text: '#6b21a8',
        glow: 'rgba(168,85,247,0.4)',
        label: 'Spell Modifier',
        labelColor: '#9333ea',
        twBorder: 'border-pink-500',
        twBg: 'bg-pink-500/20',
        twText: 'text-pink-400',
        twGlow: 'shadow-pink-500/30',
    },
    nodeBlue: {
        bg: '#dbeafe',
        border: '#3b82f6',
        text: '#1e40af',
        glow: 'rgba(59,130,246,0.4)',
        label: 'Major Ability',
        labelColor: '#2563eb',
        twBorder: 'border-cyan-500',
        twBg: 'bg-cyan-500/20',
        twText: 'text-cyan-400',
        twGlow: 'shadow-cyan-500/30',
    },
    nodeRed: {
        bg: '#fee2e2',
        border: '#ef4444',
        text: '#991b1b',
        glow: 'rgba(239,68,68,0.4)',
        label: 'Keystone',
        labelColor: '#dc2626',
        twBorder: 'border-red-500',
        twBg: 'bg-red-500/20',
        twText: 'text-red-400',
        twGlow: 'shadow-red-500/30',
    },
    nodeArcher: {
        bg: '#dcfce7',
        border: '#22c55e',
        text: '#166534',
        glow: 'rgba(34,197,94,0.5)',
        label: 'Core Spell',
        labelColor: '#16a34a',
        twBorder: 'border-green-500',
        twBg: 'bg-green-500/20',
        twText: 'text-green-400',
        twGlow: 'shadow-green-500/30',
    },
    nodeMage: {
        bg: '#dbeafe',
        border: '#3b82f6',
        text: '#1e40af',
        glow: 'rgba(59,130,246,0.5)',
        label: 'Core Spell',
        labelColor: '#2563eb',
        twBorder: 'border-green-500',
        twBg: 'bg-green-500/20',
        twText: 'text-green-400',
        twGlow: 'shadow-green-500/30',
    },
    nodeWarrior: {
        bg: '#fee2e2',
        border: '#ef4444',
        text: '#991b1b',
        glow: 'rgba(239,68,68,0.5)',
        label: 'Core Spell',
        labelColor: '#dc2626',
        twBorder: 'border-green-500',
        twBg: 'bg-green-500/20',
        twText: 'text-green-400',
        twGlow: 'shadow-green-500/30',
    },
    nodeAssassin: {
        bg: '#f3e8ff',
        border: '#a855f7',
        text: '#6b21a8',
        glow: 'rgba(168,85,247,0.5)',
        label: 'Core Spell',
        labelColor: '#9333ea',
        twBorder: 'border-green-500',
        twBg: 'bg-green-500/20',
        twText: 'text-green-400',
        twGlow: 'shadow-green-500/30',
    },
    nodeShaman: {
        bg: '#fef3c7',
        border: '#f59e0b',
        text: '#92400e',
        glow: 'rgba(245,158,11,0.5)',
        label: 'Core Spell',
        labelColor: '#d97706',
        twBorder: 'border-green-500',
        twBg: 'bg-green-500/20',
        twText: 'text-green-400',
        twGlow: 'shadow-green-500/30',
    },
    ultimate: {
        bg: 'linear-gradient(135deg, #fef08a, #fbbf24)',
        border: '#f59e0b',
        text: '#78350f',
        glow: 'rgba(251,191,36,0.6)',
        label: 'Ultimate',
        labelColor: '#b45309',
        twBorder: 'border-amber-400',
        twBg: 'bg-amber-500/30',
        twText: 'text-amber-300',
        twGlow: 'shadow-amber-500/50',
    },
};

const S = 40;
const M = S / 2;

export const CONNECTOR_PATHS: Record<string, string> = {
    connector_up_down: `M${M},0 L${M},${S}`,
    connector_right_left: `M0,${M} L${S},${M}`,
    connector_right_down: `M${S},${M} L${M},${M} L${M},${S}`,
    connector_down_left: `M${M},${S} L${M},${M} L0,${M}`,
    connector_up_right_down: `M${M},0 L${M},${S} M${M},${M} L${S},${M}`,
    connector_up_down_left: `M${M},0 L${M},${S} M${M},${M} L0,${M}`,
    connector_right_down_left: `M0,${M} L${S},${M} M${M},${M} L${M},${S}`,
    connector_up_right_down_left: `M${M},0 L${M},${S} M0,${M} L${S},${M}`,
    connector_up_left: `M${M},0 L${M},${M} L0,${M}`,
    connector_up_right: `M${M},0 L${M},${M} L${S},${M}`,
};

export const CONNECTOR_SIZE = S;
