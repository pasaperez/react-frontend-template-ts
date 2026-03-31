export interface HttpClient {
    delete(path: string): Promise<void>;
    get<TResponse>(path: string): Promise<TResponse>;
    post<TResponse, TBody>(path: string, body: TBody): Promise<TResponse>;
    put<TResponse, TBody>(path: string, body: TBody): Promise<TResponse>;
}
