import {createSlice} from "@reduxjs/toolkit";
import {CookieService} from "../Utils/Cookie.ts";
import type {RootState} from "./store.ts";

const initialUserState = {
    isLoggedIn: !!CookieService.get("isLoggedIn"),
    userId: CookieService.get("userId") ? Number(CookieService.get("userId")) : null,
    token: CookieService.get("token") ?? '',
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

export const { isLogged_changed, userId_changed, token_added } = usersSlice.actions;
