import {
    Alert,
    Box,
    Chip,
    Divider,
    IconButton,
    Skeleton,
    Typography,
    useTheme,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import StarIcon from '@mui/icons-material/Star';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PublicRoundedIcon from '@mui/icons-material/PublicRounded';
import SavingsRoundedIcon from '@mui/icons-material/SavingsRounded';
import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import type {FilmDetailResponse} from "../../../Types/Types.ts";
import {useSelector} from "react-redux";
import {selectToken} from "../../../store/authSlice.ts";
import {buildTmdbImageUrl, getErrorMessage, tmdbRequest} from "../../../Utils/tmdb.ts";

const fallbackDescription = "Описание фильма пока недоступно на выбранном языке.";

const formatRuntime = (time: number | undefined) => {
    if (!time) return "Нет данных";
    const h = Math.floor(time / 60);
    const m = time % 60;
    return `${h}ч ${m}мин`;
};

const formatMoney = (value: number) => {
    if (!value) return "Нет данных";
    return new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
    }).format(value);
};

const FilmDetail = () => {
    const theme = useTheme();
    const { id } = useParams();
    const [filmDetail, setFilmDetail] = useState<FilmDetailResponse>();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const token = useSelector(selectToken);

    useEffect(() => {
        if (!id || !token) return;

        const fetchFilmsDetail = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const data = await tmdbRequest<FilmDetailResponse>(
                    `/movie/${id}`,
                    token,
                    {method: 'GET'},
                    {language: 'ru-RU'},
                );
                setFilmDetail(data);
            } catch (fetchError) {
                setError(getErrorMessage(fetchError));
            } finally {
                setIsLoading(false);
            }
        };

        fetchFilmsDetail();
    }, [id, token]);

    const backdropUrl = buildTmdbImageUrl(filmDetail?.backdrop_path ?? filmDetail?.poster_path, 'original');
    const posterUrl = buildTmdbImageUrl(filmDetail?.poster_path, 'w500');
    const releaseYear = filmDetail?.release_date?.split('-')[0] || 'Нет данных';

    return (
        <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', position: 'relative', overflow: 'hidden' }}>
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    backgroundImage: backdropUrl ? `url(${backdropUrl})` : undefined,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center top',
                    opacity: backdropUrl ? 0.24 : 1,
                    zIndex: 0,
                    backgroundColor: '#07111f',
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(180deg, rgba(7,17,31,0.22) 0%, rgba(7,17,31,0.76) 40%, rgba(7,17,31,1) 100%)',
                    zIndex: 1,
                }}
            />

            <Box
                sx={{
                    position: 'relative',
                    zIndex: 2,
                    maxWidth: 1220,
                    mx: 'auto',
                    px: { xs: 2, md: 4 },
                    py: {xs: 3, md: 4},
                    animation: 'detailEntrance 520ms ease',
                }}
            >
                <Link to={'/'}>
                    <IconButton
                        className="animate-left"
                        sx={{
                            mb: 4,
                            color: 'text.secondary',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 99,
                            px: 2,
                            gap: 1,
                            '&:hover': {
                                borderColor: theme.palette.primary.main,
                                color: theme.palette.primary.main,
                                bgcolor: 'rgba(255,107,44,0.08)',
                            },
                        }}
                    >
                        <ArrowBackIcon fontSize="small" />
                        <Typography fontSize={13} fontWeight={700}>К каталогу</Typography>
                    </IconButton>
                </Link>

                {isLoading ? (
                    <Box className="animate-fade" sx={{display: 'grid', gridTemplateColumns: {xs: '1fr', md: '320px 1fr'}, gap: 4}}>
                        <Skeleton variant="rounded" sx={{height: 460, borderRadius: 6}} />
                        <Box sx={{display: 'grid', gap: 2}}>
                            <Skeleton variant="text" sx={{fontSize: 48, width: '60%'}} />
                            <Skeleton variant="text" sx={{fontSize: 22, width: '35%'}} />
                            <Skeleton variant="rounded" sx={{height: 46, width: '72%'}} />
                            <Skeleton variant="rounded" sx={{height: 160, borderRadius: 5}} />
                            <Skeleton variant="rounded" sx={{height: 200, borderRadius: 5}} />
                        </Box>
                    </Box>
                ) : error ? (
                    <Alert
                        className="animate-surface"
                        severity="error"
                        sx={{
                            borderRadius: 4,
                            border: '1px solid rgba(255,255,255,0.08)',
                            background: 'rgba(128, 26, 26, 0.18)',
                        }}
                    >
                        {error}
                    </Alert>
                ) : filmDetail && (
                    <Box sx={{ display: 'flex', gap: { xs: 3, md: 5 }, flexDirection: { xs: 'column', md: 'row' } }}>
                        <Box className="animate-left" sx={{ flexShrink: 0, width: {xs: '100%', md: 320} }}>
                            <Box
                                sx={{
                                    width: '100%',
                                    minHeight: 470,
                                    borderRadius: 6,
                                    overflow: 'hidden',
                                    background: 'linear-gradient(180deg, rgba(255,107,44,0.18), rgba(138,212,255,0.12))',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    boxShadow: '0 24px 60px rgba(0,0,0,0.34)',
                                }}
                            >
                                {posterUrl ? (
                                    <Box
                                        component="img"
                                        src={posterUrl}
                                        alt={`Постер фильма ${filmDetail.title}`}
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            minHeight: 470,
                                            objectFit: 'cover',
                                            display: 'block',
                                        }}
                                    />
                                ) : (
                                    <Box sx={{display: 'grid', placeItems: 'center', minHeight: 470, px: 3}}>
                                        <Typography sx={{fontSize: 22, fontWeight: 800, textAlign: 'center'}}>
                                            Постер недоступен
                                        </Typography>
                                    </Box>
                                )}
                            </Box>

                            <Box
                                sx={{
                                    mt: 2,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    gap: 1,
                                    bgcolor: 'rgba(255,255,255,0.04)',
                                    borderRadius: 4,
                                    px: 2,
                                    py: 1.6,
                                    border: '1px solid rgba(255,255,255,0.08)',
                                }}
                            >
                                <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                    <StarIcon sx={{ color: '#ffb454', fontSize: 20 }} />
                                    <Typography fontWeight={800} fontSize={18} sx={{ color: '#ffb454' }}>
                                        {filmDetail.vote_average.toFixed(1)}
                                    </Typography>
                                </Box>
                                <Typography fontSize={12} color="text.secondary">
                                    {filmDetail.vote_count} оценок
                                </Typography>
                            </Box>
                        </Box>

                        <Box className="animate-rise" sx={{ flex: 1, minWidth: 0, animationDelay: '80ms' }}>
                            <Box sx={{display: 'grid', gap: 1.2, mb: 3}}>
                                <Typography variant="h4" sx={{ lineHeight: 1.1, color: 'text.primary'}}>
                                    {filmDetail.title}
                                </Typography>
                                <Typography color="text.secondary" fontSize={16}>
                                    {filmDetail.original_title}
                                </Typography>
                                {filmDetail.tagline && (
                                    <Typography
                                        sx={{
                                            fontStyle: 'italic',
                                            color: theme.palette.primary.main,
                                            fontSize: 15,
                                            opacity: 0.92,
                                        }}
                                    >
                                        {filmDetail.tagline}
                                    </Typography>
                                )}
                            </Box>

                            <Box className="animate-fade" sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2.5, animationDelay: '120ms' }}>
                                {filmDetail.genres.map((genre) => (
                                    <Chip
                                        key={genre.id}
                                        label={genre.name}
                                        size="small"
                                        sx={{
                                            bgcolor: 'rgba(255,107,44,0.1)',
                                            color: theme.palette.primary.main,
                                            border: '1px solid rgba(255,107,44,0.22)',
                                            fontWeight: 700,
                                            fontSize: 12,
                                            borderRadius: 99,
                                        }}
                                    />
                                ))}
                            </Box>

                            <Box className="animate-fade" sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap', animationDelay: '160ms' }}>
                                {[
                                    { icon: <CalendarTodayIcon sx={{ fontSize: 14 }} />, value: releaseYear },
                                    { icon: <AccessTimeIcon sx={{ fontSize: 14 }} />, value: formatRuntime(filmDetail.runtime) },
                                    {
                                        icon: <PublicRoundedIcon sx={{ fontSize: 14 }} />,
                                        value: filmDetail.production_countries?.map(country => country.name).join(', ') || 'Нет данных'
                                    },
                                ].map(({ icon, value }) => (
                                    <Box
                                        key={value}
                                        sx={{
                                            display: 'inline-flex',
                                            alignItems: 'center',
                                            gap: 0.8,
                                            px: 1.4,
                                            py: 1,
                                            borderRadius: 99,
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            background: 'rgba(255,255,255,0.04)',
                                            color: 'text.secondary',
                                        }}
                                    >
                                        {icon}
                                        <Typography fontSize={13}>{value}</Typography>
                                    </Box>
                                ))}
                            </Box>

                            <Typography
                                fontSize={16}
                                lineHeight={1.85}
                                color="text.primary"
                                sx={{ mb: 3.5, maxWidth: 860, opacity: 0.86 }}
                            >
                                {filmDetail.overview || fallbackDescription}
                            </Typography>

                            <Divider sx={{ borderColor: 'rgba(255,255,255,0.08)', mb: 2.5 }} />

                            <Box
                                className="animate-fade"
                                sx={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                                    gap: 1.5,
                                    animationDelay: '220ms',
                                }}
                            >
                                {[
                                    { label: 'Статус', value: filmDetail.status || 'Нет данных', icon: <PublicRoundedIcon sx={{fontSize: 18}} /> },
                                    { label: 'Бюджет', value: formatMoney(filmDetail.budget), icon: <SavingsRoundedIcon sx={{fontSize: 18}} /> },
                                    { label: 'Сборы', value: formatMoney(filmDetail.revenue), icon: <SavingsRoundedIcon sx={{fontSize: 18}} /> },
                                    { label: 'Год релиза', value: releaseYear, icon: <CalendarTodayIcon sx={{fontSize: 18}} /> },
                                ].map(({ label, value, icon }) => (
                                    <Box
                                        key={label}
                                        sx={{
                                            bgcolor: 'rgba(255,255,255,0.03)',
                                            border: '1px solid rgba(255,255,255,0.08)',
                                            borderRadius: 4,
                                            px: 2,
                                            py: 1.8,
                                            minHeight: 114,
                                            display: 'grid',
                                            alignContent: 'space-between',
                                        }}
                                    >
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 1, color: 'text.secondary', mb: 1.6}}>
                                            {icon}
                                            <Typography fontSize={11} fontWeight={800} textTransform="uppercase" letterSpacing={1.1}>
                                                {label}
                                            </Typography>
                                        </Box>
                                        <Typography fontSize={16} fontWeight={800} color="text.primary">
                                            {value}
                                        </Typography>
                                    </Box>
                                ))}
                            </Box>
                        </Box>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default FilmDetail;
