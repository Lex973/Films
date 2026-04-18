import {Box} from "@mui/material";
import Pagination from "@mui/material/Pagination";
import type {MoviesResponse} from "../../../Types/Types.ts";
import {useDispatch } from "react-redux";
import {page_changed } from "../../../store/filmsSlice.ts";
import type {AppDispatch} from "../../../store/store.ts";

const FilmsPagination = ({data, page}: {data: MoviesResponse, page: number}) => {
    const dispatch = useDispatch<AppDispatch>();
    const totalPages = Math.min(data.total_pages, 500);

    if (totalPages <= 1) return null;

    return (
        <Box className="animate-rise" sx={{display: "flex", justifyContent: "center", marginY: 4, px: 1, animationDelay: '180ms'}} >
            <Pagination
                size="large"
                count={totalPages}
                color="primary"
                page={page}
                variant="outlined"
                shape="rounded"
                siblingCount={0}
                boundaryCount={1}
                sx={{
                    '& .MuiPaginationItem-root': {
                        borderColor: 'rgba(255,255,255,0.1)',
                        background: 'rgba(255,255,255,0.03)',
                    },
                }}
                onChange={(_, page) => {
                    dispatch(page_changed(page))
                }}
            />
        </Box>
    );
};

export default FilmsPagination;
