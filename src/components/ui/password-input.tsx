import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface PasswordInputProps extends Omit<React.ComponentProps<"input">, "type"> {
    label: string;
}

export function PasswordInput({ className, id, label, ...props }: PasswordInputProps) {
    const [isVisible, setIsVisible] = useState(false);
    const inputId = id ?? props.name;

    return (
        <div className="grid gap-2">
            <label className="text-sm font-medium text-slate-700" htmlFor={inputId}>
                {label}
            </label>
            <div className="relative">
                <input
                    {...props}
                    id={inputId}
                    type={isVisible ? "text" : "password"}
                    className={cn(
                        "h-12 w-full rounded-xl border border-slate-200 bg-white px-4 pr-12 text-sm text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-violet-500 focus:ring-4 focus:ring-violet-100",
                        className
                    )}
                />
                <button
                    aria-label={isVisible ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-0 grid w-12 place-items-center rounded-r-xl text-slate-400 transition hover:text-slate-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500"
                    onClick={() => setIsVisible(visible => !visible)}
                    type="button"
                >
                    {isVisible ? <EyeOff aria-hidden="true" size={19} /> : <Eye aria-hidden="true" size={19} />}
                </button>
            </div>
        </div>
    );
}
