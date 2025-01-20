import { BrowserRouter, Routes, Route } from "react-router-dom";
import { StoreProvider } from "./context";
import HomeView from "../src/views/HomeView";
import RegisterView from "../src/views/RegisterView";
import LoginView from "../src/views/LoginView";
import MoviesView from "../src/views/MoviesView";
import GenreView from "../src/views/GenreView";
import DetailView from "./views/DetailView";
import CartView from "./views/CartView";
import SettingsView from "../src/views/SettingsView";
import ProtectedRoutes from "./util/ProtectedRoutes";
import ErrorView from "./views/errorView";

import "./App.css";

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/login" element={<LoginView />} />

          <Route element={<ProtectedRoutes />}>
            <Route path="/Cart" element={<CartView />} />
            <Route path="/settings" element={<SettingsView />} />

            <Route path="/movies" element={<MoviesView />}>
              <Route path="genre/:id" element={<GenreView />} />
              <Route path="details/:id" element={<DetailView />} />
            </Route>
          </Route>
          <Route path="*" element={<ErrorView />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  );
}
export default App;
