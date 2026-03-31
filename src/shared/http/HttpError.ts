export class HttpError extends Error {
    readonly code: string;
    readonly statusCode: number;

    constructor({ code, message, statusCode }: { code: string; message: string; statusCode: number; }) {
        super(message);
        this.name = 'HttpError';
        this.code = code;
        this.statusCode = statusCode;
    }
}

export function toErrorMessage(error: unknown, fallbackMessage: string): string {
    if (error instanceof HttpError) {
        return error.message;
    }

    if (error instanceof Error) {
        return error.message;
    }

    return fallbackMessage;
}
