const TMDB_API_BASE_URL = "https://api.themoviedb.org/3";
const TMDB_IMAGE_BASE_URL = "https://image.tmdb.org/t/p";

type QueryValue = string | number | undefined | null;
type QueryParams = Record<string, QueryValue>;

const DEFAULT_HEADERS = {
    accept: "application/json",
    "content-type": "application/json",
};

const appendQueryParams = (url: URL, params?: QueryParams) => {
    if (!params) return;

    Object.entries(params).forEach(([key, value]) => {
        if (value === undefined || value === null || value === "") return;
        url.searchParams.set(key, String(value));
    });
};

export const getErrorMessage = (error: unknown) => {
    if (typeof error === "string") return error;
    if (error instanceof Error) return error.message;
    return "Произошла непредвиденная ошибка.";
};

export const tmdbRequest = async <T>(
    path: string,
    token: string,
    init?: RequestInit,
    params?: QueryParams,
): Promise<T> => {
    if (!token) {
        throw new Error("Токен TMDB не найден.");
    }

    const url = new URL(`${TMDB_API_BASE_URL}${path}`);
    appendQueryParams(url, params);

    const response = await fetch(url, {
        ...init,
        headers: {
            ...DEFAULT_HEADERS,
            ...init?.headers,
            Authorization: `Bearer ${token}`,
        },
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
        const message =
            data?.status_message ||
            data?.errors?.join?.(", ") ||
            "Не удалось получить данные от TMDB.";
        throw new Error(message);
    }

    return data as T;
};

export const buildTmdbImageUrl = (path: string | null | undefined, size = "w500") => {
    if (!path) return null;
    return `${TMDB_IMAGE_BASE_URL}/${size}${path}`;
};
