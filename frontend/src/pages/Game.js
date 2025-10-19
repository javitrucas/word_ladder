import React, { useState, useEffect } from "react";
import "./Game.css";
import Header from "../components/Header";

export default function Game() {
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [vidas, setVidas] = useState(3);
  const [cadena, setCadena] = useState([]);
  const [palabra, setPalabra] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [colores, setColores] = useState([]);
  const [terminado, setTerminado] = useState(false);
  const [detalles, setDetalles] = useState(null);
  const [solucion, setSolucion] = useState([]);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("modo") === "oscuro"
  );

  useEffect(() => {
    const nuevaPartida = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/nueva_partida");
        const data = await res.json();
        setInicio(data.inicio);
        setFin(data.fin);
        setCadena([data.inicio]);
        setSolucion(data.solucion);
        setVidas(3);
        setMensaje("");
        setTerminado(false);
        setDetalles(null);
        setColores([[...Array(data.inicio.length).fill(null)]]);
      } catch (err) {
        console.error("Error al iniciar partida", err);
      }
    };
    nuevaPartida();
  }, []);

  useEffect(() => {
    document.body.classList.toggle("dark-mode", darkMode);
    document.body.classList.toggle("light-mode", !darkMode);
    localStorage.setItem("modo", darkMode ? "oscuro" : "claro");
  }, [darkMode]);

  const handleEnter = async () => {
    if (!palabra || terminado) return;
    const palabraActual = cadena[cadena.length - 1];

    const res = await fetch("http://127.0.0.1:8000/jugada", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        palabra_actual: palabraActual,
        palabra_nueva: palabra,
        palabras_usadas: cadena,
        vidas: vidas,
      }),
    });

    const data = await res.json();

    if (!data.valida) {
      setMensaje(data.motivo);
      setVidas(data.vidas);
      if (data.game_over || data.vidas === 0) {
        setTerminado(true);
        finalizarJuego([...cadena]);
      }
      return;
    }

    const nuevaCadena = [...cadena, palabra];
    const nuevosColores = [...colores, data.colores];
    setCadena(nuevaCadena);
    setColores(nuevosColores);
    setPalabra("");
    setMensaje("");

    if (palabra === fin) {
      setTerminado(true);
      finalizarJuego(nuevaCadena);
    }
  };

  const finalizarJuego = async (cadenaFinal) => {
    try {
      const res = await fetch("http://127.0.0.1:8000/puntuacion_detallada", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cadenaFinal),
      });
      const data = await res.json();
      setDetalles(data);
    } catch (err) {
      console.error("Error puntuación:", err);
    }
  };

  return (
    <div className={`game-container container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Header darkMode={darkMode} />
      
      {/* Botón modo oscuro */}
      <div className="dark-mode-toggle">
        <label className="switch">
          <input
            type="checkbox"
            checked={darkMode}
            onChange={() => setDarkMode(!darkMode)}
          />
          <span className="slider"></span>
        </label>
      </div>

      {/* CABECERA */}
      <div className="cabecera">
        <h2 className="objetivo">
          Palabra objetivo:{" "}
          <span className="objetivo-texto">{fin}</span>
        </h2>

        <div className="vidas">
          {[...Array(3)].map((_, i) => (
            <span key={i} className={`vida ${i < vidas ? "viva" : "muerta"}`}>
              ❤️
            </span>
          ))}
        </div>
      </div>

      {/* CADENA */}
      <div className="cadena">
        {cadena.map((pal, i) => (
          <div key={i} className="palabra">
            {pal.split("").map((letra, j) => (
              <span
                key={j}
                className={`letra ${
                  colores[i]?.[j] === "green"
                    ? "verde"
                    : colores[i]?.[j] === "yellow"
                    ? "amarillo"
                    : colores[i]?.[j] === "red"
                    ? "rojo"
                    : ""
                }`}
              >
                {letra}
              </span>
            ))}
          </div>
        ))}
      </div>

      {/* INPUT */}
      {!terminado && (
        <div className="input-zone">
          <input
            className="input-palabra"
            type="text"
            placeholder="Escribe una palabra..."
            value={palabra}
            onChange={(e) => setPalabra(e.target.value.toLowerCase())}
            onKeyDown={(e) => e.key === "Enter" && handleEnter()}
          />
          <button className="boton" onClick={handleEnter}>⏎</button>
        </div>
      )}

      {mensaje && <p className="mensaje">{mensaje}</p>}

      {/* FINAL */}
      {terminado && (
        <div className="final">
          <h3>Juego terminado</h3>
          <p>Inicio: <strong>{inicio}</strong></p>
          <p>Final: <strong>{fin}</strong></p>

          {detalles && (
            <div className="puntuacion">
              <h4>Tu cadena:</h4>
              <ul>
                {detalles.detalles.map((d, i) => (
                  <li key={i}>
                    {d.palabra} → {d.puntuacion ?? "❌"}
                  </li>
                ))}
              </ul>
              <p><strong>Total:</strong> {detalles.total}</p>
            </div>
          )}

          <button onClick={() => window.location.reload()} className="boton-reiniciar">
            Nueva partida
          </button>
        </div>
      )}
    </div>
  );
}
