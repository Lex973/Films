import {filmsSlice} from "./filmsSlice.ts";
import {configureStore} from "@reduxjs/toolkit";
import {usersSlice} from "./authSlice.ts";
import {fetchSlice} from "./fetchSlice.ts";

export const store = configureStore({
    reducer: {
        films: filmsSlice.reducer,
        fetchFilms: fetchSlice.reducer,
        user: usersSlice.reducer
    }
})
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
