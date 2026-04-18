import {createSlice} from "@reduxjs/toolkit";
import type {RootState} from "./store.ts";

const currentYear = new Date().getFullYear();

export const initialFilmsState = {
    sortBy: 'Популярности',
    year: [1930, currentYear],
    genres: [],
    page: 1,
    favoriteIDs: [],
    onlyFavorites: false,
    searchQuery: '',
};
export const filmsSlice = createSlice({
    name: 'films',
    initialState: initialFilmsState,
    reducers: {
        sort_changed: (state, action) => {
            state.sortBy = action.payload;
        },
        year_changed: (state, action) => {
            state.year = action.payload;
        },
        genres_added: (state, action) => {
            state.genres = action.payload;
        },
        favorite_changed: (state, action) => {
            state.favoriteIDs = action.payload;
        },
        favorite_filter_toggled: (state, action) => {
            state.onlyFavorites = action.payload;
        },
        search_changed: (state, action) => {
            state.searchQuery = action.payload;
        },
        filters_reset: () => {
            return initialFilmsState;
        },
        page_changed: (state, action) => {
            state.page = action.payload;
        }
    }
})

export const { sort_changed, year_changed, genres_added, favorite_changed, favorite_filter_toggled, search_changed, filters_reset, page_changed, } = filmsSlice.actions

export const selectFavoriteIds = (state: RootState) => state.films.favoriteIDs;
export const selectOnlyFavorites = (state: RootState) => state.films.onlyFavorites;
export const selectSearchQuery = (state: RootState) => state.films.searchQuery;
export const selectSortBy = (state: RootState) => state.films.sortBy;
export const selectGenres = (state: RootState) => state.films.genres;
export const selectPage = (state: RootState) => state.films.page;
export const selectYear = (state: RootState) => state.films.year;
