import Header from "./Components/Layout/Header/Header.tsx";
import Sidebar from "./Components/Layout/Sidebar/Sidebar.tsx";
import Films from "./Components/Layout/Films/Films.tsx";
import Loading from "./Components/UI/Loading/Loading.tsx";
import {useEffect, useState} from "react";
import {Alert, Box, Fade} from "@mui/material";
import LoginModal from "./Components/Layout/Modals/LoginModal.tsx";
import {useDispatch, useSelector} from "react-redux";
import {
    selectGenres,
    selectPage,
    selectSearchQuery,
    selectSortBy, selectYear
} from "./store/filmsSlice.ts";
import {selectToken} from "./store/authSlice.ts";
import type {AppDispatch} from "./store/store.ts";
import {
    fetchFilterFilms,
    fetchGenres,
    selectAvailableGenres,
    selectFetchError,
    selectFilms,
    selectIsFilmsLoading,
    selectIsGenresLoading
} from "./store/fetchSlice.ts";


const App = () => {
    const token = useSelector(selectToken);
    const searchQuery = useSelector(selectSearchQuery);
    const sortBy = useSelector(selectSortBy);
    const films = useSelector(selectFilms);
    const isFilmsLoading = useSelector(selectIsFilmsLoading);
    const isGenresLoading = useSelector(selectIsGenresLoading);
    const page = useSelector(selectPage);
    const availableGenres = useSelector(selectAvailableGenres);
    const years = useSelector(selectYear);
    const genres = useSelector(selectGenres);
    const fetchError = useSelector(selectFetchError);

    const dispatch = useDispatch<AppDispatch>();

    const [open, setOpen] = useState(true);

    useEffect(() => {
        if (!token) return;
        dispatch(fetchGenres({token}));
    }, [dispatch, token]);

    useEffect(() => {
        if (!token) return;
        dispatch(fetchFilterFilms({page, token, sortBy, searchQuery, years, genres}));
    }, [dispatch, page, sortBy, searchQuery, token, genres, years]);

    if (!token) return <LoginModal open={true} setOpen={() => {}} />;

    return (
        <Box sx={{minHeight: '100vh'}}>
            <Header/>
            <Box sx={{px: {xs: 1, md: 1.25, lg: 0}, pb: 4}}>
                <Fade in={Boolean(fetchError)}>
                    <Box sx={{pt: 2}}>
                        {fetchError && (
                            <Alert
                                severity="error"
                                sx={{
                                    borderRadius: '10px',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    backdropFilter: 'blur(14px)',
                                    background: 'rgba(128, 26, 26, 0.22)',
                                }}
                            >
                                {fetchError}
                            </Alert>
                        )}
                    </Box>
                </Fade>

                <Box sx={{display: 'flex', alignItems: 'flex-start', gap: {xs: 0, lg: 2}, pt: 2}}>
                    <Sidebar availableGenres={availableGenres} open={open} setOpen={setOpen} />
                    {isFilmsLoading || isGenresLoading
                        ? <Loading />
                        : <Films data={films} page={page}/>
                    }
                </Box>
            </Box>
        </Box>
    );
};

export default App;
