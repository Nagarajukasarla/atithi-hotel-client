import { Link } from "react-router-dom";
import { Home, ArrowLeft, Hotel } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";

export function NotFoundPage() {
    const { isAuthenticated } = useAuth();

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 p-4 text-center text-slate-900 sm:p-6">
            <div className="mx-auto w-full max-w-md rounded-3xl bg-white p-8 shadow-xl shadow-slate-900/5 sm:p-10">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-100 text-violet-600">
                    <Hotel size={32} />
                </div>

                <h1 className="mt-6 text-6xl font-bold tracking-tight text-violet-600">404</h1>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Page not found</h2>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">
                    Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or
                    doesn&apos;t exist.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
                    {isAuthenticated ? (
                        <Link
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200"
                            to="/overview"
                        >
                            <Home size={18} />
                            Return to Overview
                        </Link>
                    ) : (
                        <Link
                            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-violet-600 px-5 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus:ring-4 focus:ring-violet-200"
                            to="/login"
                        >
                            <ArrowLeft size={18} />
                            Back to Sign In
                        </Link>
                    )}
                </div>
            </div>
        </div>
    );
}
