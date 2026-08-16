import type { FormEvent } from "react";
import { Link } from "react-router-dom";

import { AuthForm } from "@/components/ui/auth-form";
import { AuthLayout } from "@/components/ui/auth-layout";
import { PasswordInput } from "@/components/ui/password-input";

export interface SignInFormValues {
    email: string;
    password: string;
    rememberMe: boolean;
}

interface SignInPageProps {
    error?: string;
    isSubmitting?: boolean;
    onSubmit: (values: SignInFormValues) => void;
    success?: string;
}

export function SignInPage({ error, isSubmitting, onSubmit, success }: SignInPageProps) {
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        onSubmit({
            email: String(formData.get("email") ?? "").trim(),
            password: String(formData.get("password") ?? ""),
            rememberMe: formData.get("rememberMe") === "on",
        });
    }

    return (
        <AuthLayout
            eyebrow="ATITHI"
            heading="A calmer way to run an exceptional stay."
            quote="Atithi keeps our team aligned from check-in to check-out."
            quoteAuthor="— Aditi Sharma, Hotel Manager"
        >
            <div className="mb-8">
                <p className="text-sm font-semibold tracking-[0.18em] text-violet-600">WELCOME BACK</p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight sm:text-4xl">Sign in to Atithi</h2>
                <p className="mt-3 text-slate-600">Enter your details to access your hotel workspace.</p>
            </div>

            <AuthForm
                error={error}
                footer={
                    <>
                        <span>New to Atithi? </span>
                        <Link className="font-semibold text-violet-700 hover:underline" to="/signup">
                            Create an account
                        </Link>
                    </>
                }
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                submitLabel="Sign in"
                success={success}
            >
                <div className="grid gap-2">
                    <label className="text-sm font-medium text-slate-700" htmlFor="email">
                        Email address
                    </label>
                    <input
                        autoComplete="email"
                        className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                        id="email"
                        name="email"
                        placeholder="you@hotel.com"
                        required
                        type="email"
                    />
                </div>
                <PasswordInput
                    autoComplete="current-password"
                    label="Password"
                    minLength={6}
                    name="password"
                    placeholder="Enter your password"
                    required
                />
                <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-600">
                    <input
                        className="size-4 rounded border-slate-300 accent-violet-600"
                        name="rememberMe"
                        type="checkbox"
                    />
                    Keep me signed in
                </label>
            </AuthForm>
        </AuthLayout>
    );
}
