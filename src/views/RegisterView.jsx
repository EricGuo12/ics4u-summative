import "./RegisterView.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../context";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

function RegisterView() {
  const {
    setFirstName,
    setLastName,
    setEmail,
    setPassword,
    setLogin,
    checked,
    prefGenre,
    toggleGenre,
  } = useStoreContext();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    rePassword: "",
  });
  const [error, setError] = useState("");
  const [isEmailRegistering, setIsEmailRegistering] = useState(true);
  const navigate = useNavigate();

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

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Update context for firstName and lastName specifically
    if (name === "firstName") {
      setFirstName(value);
    } else if (name === "lastName") {
      setLastName(value);
    }
  };

  const validateGenres = () => {
    if (prefGenre.length < 10) {
      setError("Please select at least 10 genres.");
      return false;
    }
    setError("");
    return true;
  };

  const registerByEmail = async (event) => {
    event.preventDefault();
    if (!validateGenres()) return;

    const { email, password, firstName, lastName } = formData;

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await updateProfile(user, { displayName: `${firstName} ${lastName}` });
      setLogin(user);

      navigate(`/movies`);
    } catch (error) {
      console.error("Error during registration:", error.message);
      alert("Error creating user with email and password!");
    }
  };

  const registerByGoogle = async () => {
    if (!validateGenres()) return;

    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      console.log("Google user registered successfully:", user);

      setLogin(user);
      navigate(`/movies`);
    } catch (error) {
      if (error.code === "auth/popup-closed-by-user") {
        alert("The sign-in popup was closed. Please try again.");
      } else if (error.code === "auth/cancelled-popup-request") {
        console.warn("Popup request was canceled.");
      } else {
        console.error("Google Registration Error:", error);
        alert(`Error creating user with Google: ${error.message}`);
      }
    }
  };

  useEffect(() => {
    console.log(prefGenre);
  }, [prefGenre]);

  return (
    <div>
      <Header />
      <div className="register-flex">
        <div className="genre-checklist">
          <h3 className="genre-title">Genres</h3>
          <p className="genre-paragraph">
            Choose up to 10 genres to personalize your account.
          </p>
          {genres.map((item, index) => (
            <div key={item.id}>
              <input
                type="checkbox"
                checked={checked[item.genre] || false}
                onChange={() => toggleGenre(item)}
                id={`checkbox-${index}`}
              />
              <label htmlFor={`checkbox-${index}`} className="genre-name">
                {item.genre}
              </label>
            </div>
          ))}
          <p className="genre-count">genres selected: {prefGenre.length}</p>
        </div>

        <div className="register-container">
          <h2 className="register-title">Join Us!</h2>

          {isEmailRegistering ? (
            <form className="register-form" onSubmit={registerByEmail}>
              <label htmlFor="first-name" className="register-text">
                First Name:
              </label>
              <input
                type="text"
                id="first-name"
                name="firstName"
                className="register-inputs"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="last-name" className="register-text">
                Last Name:
              </label>
              <input
                type="text"
                id="last-name"
                name="lastName"
                className="register-inputs"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="email" className="register-text">
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="register-inputs"
                value={formData.email}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="password" className="register-text">
                Password:
              </label>
              <input
                type="password"
                id="password"
                name="password"
                className="register-inputs"
                value={formData.password}
                onChange={handleInputChange}
                required
              />

              <label htmlFor="re-password" className="register-text">
                Re-Enter Password:
              </label>
              <input
                type="password"
                id="re-password"
                name="rePassword"
                className="register-inputs"
                value={formData.rePassword}
                onChange={handleInputChange}
                required
              />

              {error && <p className="error-message">{error}</p>}

              <button type="submit" className="register-button">
                Sign Up
              </button>
              <button
                onClick={registerByGoogle}
                className="google-register-button"
              >
                Register with Google
              </button>
            </form>
          ) : (
            <div className="google-register">
              <button
                onClick={registerByGoogle}
                className="google-register-button"
              >
                Register with Google
              </button>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RegisterView;
