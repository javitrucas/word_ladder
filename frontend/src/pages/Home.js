import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlay } from "react-icons/fa";

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
    <div className="home">
      <p className="intro">Crea una cadena de palabras vecinas hasta llegar a la final.</p>
      <button className="btn" onClick={nuevaPartida}>
        <FaPlay style={{ marginRight: "8px" }} /> Comenzar
      </button>
    </div>
  );
}
