import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import tituloImg from "./assets/word_ladder.png";

export default function Home() {
  const navigate = useNavigate();
  const eyeRefs = useRef([]);

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

  useEffect(() => {
    const handleMouseMove = (e) => {
      eyeRefs.current.forEach((eye) => {
        if (!eye) return;
        const rect = eye.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;
        const dx = e.clientX - eyeCenterX;
        const dy = e.clientY - eyeCenterY;
        const angle = Math.atan2(dy, dx);
        const distance = Math.min(rect.width / 4, Math.hypot(dx, dy) / 10);
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        eye.style.transform = `translate(${x}px, ${y}px)`;
      });
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="container">
      <img src={tituloImg} alt="Escalera de Palabras" className="titulo-img" />

      <div className="explicacion">
        <p>
          Bienvenido a <strong>Escalera de Palabras</strong>! 🎉
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

      <div className="btn-flex">
        {[0, 1].map((_, i) => (
          <div key={i} className="btn-container">
            <button className="btn-button" onClick={nuevaPartida}>
              <div className="btn-lid"></div>
              <div
                className="btn-pupil"
                ref={(el) => (eyeRefs.current[i] = el)}
              ></div>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
