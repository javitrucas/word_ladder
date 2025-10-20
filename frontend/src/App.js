import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import "./App.css";

function App() {
  // 🔥 Modo oscuro global (persistente)
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("modo") === "oscuro"
  );

  // ✅ Aplica el modo correcto al body al iniciar
  useEffect(() => {
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(darkMode ? "dark-mode" : "light-mode");
  }, []);

  // ✅ Cada vez que cambie, actualiza el body y localStorage
  useEffect(() => {
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(darkMode ? "dark-mode" : "light-mode");
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
      </Routes>
    </Router>
  );
}

export default App;
