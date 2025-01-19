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
  // const genres = [
  //   {
  //     genre: "Action",
  //     id: 28,
  //   },
  //   {
  //     genre: "Family",
  //     id: 10751,
  //   },
  //   {
  //     genre: "Science Fiction",
  //     id: 878,
  //   },
  //   {
  //     genre: "Animation",
  //     id: 16,
  //   },
  //   {
  //     genre: "Comedy",
  //     id: 35,
  //   },
  //   {
  //     genre: "Crime",
  //     id: 80,
  //   },
  //   {
  //     genre: "History",
  //     id: 36,
  //   },
  //   {
  //     genre: "Fantasy",
  //     id: 14,
  //   },
  //   {
  //     genre: "Horror",
  //     id: 27,
  //   },
  //   {
  //     genre: "Thriller",
  //     id: 53,
  //   },
  // ];
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
