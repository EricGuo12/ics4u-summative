import "./RegisterView.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../context";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";

function RegisterView() {
  const { setUser, checked, prefGenre, toggleGenre } = useStoreContext();

  const firstNameRef = useRef("");
  const lastNameRef = useRef("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");

  const genres = [
    { id: 28, genre: "Action" },
    { id: 12, genre: "Adventure" },
    { id: 16, genre: "Animation" },
    { id: 80, genre: "Crime" },
    { id: 35, genre: "Comedy" },
    { id: 10751, genre: "Family" },
    { id: 10402, genre: "Music" },
    { id: 36, genre: "History" },
    { id: 27, genre: "Horror" },
    { id: 9648, genre: "Mystery" },
    { id: 878, genre: "Sci-Fi" },
    { id: 10752, genre: "War" },
    { id: 53, genre: "Thriller" },
    { id: 37, genre: "Western" },
  ];

  const navigate = useNavigate();

  const registerByEmail = async (event) => {
    event.preventDefault();

    if (password === rePassword && prefGenre.length >= 10) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await updateProfile(user, {
          displayName: `${firstNameRef.current.value} ${lastNameRef.current.value}`,
        });

        const userData = {
          email: user.email,
          password: password, // remove this line if you do not want to store plaintext
          firstName: firstNameRef.current.value,
          lastName: lastNameRef.current.value,
          genres: prefGenre,
        };
        const docRef = doc(firestore, "users", user.email);
        await setDoc(docRef, userData, { merge: true });

        setUser(user);
        navigate(`/movies`);
        window.location.reload();
      } catch (error) {
        console.error("Error creating user:", error);
        alert("Error creating user with email and password!");
      }
    } else {
      alert(
        "Make sure the passwords match and you selected at least 10 genres."
      );
    }
  };

  const registerByGoogle = async () => {
    if (prefGenre.length >= 10) {
      try {
        const userCredential = await signInWithPopup(
          auth,
          new GoogleAuthProvider()
        );
        const user = userCredential.user;

        const docRef = doc(firestore, "users", user.email);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          signOut(auth);
          alert("You Already Registered With Google");
        } else {
          const userData = {
            email: user.email,
            genres: prefGenre,
          };

          await setDoc(docRef, userData, { merge: true });
          setUser(user);
          navigate(`/movies`);
          window.location.reload();
        }
      } catch (error) {
        console.error("Error creating user with Google:", error);
        alert("Error creating user with Google!");
      }
    } else {
      alert("Make sure you selected at least 10 genres.");
    }
  };

  return (
    <div>
      <Header />
      <div className="register-flex">
        <div className="genre-checklist">
          <h3 className="genre-title">Genres</h3>
          <p className="genre-paragraph">
            Please choose at least 10 genres so we can personalize your account
          </p>
          {genres.map((item, i) => (
            <div key={i}>
              <input
                type="checkbox"
                checked={checked[item.genre]}
                onChange={() => toggleGenre(item)}
                id={`checkbox-${i}`}
              />
              <label className="genre-name" htmlFor={`checkbox-${i}`}>
                {item.genre}
              </label>
            </div>
          ))}
          <p className="genre-count">
            # of genres selected: {prefGenre.length}
          </p>
        </div>

        <div className="register-container">
          <h2 className="register-title">Join Us!</h2>
          <form className="register-form" onSubmit={registerByEmail}>
            <label className="register-text">First Name:</label>
            <input
              type="text"
              className="register-inputs"
              ref={firstNameRef}
              required
            />

            <label className="register-text">Last Name:</label>
            <input
              type="text"
              className="register-inputs"
              ref={lastNameRef}
              required
            />

            <label className="register-text">Email:</label>
            <input
              type="email"
              className="register-inputs"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label className="register-text">Password:</label>
            <input
              type="password"
              className="register-inputs"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <label className="register-text">Re-Enter Password:</label>
            <input
              type="password"
              className="register-inputs"
              value={rePassword}
              onChange={(e) => setRePassword(e.target.value)}
              required
            />

            <button className="register-button" type="submit">
              Sign Up
            </button>
          </form>

          <button className="register-button" onClick={registerByGoogle}>
            Sign Up With Google
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default RegisterView;
