import { Link } from "react-router-dom";
import { useState, useEffect } from "react";

import axios from "axios";
import "./Hero.css";
import netCafeLogo from "../assets/netcafelogo1.png";
import exit from "../assets/exit.png";

const Features = () => {
  return (
    <div className="features">
      <h2>Trending Now</h2>
      <p>Take a look at some featured films</p>
      <img src={exit} alt="Exit Icon" className="exit" />
    </div>
  );
};

const FeatureContainer = ({ movies }) => {
  return (
    <div className="feature-container">
      {movies.map((movie) => (
        <div key={movie.id} className="movie-card">
          <Link to={`/movies/details/${movie.id}`}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="poster"
            />
          </Link>
        </div>
      ))}
    </div>
  );
};

const Features2 = () => {
  return (
    <div className="features2">
      <h2>Animated Marvels</h2>
      <p>Peek into peak fiction</p>
      <img src={exit} alt="Exit Icon" className="exit" />
    </div>
  );
};

const Feature2Container = ({ movies }) => {
  return (
    <div className="feature2-container">
      {movies.map((movie) => (
        <div key={movie.id} className="movie-card">
          <Link to={`/movies/details/${movie.id}`}>
            <img
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              className="poster"
            />
          </Link>
        </div>
      ))}
    </div>
  );
};

const Hero = () => {
  const [movies, setMovies] = useState([]);
  function shuffle(array) {
    let currentIndex = array.length;

    while (currentIndex !== 0) {
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex],
        array[currentIndex],
      ];
    }
  }

  useEffect(() => {
    (async function getMovies() {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/movie/now_playing?api_key=${
            import.meta.env.VITE_TMDB_KEY
          }`
        );

        const threeMovies = [];
        shuffle(response.data.results);
        threeMovies.push(response.data.results.pop());
        threeMovies.push(response.data.results.pop());
        threeMovies.push(response.data.results.pop());
        threeMovies.push(response.data.results.pop());
        threeMovies.push(response.data.results.pop());
        threeMovies.push(response.data.results.pop());
        threeMovies.push(response.data.results.pop());
        threeMovies.push(response.data.results.pop());
        threeMovies.push(response.data.results.pop());
        threeMovies.push(response.data.results.pop());
        threeMovies.push(response.data.results.pop());
        threeMovies.push(response.data.results.pop());
        threeMovies.push(response.data.results.pop());

        setMovies(threeMovies);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    })();
  }, []);

  return (
    <section className="hero">
      <div className="hero-container">
        <div className="column-left">
          <img src={netCafeLogo} alt="Net Cafe Logo" className="image2" />
        </div>
        <div className="column-right">
          <h1>Feline Good With Us</h1>
          <p>
            Relax and take a break with all your favorite movies. WE ARNT KITTEN
            AROUND
          </p>
          <input
            type="text"
            className="browse-films"
            placeholder="Browse Films"
          />
        </div>
      </div>
      <Features />
      <FeatureContainer movies={movies} />
      <Features2 />
    </section>
  );
};

export default Hero;
