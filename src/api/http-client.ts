import { appConfig } from "@/config/env";

export class HttpError extends Error {
    public readonly status: number;
    public readonly data?: unknown;

    constructor(message: string, status: number, data?: unknown) {
        super(message);
        this.name = "HttpError";
        this.status = status;
        this.data = data;
    }
}

export type RequestOptions = Omit<RequestInit, "body" | "headers"> & {
    body?: unknown;
    headers?: HeadersInit;
};

function requireBaseUrl() {
    if (!appConfig.apiBaseUrl) {
        throw new Error("VITE_API_BASE_URL is required before making API requests.");
    }

    return appConfig.apiBaseUrl;
}

function getRequestHeaders(headers?: HeadersInit) {
    const requestHeaders = new Headers(headers);
    requestHeaders.set("Accept", "application/json");
    requestHeaders.set("Content-Type", "application/json");
    return requestHeaders;
}

async function readResponseBody(response: Response) {
    const contentType = response.headers.get("content-type");
    return contentType?.includes("application/json") ? (response.json() as Promise<unknown>) : response.text();
}

function resolveApiUrl(path: string) {
    // API route constants may use a leading slash without discarding `/api/v1`
    // from the configured base URL.
    return new URL(path.replace(/^\/+/, ""), `${requireBaseUrl()}/`);
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
    const { body, headers, ...init } = options;
    const response = await fetch(resolveApiUrl(path), {
        credentials: "include",
        ...init,
        body: body === undefined ? undefined : JSON.stringify(body),
        headers: getRequestHeaders(headers),
    });
    const data = await readResponseBody(response);

    if (!response.ok) {
        const message =
            typeof data === "object" && data !== null && "message" in data && typeof data.message === "string"
                ? data.message
                : response.statusText || "API request failed";

        throw new HttpError(message, response.status, data);
    }

    return data as T;
}
