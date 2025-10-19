import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Game from "./pages/Game";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="app">
        <h1 className="title">Escalera de Palabras</h1>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/juego" element={<Game />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
