import "./Header.css";
import netCafeLogo from "../assets/netcafelogo2.png";
import { useStoreContext } from "../context";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

function Header() {
  const navigate = useNavigate();

  const { user, resetState } = useStoreContext();

  function handleLogin() {
    navigate(`/login`);
  }

  function register() {
    navigate(`/register`);
  }

  async function logout() {
    try {
      await signOut(auth);
      resetState();
      navigate(`/`);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  function settings() {
    navigate(`/settings`);
  }

  function cartPage() {
    navigate("/cart");
  }

  return (
    <nav>
      <img src={netCafeLogo} alt="Net Cafe Logo" className="image1" />

      <div className="nav-items">
        <p className="logo">NET CAFE</p>
        {!user ? (
          <>
            <button onClick={register}>Sign Up</button>
            <button onClick={handleLogin}>Sign In</button>
          </>
        ) : (
          <>
            <button onClick={logout}>Sign Out</button>
            <button onClick={settings}>Settings</button>
            <button onClick={cartPage}>Cart</button>
            <p className="logo">
              Welcome, {user.displayName ? user.displayName : "User"}
            </p>
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;
