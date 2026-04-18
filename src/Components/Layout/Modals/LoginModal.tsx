import {Box, Button, Collapse, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, TextField} from "@mui/material";
import {useEffect, useState} from "react";
import CloseIcon from '@mui/icons-material/Close';
import {useDispatch, useSelector} from "react-redux";
import {isLogged_changed, selectToken, token_added, userId_changed} from "../../../store/authSlice.ts";
import {CookieService} from "../../../Utils/Cookie.ts";
import type {AppDispatch} from "../../../store/store.ts";

interface LoginModalProps {
    open: boolean,
    setOpen: (open: boolean) => void,
}

const LoginModal = ({open, setOpen}: LoginModalProps) => {
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [showCodeInput, setShowCodeInput] = useState<boolean>(false);
    const dispatch = useDispatch<AppDispatch>();
    const token = useSelector(selectToken);
    const effectiveToken = code.trim() || token;

    const openShowCodeInput = () => {
        setShowCodeInput(true)
    }
    const closeModal = () => {
        setOpen(false)
        setShowCodeInput(false)
        setEmail('')
        setCode('')
    }
    const setData = async () => {
        closeModal()
        dispatch(token_added(effectiveToken))
        CookieService.set("token", `${effectiveToken}`, 7)
        dispatch(isLogged_changed(true))
        CookieService.set("isLoggedIn", `${true}`, 7);
    }

    useEffect(() => {
        if (!effectiveToken) return;

        const fetchId = async () => {
            const response = await fetch('https://api.themoviedb.org/3/account/account_id', {
                method: 'GET',
                headers: {
                    accept: 'application/json',
                    Authorization: `Bearer ${effectiveToken}`
                }
            })
            const data = await response.json()
            dispatch(userId_changed(data.id))
            CookieService.set("userId", `${data.id}`, 7)
        }
        fetchId()
    }, [dispatch, effectiveToken]);

    return (
        <Dialog open={open} onClose={closeModal} maxWidth='sm' fullWidth slotProps={{
            paper: {
                sx: {
                    backgroundColor: 'rgba(0,0,0,1)',
                    borderRadius: '10px',
                    border: '1px solid rgba(255,255,255,0.08)',
                    animation: 'surfaceReveal 320ms cubic-bezier(0.22, 1, 0.36, 1)',
                }
            }
        }}>
            <Box className="animate-fade" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: '15px'}}>
                <DialogTitle>Запросить токен</DialogTitle>

                <IconButton onClick={closeModal}>
                    <CloseIcon/>
                </IconButton>
            </Box>

            <DialogContent className="animate-rise">
                <TextField
                    sx={{
                        marginTop: 1,
                    }}
                    label='Введите почту'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    variant="outlined"
                    fullWidth
                />
                <Collapse in={showCodeInput} timeout={260}>
                    <TextField
                        sx={{
                            marginTop: 2,
                        }}
                        label='Введите токен'
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        variant="outlined"
                        fullWidth
                    />
                </Collapse>
            </DialogContent>

            <DialogActions className="animate-fade">
                <Button onClick={showCodeInput ? setData : openShowCodeInput}>
                    {showCodeInput ? 'Подтвердить' : 'Запросить'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default LoginModal;
