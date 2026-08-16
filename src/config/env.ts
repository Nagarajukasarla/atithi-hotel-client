const rawApiBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

function readApiBaseUrl() {
    if (!rawApiBaseUrl) {
        return undefined;
    }

    try {
        return new URL(rawApiBaseUrl).toString().replace(/\/$/, "");
    } catch {
        throw new Error("VITE_API_BASE_URL must be a valid absolute URL.");
    }
}

export const appConfig = {
    apiBaseUrl: readApiBaseUrl(),
} as const;
