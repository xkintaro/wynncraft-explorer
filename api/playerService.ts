import { wynnFetch } from './wynnClient';

export const PlayerService = {
    getPlayer: (identifier: string,) => {
        return wynnFetch(`/player/${identifier}`);
    },

    getCharacters: (identifier: string) => {
        return wynnFetch(`/player/${identifier}/characters`);
    },

    getCharacter: (identifier: string, characterUuid: string) => {
        return wynnFetch(`/player/${identifier}/characters/${characterUuid}`);
    },

    getCharacterAbilities: (identifier: string, characterUuid: string) => {
        return wynnFetch(`/player/${identifier}/characters/${characterUuid}/abilities`);
    },

    searchPlayerContext: (identifier: string, server?: string | number) => {
        const params = new URLSearchParams({ identifier });
        if (server) {
            params.append('server', String(server));
        }
        return wynnFetch(`/player?${params.toString()}`);
    },

    getFullProfile: async (identifier: string) => {
        const [playerData, charactersData] = await Promise.all([
            wynnFetch<any>(`/player/${identifier}`).catch(() => null),
            wynnFetch<any>(`/player/${identifier}/characters`).catch(() => null),
        ]);

        let guildData = null;
        if (playerData?.guild?.name) {
            guildData = await wynnFetch<any>(
                `/guild/${encodeURIComponent(playerData.guild.name)}`
            ).catch(() => null);
        }

        return {
            player: playerData,
            characters: charactersData,
            guild: guildData,
        };
    },

    getCharacterFull: async (identifier: string, characterUuid: string) => {
        const [characterData, abilitiesData] = await Promise.all([
            wynnFetch<any>(`/player/${identifier}/characters/${characterUuid}`).catch(() => null),
            wynnFetch<any>(`/player/${identifier}/characters/${characterUuid}/abilities`).catch(() => null),
        ]);

        return {
            character: characterData,
            abilities: abilitiesData,
        };
    },
};