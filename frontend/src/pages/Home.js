import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  const nuevaPartida = async () => {
    navigate("/juego");
  };

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>🧩 Escalera de Palabras</h1>
      <button onClick={nuevaPartida} style={{ fontSize: "20px", padding: "10px 20px" }}>
        Nueva partida
      </button>
    </div>
  );
}

export default Home;
