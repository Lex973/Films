import {createSlice} from "@reduxjs/toolkit";
import {CookieService} from "../Utils/Cookie.ts";
import type {RootState} from "./store.ts";

const FALLBACK_TMDB_TOKEN = "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI1ZTEwZjIyZTk0ZjM4YzkwNGM5ZDExMmUwNDNmNGRmYiIsIm5iZiI6MTc3MjMzMzA1MS4xNzcsInN1YiI6IjY5YTNhN2ZiNDAwZTcxNWZiYmE3OWIwNiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.K1qbhAbhtwhLw6w4AgswKNLNvQAEekwPADw96rSNyMU";
const initialToken = CookieService.get("token") || FALLBACK_TMDB_TOKEN;

const initialUserState = {
    isLoggedIn: !!CookieService.get("isLoggedIn") || Boolean(initialToken),
    userId: CookieService.get("userId") ? Number(CookieService.get("userId")) : null,
    token: initialToken,
}
export const usersSlice = createSlice({
    name: 'User',
    initialState: initialUserState,
    reducers: {
        isLogged_changed: (state, action) => {
            state.isLoggedIn = action.payload; 
        },
        userId_changed: (state, action) => {
            state.userId = action.payload;
        },
        token_added: (state, action) => {
            state.token = action.payload;
        }
    }
})
export const selectUserId = (state: RootState) => state.user.userId;
export const selectToken  = (state: RootState) => state.user.token;
export const selectIsLoggedIn = (state: RootState) => state.user.isLoggedIn;

export const { isLogged_changed, userId_changed, token_added } = usersSlice.actions;
