import "./MoviesView.css";
import Genres from "../components/Genres.jsx";
import { Outlet } from "react-router-dom";
import "../Components/Header.jsx";
import "../Components/Hero.jsx";
import "../Components/Footer.jsx";
import Header from "../Components/Header";
import Footer from "../Components/Footer";
import { useStoreContext } from "../context";

function MoviesView() {
  const { prefGenre } = useStoreContext();

  return (
    <div className="body">
      <Header />

      <div className="movies-view-container">
        <Genres genresList={prefGenre} />
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default MoviesView;
