import { NextRequest, NextResponse } from 'next/server';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ path: string[] }> }
) {
    const { path } = await context.params;
    const pathString = path.join('/');
    const searchParams = request.nextUrl.searchParams.toString();
    const targetUrl = `https://api.wynncraft.com/v3/${pathString}${searchParams ? `?${searchParams}` : ''}`;

    console.log(`[Proxy] Requesting: ${targetUrl}`);

    try {
        const response = await fetch(targetUrl, {
            headers: {
                'Accept': 'application/json',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Encoding': 'gzip, deflate',
            },
            cache: 'no-store'
        });

        if (!response.ok) {
            console.error(`[Proxy] API returned error: ${response.status} for ${targetUrl}`);
            const errorText = await response.text();
            return NextResponse.json({ error: `API Error: ${response.status}`, details: errorText }, { status: response.status });
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error(`[Proxy] Fatal error for ${targetUrl}:`, error);
        return NextResponse.json(
            { error: 'Failed to fetch from Wynncraft API', message: error instanceof Error ? error.message : String(error) }, 
            { status: 500 }
        );
    }
}
