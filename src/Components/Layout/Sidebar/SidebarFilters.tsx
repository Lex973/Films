import {
    Autocomplete,
    Box,
    Button,
    Checkbox,
    FormControl,
    FormControlLabel,
    InputLabel,
    MenuItem,
    Select,
    Slider,
    Switch,
    TextField,
    Typography
} from "@mui/material";
import {type ChangeEvent, useEffect, useMemo, useState} from "react";
import type {Genre} from "../../../Types/Types.ts";
import {CookieService} from "../../../Utils/Cookie.ts";
import {useDispatch, useSelector} from "react-redux";
import {
    favorite_changed,
    favorite_filter_toggled,
    filters_reset,
    genres_added,
    page_changed,
    selectGenres,
    selectOnlyFavorites,
    selectSortBy,
    selectYear,
    sort_changed,
    year_changed,
} from "../../../store/filmsSlice.ts";
import type {AppDispatch} from "../../../store/store.ts";

interface SidebarFiltersProps {
    availableGenres: Genre[];
}

const SidebarFilters = ({ availableGenres }: SidebarFiltersProps) => {
    const dispatch = useDispatch<AppDispatch>();
    const sortBy = useSelector(selectSortBy);
    const filterGenres = useSelector(selectGenres);
    const year = useSelector(selectYear);
    const onlyFavorites = useSelector(selectOnlyFavorites);
    const currentYear = new Date().getFullYear();

    const [localYear, setLocalYear] = useState<number[]>(year);

    useEffect(() => {
        setLocalYear(year);
    }, [year]);

    const hasYearChanges = useMemo(
        () => localYear[0] !== year[0] || localYear[1] !== year[1],
        [localYear, year],
    );

    const handleFavoriteToggle = (e: ChangeEvent<HTMLInputElement>) => {
        const checked = e.target.checked;
        dispatch(favorite_filter_toggled(checked));

        if (!checked) {
            dispatch(favorite_changed([]));
            return;
        }

        const favoriteIDs = CookieService.get("FavoriteFilmsId")?.split(',');
        if (!favoriteIDs?.length) {
            dispatch(favorite_changed([]));
            return;
        }

        dispatch(favorite_changed(favoriteIDs.map((id) => Number(id))));
    };

    return (
        <Box
            sx={{
                p: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 3,
                maxHeight: '100%',
                minWidth: 0,
                overflowY: 'auto',
                overflowX: 'hidden',
                '& > *': {
                    minWidth: 0,
                },
            }}
        >
            <Box sx={{display: 'grid', gap: 0.8}}>
                <Typography sx={{fontSize: 13, textTransform: 'uppercase', letterSpacing: 1.8, color: 'text.secondary'}}>
                    Быстрые настройки
                </Typography>
                <Typography sx={{fontSize: 14, lineHeight: 1.55, color: 'text.secondary'}}>
                    Настройте выдачу по рейтингу, году, жанрам и избранному.
                </Typography>
            </Box>

            <FormControl className="animate-rise" variant="standard" sx={{animationDelay: '40ms'}}>
                <InputLabel>Сортировать по</InputLabel>

                <Select
                    label="Сортировать по"
                    MenuProps={{
                        PaperProps: {
                            sx: {
                                backdropFilter: 'blur(12px)',
                                borderRadius: '10px',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }
                        }
                    }}
                    defaultValue="Популярности"
                    value={sortBy}
                    onChange={(e) => {
                        dispatch(page_changed(1));
                        dispatch(sort_changed(e.target.value));
                    }}
                >
                    <MenuItem value="Популярности">Популярности</MenuItem>
                    <MenuItem value="Рейтингу">Рейтингу</MenuItem>
                </Select>
            </FormControl>

            <Box className="animate-rise" sx={{animationDelay: '90ms'}}>
                <Box sx={{display: 'flex', justifyContent: 'space-between', gap: 2, alignItems: 'center', mb: 1}}>
                    <Typography color='textPrimary'>Год релиза</Typography>
                    <Typography sx={{fontSize: 13, color: 'text.secondary'}}>
                        {localYear[0]} - {localYear[1]}
                    </Typography>
                </Box>

                <Slider
                    value={localYear}
                    valueLabelDisplay="off"
                    onChange={(_, newValue) => setLocalYear(newValue as number[])}
                    min={1900}
                    max={currentYear}
                    sx={{
                        mx: 1,
                        width: 'calc(100% - 16px)',
                        '& .MuiSlider-thumb': {
                            boxShadow: '0 0 0 8px rgba(255,107,44,0.12)',
                        },
                    }}
                />

                <Button
                    variant="contained"
                    fullWidth
                    disabled={!hasYearChanges}
                    onClick={() => {
                        dispatch(page_changed(1));
                        dispatch(year_changed(localYear));
                    }}
                >
                    Применить диапазон
                </Button>
            </Box>

            <FormControl className="animate-rise" sx={{animationDelay: '140ms'}}>
                <Typography color='textPrimary' sx={{mb: 1.2}}>
                    Жанры
                </Typography>
                <Autocomplete
                    sx={{
                        minWidth: 0,
                        width: '100%',
                    }}
                    slotProps={{
                        paper: {
                            sx: {
                                backdropFilter: 'blur(12px)',
                                borderRadius: '10px',
                                border: '1px solid rgba(255,255,255,0.08)',
                            }
                        }
                    }}
                    limitTags={2}
                    multiple
                    options={availableGenres}
                    getOptionLabel={(option) => option.name}
                    value={filterGenres}
                    onChange={(_, value) => {
                        dispatch(page_changed(1));
                        dispatch(genres_added(value));
                    }}
                    disableCloseOnSelect
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    renderInput={(params) => <TextField variant='standard' {...params} label='Выберите жанры'/>}
                    renderOption={(props, option, { selected }) => (
                        <li {...props} key={option.id}>
                            <Checkbox checked={selected}/>
                            {option.name}
                        </li>
                    )}
                />
            </FormControl>

            <Box
                className="animate-rise"
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    p: 1.2,
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    background: 'rgba(255,255,255,0.03)',
                    animationDelay: '190ms',
                }}
            >
                <FormControlLabel
                    control={<Switch checked={onlyFavorites} onChange={handleFavoriteToggle}/>}
                    label="Только избранные"
                    sx={{
                        m: 0,
                        '& .MuiFormControlLabel-label': {
                            fontSize: '0.875rem',
                            color: 'text.secondary',
                        }
                    }}
                />
            </Box>

            <Box className="animate-rise" sx={{ mt: 'auto', display: 'flex', gap: 1, animationDelay: '240ms' }}>
                <Button
                    variant="outlined"
                    fullWidth
                    onClick={() => {
                        dispatch(filters_reset());
                        dispatch(page_changed(1));
                        setLocalYear([1930, currentYear]);
                    }}
                >
                    Сбросить фильтры
                </Button>
            </Box>
        </Box>
    );
};

export default SidebarFilters;
