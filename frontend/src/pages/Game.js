// frontend/src/pages/Game.js
import React, { useState, useEffect } from "react";
import "./Game.css";
import Header from "../components/Header";
import API_URL from "../config";

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
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(darkMode ? "dark-mode" : "light-mode");
  }, []);

  useEffect(() => {
    document.body.classList.remove("light-mode", "dark-mode");
    document.body.classList.add(darkMode ? "dark-mode" : "light-mode");
    localStorage.setItem("modo", darkMode ? "oscuro" : "claro");
  }, [darkMode]);

  useEffect(() => {
    const nuevaPartida = async () => {
      try {
        const res = await fetch(`${API_URL}/nueva_partida`);
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

  const handleEnter = async () => {
    if (!palabra || terminado) return;
    const palabraActual = cadena[cadena.length - 1];

    const res = await fetch(`${API_URL}/jugada`, {
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
        finalizarJuego([...cadena], false);
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
      finalizarJuego(nuevaCadena, true);
    }
  };

  const guardarPartidaLocal = (cadenaFinal, victoria, totalPuntos) => {
  const partidas = JSON.parse(localStorage.getItem("partidas")) || [];
  partidas.push({
    inicio,
    fin,
    cadenaUsuario: cadenaFinal,
    vidasUsadas: 3 - vidas,
    puntos: totalPuntos, // aquí van los puntos totales
    victoria: victoria   // true si ganaste, false si perdiste
  });
  localStorage.setItem("partidas", JSON.stringify(partidas));
};

const finalizarJuego = async (cadenaFinal) => {
  try {
    const res = await fetch(`${API_URL}/puntuacion_detallada`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cadenaFinal),
    });
    const data = await res.json();
    setDetalles(data);

    const totalPuntos = data?.total ?? 0;
    const victoria = cadenaFinal[cadenaFinal.length - 1] === fin;

    guardarPartidaLocal(cadenaFinal, victoria, totalPuntos);

  } catch (err) {
    console.error("Error puntuación:", err);
    // Guardamos partida con 0 puntos si falla
    const totalPuntos = 0;
    const victoria = cadenaFinal[cadenaFinal.length - 1] === fin;
    guardarPartidaLocal(cadenaFinal, victoria, totalPuntos);
  }
};

  const [htmlGrafo, setHtmlGrafo] = useState(null);

  const graficarCadenas = async () => {
    try {
      const res = await fetch(`${API_URL}/grafo`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cadena_usuario: cadena,
          partida: { inicio, fin, solucion },
          max_cadenas_extra: 5,
          tiempo_max: 5
        })
      });
      const data = await res.json();
      if (data.html) {
        setHtmlGrafo(data.html);
      } else {
        alert("Error al generar el grafo: " + data.error);
      }
    } catch (err) {
      console.error(err);
      alert("Error al generar el grafo");
    }
  };

  return (
    <div className={`game-container container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Header darkMode={darkMode} />

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

      <div className="cabecera">
        <h2 className="objetivo">
          Palabra objetivo: <span className="objetivo-texto">{fin}</span>
        </h2>

        <div className="vidas">
          {[...Array(3)].map((_, i) => (
            <span key={i} className={`vida ${i < vidas ? "viva" : "muerta"}`}>
              ❤️
            </span>
          ))}
        </div>
      </div>

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

          <button onClick={graficarCadenas} className="boton-grafo">
            Graficar cadenas
          </button>

          {htmlGrafo && (
            <iframe
              title="grafo-partida"
              srcDoc={htmlGrafo}
              style={{ width: "100%", height: "700px", border: "none", marginTop: "20px" }}
            />
          )}

          <button onClick={() => window.location.reload()} className="boton-reiniciar">
            Nueva partida
          </button>
        </div>
      )}
    </div>
  );
}
