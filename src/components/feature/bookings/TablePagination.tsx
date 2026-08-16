import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface TablePaginationProps {
    page: number;
    pageSize: number;
    total: number;
    onChange: (page: number, pageSize: number) => void;
    pageSizeOptions?: number[];
    itemLabel?: string;
    className?: string;
}

export function TablePagination({
    page,
    pageSize,
    total,
    onChange,
    pageSizeOptions = [10, 20, 50],
    itemLabel = "rooms",
    className,
}: TablePaginationProps) {
    const totalPages = Math.max(1, Math.ceil(total / pageSize));
    const isPrevDisabled = page <= 1;
    const isNextDisabled = page >= totalPages;

    const handlePageChange = (newPage: number) => {
        if (newPage >= 1 && newPage <= totalPages) {
            onChange(newPage, pageSize);
        }
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = Number(e.target.value);
        onChange(1, newSize);
    };

    return (
        <div
            className={cn(
                "flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 text-xs text-slate-600",
                className
            )}
        >
            <div className="flex items-center gap-2">
                <span className="font-medium text-slate-700">
                    Total {total} {itemLabel}
                </span>
                <div className="flex items-center gap-1.5 ml-3">
                    <label className="sr-only" htmlFor="page-size-select">
                        Items per page
                    </label>
                    <select
                        className="rounded border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 outline-none focus:ring-1 focus:ring-blue-500 cursor-pointer"
                        id="page-size-select"
                        value={pageSize}
                        onChange={handlePageSizeChange}
                    >
                        {pageSizeOptions.map(opt => (
                            <option key={opt} value={opt}>
                                {opt} / page
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <span className="text-slate-500 font-medium">
                    Page {page} of {totalPages}
                </span>
                <div className="flex items-center gap-1">
                    <button
                        aria-label="Previous page"
                        className={cn(
                            "flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 transition-colors cursor-pointer",
                            isPrevDisabled
                                ? "opacity-40 cursor-not-allowed bg-slate-50"
                                : "hover:bg-slate-100 text-slate-800"
                        )}
                        disabled={isPrevDisabled}
                        onClick={() => handlePageChange(page - 1)}
                        type="button"
                    >
                        <ChevronLeft className="h-4 w-4" />
                    </button>
                    <button
                        aria-label="Next page"
                        className={cn(
                            "flex h-8 w-8 items-center justify-center rounded border border-slate-200 bg-white text-slate-600 transition-colors cursor-pointer",
                            isNextDisabled
                                ? "opacity-40 cursor-not-allowed bg-slate-50"
                                : "hover:bg-slate-100 text-slate-800"
                        )}
                        disabled={isNextDisabled}
                        onClick={() => handlePageChange(page + 1)}
                        type="button"
                    >
                        <ChevronRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </div>
    );
}
