import { wynnFetch } from './wynnClient';

export const NewsService = {
    getLatest: () => {
        return wynnFetch('/latest-news');
    },
};
