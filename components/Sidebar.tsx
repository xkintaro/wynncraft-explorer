import Link from 'next/link';

import React from 'react';

import {
    Home,
    Shield,
    Flag,
    Trophy,
    Users,
    Newspaper,
    Shell
} from 'lucide-react';

export default async function Sidebar() {

    return (

        <aside className="w-64 h-screen sticky top-0 border-r-4 border-black flex flex-col p-6 overflow-y-auto">

            <nav className="flex flex-col gap-8">

                <section className="space-y-2">

                    <SidebarLink href="/" icon={<Home />} label="Home" />

                    <SidebarLink href="/player" icon={<Users />} label="Player" />

                    <SidebarLink href="/classes" icon={<Shell />} label="Classes" />

                    <SidebarLink href="/leaderboards" icon={<Trophy />} label="Leaderboards" />

                    <SidebarLink href="/guilds" icon={<Shield />} label="Guilds" />

                    <SidebarLink href="/guilds/territories" icon={<Flag />} label="Territories" />

                    <SidebarLink href="/news" icon={<Newspaper />} label="News" />

                </section>

            </nav>

        </aside>

    );

}

function SidebarLink({ href, icon, label }: { href: string; icon: React.ReactElement; label: string }) {

    return (

        <Link
            href={href}
            className="group flex items-center gap-3 p-3 border-2 border-transparent hover:border-black transition-all duration-300 relative overflow-hidden"
        >

            <div className="w-8 h-8 flex items-center justify-center border-2 border-black bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:bg-amber-400 group-hover:-rotate-3 transition-all">
                {React.cloneElement(icon as React.ReactElement<any>, { className: 'w-4 h-4 text-black' })}
            </div>

            <span className="font-bold text-black uppercase tracking-tight text-xs flex-1">
                {label}
            </span>

        </Link>

    );

}
