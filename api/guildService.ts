import { wynnFetch } from './wynnClient';

export const GuildService = {
    getGuild: (name: string, identifier?: string) => {
        const query = identifier ? `?identifier=${identifier}` : '';
        return wynnFetch(`/guild/${encodeURIComponent(name)}${query}`);
    },

    getGuildByPrefix: (prefix: string, identifier?: string) => {
        const query = identifier ? `?identifier=${identifier}` : '';
        return wynnFetch(`/guild/prefix/${encodeURIComponent(prefix)}${query}`);
    },

    getGuildList: () => {
        return wynnFetch<Record<string, { uuid: string; prefix: string }>>('/guild/list/guild');
    },

    getTerritoryList: () => {
        return wynnFetch('/guild/list/territory');
    },
};
