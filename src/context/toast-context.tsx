import * as React from "react";
import { CheckCircle2, AlertCircle, Info, X } from "lucide-react";

export type ToastType = "success" | "error" | "info";

export interface Toast {
    id: string;
    message: string;
    type: ToastType;
    duration?: number;
}

interface ToastContextProps {
    showToast: (message: string, type?: ToastType, duration?: number) => void;
}

const ToastContext = React.createContext<ToastContextProps | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = React.useState<Toast[]>([]);

    const showToast = React.useCallback((message: string, type: ToastType = "success", duration = 3000) => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts(prev => [...prev, { id, message, type, duration }]);

        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id));
        }, duration);
    }, []);

    const removeToast = React.useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}
            {/* Toast container */}
            <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-md w-full sm:w-96 pointer-events-none px-4 sm:px-0">
                {toasts.map(toast => {
                    let Icon = CheckCircle2;
                    let iconColor = "text-emerald-500";
                    let bgColor = "bg-white border-emerald-100";
                    let textColor = "text-slate-800";
                    let bannerColor = "bg-emerald-500";

                    if (toast.type === "error") {
                        Icon = AlertCircle;
                        iconColor = "text-rose-500";
                        bgColor = "bg-white border-rose-100";
                        textColor = "text-slate-800";
                        bannerColor = "bg-rose-500";
                    } else if (toast.type === "info") {
                        Icon = Info;
                        iconColor = "text-blue-500";
                        bgColor = "bg-white border-blue-100";
                        textColor = "text-slate-800";
                        bannerColor = "bg-blue-500";
                    }

                    return (
                        <div
                            key={toast.id}
                            className={`flex items-center gap-3 p-4 rounded-xl shadow-lg border ${bgColor} pointer-events-auto transition-all duration-300 transform translate-y-0 relative overflow-hidden`}
                            role="alert"
                        >
                            {/* Sleek top/left accent bar */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${bannerColor}`} />

                            <Icon className={`h-5 w-5 flex-shrink-0 ml-1.5 ${iconColor}`} />
                            <p className={`text-sm font-semibold ${textColor} flex-1`}>{toast.message}</p>
                            <button
                                onClick={() => removeToast(toast.id)}
                                className="text-slate-400 hover:text-slate-600 transition-colors p-1 rounded-full hover:bg-slate-100"
                                type="button"
                                aria-label="Close notification"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    );
                })}
            </div>
        </ToastContext.Provider>
    );
}

export function useToastContext() {
    const context = React.useContext(ToastContext);
    if (context === undefined) {
        throw new Error("useToastContext must be used within a ToastProvider");
    }
    return context;
}
export default ToastContext;
