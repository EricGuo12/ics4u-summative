import React, { useState, useRef } from "react";
import "./LoginView.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate, Link } from "react-router-dom";
import { useStoreContext } from "../context";
import { auth } from "../firebase";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";

function LoginView() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const emailRef = useRef("");
  const navigate = useNavigate();

  const { setUser, setPrefGenre } = useStoreContext();

  async function handleLogin(event) {
    event.preventDefault();
    setError("");
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        emailRef.current.value,
        password
      );
      const firebaseUser = userCredential.user;
      console.log("User signed in:", firebaseUser);

      const docRef = doc(firestore, "users", firebaseUser.email);
      const snapshot = await getDoc(docRef);

      let userData = {};
      if (snapshot.exists()) {
        userData = snapshot.data();
        console.log("Fetched user data:", userData);

        setPrefGenre(userData.genres || []);
      }

      const combinedUser = {
        ...firebaseUser,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || firebaseUser.email,
        password: userData.password || "",
      };

      setUser(combinedUser);

      navigate(`/movies`);
    } catch (err) {
      console.error("Login failed:", err);
      setError("Invalid email or password. Please try again.");
    }
  }

  async function handleGoogleSignIn() {
    setError("");
    try {
      const userCredential = await signInWithPopup(
        auth,
        new GoogleAuthProvider()
      );
      const firebaseUser = userCredential.user;
      console.log("Google sign-in successful:", firebaseUser);

      const docRef = doc(firestore, "users", firebaseUser.email);
      const snapshot = await getDoc(docRef);

      let userData = {};
      if (snapshot.exists()) {
        userData = snapshot.data();
        console.log("Fetched user data:", userData);

        setPrefGenre(userData.genres || []);
      }

      const combinedUser = {
        ...firebaseUser,
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        email: userData.email || firebaseUser.email,
        password: userData.password || "",
      };

      setUser(combinedUser);

      navigate(`/movies`);
    } catch (err) {
      console.error("Google sign-in failed:", err);
      setError("Failed to sign in with Google. Please try again.");
    }
  }

  return (
    <div>
      <Header />

      <div className="login-page">
        <div className="login-container">
          <div className="form-container">
            <h2>Login to Your Account</h2>
            <form onSubmit={handleLogin}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                ref={emailRef}
                required
              />

              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />

              {error && <p className="error-message">{error}</p>}

              <button type="submit" className="login-button">
                Login
              </button>
            </form>

            <button
              onClick={handleGoogleSignIn}
              className="google-signin-button"
            >
              Sign in with Google
            </button>

            <p className="register-link">
              New to Net Cafe? <Link to="/register">Register</Link>
            </p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default LoginView;
