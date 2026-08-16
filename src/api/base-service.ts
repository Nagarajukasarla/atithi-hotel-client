import { request, type RequestOptions } from "@/api/http-client";

export abstract class BaseService {
    protected get<T>(route: string, options?: RequestOptions) {
        return request<T>(route, { ...options, method: "GET" });
    }

    protected post<T>(route: string, body?: unknown, options?: RequestOptions) {
        return request<T>(route, { ...options, body, method: "POST" });
    }
}
