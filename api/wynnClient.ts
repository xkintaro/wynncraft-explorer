const BASE_API_URL = 'https://api.wynncraft.com/v3';
const PROXY_URL = '/api/proxy';

const DEFAULT_HEADERS: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json',
    'Accept-Encoding': 'gzip, deflate',
};

export async function wynnFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const isClient = typeof window !== 'undefined';

    let url: string;
    if (endpoint.startsWith('http')) {
        url = endpoint;
    } else {
        const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;

        if (isClient) {
            url = `${PROXY_URL}/${cleanEndpoint}`;
        } else {
            url = `${BASE_API_URL}/${cleanEndpoint}`;
        }
    }

    const response = await fetch(url, {
        next: { revalidate: 60 },
        headers: {
            ...DEFAULT_HEADERS,
            ...(options.headers as Record<string, string> || {}),
        },
        ...options,
    });

    if (!response.ok) {
        if (response.status === 404) throw new Error('Resource not found');
        if (response.status === 429) throw new Error('Rate limit exceeded. Please wait.');
        if (response.status === 403) throw new Error('Access forbidden');
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
}