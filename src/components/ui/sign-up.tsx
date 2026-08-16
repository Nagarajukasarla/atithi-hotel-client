import type { FormEvent } from "react";
import { Link } from "react-router-dom";
import { Building2, User } from "lucide-react";

import { AuthForm } from "@/components/ui/auth-form";
import { AuthLayout } from "@/components/ui/auth-layout";
import { PasswordInput } from "@/components/ui/password-input";

export interface SignUpFormValues {
    hotelName: string;
    ownerName: string;
    email: string;
    password: string;
    phone?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
}

interface SignUpPageProps {
    error?: string;
    isSubmitting?: boolean;
    onSubmit: (values: SignUpFormValues) => void;
    success?: string;
}

export function SignUpPage({ error, isSubmitting, onSubmit, success }: SignUpPageProps) {
    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        const formData = new FormData(event.currentTarget);
        onSubmit({
            hotelName: String(formData.get("hotelName") ?? "").trim(),
            ownerName: String(formData.get("ownerName") ?? "").trim(),
            email: String(formData.get("email") ?? "").trim(),
            password: String(formData.get("password") ?? ""),
            phone: String(formData.get("phone") ?? "").trim() || undefined,
            city: String(formData.get("city") ?? "").trim() || undefined,
            state: String(formData.get("state") ?? "").trim() || undefined,
            country: String(formData.get("country") ?? "").trim() || undefined,
            postalCode: String(formData.get("postalCode") ?? "").trim() || undefined,
        });
    }

    return (
        <AuthLayout
            eyebrow="ATITHI"
            heading="Build the home base for your hospitality team."
            quote="Simple enough for everyone on the floor, powerful enough for the whole property."
            quoteAuthor="— Aman Verma, Operations Lead"
        >
            <div className="mb-6">
                <p className="text-sm font-semibold tracking-[0.18em] text-violet-600">REGISTER HOTEL</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
                    Register your Property
                </h2>
                <p className="mt-2 text-sm text-slate-600">Enter your hotel and owner credentials to get started.</p>
            </div>

            <AuthForm
                error={error}
                footer={
                    <>
                        <span>Already registered? </span>
                        <Link className="font-semibold text-violet-700 hover:underline" to="/login">
                            Sign in
                        </Link>
                    </>
                }
                isSubmitting={isSubmitting}
                onSubmit={handleSubmit}
                submitLabel="Create Hotel Account"
                success={success}
            >
                {/* Hotel Details Section */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-700">
                        <Building2 size={16} />
                        <span>Property Information</span>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-xs font-medium text-slate-700" htmlFor="hotelName">
                            Hotel / Property Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            autoComplete="organization"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                            id="hotelName"
                            name="hotelName"
                            placeholder="e.g. Grand Palace Hotel"
                            required
                        />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                        <div className="grid gap-1.5">
                            <label className="text-xs font-medium text-slate-700" htmlFor="phone">
                                Phone Number
                            </label>
                            <input
                                autoComplete="tel"
                                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                id="phone"
                                name="phone"
                                placeholder="9876543210"
                                type="tel"
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <label className="text-xs font-medium text-slate-700" htmlFor="city">
                                City
                            </label>
                            <input
                                autoComplete="address-level2"
                                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                id="city"
                                name="city"
                                placeholder="e.g. Hyderabad"
                            />
                        </div>
                    </div>

                    <div className="grid gap-3 sm:grid-cols-3">
                        <div className="grid gap-1.5">
                            <label className="text-xs font-medium text-slate-700" htmlFor="state">
                                State
                            </label>
                            <input
                                autoComplete="address-level1"
                                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                id="state"
                                name="state"
                                placeholder="Telangana"
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <label className="text-xs font-medium text-slate-700" htmlFor="country">
                                Country
                            </label>
                            <input
                                autoComplete="country-name"
                                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                id="country"
                                name="country"
                                placeholder="India"
                            />
                        </div>
                        <div className="grid gap-1.5">
                            <label className="text-xs font-medium text-slate-700" htmlFor="postalCode">
                                Postal Code
                            </label>
                            <input
                                autoComplete="postal-code"
                                className="h-10 w-full rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                                id="postalCode"
                                name="postalCode"
                                placeholder="500001"
                            />
                        </div>
                    </div>
                </div>

                {/* Owner Details Section */}
                <div className="rounded-2xl border border-slate-100 bg-slate-50/60 p-4 space-y-4">
                    <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-violet-700">
                        <User size={16} />
                        <span>Owner Account</span>
                    </div>

                    <div className="grid gap-2">
                        <label className="text-xs font-medium text-slate-700" htmlFor="ownerName">
                            Owner Name <span className="text-rose-500">*</span>
                        </label>
                        <input
                            autoComplete="name"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                            id="ownerName"
                            name="ownerName"
                            placeholder="Full name of owner / manager"
                            required
                        />
                    </div>

                    <div className="grid gap-2">
                        <label className="text-xs font-medium text-slate-700" htmlFor="email">
                            Work Email <span className="text-rose-500">*</span>
                        </label>
                        <input
                            autoComplete="email"
                            className="h-11 w-full rounded-xl border border-slate-200 bg-white px-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100"
                            id="email"
                            name="email"
                            placeholder="owner@hotel.com"
                            required
                            type="email"
                        />
                    </div>

                    <PasswordInput
                        autoComplete="new-password"
                        label="Password"
                        minLength={6}
                        name="password"
                        placeholder="At least 6 characters"
                        required
                    />
                </div>
            </AuthForm>
        </AuthLayout>
    );
}
