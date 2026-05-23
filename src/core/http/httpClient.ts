import { apiClient } from '../api/apiClient';
import type {AxiosRequestConfig} from "axios";

class HttpClient {
    async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return apiClient.get<unknown, T>(url, config);
    }

    async post<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
        return apiClient.post<unknown, T>(url, body, config);
    }

    async put<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
        return apiClient.put<unknown, T>(url, body, config);
    }

    async patch<T>(url: string, body?: unknown, config?: AxiosRequestConfig): Promise<T> {
        return apiClient.patch<unknown, T>(url, body, config);
    }

    async delete<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
        return apiClient.delete<unknown, T>(url, config);
    }
}

export const httpClient = new HttpClient();