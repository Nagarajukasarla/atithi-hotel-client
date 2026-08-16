import { Navigate, Outlet } from "react-router-dom";
import { LoaderCircle } from "lucide-react";

import { useAuth } from "@/hooks/use-auth";

export function PublicOnlyRoute() {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-50">
                <div className="flex flex-col items-center gap-3">
                    <LoaderCircle className="animate-spin text-violet-600" size={36} />
                    <p className="text-sm font-medium text-slate-600">Loading…</p>
                </div>
            </div>
        );
    }

    if (isAuthenticated) {
        return <Navigate to="/overview" replace />;
    }

    return <Outlet />;
}
