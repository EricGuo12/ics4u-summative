import { useStoreContext } from "../context";
import "./CartView.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { firestore } from "../firebase";
import { Map } from "immutable";

function CartView() {
  const { cart, setCart, user, setPurchases } = useStoreContext();
  const navigate = useNavigate();

  function backPage() {
    navigate(`/movies`);
  }

  function removeMovie(key) {
    if (!user) {
      setCart((prev) => prev.delete(key));
      return;
    }

    setCart((prevCart) => {
      const newCart = prevCart.delete(key);
      localStorage.setItem(user.uid, JSON.stringify(newCart.toJS()));
      return newCart;
    });
  }

  const checkout = async () => {
    if (!user) {
      alert("Please sign in first.");
      return;
    }

    if (cart.size > 0) {
      try {
        const docRef = doc(firestore, "users", user.email);
        await setDoc(docRef, { purchases: cart.toJS() }, { merge: true });

        localStorage.removeItem(user.uid);

        setCart(Map());

        const updatedSnap = await getDoc(docRef);
        if (updatedSnap.exists()) {
          const data = updatedSnap.data();
          setPurchases(Map(data.purchases || {}));
        }

        alert("Thank you for your purchase!");
      } catch (error) {
        console.error("Error during checkout:", error);
        alert("Something went wrong during checkout.");
      }
    } else {
      alert("Please add movies first.");
    }
  };

  return (
    <div>
      <Header />
      <div className="cart-view">
        <button onClick={backPage} className="back-button">
          Back
        </button>

        <h1>Shopping Cart</h1>
        <button onClick={checkout} className="checkout-button">
          Checkout
        </button>

        <div className="cart-items">
          {cart
            .entrySeq()
            .reverse()
            .map(([key, value]) => (
              <div className="cart-item" key={key}>
                <img
                  src={`https://image.tmdb.org/t/p/w500${value.url}`}
                  alt={value.title}
                />
                <h1>{value.title}</h1>
                <button
                  className="remove-button"
                  onClick={() => removeMovie(key)}
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
