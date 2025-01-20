import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStoreContext } from "../context";
import "./GenreView.css";

function GenreView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, firstName, cart, setCart, purchases } = useStoreContext();
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const genreNames = {
    28: "Action",
    10751: "Family",
    878: "Science Fiction",
    16: "Animation",
    35: "Comedy",
    14: "Fantasy",
    80: "Crime",
    36: "History",
    53: "Thriller",
    27: "Horror",
    12: "Adventure",
    10402: "Music",
    9648: "Mystery",
    10752: "War",
    37: "Western",
  };
  const genreName = genreNames[id] || "Unknown Genre";

  useEffect(() => {
    if (!id) return;

    const fetchMovies = async () => {
      try {
        const response = await axios.get(
          `https://api.themoviedb.org/3/discover/movie?api_key=${
            import.meta.env.VITE_TMDB_KEY
          }&with_genres=${id}&page=${page}`
        );
        setMovies(response.data.results);
        setTotalPages(response.data.total_pages);
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };

    fetchMovies();
  }, [id, page]);

  const handlePageChange = (direction) => {
    if (direction === "next" && page < totalPages) {
      setPage((prevPage) => prevPage + 1);
    } else if (direction === "prev" && page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const loadMovie = (movieId) => {
    navigate(`/movies/details/${movieId}`);
  };

  const addToCart = (movie) => {
    if (purchases && purchases.has(String(movie.id))) {
      alert("You already purchased this movie!");
      return;
    }

    const movieDetails = {
      title: movie.title,
      url: movie.poster_path,
    };

    setCart((prevCart) => {
      const updatedCart = prevCart.set(String(movie.id), movieDetails);

      if (user) {
        localStorage.setItem(user.uid, JSON.stringify(updatedCart.toJS()));
      }

      return updatedCart;
    });
  };

  const buttonText = (movieId) => {
    const strId = String(movieId);
    if (purchases && purchases.has(strId)) return "Purchased";
    if (cart && cart.has(strId)) return "Added";
    return "Buy";
  };

  return (
    <div className="genre-list-container">
      <p className="page-title">{genreName}</p>

      <div className="movie-list">
        {movies.map((movie) => {
          const isPurchased = purchases && purchases.has(String(movie.id));
          return (
            <div key={movie.id} className="movie-item">
              <div onClick={() => loadMovie(movie.id)}>
                <img
                  src={`https://image.tmdb.org/t/p/w500/${movie.poster_path}`}
                  alt={movie.title}
                  className="movie-poster"
                />
                <h3 className="movie-title">{movie.title}</h3>
              </div>

              <button
                className="buy-button"
                onClick={(e) => {
                  e.stopPropagation();
                  addToCart(movie);
                }}
                disabled={isPurchased || cart.has(String(movie.id))}
              >
                {buttonText(movie.id)}
              </button>
            </div>
          );
        })}
      </div>

      {totalPages > 1 && (
        <div className="genre-buttons">
          <button
            className="page-button"
            onClick={() => handlePageChange("prev")}
            disabled={page === 1}
          >
            Previous Page
          </button>
          <button
            className="page-button"
            onClick={() => handlePageChange("next")}
            disabled={page === totalPages}
          >
            Next Page
          </button>
        </div>
      )}

      <p className="page">
        Page: {page} / {totalPages}
      </p>
    </div>
  );
}

export default GenreView;
