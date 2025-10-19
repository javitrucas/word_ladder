import { useState } from "react";

function App() {
  const [mensaje, setMensaje] = useState("");
  const [palabraInicio, setPalabraInicio] = useState("");
  const [palabraFin, setPalabraFin] = useState("");

  const iniciarJuego = async () => {
    try {
      const response = await fetch("http://127.0.0.1:8000/nueva_partida");
      if (!response.ok) {
        throw new Error("Error al conectar con el backend");
      }
      const data = await response.json();
      setPalabraInicio(data.inicio);
      setPalabraFin(data.fin);
      setMensaje(`Nuevo juego: empieza por "${data.inicio}" y termina en "${data.fin}"`);
      console.log("Solución de prueba:", data.solucion);
    } catch (error) {
      console.error("Error:", error);
      setMensaje("No se pudo iniciar la partida. Revisa la API.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Juego de palabras</h1>
      <button onClick={iniciarJuego}>Nueva partida</button>
      <p>{mensaje}</p>
    </div>
  );
}

export default App;
