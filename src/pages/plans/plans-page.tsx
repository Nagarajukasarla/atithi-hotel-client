export function PlansPage() {
    return (
        <div className="p-4 sm:p-6 w-full max-w-5xl mx-auto space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800">Subscription & Rate Plans</h2>
                        <p className="text-sm text-slate-500">
                            Manage your hotel operations tier and room rate packages.
                        </p>
                    </div>
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 border border-blue-200">
                        Enterprise Tier Active
                    </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
                        <span className="text-xs font-bold uppercase text-slate-500">Standard Plan</span>
                        <div className="text-2xl font-extrabold text-slate-800">
                            $199<span className="text-xs font-normal text-slate-500">/mo</span>
                        </div>
                        <p className="text-xs text-slate-600">
                            Up to 50 rooms, basic reporting, front-desk management.
                        </p>
                    </div>

                    <div className="rounded-lg border-2 border-blue-500 bg-white p-4 space-y-2 relative shadow-xs">
                        <span className="absolute -top-2.5 right-3 rounded bg-blue-600 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                            Current
                        </span>
                        <span className="text-xs font-bold uppercase text-blue-600">Pro Enterprise</span>
                        <div className="text-2xl font-extrabold text-slate-800">
                            $499<span className="text-xs font-normal text-slate-500">/mo</span>
                        </div>
                        <p className="text-xs text-slate-600">
                            Unlimited rooms, channel manager sync, advanced analytics & API access.
                        </p>
                    </div>

                    <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 space-y-2">
                        <span className="text-xs font-bold uppercase text-slate-500">Custom Luxury</span>
                        <div className="text-2xl font-extrabold text-slate-800">Custom</div>
                        <p className="text-xs text-slate-600">
                            Multi-property chain management, dedicated concierge integration.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
