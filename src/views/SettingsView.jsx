import { useStoreContext } from "../context";
import "./SettingsView.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  updateProfile,
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { firestore } from "../firebase";

function SettingsView() {
  const { user, checked, toggleGenre, prefGenre, purchases } =
    useStoreContext();

  const navigate = useNavigate();

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

  const [isReadOnly, setIsReadOnly] = useState(true);

  const nameArray = user?.displayName?.split(" ") ?? [];
  const defaultFirstName = nameArray[0] || "";
  const defaultLastName = nameArray[1] || "";

  const [firstName, setFirstName] = useState(defaultFirstName);
  const [lastName, setLastName] = useState(defaultLastName);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (user && user.providerData) {
      const isEmailPasswordUser = user.providerData.some(
        (provider) => provider.providerId === "password"
      );
      setIsReadOnly(!isEmailPasswordUser);
    }
  }, [user]);

  async function handleSaveChanges(event) {
    event.preventDefault();

    if (isReadOnly) {
      alert(
        "You can only change your name or password if you logged in by email."
      );
      return;
    }

    if (newPassword || confirmPassword) {
      if (newPassword !== confirmPassword) {
        alert("The new password and confirmation do not match.");
        return;
      }
      if (!currentPassword) {
        alert("Please enter your current password to re-authenticate.");
        return;
      }
    }

    try {
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`,
      });

      if (newPassword) {
        const credential = EmailAuthProvider.credential(
          user.email,
          currentPassword
        );
        await reauthenticateWithCredential(user, credential);

        await updatePassword(user, newPassword);
      }

      const docRef = doc(firestore, "users", user.email);
      await setDoc(
        docRef,
        {
          firstName,
          lastName,
          password: newPassword || "",
        },
        { merge: true }
      );

      alert("Profile updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error updating profile or password:", err);

      alert("There was an error updating your information. " + err.message);
    }
  }

  async function updateGenres() {
    if (prefGenre.length >= 10) {
      try {
        const docRef = doc(firestore, "users", user.email);
        await setDoc(docRef, { genres: prefGenre }, { merge: true });
        alert("Genres updated in Firestore!");
      } catch (err) {
        console.error("Error updating genres:", err);
        alert("Failed to update genres.");
      }
    } else {
      alert("Make sure you selected at least 10 genres!");
    }
  }

  function backPage() {
    navigate(`/movies`);
  }

  return (
    <div>
      <Header />
      <div className="register-flex">
        <div className="settings-checklist">
          <h1 className="genre-title">Genres</h1>
          <p className="settings-paragraph">
            Please choose at least 10 genres so we can personalize your account
          </p>

          {genres.map((item, i) => (
            <div key={item.id}>
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

          <button className="settings-button" onClick={updateGenres}>
            Change Genres?
          </button>

          <p className="genre-count">
            # of genres selected: {prefGenre.length}
          </p>
        </div>

        <div className="settings-view">
          <button onClick={backPage} className="back-button">
            Back
          </button>
          <h1>Settings</h1>
          <div className="settings-info">
            <form className="settings-form" onSubmit={handleSaveChanges}>
              <label className="settings-text">First Name:</label>
              <input
                type="text"
                id="first-name"
                className="settings-inputs"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                readOnly={isReadOnly}
                required
              />

              <label className="settings-text">Last Name:</label>
              <input
                type="text"
                id="last-name"
                className="settings-inputs"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                readOnly={isReadOnly}
                required
              />

              {!isReadOnly && (
                <>
                  <label className="settings-text">Current Password:</label>
                  <input
                    type="password"
                    id="current-password"
                    className="settings-inputs"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />

                  <label className="settings-text">New Password:</label>
                  <input
                    type="password"
                    id="new-password"
                    className="settings-inputs"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />

                  <label className="settings-text">Confirm Password:</label>
                  <input
                    type="password"
                    id="confirm-password"
                    className="settings-inputs"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />

                  <button className="settings-button" type="submit">
                    Change Name/Password?
                  </button>
                </>
              )}
            </form>

            <label className="settings-text">Email:</label>
            <input
              type="email"
              id="email"
              className="settings-inputs readOnly"
              readOnly
              value={user.email}
            />

            <h1>Previous Purchases:</h1>
            <div className="cart-items">
              {purchases && purchases.size > 0 ? (
                purchases
                  .entrySeq()
                  .reverse()
                  .map(([key, value]) => (
                    <div className="cart-item" key={key}>
                      <img
                        src={`https://image.tmdb.org/t/p/w500${value.url}`}
                        alt={value.title}
                      />
                      <h1>{value.title}</h1>
                    </div>
                  ))
              ) : (
                <p>No past purchases found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default SettingsView;
