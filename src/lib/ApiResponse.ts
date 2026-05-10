export type ApiResponseType<T = unknown> = {
    success: boolean;
    status_code: number;
    message: string;
    data?: T;
};

export function ApiResponse<T>(
    status: number,
    message: string,
    data?: T
): ApiResponseType<T> {
    const success = status >= 200 && status < 300;

    return {
        success,
        status_code: status,
        message,
        ...(data !== undefined && { data })
    };
}
