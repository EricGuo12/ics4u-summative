import "./HomeView.css";
import "../Components/Header.jsx";
import "../Components/Hero.jsx";
import "../Components/Footer.jsx";

import Header from "../Components/Header";
import Hero from "../Components/Hero";
import Footer from "../Components/Footer";

function HomeView() {
  return (
    <div>
      <Header />
      <Hero />
      <Footer />
    </div>
  );
}

export default HomeView;
