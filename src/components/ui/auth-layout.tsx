import type { ReactNode } from "react";

interface AuthLayoutProps {
    children: ReactNode;
    eyebrow: string;
    heading: string;
    quote: string;
    quoteAuthor: string;
}

export function AuthLayout({ children, eyebrow, heading, quote, quoteAuthor }: AuthLayoutProps) {
    return (
        <main className="min-h-svh bg-slate-50 p-4 text-slate-950 sm:p-6 lg:p-8">
            <div className="mx-auto grid min-h-[calc(100svh-2rem)] max-w-7xl overflow-hidden rounded-3xl bg-white shadow-2xl shadow-slate-950/10 lg:grid-cols-[1fr_1.05fr] sm:min-h-[calc(100svh-3rem)]">
                <section className="flex items-center justify-center px-6 py-12 sm:px-10 lg:px-16">
                    <div className="w-full max-w-md">{children}</div>
                </section>

                <aside className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:flex lg:flex-col lg:justify-between">
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-cover bg-center opacity-45"
                        style={{
                            backgroundImage:
                                "url(https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1600&q=85)",
                        }}
                    />
                    <div
                        aria-hidden="true"
                        className="absolute inset-0 bg-gradient-to-br from-violet-950/90 via-slate-950/60 to-slate-950/90"
                    />

                    <div className="relative">
                        <p className="text-sm font-semibold tracking-[0.24em] text-violet-200">{eyebrow}</p>
                        <h1 className="mt-5 max-w-lg text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
                            {heading}
                        </h1>
                    </div>

                    <figure className="relative rounded-2xl border border-white/15 bg-white/10 p-6 backdrop-blur-md">
                        <blockquote className="text-lg leading-relaxed text-white/95">“{quote}”</blockquote>
                        <figcaption className="mt-4 text-sm font-medium text-violet-200">{quoteAuthor}</figcaption>
                    </figure>
                </aside>
            </div>
        </main>
    );
}
