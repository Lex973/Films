import {AppBar, Toolbar, Typography, IconButton, useTheme, Box, InputAdornment, TextField} from '@mui/material'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
import {useEffect, useState} from "react";
import LoginModal from "../Modals/LoginModal.tsx";
import SearchIcon from '@mui/icons-material/Search';
import {page_changed, search_changed, selectSearchQuery} from "../../../store/filmsSlice.ts";
import {useDispatch, useSelector} from "react-redux";
import useDebounce from "../../../Hooks/useDebounce.ts";
import type {AppDispatch} from "../../../store/store.ts";

const Header = () => {
    const theme = useTheme();
    const [openModal, setOpenModal] = useState(false);
    const dispatch = useDispatch<AppDispatch>();
    const searchQuery = useSelector(selectSearchQuery);

    const [localValue, setLocalValue] = useState(searchQuery);
    const debouncedValue = useDebounce(localValue, 300);

    useEffect(() => {
        dispatch(page_changed(1));
        dispatch(search_changed(debouncedValue.trim()));
    }, [debouncedValue, dispatch]);

    useEffect(() => {
        setLocalValue(searchQuery);
    }, [searchQuery]);

    return (
        <AppBar
            position='sticky'
            elevation={0}
            className="animate-fade"
            sx={{
                background: 'linear-gradient(135deg, rgba(10,20,35,0.88), rgba(8,14,28,0.72))',
                borderBottom: '1px solid rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 18px 40px rgba(0, 0, 0, 0.24)',
            }}
        >
            <Toolbar sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, py: 1.2, flexWrap: {xs: 'wrap', md: 'nowrap'}}}>
                <Box className="animate-left" sx={{display: 'flex', alignItems: 'center', gap: 2, minWidth: 0, flex: {xs: '1 1 100%', md: '0 0 auto'}}}>
                    <Box
                        sx={{
                            width: 44,
                            height: 44,
                            borderRadius: '16px',
                            background: 'linear-gradient(135deg, rgba(255,107,44,0.95), rgba(138,212,255,0.72))',
                            boxShadow: '0 14px 30px rgba(255,107,44,0.28)',
                        }}
                    />
                    <Box sx={{minWidth: 0}}>
                        <Typography variant="h5" sx={{color: theme.palette.primary.main, lineHeight: 1}}>
                            Кинопоиск
                        </Typography>
                        <Typography sx={{color: 'text.secondary', fontSize: 13, mt: 0.3}}>
                            Каталог фильмов с быстрым поиском и детальными карточками
                        </Typography>
                    </Box>
                </Box>

                <Box className="animate-rise" sx={{display: 'flex', gap: 1.5, alignItems: 'center', flex: 1, justifyContent: 'flex-end', width: '100%'}}>
                    <TextField
                        placeholder="Название фильма или ключевое слово"
                        size="small"
                        value={localValue}
                        onChange={(e) => {
                            setLocalValue(e.target.value);
                        }}
                        sx={{
                            width: '100%',
                            maxWidth: 520,
                            '& .MuiOutlinedInput-root': {
                                borderRadius: 99,
                                background: 'rgba(255,255,255,0.04)',
                                transition: 'transform 180ms ease, box-shadow 180ms ease',
                                '&:hover': {
                                    transform: 'translateY(-1px)',
                                },
                                '&.Mui-focused': {
                                    boxShadow: '0 0 0 4px rgba(255,107,44,0.12)',
                                },
                            },
                        }}
                        slotProps={{
                            input: {
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon sx={{color: 'text.secondary'}} />
                                    </InputAdornment>
                                )
                            }
                        }}
                    />

                    <IconButton
                        color='inherit'
                        sx={{
                            border: '1px solid rgba(255,255,255,0.1)',
                            background: 'rgba(255,255,255,0.04)',
                            transition: 'transform 180ms ease, border-color 180ms ease, color 180ms ease',
                            '&:hover': {
                                color: theme.palette.primary.main,
                                borderColor: 'rgba(255,107,44,0.35)',
                                backgroundColor: 'rgba(255,107,44,0.08)',
                                transform: 'translateY(-1px)',
                            }
                        }}
                        onClick={() => setOpenModal(true)}
                    >
                        <AccountCircleIcon sx={{ fontSize: 32 }}/>
                    </IconButton>
                </Box>
            </Toolbar>

            {openModal && <LoginModal open={openModal} setOpen={setOpenModal}/>}
        </AppBar>
    );
};

export default Header;
