export type Genre = {
    id: number,
    name: string
}
export type fetchState = {
    genres: Genre[];
    films: MoviesResponse;
    error: string | null;
    isFilmsLoading: boolean;
    favoriteFilms: Movie[];
    isGenresLoading: boolean;
    isFavoriteLoading: boolean;
    isFavoriteAddLoading: boolean,
}
export type GenresAction = {
    id: number;
    name: string;
}

export type Movie = {
    id: number;
    title: string;
    original_title?: string;
    poster_path: string | null;
    backdrop_path?: string | null;
    vote_average: number;
    vote_count?: number;
    overview?: string;
    release_date: string;
    genre_ids: number[];
}
export type MoviesResponse = {
    page: number;
    results: Movie[];
    total_pages: number;
    total_results: number;
}

export type FilmDetailGenresResponse = {
    id: number;
    name: string;
}
export type FilmDetailCountriesResponse = {
    iso_3166_1: string;
    name: string;
}
export type FilmDetailResponse = {
    id: number;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    vote_count: number;
    title: string;
    original_title: string;
    tagline: string;
    genres: FilmDetailGenresResponse[];
    release_date: string;
    runtime: number;
    overview: string;
    production_countries: FilmDetailCountriesResponse[];
    status: string;
    budget: number;
    revenue: number;
}
