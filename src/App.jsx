import React, { useState, useEffect } from "react";
import Search from "./component/Search.jsx";
import Spinner from "./component/Spinner.jsx";
import Moviecard from "./component/Moviecard.jsx";
import { useDebounce } from "react-use";
import { updateSearchCount, getTrendingMovies } from "./appwrite.js";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API = import.meta.env.VITE_TMDB_API;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API}`,
  },
};

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  
  const [trendingMovies, setTrendingMovies] = useState([]);

  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  
  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);


  useEffect(() => {
    fetchMovies();
  }, [debouncedSearchTerm]);

  
  useEffect(() => {
    loadTrendingMovies();
  }, []);

  const fetchMovies = async () => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = debouncedSearchTerm.trim()
        ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(
            debouncedSearchTerm
          )}`
        : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);
      if (!response.ok) throw new Error("Failed to fetch movies");

      const data = await response.json();
      setMovieList(data.results || []);

      
      if (debouncedSearchTerm.trim() && data.results?.length > 0) {
        await updateSearchCount(debouncedSearchTerm, data.results[0]);
      }
    } catch (error) {
      console.error("Error fetching the movies:", error);
      setErrorMessage("Error fetching movies, please try again later");
      setMovieList([]);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingMovies = async () => {
    try {
      const movies = await getTrendingMovies();
      if (movies) setTrendingMovies(movies);
    } catch (error) {
      console.log("Error fetching trending movies:", error);
    }
  };

  return (
    <div className="pattern">
      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="hero banner" />
          <h1>
            Find <span className="text-gradient">Movies </span>you’ll Enjoy
            Without the Hassle
          </h1>
          <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </header>

        {trendingMovies.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovies.map((movie, index) => (
                <li key={movie.$id}>
                  <p>{index + 1}</p>
                  <img src={movie.poster_url} alt="poster" />
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="all-movies">
          <h2 className="">All Movies</h2>
          {isLoading ? (
            <Spinner />
          ) : errorMessage ? (
            <p className="text-red-500">{errorMessage}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <Moviecard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}

export default App;
