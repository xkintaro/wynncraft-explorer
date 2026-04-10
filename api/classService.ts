import { wynnFetch } from './wynnClient';

export const ClassService = {
    getAll: () => {
        return wynnFetch<Record<string, { name: string; overallDifficulty: number }>>('/classes');
    },

    getClass: (className: string) => {
        return wynnFetch(`/classes/${encodeURIComponent(className)}`);
    },
};
