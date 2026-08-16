import { LoaderCircle } from "lucide-react";
import type { FormEvent, ReactNode } from "react";

interface AuthFormProps {
    children: ReactNode;
    error?: string;
    footer: ReactNode;
    onSubmit: (event: FormEvent<HTMLFormElement>) => void;
    submitLabel: string;
    success?: string;
    isSubmitting?: boolean;
}

export function AuthForm({
    children,
    error,
    footer,
    isSubmitting = false,
    onSubmit,
    submitLabel,
    success,
}: AuthFormProps) {
    return (
        <form className="space-y-5" onSubmit={onSubmit}>
            {children}
            {error ? (
                <p className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700" role="alert">
                    {error}
                </p>
            ) : null}
            {success ? (
                <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700" role="status">
                    {success}
                </p>
            ) : null}
            <button
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 text-sm font-semibold text-white transition hover:bg-violet-700 focus:outline-none focus-visible:ring-4 focus-visible:ring-violet-200 disabled:cursor-not-allowed disabled:opacity-65"
                disabled={isSubmitting}
                type="submit"
            >
                {isSubmitting ? <LoaderCircle aria-hidden="true" className="animate-spin" size={18} /> : null}
                {isSubmitting ? "Please wait…" : submitLabel}
            </button>
            <div className="text-center text-sm text-slate-600">{footer}</div>
        </form>
    );
}
