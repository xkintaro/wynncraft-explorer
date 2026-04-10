import { ClassService } from '@/api/classService';

import { CLASS_CONFIG } from '@/lib/constants';

import Link from 'next/link';

import { ArrowLeft, Shell, Star } from 'lucide-react';

export default async function ClassesPage() {

    const classes = await ClassService.getAll();
    const classEntries = Object.entries(classes);

    return (
        <div className="global-container">

            <header className="global-header">

                <Link href="/" className="global-back-btn">
                    <ArrowLeft />
                </Link>

                <h1 className="global-title">
                    <Shell />
                    Classes
                </h1>

            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                {classEntries.map(([key, info]) => {
                    const config = CLASS_CONFIG[key.toUpperCase()] || CLASS_CONFIG.WARRIOR;
                    const IconComp = config.icon;

                    return (

                        <Link href={`/classes/${key}`} key={key} className="class-card">

                            <div className="flex items-center justify-between mb-6">

                                <div className="icon">
                                    <IconComp className={`${config.textColor}`} />
                                </div>

                                <div className="flex flex-col items-end">

                                    <span className="difficulty-label">
                                        Difficulty
                                    </span>

                                    <div className="flex gap-1">
                                        {[...Array(3)].map((_, i) => (
                                            <Star
                                                key={i}
                                                className={`size-3 ${i < info.overallDifficulty ? 'fill-amber-400 text-amber-400' : 'text-black/20'}`}
                                            />
                                        ))}
                                    </div>

                                </div>

                            </div>

                            <h2 className="title">
                                {info.name}
                            </h2>

                        </Link>

                    );

                })}

            </div>

        </div>

    );

}
