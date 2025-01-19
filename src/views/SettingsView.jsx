import { useStoreContext } from "../context";
import "./SettingsView.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";

function SettingsView() {
  const {
    password,
    email,
    firstName,
    lastName,
    checked,
    toggleGenre,
    setFirstName,
    setLastName,
    prefGenre,
  } = useStoreContext();

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

  const navigate = useNavigate();

  const changeName = (event) => {
    event.preventDefault();
    alert("First and last name changed!");
  };

  const backPage = () => {
    if (prefGenre.length >= 10) {
      navigate(`/movies`);
    } else {
      alert("Please make sure you have selected at least 10 genres.");
    }
  };

  return (
    <div>
      <Header />

      <div className="register-flex">
        {/* Genre Checklist */}
        <div className="settings-checklist">
          <h3 className="genre-title">Genres</h3>
          <p className="settings-paragraph">
            Choose up to 10 genres to personalize your account.
          </p>

          {genres.map((item, index) => (
            <div key={item.id}>
              <input
                type="checkbox"
                checked={checked[item.genre]}
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

        {/* Settings View */}
        <div className="settings-view">
          <button onClick={backPage} className="back-button">
            Back
          </button>

          <h1>Settings</h1>

          <div className="settings-info">
            <form className="settings-form" onSubmit={changeName}>
              <label className="settings-text" htmlFor="first-name">
                First Name:
              </label>
              <input
                type="text"
                id="first-name"
                className="settings-inputs"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                required
              />

              <label className="settings-text" htmlFor="last-name">
                Last Name:
              </label>
              <input
                type="text"
                id="last-name"
                className="settings-inputs"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                required
              />

              <button type="submit" className="settings-button">
                Click to change First/Last Name after editing the box
              </button>
            </form>

            <label className="settings-text" htmlFor="email">
              Email:
            </label>
            <input
              type="email"
              id="email"
              className="settings-inputs readOnly"
              value={email}
              readOnly
              required
            />

            <label className="settings-text" htmlFor="password">
              Password:
            </label>
            <input
              type="text"
              id="password"
              className="settings-inputs readOnly"
              value={password}
              readOnly
              required
            />
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

export default SettingsView;
