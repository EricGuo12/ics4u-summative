import { useStoreContext } from "../context";
import "./Cartview.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function CartView() {
  const { cart, setCart } = useStoreContext();
  const navigate = useNavigate();

  function backPage() {
    navigate(`/movies/genre/28`);
  }

  // Function to remove an item from the cart
  function removeItemFromCart(key) {
    setCart((prevCart) => {
      const updatedCart = new Map(prevCart); // Create a new map to update state
      updatedCart.delete(key); // Delete the item by key
      return updatedCart; // Return the updated map
    });
  }

  return (
    <div>
      <Header />
      <div className="cart-view">
        <button onClick={backPage} className="back-button">
          Back
        </button>
        <h1>Shopping Cart</h1>
        <div className="cart-items">
          {Array.from(cart.entries()) // Convert Map to array
            .reverse() // Optional, for reversing the order
            .map(([key, value]) => (
              <div className="cart-item" key={key}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${value.url}`}
                  alt={value.title}
                />
                <h1>{value.title}</h1>
                <button
                  className="remove-button"
                  onClick={() => removeItemFromCart(key)} // Remove item on click
                >
                  Remove
                </button>
              </div>
            ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default CartView;
