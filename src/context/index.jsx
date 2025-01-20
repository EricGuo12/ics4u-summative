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
  const [prefGenre, setPrefGenre] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [purchases, setPurchases] = useState(Map());

  const genres = [
    { id: 28, genre: "Action" },
    { id: 10751, genre: "Family" },
    { id: 878, genre: "Sci-Fi" },
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

  const [checked, setChecked] = useState({
    Action: false,
    Family: false,
    "Sci-Fi": false,
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

  const toggleGenre = (genreObj) => {
    setChecked((prev) => {
      const updatedChecked = {
        ...prev,
        [genreObj.genre]: !prev[genreObj.genre],
      };
      const updatedPrefGenre = Object.keys(updatedChecked)
        .filter((genreKey) => updatedChecked[genreKey])
        .map((key) => genres.find((g) => g.genre === key));
      setPrefGenre(updatedPrefGenre);
      return updatedChecked;
    });
  };

  useEffect(() => {
    if (prefGenre?.length > 0) {
      setChecked((prev) => {
        const updatedChecked = { ...prev };
        Object.keys(updatedChecked).forEach((genreKey) => {
          updatedChecked[genreKey] = false;
        });
        prefGenre.forEach((genreObj) => {
          if (updatedChecked.hasOwnProperty(genreObj.genre)) {
            updatedChecked[genreObj.genre] = true;
          }
        });
        return updatedChecked;
      });
    } else {
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
    }
  }, [prefGenre]);

  const resetState = () => {
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
    setPrefGenre([]);
    setUser(null);
    setPurchases(Map());
    setLogin(false);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        setUser(fbUser);
        setLogin(true);

        const sessionCart = localStorage.getItem(fbUser.uid);
        if (sessionCart) {
          setCart(Map(JSON.parse(sessionCart)));
        }

        try {
          const docRef = doc(firestore, "users", fbUser.email);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setPurchases(Map(data.purchases || {}));
            setPrefGenre(data.genres || []);
          } else {
            setPurchases(Map());
            setPrefGenre([]);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      } else {
        setUser(null);
        setLogin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <StoreContext.Provider
      value={{
        user,
        setUser,
        cart,
        setCart,
        login,
        setLogin,
        checked,
        setChecked,
        toggleGenre,
        prefGenre,
        setPrefGenre,
        purchases,
        setPurchases,
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
