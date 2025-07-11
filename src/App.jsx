import Search from "./components/search.jsx";
import React, { useState, useEffect } from "react";
import Spinner from "./components/spinner.jsx";
import MovieCard from "./components/MovieCard.jsx";
import {useDebounce} from 'react-use';
import { getTrendingMovies, updateSearchCount } from "./appwrite.js";


const API_BASE_URL = 'https://api.themoviedb.org/3';

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: 'GET',
  headers: {
    accept: 'application/json',
    Authorization: `Bearer ${API_KEY}`
  }
}


const App = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const [errorMessage, setErrorMessage] = useState('');

  const [movieList, setMovieList] = useState([]);

  const [isloading, setIsLoading] = useState(false);

  const[debounceSearchTerm, setDebounceSearchTerm] = useState('');

  const [trendingMovies, setTrendingMovies] = useState([]);

  useDebounce(() => setDebounceSearchTerm(searchTerm), 500 , [searchTerm]);

  const fetchMovies = async (query = '') => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const endPoint = query ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}` : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endPoint, API_OPTIONS);
      
      

      if(!response.ok){
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data);
      

      if(data.response === 'False'){
        setErrorMessage(data.Error);
        setMovieList([]);
        return;
      }
      
      setMovieList(data.results);
      // console.log("Movies fetched successfully:", data.results);
      if(query && data.results.length>0){
        await updateSearchCount(query, data.results[0]);
      }


    } catch (error){
      console.error("Error fetching movies:", error);
      setErrorMessage("Failed to fetch movies. Please try again later.");
    } finally{
      setIsLoading(false);
    }
  }

  const loadTreandingMovies = async () => {
    try {
        const movies = await getTrendingMovies();

        setTrendingMovies(movies);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
    }
  }

  useEffect(() => {
      fetchMovies(debounceSearchTerm);
  }, [debounceSearchTerm]);

  useEffect(() => {
    loadTreandingMovies();
  })



  return (
    <main>
      <div className="pattern">
        <div className="wrapper">
          <header>
            <img src="./hero-img.png" alt="hero" />
            <h1>Find <span className="text-gradient">movies</span> you enjoy without hassel</h1>
            <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} /> 
          </header>
          {Array.isArray(trendingMovies) && trendingMovies.length > 0 && (
            <section className="trending">
              <h2>Trending Movies</h2>
              <ul>
                {trendingMovies.map((movie, index) => (
                  <li key={movie.$id}>
                    <p>{index + 1}</p>
                    <img src={movie.poster_url} alt={movie.title} />
                  </li>
                ))}
              </ul>
            </section>
          )}
          <section className="all-movies">
            <h2>All Movies</h2>
            { isloading ? (
              <Spinner / >
            ) : errorMessage ? (
              <p className="text-red-500">{errorMessage}</p>
            ): <ul>
                {movieList.map((movie) => {
                  return(
                    <>
                      <MovieCard key={movie.id} movie={movie}/>
                    </>
                  )
                })}
              </ul>}
          </section>
        </div>
      </div>
    </main>
  );
};

export default App;