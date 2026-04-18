import {Badge, Box, Card, CardActionArea, CardMedia, Chip, IconButton, Typography, useTheme} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import BrokenImageRoundedIcon from '@mui/icons-material/BrokenImageRounded';
import {Link as RouterLink} from "react-router-dom";
import {useState} from "react";
import ErrorModal from "../Layout/Modals/ErrorModal.tsx";
import {useDispatch, useSelector} from "react-redux";
import {selectToken, selectUserId} from "../../store/authSlice.ts";
import {selectFavoriteFilms, toggleFavoriteFilm} from "../../store/fetchSlice.ts";
import type {AppDispatch} from "../../store/store.ts";
import {buildTmdbImageUrl, getErrorMessage} from "../../Utils/tmdb.ts";

interface FilmCardProps {
    name: string;
    posterPath: string | null;
    rating: number;
    id: number;
    releaseDate: string;
    index: number;
}

const FilmCard = ({name, rating, posterPath, id, releaseDate, index}: FilmCardProps) => {
    const theme = useTheme();
    const account_id = useSelector(selectUserId);
    const token = useSelector(selectToken);
    const userFavoriteFilms = useSelector(selectFavoriteFilms);
    const isFav = userFavoriteFilms.some(film => film.id === id);
    const dispatch = useDispatch<AppDispatch>();

    const [textModal, setTextModal] = useState<{text: string, status: 'error' | 'success', isOpen: boolean} | null>(null);
    const posterUrl = buildTmdbImageUrl(posterPath, 'w500');
    const releaseYear = releaseDate?.split('-')[0] || 'Без даты';

    const addSavedFilm = async () => {
        try {
            const result = await dispatch(
                toggleFavoriteFilm({ account_id, token, id, isFav })
            ).unwrap();

            setTextModal({
                text: result.message,
                status: "success",
                isOpen: true,
            });
        } catch (error) {
            setTextModal({
                text: getErrorMessage(error),
                status: 'error',
                isOpen: true,
            });
        }
    };

    return (
        <>
            {textModal?.isOpen && <ErrorModal text={textModal.text} status={textModal.status} setTextModal={setTextModal}/>}

            <Card
                className="animate-surface"
                sx={{
                    position: 'relative',
                    overflow: 'hidden',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'linear-gradient(180deg, rgba(15, 26, 44, 0.92), rgba(9, 18, 32, 0.96))',
                    boxShadow: '0 18px 40px rgba(0,0,0,0.22)',
                    animation: `cardEntrance 520ms ease ${Math.min(index * 60, 360)}ms both`,
                    transition: 'transform 220ms ease, box-shadow 220ms ease, border-color 220ms ease',
                    '&:hover': {
                        transform: 'translateY(-6px)',
                        borderColor: 'rgba(255,107,44,0.32)',
                        boxShadow: '0 22px 46px rgba(0,0,0,0.32)',
                    },
                }}
            >
                <CardActionArea component={RouterLink} to={`/movie/${id}`} sx={{height: '100%'}}>
                    <Box sx={{position: 'relative'}}>
                        {posterUrl ? (
                            <CardMedia
                                component="img"
                                src={posterUrl}
                                alt={`Постер фильма ${name}`}
                                sx={{height: 380, objectFit: 'cover'}}
                            />
                        ) : (
                            <Box
                                sx={{
                                    height: 380,
                                    display: 'grid',
                                    placeItems: 'center',
                                    background: 'linear-gradient(180deg, rgba(255,107,44,0.24), rgba(138,212,255,0.12))',
                                }}
                            >
                                <BrokenImageRoundedIcon sx={{fontSize: 52, color: 'rgba(255,255,255,0.82)'}} />
                            </Box>
                        )}

                        <Box
                            sx={{
                                position: 'absolute',
                                inset: 0,
                                background: 'linear-gradient(180deg, rgba(4,10,20,0.02) 28%, rgba(4,10,20,0.78) 100%)',
                            }}
                        />
                    </Box>

                    <Box sx={{display: 'grid', gridTemplateColumns: '1fr auto', gap: 1.1, px: 1.75, py: 1.75}}>
                        <Typography
                            sx={{
                                color: theme.palette.text.primary,
                                fontSize: 17,
                                fontWeight: 800,
                                lineHeight: 1.3,
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                                minHeight: 46,
                                textShadow: '0 1px 0 rgba(0,0,0,0.18)',
                            }}
                        >
                            {name}
                        </Typography>
                        <Box sx={{display: 'grid', justifyItems: 'end', gap: 0.6, flexShrink: 0, gridColumn: 2, gridRow: '1 / span 2'}}>
                            <Chip
                                label={releaseYear}
                                size="small"
                                sx={{
                                    height: 28,
                                    borderRadius: '10px',
                                    background: 'rgba(255,255,255,0.06)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    color: 'rgba(255,255,255,0.88)',
                                    transition: 'transform 180ms ease, background 180ms ease',
                                    '& .MuiChip-label': {
                                        px: 1,
                                        fontWeight: 700,
                                    }
                                }}
                            />
                            <IconButton
                                onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    addSavedFilm();
                                }}
                                size="small"
                                sx={{
                                    width: 32,
                                    height: 32,
                                    borderRadius: '10px',
                                    border: '1px solid rgba(255,255,255,0.12)',
                                    background: 'rgba(255,255,255,0.04)',
                                    transition: 'transform 180ms ease, background 180ms ease, border-color 180ms ease',
                                    '&:hover': {
                                        background: 'rgba(255,107,44,0.18)',
                                        transform: 'translateY(-1px)',
                                        borderColor: 'rgba(255,107,44,0.28)',
                                    },
                                }}
                            >
                                <StarIcon
                                    sx={{
                                        fontSize: 18,
                                        color: isFav ? '#ffb454' : 'rgba(255,255,255,0.68)',
                                        transition: 'color 0.2s, transform 0.2s ease',
                                    }}
                                />
                            </IconButton>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, gridColumn: 1 }}>
                            <Badge
                                variant='dot'
                                sx={{
                                    '& .MuiBadge-badge': {
                                        bgcolor: rating >= 7 ? '#3ddc97' : rating >= 5 ? '#ffb454' : '#ff6b6b',
                                    }
                                }}
                            />
                            <Typography sx={{ color: 'rgba(255,255,255,0.82)', fontSize: 13, fontWeight: 600 }}>
                                Рейтинг {rating}
                            </Typography>
                        </Box>
                    </Box>
                </CardActionArea>
            </Card>
        </>
    );
};

export default FilmCard;
