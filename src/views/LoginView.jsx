import React, { useState, useRef } from "react";
import "./LoginView.css";
import { useNavigate } from "react-router-dom";
import { useStoreContext } from "../context";
import { Link } from "react-router-dom";
import { auth } from "../firebase"; // Import Firebase auth
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth"; // Import Firebase methods

function LoginView() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for error messages
  const email = useRef("");
  const navigate = useNavigate();
  const { setLogin } = useStoreContext();

  // Handle login with email and password
  async function handleLogin(event) {
    event.preventDefault();

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.current.value,
        password
      );

      const user = userCredential.user;
      console.log("User signed in:", user);

      // Update the login state in the context
      setLogin(user);

      // Navigate to the movies page on successful login
      navigate(`/movies`);
    } catch (error) {
      console.error("Login failed:", error.message);
      setError("Invalid email or password. Please try again."); // Set an error message
    }
  }

  // Handle login with Google
  async function handleGoogleSignIn() {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      console.log("Google sign-in successful:", user);

      // Update the login state in the context
      setLogin(user);

      // Navigate to the movies page on successful sign-in
      navigate(`/movies`);
    } catch (error) {
      console.error("Google sign-in failed:", error.message);
      setError("Failed to sign in with Google. Please try again.");
    }
  }

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="form-container">
          <h2>Login to Your Account</h2>
          <form onSubmit={handleLogin}>
            <label htmlFor="email">Email</label>
            <input type="email" id="email" name="email" ref={email} required />
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
          <button onClick={handleGoogleSignIn} className="google-signin-button">
            Sign in with Google
          </button>
          <p className="register-link">
            New to Net Cafe? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginView;
