import {IconButton, Typography} from "@mui/material";
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';
import ChevronLeftRoundedIcon from '@mui/icons-material/ChevronLeftRounded';

interface ToggleButtonProps {
    open: boolean;
    setOpen: (open: boolean) => void;
}

const SidebarToggleButton = ({open, setOpen}: ToggleButtonProps) => {
    return (
        <IconButton
            onClick={() => setOpen(!open)}
            sx={{
                px: 1.25,
                py: 0.95,
                width: '100%',
                justifyContent: 'space-between',
                borderRadius: '10px',
                display: 'flex',
                gap: 0.8,
                alignItems: 'center',
                color: 'text.primary',
                background: 'rgba(14, 24, 40, 0.92)',
                boxShadow: '0 12px 30px rgba(4, 10, 20, 0.18)',
                border: '1px solid rgba(255,255,255,0.12)',
                '&:hover': {
                    background: 'rgba(20, 32, 52, 0.96)',
                },
                transition: 'background 180ms ease',
            }}
        >
            <TuneRoundedIcon sx={{fontSize: 18, color: 'primary.main'}} />
            <Typography sx={{fontSize: 12, fontWeight: 800, flex: 1, textAlign: 'left'}}>
                {open ? 'Скрыть фильтры' : 'Показать фильтры'}
            </Typography>
            <ChevronLeftRoundedIcon
                sx={{
                    fontSize: 18,
                    transform: `rotate(${open ? '-90deg' : '90deg'})`,
                    transition: 'transform 220ms ease',
                }}
            />
        </IconButton>
    );
};

export default SidebarToggleButton;
