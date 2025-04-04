import {useNavigate, useSearchParams} from "react-router-dom"
import styled from "styled-components"
import {useMovies} from "../api/useMovies.ts";
import {getPosterSrc} from "../utils/getPosterSrc.ts";

export const SearchView = () => {
    const [searchParams, setSearchParams] = useSearchParams("");
    const query = searchParams.get("query") || ""
    const {data, fetchNextPage, hasNextPage, isError, error} = useMovies(query);
    const navigate = useNavigate();

    const movies = data?.pages.flatMap((page) => page?.results) || [];
    const noResults = query.length >= 3 && movies.length === 0;

    return (
        <Container>
            <SearchInput
                type="text"
                placeholder="Search movies..."
                value={query}
                onChange={(e) => {
                    const value = e.target.value
                    setSearchParams({query: value})
                }}
            />
            {isError && <ErrorMessage>❌ Error: {error.message}</ErrorMessage>}
            {noResults && <NoResultsText>😞 No movies found for "{query}".</NoResultsText>}
            <MovieList>
                {movies.map((movie) => (
                    <MovieItem key={movie.id} onClick={() => navigate(`/movie/${movie.id}`)}>
                        <picture>
                            <source srcSet={getPosterSrc(movie.poster_path, "webp")} type="image/webp" />
                            <source srcSet={getPosterSrc(movie.poster_path, "jpg")} type="image/jpeg" />
                            <MoviePoster src={getPosterSrc(movie.poster_path)} alt={movie.title || "Placeholder Poster"} />
                        </picture>

                        <MovieTitleWrapper>
                            <MovieTitle>{movie.title}</MovieTitle>
                            {movie.release_date !== '' &&
                                <MovieYear>({movie.release_date?.split("-")[0]})</MovieYear>
                            }
                        </MovieTitleWrapper>
                    </MovieItem>
                ))}
            </MovieList>
            {hasNextPage &&
                <ButtonWrapper><LoadMoreButton onClick={() => fetchNextPage()}>Load
                    more</LoadMoreButton></ButtonWrapper>}
        </Container>
    )
}

const Container = styled.div`
    margin: 0 auto;
    padding: 20px;

    max-width: 1170px;
`

const SearchInput = styled.input`
    padding: 12px 16px;
    width: 100%;

    color: #333;
    font-size: 16px;

    border: 2px solid #ddd;
    border-radius: 8px;
    background: #fff;
    outline: none;
    transition: all 0.3s ease-in-out;
    box-shadow: 2px 2px 10px rgba(0, 0, 0, 0.05);

    margin: 0 auto 32px;

    &:focus {
        box-shadow: 0 0 10px rgba(74, 144, 226, 0.4);
    }

    &::placeholder {
        color: #aaa;
        font-style: italic;
    }
`

const ErrorMessage = styled.p`
    color: red;
    font-weight: bold;
    text-align: center;
`

const NoResultsText = styled.p`
    text-align: center;
    font-size: 18px;
`

const MovieList = styled.div`
    margin-bottom: 20px;

    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
`

const MovieItem = styled.div`
    padding: 10px;

    border-radius: 8px;
    border: 1px solid #ccc;
    cursor: pointer;

    &:hover {
        background: #f0f0f0;
    }
`

const MoviePoster = styled.img`
    width: 100%;
    height: 300px;
    object-fit: cover;
`

const MovieTitleWrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
`

const MovieTitle = styled.p`
    font-size: 16px;
    font-weight: 600;

    text-align: center;
`

const MovieYear = styled.span`
    color: #aaa;
    font-size: 14px;
`

const ButtonWrapper = styled.div`
    display: flex;
    justify-content: center;
`

const LoadMoreButton = styled.button`
    padding: 12px 28px;

    color: white;
    font-weight: 600;

    border-radius: 4px;
    background: #000;

    &:hover {
        box-shadow: 0 0 12px rgba(74, 144, 226, 0.4);
    }
`