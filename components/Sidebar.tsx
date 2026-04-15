'use client';

import Link from 'next/link';

import { usePathname } from 'next/navigation';

import React, { useState, useEffect } from 'react';

import {
    Home,
    Shield,
    Flag,
    Trophy,
    Users,
    Newspaper,
    Shell,
    Menu,
    X,
    ChevronRight
} from 'lucide-react';

export default function Sidebar() {

    const [isOpen, setIsOpen] = useState(false);

    const pathname = usePathname();

    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    return (
        <>

            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed top-5 max-xl:right-5 xl:left-5 z-60 size-10 sm:size-12 bg-white border-2 border-black shadow-retro-sm hover:bg-amber-400 active:translate-y-1 active:shadow-none transition-all cursor-pointer flex items-center justify-center"
            >
                {isOpen ? <X className="size-5 sm:size-6 text-black" /> : <Menu className="size-5 sm:size-6 text-black" />}

            </button>

            <aside
                className={`
                    fixed top-0 left-0 h-full z-55 w-86 bg-white border-r-8 border-black flex flex-col px-4 sm:px-8 pb-8 pt-12 sm:pt-28 overflow-y-auto
                    transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
                `}
            >
                <nav className="flex flex-col gap-3">

                    <SidebarLink
                        href="/"
                        icon={<Home />}
                        label="Home"
                        active={pathname === '/'}
                    />

                    <SidebarLink
                        href="/player"
                        icon={<Users />}
                        label="Player"
                        active={pathname?.startsWith('/player')}
                    />

                    <SidebarLink
                        href="/classes"
                        icon={<Shell />}
                        label="Classes"
                        active={pathname?.startsWith('/classes')}
                    />

                    <SidebarLink
                        href="/leaderboards"
                        icon={<Trophy />}
                        label="Leaderboards"
                        active={pathname?.startsWith('/leaderboards')}
                    />

                    <SidebarLink
                        href="/guilds"
                        icon={<Shield />}
                        label="Guilds"
                        active={pathname?.startsWith('/guilds')}
                    />

                    <SidebarLink
                        href="/guilds/territories"
                        icon={<Flag />}
                        label="Territories"
                        active={pathname === '/guilds/territories'}
                    />

                    <SidebarLink
                        href="/news"
                        icon={<Newspaper />}
                        label="News"
                        active={pathname === '/news'}
                    />

                </nav>

            </aside>

        </>

    );

}

function SidebarLink({
    href,
    icon,
    label,
    active
}: {
    href: string;
    icon: React.ReactElement;
    label: string;
    active: boolean;
}) {
    return (

        <Link
            href={href}
            className={`
                group flex items-center gap-4 p-4 border-4 transition-all duration-300 relative
                ${active
                    ? 'border-black bg-amber-400 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-1'
                    : 'border-transparent hover:border-black/10 hover:translate-x-2'
                }
            `}
        >
            <div className={`
                w-10 h-10 flex items-center justify-center shrink-0 border-4 border-black transition-all
                ${active ? 'bg-white rotate-6' : 'bg-white group-hover:bg-amber-400 group-hover:-rotate-6'}
            `}>

                {React.cloneElement(icon as React.ReactElement<any>, {
                    className: `size-5 text-black ${active ? 'animate-pulse' : ''}`
                })}

            </div>

            <span className={`font-jersey text-2xl uppercase tracking-wide flex-1 ${active ? 'text-black' : 'text-black/60'}`}>
                {label}
            </span>

            {active && <ChevronRight className="size-5 text-black animate-bounce-x" />}

        </Link>

    );

}
