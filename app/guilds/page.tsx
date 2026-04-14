import { GuildService } from '@/api/guildService';
import GuildListClient from './GuildListClient';

export default async function GuildsPage() {

    const guilds = await GuildService.getGuildList();

    return <GuildListClient guilds={guilds} />;

}
