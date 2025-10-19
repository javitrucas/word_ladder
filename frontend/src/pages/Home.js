import React from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

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
    <div className="container">
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
          Bienvenido a <strong>Word Ladder</strong>! 🎉
        </p>
        <p>
          Tu objetivo es formar una cadena de palabras vecinas, cambiando solo una letra a la vez.
        </p>
        <p>
          Tienes <strong>3 vidas</strong> y no puedes repetir palabras.
        </p>
        <p>
          Llega a la palabra final y consigue la máxima puntuación posible.
        </p>
      </div>
    </div>
  );
}
