// app/player/[uuid]/characters/page.tsx
import { PlayerService } from '@/api/playerService';

export default async function CharactersListPage({ params }: { params: Promise<{ uuid: string }> }) {
    const { uuid } = await params;
    const data = await PlayerService.getCharacters(uuid);

    return (
        <div>
            <h1>Characters of {uuid}</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}