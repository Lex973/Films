import {createAsyncThunk, createSlice} from "@reduxjs/toolkit";
import type {fetchState, Genre, GenresAction, Movie,} from "../Types/Types.ts";
import {CookieService} from "../Utils/Cookie.ts";
import type {RootState} from "./store.ts";
import {getErrorMessage, tmdbRequest} from "../Utils/tmdb.ts";

interface FetchFavoriteFilms {
    account_id: number | null,
    token: string
}
export const fetchFavoriteFilms = createAsyncThunk<Movie[], FetchFavoriteFilms, { rejectValue: string }>(
    'films/fetchFavoriteFilms',
    async ({account_id, token}: FetchFavoriteFilms, {rejectWithValue}) => {
        if (!account_id || !token) return [];

        try {
            const data = await tmdbRequest<{ results: Movie[] }>(
                `/account/${account_id}/favorite/movies`,
                token,
                {method: 'GET'},
                {
                    language: 'ru-RU',
                    sort_by: 'created_at.desc',
                },
            );
            const ids = data.results.map((film: Movie) => film.id);
            CookieService.set('FavoriteFilmsId', ids.toString(), 7);
            return data.results;
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
)

export const fetchGenres = createAsyncThunk<Genre[], {token: string | null}, { rejectValue: string }>(
    'films/fetchGenres',
    async ({token}: {token: string | null}, {rejectWithValue}) => {
        if (!token) return [];

        try {
            const data = await tmdbRequest<{ genres: Genre[] }>(
                '/genre/movie/list',
                token,
                {method: 'GET'},
                {language: 'ru-RU'},
            );

            return data.genres.map((genre: GenresAction) => {
                const genreFirstSymbol = genre.name[0]?.toUpperCase() ?? '';
                return {
                    id: genre.id,
                    name: `${genreFirstSymbol}${genre.name.slice(1)}`
                };
            });
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
)

interface fetchFavoriteAddProps {
    account_id: number | null,
    token: string,
    id: number,
    isFav: boolean,
}
export const toggleFavoriteFilm = createAsyncThunk<
    { success: boolean; message: string },
    fetchFavoriteAddProps,
    { rejectValue: string }
>(
    'films/toggleFavoriteFilm',
    async ({account_id, token, id, isFav}: fetchFavoriteAddProps, {dispatch, rejectWithValue}) => {
        if (!account_id || !token) {
            return rejectWithValue('Не удалось определить пользователя для работы с избранным.');
        }

        try {
            await tmdbRequest(
                `/account/${account_id}/favorite`,
                token,
                {
                    method: 'POST',
                    body: JSON.stringify({
                    media_type: 'movie',
                    media_id: id,
                    favorite: !isFav,
                    }),
                },
            );
            dispatch(fetchFavoriteFilms({account_id, token}));

            return {
                success: true,
                message: `Фильм ${isFav ? 'удален из избранного' : 'добавлен в избранное'}`,
            };
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
)

interface fetchFilterFilmsProps {
    searchQuery?: string;
    sortBy?: string;
    page: number;
    token: string;
    years?: number[];
    genres?: Genre[];
}
export const fetchFilterFilms = createAsyncThunk<fetchState["films"], fetchFilterFilmsProps, { rejectValue: string }>(
    'films/fetchFilterFilms',
    async ({searchQuery, sortBy, page, token, years, genres}: fetchFilterFilmsProps, {rejectWithValue}) => {
        if (!token) {
            return rejectWithValue('Токен TMDB не найден.');
        }

        const sortByFilter = sortBy === 'Популярности' ? 'popularity.desc' : 'vote_average.desc';
        const normalizedSearchQuery = searchQuery?.trim();

        const params = new URLSearchParams({
            language: 'ru-RU',
            page: `${page}`,
            sort_by: `${sortByFilter}`,
        });

        if (years?.length === 2) {
            const [yearFrom, yearTo] = years;
            params.set(`primary_release_date.gte`, `${yearFrom}-01-01`);
            params.set(`primary_release_date.lte`, `${yearTo}-12-31`);
        }
        if (genres?.length) {
            const genresIDs = genres.map((genre: Genre) => String(genre.id)).join(',')
            params.set('with_genres', `${genresIDs}`)
        }

        try {
            if (normalizedSearchQuery) {
                return await tmdbRequest<fetchState["films"]>(
                    '/search/movie',
                    token,
                    {method: 'GET'},
                    {
                        query: normalizedSearchQuery,
                        language: 'ru-RU',
                        page,
                        include_adult: 'false',
                    },
                );
            }

            return await tmdbRequest<fetchState["films"]>(
                `/discover/movie?${params.toString()}`,
                token,
                {method: 'GET'},
            );
        } catch (error) {
            return rejectWithValue(getErrorMessage(error));
        }
    }
)
export const initialFetchState: fetchState = {
    genres: [],
    films: {
        page: 0,
        results: [],
        total_pages: 0,
        total_results: 0,
    },
    error: null,
    isFilmsLoading: false,
    isGenresLoading: false,
    isFavoriteLoading: false,
    isFavoriteAddLoading: false,
    favoriteFilms: [],
};
export const fetchSlice = createSlice({
    name: 'fetchFilterFilms',
    initialState: initialFetchState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFilterFilms.pending, (state) => {
                state.isFilmsLoading = true;
                state.error = null;
            })
            .addCase(fetchFilterFilms.fulfilled, (state, action) => {
                state.isFilmsLoading = false;
                state.films = action.payload;
            })
            .addCase(fetchFilterFilms.rejected, (state, action) => {
                state.isFilmsLoading = false;
                state.error = action.payload as string ?? action.error.message ?? null;
            })

            .addCase(fetchFavoriteFilms.pending, (state) => {
                state.isFavoriteLoading = true;
                state.error = null;
            })
            .addCase(fetchFavoriteFilms.fulfilled, (state, action) => {
                state.isFavoriteLoading = false;
                state.favoriteFilms = action.payload ?? [];
            })
            .addCase(fetchFavoriteFilms.rejected, (state, action) => {
                state.isFavoriteLoading = false;
                state.error = action.payload as string ?? action.error.message ?? null;
            })

            .addCase(fetchGenres.pending, (state) => {
                state.isGenresLoading = true;
                state.error = null;
            })
            .addCase(fetchGenres.fulfilled, (state, action) => {
                state.isGenresLoading = false;
                state.genres = action.payload ?? [];
            })
            .addCase(fetchGenres.rejected, (state, action) => {
                state.isGenresLoading = false;
                state.error = action.payload as string ?? action.error.message ?? null;
            })

            .addCase(toggleFavoriteFilm.pending, (state) => {
                state.isFavoriteAddLoading = true;
            })
            .addCase(toggleFavoriteFilm.fulfilled, (state) => {
                state.isFavoriteAddLoading = false;
            })
            .addCase(toggleFavoriteFilm.rejected, (state, action) => {
                state.isFavoriteAddLoading = false;
                state.error = action.payload as string ?? action.error.message ?? null;
            })
    }
})
export const selectFilms = (state: RootState) => state.fetchFilms.films;
export const selectIsFilmsLoading = (state: RootState) => state.fetchFilms.isFilmsLoading;
export const selectFavoriteFilms = (state: RootState) => state.fetchFilms.favoriteFilms;
export const selectIsGenresLoading = (state: RootState)=> state.fetchFilms.isGenresLoading;
export const selectAvailableGenres = (state: RootState) => state.fetchFilms.genres;
export const selectFetchError = (state: RootState) => state.fetchFilms.error;
