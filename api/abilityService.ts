import { wynnFetch } from './wynnClient';

export const AbilityService = {
    getTree: (className: string) => {
        return wynnFetch(`/ability/tree/${encodeURIComponent(className)}`);
    },

    getMap: (className: string) => {
        return wynnFetch(`/ability/map/${encodeURIComponent(className)}`);
    },

    getAspects: (className: string) => {
        return wynnFetch(`/aspects/${encodeURIComponent(className)}`);
    },
};
