import { NewsService } from '@/api/newsService';

import Link from 'next/link';

import {
    ArrowLeft,
    MessageSquare,
    ArrowRight,
    Flame,
    FileText,
    Newspaper,
} from 'lucide-react';

interface NewsItem {
    title: string;
    date: string;
    forumThread: string;
    author: string;
    content: string;
    comments: string;
}

export default async function NewsPage() {

    const data = await NewsService.getLatest() as NewsItem[];

    return (

        <div className="global-container">

            <header className="global-header">

                <Link
                    href="/"
                    className="global-back-btn"
                >

                    <ArrowLeft />

                </Link>

                <h1 className="global-title">

                    <Newspaper />

                    News

                </h1>

            </header>

            <div className="flex flex-col gap-4 sm:gap-6 lg:gap-8">

                {data.map((news, index) => (

                    <article
                        key={index}
                        className="news-card"
                    >

                        <div className="flex flex-wrap items-center gap-2 sm:gap-4 mb-4 sm:mb-8">

                            <div className="badge-date">

                                {index === 0 ? <Flame /> : <FileText />}

                                {news.date}

                            </div>

                            <div className="badge-author">

                                Author: {news.author}

                            </div>

                        </div>

                        <h2 className="title">
                            {news.title}
                        </h2>

                        <div
                            className="content"
                            dangerouslySetInnerHTML={{ __html: news.content }}
                        />

                        <div className="footer">

                            <div className="flex items-center gap-3">

                                <div className="comments-icon">

                                    <MessageSquare />

                                </div>

                                <div>

                                    <p className="comments-label">
                                        Comments
                                    </p>

                                    <p className="comments-count">
                                        {news.comments}
                                    </p>

                                </div>

                            </div>

                            <a
                                href={news.forumThread}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="btn"
                            >
                                Read News
                                <ArrowRight />
                            </a>

                        </div>

                    </article>

                ))}

            </div>

        </div>
    );

}
