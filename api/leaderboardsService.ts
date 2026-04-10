import { wynnFetch } from './wynnClient';

export const LeaderboardService = {
    getTypes: () => {
        return wynnFetch<string[]>('/leaderboards/types');
    },

    getLeaderboard: (type: string) => {
        return wynnFetch(`/leaderboards/${type}?resultLimit=10`);
    },
};