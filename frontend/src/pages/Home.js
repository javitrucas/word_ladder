import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import Header from "../components/Header";

export default function Home() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);

  // Mantener el fondo cuando el componente carga
  useEffect(() => {
    document.body.classList.add("light-mode");
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  };

  const nuevaPartida = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/nueva_partida");
      const data = await res.json();
      localStorage.setItem("partida", JSON.stringify(data));
      navigate("/juego");
    } catch (err) {
      alert("Error al iniciar la partida 😢");
      console.error(err);
    }
  };

  return (
    <>
      {/* Toggle de modo oscuro */}
      <div className="dark-mode-toggle">
        <label className="switch">
          <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
          <span className="slider"></span>
        </label>
      </div>

      <div className="container">
        <Header darkMode={darkMode} />

        <div className="titulo">
          <span>W</span>
          <div className="btn-container">
            <div style={{ "--a": 0 }} className="btn-sensor sensor-n"></div>
            <div style={{ "--a": 45 }} className="btn-sensor sensor-ne"></div>
            <div style={{ "--a": 90 }} className="btn-sensor sensor-e"></div>
            <div style={{ "--a": 135 }} className="btn-sensor sensor-se"></div>
            <div style={{ "--a": 180 }} className="btn-sensor sensor-s"></div>
            <div style={{ "--a": 225 }} className="btn-sensor sensor-sw"></div>
            <div style={{ "--a": 270 }} className="btn-sensor sensor-w"></div>
            <div style={{ "--a": 315 }} className="btn-sensor sensor-nw"></div>
            <button className="btn-button" onClick={nuevaPartida}>
              <div className="btn-lid"></div>
              <div className="btn-pupil"></div>
            </button>
          </div>
          <span>RD</span>
        </div>

        <div className="subtitle">LADDER</div>

        <div className="explicacion">
          <p>
            En <strong>Word Ladder</strong> tu objetivo es pasar de una palabra inicial a otra final.
            Cada intento solo puede cambiar <strong>una letra por palabra</strong>.
          </p>
          <p>
            Las letras correctas en la posición correcta aparecen en <span className="verde">verde</span>, 
            las letras que has cambiado aparecen en <span className="amarillo">amarillo</span>.
          </p>
          <p>
            Solo tienes <strong>tres vidas</strong>, así que piensa bien cada movimiento. 
            <br />
            <strong>Haz clic en el ojo para comenzar</strong>.
          </p>
        </div>
      </div>
    </>
  );
}
