import {
    Box,
    Fade,
    Toolbar,
    Typography,
    useMediaQuery,
    useTheme
} from "@mui/material";
import SidebarToggleButton from "./SidebarToggleButton.tsx";
import SidebarFilters from "./SidebarFilters.tsx";
import type {Genre} from "../../../Types/Types.ts";

interface SidebarProps {
    availableGenres: Genre[];
    open: boolean;
    setOpen: (open: boolean) => void;
}

const Sidebar = ({availableGenres, open, setOpen}: SidebarProps) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('lg'));

    return (
        <>
            <Fade in={open && isMobile}>
                <Box
                    onClick={() => setOpen(false)}
                    sx={{
                        display: open && isMobile ? 'block' : 'none',
                        position: 'fixed',
                        inset: 0,
                        zIndex: 1200,
                        background: 'rgba(2, 8, 16, 0.56)',
                        backdropFilter: 'blur(8px)',
                    }}
                />
            </Fade>

            <Box
                className="animate-left"
                sx={{
                    width: {xs: 'calc(100vw - 20px)', sm: 300, xl: 312},
                    maxWidth: '100%',
                    position: {xs: 'fixed', lg: 'sticky'},
                    left: {xs: 10, lg: 0},
                    top: {xs: 82, lg: 88},
                    flexShrink: 0,
                    zIndex: 1250,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1,
                    alignItems: 'stretch',
                }}
            >
                <Box
                    sx={{
                        overflow: 'hidden',
                        maxHeight: open ? {xs: 'calc(100vh - 178px)', lg: 'calc(100vh - 210px)'} : 0,
                        opacity: open ? 1 : 0,
                        pointerEvents: open ? 'auto' : 'none',
                        borderRadius: '10px',
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'linear-gradient(180deg, rgba(13, 25, 42, 0.95), rgba(8, 16, 30, 0.88))',
                        boxShadow: open ? '0 22px 48px rgba(0,0,0,0.24)' : 'none',
                        backdropFilter: 'blur(20px)',
                        transition: 'max-height 320ms cubic-bezier(0.22, 1, 0.36, 1), opacity 220ms ease, box-shadow 220ms ease',
                    }}
                >
                    <Toolbar className="animate-fade" sx={{display: 'flex', alignItems: 'center', minHeight: '52px !important', px: 2}}>
                        <Typography
                            variant="h5"
                            sx={{
                                flexGrow: 1,
                                color: theme.palette.secondary.main,
                                fontFamily: theme.typography.fontFamily,
                                fontSize: 22,
                            }}
                        >
                            Фильтры
                        </Typography>
                    </Toolbar>

                    <SidebarFilters availableGenres={availableGenres}/>
                </Box>

                <SidebarToggleButton open={open} setOpen={setOpen}/>
            </Box>
        </>
    );
};

export default Sidebar;
