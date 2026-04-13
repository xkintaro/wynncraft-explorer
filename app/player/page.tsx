import SearchPlayer from "@/components/SearchPlayer";

import Link from "next/link";

import { ArrowLeft } from "lucide-react";

export default function PlayerSearchPage() {

    return (

        <div className="global-container">

            <header className="global-header">

                <Link
                    href="/"
                    className="global-back-btn"
                >

                    <ArrowLeft />

                </Link>

            </header>

            <SearchPlayer />

        </div>

    );

}

