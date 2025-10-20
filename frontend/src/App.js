import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import Learn from "./pages/Learn";
import Plots from "./pages/Plots";
import "./App.css";

function App() {
  // Modo oscuro global
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("modo") === "oscuro"
  );

  // Aplicar clase a body y html
  useEffect(() => {
    const tag = darkMode ? "dark-mode" : "light-mode";
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(tag);
    document.documentElement.classList.remove("light-mode", "dark-mode");
    document.documentElement.classList.add(tag);
  }, [darkMode]);

  // Guardar modo en localStorage
  useEffect(() => {
    localStorage.setItem("modo", darkMode ? "oscuro" : "claro");
  }, [darkMode]);

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={<Home darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        <Route
          path="/juego"
          element={<Game darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        <Route
          path="/learn"
          element={<Learn darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
        <Route
          path="/plots"
          element={<Plots darkMode={darkMode} setDarkMode={setDarkMode} />}
        />
      </Routes>
    </Router>
  );
}

export default App;
