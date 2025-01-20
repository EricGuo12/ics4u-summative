import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useStoreContext } from "../context";
import "./DetailView.css";

function DetailView() {
  const { id: paramId } = useParams();
  const id = parseInt(paramId, 10);
  const [movie, setMovie] = useState(null);
  const [trailers, setTrailers] = useState([]);
  const { user, firstName, cart, setCart, purchases } = useStoreContext();
  const [buttonText, setButtonText] = useState("Buy");
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchMovieDetails() {
      try {
        const [movieResponse, videosResponse] = await Promise.all([
          axios.get(
            `https://api.themoviedb.org/3/movie/${id}?api_key=${
              import.meta.env.VITE_TMDB_KEY
            }`
          ),
          axios.get(
            `https://api.themoviedb.org/3/movie/${id}/videos?api_key=${
              import.meta.env.VITE_TMDB_KEY
            }`
          ),
        ]);

        setMovie(movieResponse.data);

        const trailerResults = videosResponse.data.results.filter(
          (video) => video.type === "Trailer"
        );
        setTrailers(trailerResults);
      } catch (error) {
        console.error("Error fetching movie data:", error);
      }
    }

    if (id) {
      fetchMovieDetails();
    }
  }, [id]);

  useEffect(() => {
    const strId = String(id);

    if (purchases && purchases.has(strId)) {
      setButtonText("Purchased");
    } else if (cart && cart.has(strId)) {
      setButtonText("Added");
    } else {
      setButtonText("Buy");
    }
  }, [purchases, cart, id]);

  function cartPage() {
    navigate("/cart");
  }

  function addToCart() {
    if (!movie) return;

    if (purchases && purchases.has(String(id))) {
      alert("You already purchased this movie!");
      return;
    }

    const movieDetails = {
      title: movie.original_title,
      url: movie.poster_path,
    };

    setCart((prevCart) => {
      const updatedCart = prevCart.set(String(movie.id), movieDetails);

      if (user) {
        localStorage.setItem(user.uid, JSON.stringify(updatedCart.toJS()));
      }

      return updatedCart;
    });
  }

  if (!movie) return <div>Loading...</div>;

  return (
    <div className="detail-view-container">
      <div>
        <button
          onClick={addToCart}
          className="buy-button"
          disabled={
            (purchases && purchases.has(String(id))) || cart.has(String(id))
          }
        >
          {buttonText}
        </button>

        <button className="cart-button" onClick={cartPage}>
          Cart
        </button>

        <h1>{movie.title}</h1>
        <p className="detail-info">
          <span>Tagline:</span> {movie.tagline || "N/A"}
        </p>

        <img
          src={`https://image.tmdb.org/t/p/w300/${movie.poster_path}`}
          alt={movie.original_title}
          className="detail-view-poster"
        />

        <p className="detail-info">
          <span>Language:</span> {movie.original_language || "N/A"}
        </p>
        <p className="detail-info">
          <span>Overview:</span> {movie.overview || "No overview available."}
        </p>
        <p className="detail-info">
          <span>Country:</span> {movie.origin_country?.join(", ") || "N/A"}
        </p>
        <p className="detail-info">
          <span>Runtime:</span>
          {movie.runtime ? ` ${movie.runtime} minutes` : " N/A"}
        </p>
        <p className="detail-info">
          <span>Release Date:</span> {movie.release_date || "N/A"}
        </p>
        <p className="detail-info">
          <span>Rating:</span> {movie.vote_average || "N/A"}
        </p>
        <p className="detail-info">
          <span>Genres:</span>{" "}
          {movie.genres?.map((g) => g.name).join(", ") || "N/A"}
        </p>
        <p className="detail-info">
          <span>Box Office:</span>{" "}
          {movie.revenue ? `${movie.revenue.toLocaleString()}$` : "N/A"}
        </p>
      </div>

      <div className="trailers-grid">
        {trailers.length > 0 ? (
          trailers.map((trailer) => (
            <div key={trailer.id} className="trailer-tile">
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  className="trailer-thumbnail"
                  src={`https://img.youtube.com/vi/${trailer.key}/0.jpg`}
                  alt={trailer.name}
                />
                <h3>{trailer.name}</h3>
              </a>
            </div>
          ))
        ) : (
          <p>No trailers available.</p>
        )}
      </div>
    </div>
  );
}

export default DetailView;
