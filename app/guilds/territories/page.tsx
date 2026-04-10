import { GuildService } from '@/api/guildService';
import TerritoryListClient from './TerritoryListClient';

export default async function TerritoriesPage() {
    try {
        const data = await GuildService.getTerritoryList() as Record<string, any>;
        const territories = Object.entries(data).map(([name, info]) => ({
            name,
            ...info
        }));

        return <TerritoryListClient territories={territories} />;
    } catch (error) {
        return (
            <div>
                Error
            </div>
        );
    }
}

