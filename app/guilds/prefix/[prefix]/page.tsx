import { GuildService } from '@/api/guildService';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

import { redirect } from 'next/navigation';

export default async function GuildByPrefixPage({

    params,

}: {

    params: Promise<{ prefix: string }>;

}) {

    const { prefix } = await params;

    let data: any = null;

    data = await GuildService.getGuildByPrefix(prefix);

    if (data && data.name) {
        redirect(`/guilds/${encodeURIComponent(data.name)}`);
    }

    return (

        <div className="global-container">

            <header className="global-header">

                <Link href="/" className="global-back-btn">

                    <ArrowLeft />

                </Link>

                <h1 className="global-title">
                    PREFIX NOT FOUND
                </h1>

            </header>

        </div>

    );

}
