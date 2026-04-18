import type {MoviesResponse} from "../Types/Types.ts";
import {useSelector} from "react-redux";
import {selectFavoriteIds, selectOnlyFavorites} from "../store/filmsSlice.ts";


const useFilteredFilms = ({data}: {data: MoviesResponse}) => {
    const favoriteIDs: number[] = useSelector(selectFavoriteIds)
    const onlyFavorites = useSelector(selectOnlyFavorites);

    if (!onlyFavorites) return data.results;
    return data.results.filter(film => favoriteIDs.includes(film.id))
};

export default useFilteredFilms;
