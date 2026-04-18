/* eslint-disable react-refresh/only-export-components */
import {Suspense, lazy} from 'react';
import { createRoot } from 'react-dom/client'
import './App.css'
// @ts-expect-error package has no local type declarations for direct style import
import '@fontsource/nunito'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {store} from "./store/store.ts";
import {Provider} from "react-redux";
import Loading from "./Components/UI/Loading/Loading.tsx";

const Root = lazy(() => import("./routes/root.tsx"));
const FilmDetail = lazy(() => import("./Components/Layout/FilmDetail/FilmDetail.tsx"));

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: {
            main: '#ff6b2c'
        },
        secondary: {
            main: '#8ad4ff'
        },
        background: {
            default: '#07111f',
            paper: 'rgba(10, 20, 35, 0.72)',
        },
        text: {
            primary: '#ffffff',
            secondary: 'rgba(226,234,250,0.66)',
        },
    },
    typography: {
        fontFamily: '"Nunito", sans-serif',
        h5: {
            fontWeight: 700,
        },
        h4: {
            fontWeight: 800,
        },
    },
    shape: {
        borderRadius: 20,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    margin: 0,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    textTransform: 'none',
                    borderRadius: 14,
                    fontWeight: 700,
                },
            },
        },
    },
})

const router = createBrowserRouter([
    {
        path: "/",
        element: (
            <Suspense fallback={<Loading />}>
                <Root />
            </Suspense>
        )
    },
    {
        path: "/movie/:id",
        element: (
            <Suspense fallback={<Loading />}>
                <FilmDetail/>
            </Suspense>
        )
    }
]);

createRoot(document.getElementById('root')!).render(
        <Provider store={store}>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <RouterProvider router={router} />
            </ThemeProvider>
        </Provider>
)
