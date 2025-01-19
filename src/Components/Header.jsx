import "./Header.css";
import netCafeLogo from "../assets/netcafelogo2.png";
import { useStoreContext } from "../context";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const { login, setLogin, resetState, firstName } = useStoreContext();

  function handleLogin() {
    navigate(`/login`);
  }

  function register() {
    navigate(`/register`);
  }

  function logout() {
    setLogin(false);
    resetState();
    navigate(`/`);
  }

  function settings() {
    navigate(`/settings`);
  }
  function cartPage() {
    navigate("/cart");
  }

  function logout() {
    navigate(`/`);
    setLogin(false);
    resetState();
  }

  return (
    <nav>
      <img src={netCafeLogo} alt="Net Cafe Logo" className="image1" />

      <div className="nav-items">
        <p className="logo">NET CAFE</p>
        {!login ? (
          <>
            <button onClick={register}>Sign Up</button>
            <button onClick={handleLogin}>Sign In</button>
          </>
        ) : (
          <>
            <button onClick={logout}>Sign Out</button>
            <button onClick={settings}>Settings</button>
            <button onClick={cartPage}>Cart</button>
            <p className="logo">Welcome, {firstName ? firstName : "User"}</p>
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;
