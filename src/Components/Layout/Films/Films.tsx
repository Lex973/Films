import FilmCard from "../../UI/FilmCard.tsx";
import {Box, Chip, Typography} from "@mui/material";
import type {MoviesResponse} from "../../../Types/Types.ts";
import FilmsPagination from "../Pagination/Pagination.tsx";
import useFilteredFilms from "../../../Hooks/useFilteredFilms.ts";
import {useDispatch, useSelector} from "react-redux";
import {useEffect} from "react";
import {selectToken, selectUserId} from "../../../store/authSlice.ts";
import type {AppDispatch} from "../../../store/store.ts";
import {fetchFavoriteFilms} from "../../../store/fetchSlice.ts";

interface FilmsProps {
    data: MoviesResponse,
    page: number,
}
const Films = ({data, page}: FilmsProps) => {
    const favoriteFilms = useFilteredFilms({data});
    const dispatch = useDispatch<AppDispatch>();
    const token = useSelector(selectToken);
    const account_id = useSelector(selectUserId);

    useEffect(() => {
        if (!token || !account_id) return;
        dispatch(fetchFavoriteFilms({token, account_id}));
    }, [account_id, dispatch, token]);

    if (!favoriteFilms) return null;
    const filteredFilms = favoriteFilms.map((film, index) => {
        const rating = film.vote_average.toFixed(1);
        return (
            <FilmCard
                id={film.id}
                name={film.title}
                rating={Number(rating)}
                posterPath={film.poster_path}
                releaseDate={film.release_date}
                key={film.id}
                index={index}
            />
        );
    });

    return (
        <Box className="animate-fade" sx={{display: 'flex', flexDirection: 'column', flex: 1, minWidth: 0}}>
            {favoriteFilms.length === 0
                ? <Box
                    className="animate-surface"
                    sx={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flex: 1,
                        minHeight: 'calc(100vh - 240px)',
                        px: 2,
                    }}
                >
                        <Box
                            sx={{
                                maxWidth: 520,
                                textAlign: 'center',
                                p: {xs: 3, md: 5},
                                borderRadius: 6,
                                border: '1px solid rgba(255,255,255,0.08)',
                                background: 'linear-gradient(180deg, rgba(11, 22, 39, 0.85), rgba(7, 15, 28, 0.82))',
                                boxShadow: '0 20px 48px rgba(0,0,0,0.2)',
                            }}
                        >
                            <Typography variant="h4" color="text.primary" sx={{mb: 1.2}}>
                                Ничего не найдено
                            </Typography>
                            <Typography color="text.secondary" sx={{lineHeight: 1.7}}>
                                Попробуйте очистить часть фильтров, расширить диапазон лет или изменить поисковый запрос.
                            </Typography>
                        </Box>
                    </Box>
                : <Box sx={{display: 'grid', gap: 2}}>
                    <Box
                        sx={{
                            px: {xs: 0.5, md: 0},
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: {xs: 'flex-start', md: 'center'},
                            gap: 1.5,
                            flexWrap: 'wrap',
                        }}
                    >
                        <Box className="animate-rise">
                            <Typography variant="h4" sx={{fontSize: {xs: 28, md: 34}, mb: 0.4}}>
                                Подборка фильмов
                            </Typography>
                            <Typography color="text.secondary">
                                Страница {page} из {Math.max(data.total_pages, 1)}. Найдено {favoriteFilms.length} фильмов на текущем экране.
                            </Typography>
                        </Box>
                        <Chip
                            className="animate-rise"
                            label={`${data.total_results} результатов`}
                            sx={{
                                height: 36,
                                borderRadius: 99,
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }}
                        />
                    </Box>

                    <Box className="animate-fade" sx={{
                        width: '100%',
                        pt: 1,
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 260px), 1fr))',
                        gap: {xs: 2, lg: 2.5},
                        alignContent: 'start',
                    }}>
                        {filteredFilms}
                    </Box>

                    <FilmsPagination data={data} page={page}/>
                </Box>
            }
        </Box>
    );
};

export default Films;
