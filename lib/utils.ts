import { CLASS_CONFIG, NODE_STYLES, ARCHETYPE_STYLES, type ClassConfigItem, type NodeStyleItem } from './constants';
import { Swords, Flame, Sparkles, Shield, Star, Zap, type LucideIcon } from 'lucide-react';

/**
 * HTML etiketlerini, Wynncraft özel karakterlerini ve fazla boşlukları temizler.
 * En kapsamlı versiyon — tüm kullanım noktaları için tek kaynak.
 */
export function stripHtml(html: string): string {
    if (!html) return '';
    return html
        .replace(/<span\s+class='font-common'[^>]*>.*?<\/span>/gi, '')
        .replace(/<br\s*\/?>/gi, '\n')
        .replace(/<\/br>/gi, '\n')
        .replace(/<[^>]*>/g, '')
        .replace(/[✤✦✣✹✽]/g, '')
        .replace(/[\uE000-\uF8FF]/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/\n{3,}/g, '\n\n')
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Minecraft renk kodlarını (&0-&9, &a-&f, &k-&o, &r) temizler.
 */
export function stripColorCodes(str: string): string {
    if (!str) return '';
    return str.replace(/&[0-9a-fklmnor]/gi, '');
}

/**
 * Sınıf tipi string'inden CLASS_CONFIG'dan ilgili konfigürasyonu döndürür.
 * Bulunamazsa WARRIOR varsayılan olarak döner.
 */
export function getClassConfig(type: string): ClassConfigItem {
    return CLASS_CONFIG[type?.toUpperCase()] || CLASS_CONFIG.WARRIOR;
}

/**
 * Icon adından NODE_STYLES'dan ilgili stili döndürür.
 * AbilityTree.tsx ve classes/[className]/page.tsx tarafından kullanılır.
 */
export function getNodeStyle(iconName: string | undefined): NodeStyleItem {
    if (!iconName) return NODE_STYLES.nodeWhite;
    if (iconName.includes('ultimate')) return NODE_STYLES.ultimate;
    for (const [key, value] of Object.entries(NODE_STYLES)) {
        if (iconName.toLowerCase().includes(key.toLowerCase())) return value;
    }
    return NODE_STYLES.nodeWhite;
}

/**
 * Icon adından Tailwind class bazlı node renkleri döndürür.
 * classes/[className]/page.tsx tarafından kullanılır.
 */
export function getNodeColorTw(iconName: string): { border: string; bg: string; text: string; glow: string } {
    const style = getNodeStyle(iconName);
    return {
        border: style.twBorder,
        bg: style.twBg,
        text: style.twText,
        glow: style.twGlow,
    };
}

/**
 * Node stiline göre uygun ikonu döndürür.
 * AbilityTree.tsx tarafından kullanılır.
 */
export function getNodeIcon(style: NodeStyleItem): LucideIcon {
    switch (style.label) {
        case 'Core Spell': return Swords;
        case 'Keystone': return Flame;
        case 'Major Ability': return Sparkles;
        case 'Spell Modifier': return Shield;
        case 'Ultimate': return Star;
        default: return Zap;
    }
}

/**
 * Archetype adına göre tüm stil nesnesini döndürür.
 */
export function getArchetypeStyle(name: string): { text: string; bg: string; border: string } {
    if (!name) return ARCHETYPE_STYLES.default;
    const lower = name.toLowerCase();

    for (const [key, style] of Object.entries(ARCHETYPE_STYLES)) {
        if (key !== 'default' && lower.includes(key)) {
            return style;
        }
    }

    return ARCHETYPE_STYLES.default;
}

/**
 * Archetype adına göre Tailwind text renk sınıfı döndürür.
 */
export function getArchetypeHeaderColor(name: string): string {
    return getArchetypeStyle(name).text;
}

/**
 * Ability ID'sini insan tarafından okunabilir formata çevirir.
 */
export function formatAbilityId(id: string): string {
    return id
        .replace(/([A-Z])/g, ' $1')
        .replace(/([0-9]+)/g, ' $1')
        .replace(/^./, s => s.toUpperCase())
        .trim();
}
