import { Link } from "react-router-dom";

function Footer() {
  return (
    <section className="footer">
      <div className="footer-container">
        <div className="number">
          <a href="/">Questions? Call 324-343-3432</a>
        </div>
        <div className="bottom">
          <ul>
            <li>
              <a href="/">FAQ</a>
            </li>
            <li>
              <a href="/">Legal Notices</a>
            </li>
            <li>
              <a href="/">Privacy</a>
            </li>
            <li>
              <a href="/">Ways to Watch</a>
            </li>
          </ul>
          <ul>
            <li>
              <a href="/">Corporate Information</a>
            </li>
            <li>
              <a href="/">Only on NetCafe</a>
            </li>
            <li>
              <a href="/">Ad Choices</a>
            </li>
            <li>
              <a href="/">Contact Us</a>
            </li>
          </ul>
          <ul>
            <li>
              <a href="/">Account</a>
            </li>
            <li>
              <a href="/">Terms of Use</a>
            </li>
            <li>
              <a href="/">CatCafe Shop</a>
            </li>
            <li>
              <a href="/">Media Center</a>
            </li>
          </ul>
        </div>
      </div>
    </section>
  );
}

export default Footer;
