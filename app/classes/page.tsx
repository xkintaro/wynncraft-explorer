import { ClassService } from '@/api/classService';
import { CLASS_CONFIG } from '@/lib/constants';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function AbilitiesPage() {
    const classes = await ClassService.getAll();
    const classEntries = Object.entries(classes);

    return (
        <div className='max-w-6xl mx-auto px-6 py-12'>

            <div className="flex items-center gap-4 mb-8">
                <Link href="/" className="back-btn">
                    <ArrowLeft />
                </Link>
            </div>

            <h1 className="text-6xl">
                Classes
            </h1>

            <div className="space-y-6">

                {classEntries.map(([key, info]) => {

                    const config = CLASS_CONFIG[key.toUpperCase()] || CLASS_CONFIG.WARRIOR;
                    const IconComp = config.icon;

                    return (

                        <div key={key} className={`border-2 ${config.cardBorder} p-6 ${config.cardHover} transition-all`}>

                            <div className="flex items-center justify-between mb-5">

                                <div className="flex items-center gap-4">

                                    <div className={`w-12 h-12 border-2 ${config.cardBorder} flex items-center justify-center`}>

                                        <IconComp className={`w-6 h-6 ${config.cardText}`} />

                                    </div>

                                    <div>

                                        <h2 className="text-3xl font-jersey  uppercase tracking-wider leading-none">
                                            {info.name}
                                        </h2>

                                        <span className="text-xs uppercase tracking-[0.3em]">
                                            Zorluk: {info.overallDifficulty}/3
                                        </span>

                                    </div>

                                </div>

                            </div>

                            <Link
                                href={`/classes/${key}`}
                                className="p-5 border border-black"
                            >
                                View Class
                            </Link>

                        </div>

                    );

                })}

            </div>

        </div>
    );
}
