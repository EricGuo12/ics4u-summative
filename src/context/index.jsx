import { createContext, useState, useContext, useEffect } from "react";
import { Map } from "immutable";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";

const StoreContext = createContext();

export const StoreProvider = ({ children }) => {
  const [cart, setCart] = useState(Map());
  const [login, setLogin] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [prefGenre, setPrefGenre] = useState([]);

  const genres = [
    { id: 28, genre: "Action" },
    { id: 10751, genre: "Family" },
    { id: 878, genre: "Science Fiction" },
    { id: 16, genre: "Animation" },
    { id: 35, genre: "Comedy" },
    { id: 14, genre: "Fantasy" },
    { id: 80, genre: "Crime" },
    { id: 36, genre: "History" },
    { id: 53, genre: "Thriller" },
    { id: 27, genre: "Horror" },
    { id: 12, genre: "Adventure" },
    { id: 10402, genre: "Music" },
    { id: 9648, genre: "Mystery" },
    { id: 10752, genre: "War" },
    { id: 37, genre: "Western" },
  ];
  const toggleGenre = (genre) => {
    setChecked((prev) => {
      const updatedChecked = { ...prev, [genre.genre]: !prev[genre.genre] };

      // Update prefGenre based on checked state
      const updatedPrefGenre = Object.keys(updatedChecked)
        .filter((genreKey) => updatedChecked[genreKey])
        .map((genreKey) => genres.find((g) => g.genre === genreKey)); // Find matching genre object

      setPrefGenre(updatedPrefGenre); // Set prefGenre with objects containing both id and genre

      return updatedChecked;
    });
  };
  const [checked, setChecked] = useState({
    Action: false,
    Family: false,
    "Science Fiction": false,
    Animation: false,
    Comedy: false,
    Fantasy: false,
    Crime: false,
    History: false,
    Thriller: false,
    Horror: false,
    Adventure: false,
    Music: false,
    Mystery: false,
    War: false,
    Western: false,
  });
  const resetState = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setCart(Map());
    setChecked({
      Action: false,
      Family: false,
      "Science Fiction": false,
      Animation: false,
      Comedy: false,
      Fantasy: false,
      Crime: false,
      History: false,
      Thriller: false,
      Horror: false,
      Adventure: false,
      Music: false,
      Mystery: false,
      War: false,
      Western: false,
    });
    setPrefGenre([]); // Reset to an empty array
    setUser(null);
    setPurchases(Map());
  };

  return (
    <StoreContext.Provider
      value={{
        email,
        setEmail,
        password,
        setPassword,
        firstName,
        setFirstName,
        lastName,
        setLastName,
        cart,
        setCart,
        login,
        setLogin,
        checked,
        setChecked,
        toggleGenre,
        prefGenre,
        setPrefGenre,
        resetState,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStoreContext = () => {
  return useContext(StoreContext);
};
