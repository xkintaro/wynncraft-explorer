import { GuildService } from '@/api/guildService';
import GuildListClient from './GuildListClient';

export default async function GuildsPage() {
    try {
        const guilds = await GuildService.getGuildList();
        return <GuildListClient guilds={guilds} />;
    } catch (error) {
        return (
            <div>
                Error
            </div>
        );
    }
}
