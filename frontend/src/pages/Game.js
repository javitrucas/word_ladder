// src/pages/Game.js
import React, { useState, useEffect } from "react";

export default function Game() {
  const [partida, setPartida] = useState(null);
  const [cadena, setCadena] = useState([]);
  const [palabra, setPalabra] = useState("");
  const [estado, setEstado] = useState(null); // "ok", "error", null
  const [mensaje, setMensaje] = useState("");
  const [terminado, setTerminado] = useState(false);
  const [miDetalle, setMiDetalle] = useState(null);
  const [solDetalle, setSolDetalle] = useState(null);

  // Cargar nueva partida en cada carga de la página
  useEffect(() => {
    const iniciarPartida = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/nueva_partida");
        if (!res.ok) throw new Error("No se pudo obtener partida");
        const data = await res.json();
        setPartida(data);
        setCadena([data.inicio]);
        setPalabra("");
        setEstado(null);
        setMensaje("");
        setTerminado(false);
        setMiDetalle(null);
        setSolDetalle(null);
      } catch (err) {
        console.error("Error iniciando partida:", err);
        setMensaje("Error al iniciar partida. Revisa el backend.");
      }
    };

    iniciarPartida();
  }, []); // vacío => se ejecuta al montar (cada recarga de la página)

  const handleInput = (e) => {
    setPalabra(e.target.value.toLowerCase());
    setEstado(null);
    setMensaje("");
  };

  const enviarPalabra = async () => {
    if (!palabra) return;
    if (!partida) return;

    const palabraActual = cadena[cadena.length - 1];

    try {
      const res = await fetch(
        `http://127.0.0.1:8000/comprobar_palabra?palabra_actual=${encodeURIComponent(
          palabraActual
        )}&palabra_nueva=${encodeURIComponent(palabra)}`,
        { method: "POST" }
      );
      const data = await res.json();

      if (!data.valida) {
        setEstado("error");
        setMensaje(data.motivo || "Palabra inválida");
        return;
      }

      // palabra válida: añadimos a la cadena
      const nuevaCadena = [...cadena, palabra];
      setCadena(nuevaCadena);
      setPalabra("");
      setEstado("ok");
      setMensaje("");

      // si llegamos al final
      if (palabra === partida.fin) {
        setTerminado(true);
        // pedir puntuaciones detalladas tanto para la cadena del jugador como para la solución
        try {
          const detalleMi = await fetch("http://127.0.0.1:8000/puntuacion_detallada", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(nuevaCadena),
          });
          const detalleMiJson = await detalleMi.json();
          setMiDetalle(detalleMiJson);

          const detalleSol = await fetch("http://127.0.0.1:8000/puntuacion_detallada", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(partida.solucion),
          });
          const detalleSolJson = await detalleSol.json();
          setSolDetalle(detalleSolJson);
        } catch (err) {
          console.error("Error obteniendo puntuaciones detalladas:", err);
          setMensaje("Error al calcular puntuaciones.");
        }
      }
    } catch (err) {
      console.error(err);
      setMensaje("Error de conexión con el servidor.");
      setEstado("error");
    }
  };

  if (!partida) return <p style={{ textAlign: "center" }}>Cargando partida...</p>;

  return (
    <div style={{ textAlign: "center", marginTop: "40px", padding: "1rem" }}>
      <h2>
        De <span style={{ color: "#16a34a" }}>{partida.inicio}</span> a{" "}
        <span style={{ color: "#dc2626" }}>{partida.fin}</span>
      </h2>

      <div style={{ margin: "1rem 0" }}>
        <strong>Tu cadena:</strong>
        <div style={{ marginTop: "8px" }}>
          {cadena.map((p, i) => (
            <span
              key={i}
              style={{
                background: "#e0e7ff",
                padding: "6px 10px",
                borderRadius: "8px",
                margin: "0 6px",
                display: "inline-block",
              }}
            >
              {p}
            </span>
          ))}
        </div>
      </div>

      {!terminado ? (
        <>
          <input
            type="text"
            value={palabra}
            onChange={handleInput}
            placeholder="Escribe una palabra vecina..."
            style={{
              padding: "8px",
              fontSize: "16px",
              borderRadius: "8px",
              border: estado === "error" ? "2px solid red" : "2px solid #ccc",
              outline: "none",
              width: "220px",
            }}
          />
          <button
            onClick={enviarPalabra}
            style={{
              marginLeft: "10px",
              padding: "8px 12px",
              borderRadius: "8px",
              background: "#2a6df4",
              color: "#fff",
              border: "none",
              cursor: "pointer",
            }}
          >
            Comprobar
          </button>

          {mensaje && <p style={{ color: estado === "error" ? "#dc2626" : "#16a34a" }}>{mensaje}</p>}
        </>
      ) : (
        <>
          <h3>🎉 ¡Has llegado a la meta!</h3>

          {miDetalle && (
            <div style={{ marginTop: "12px", textAlign: "left", display: "inline-block" }}>
              <h4>Tu cadena:</h4>
              <ul>
                {miDetalle.detalles.map((d, idx) => (
                  <li key={idx}>
                    <strong>{d.palabra}</strong> — {d.puntuacion !== null ? d.puntuacion : "N/A"}
                  </li>
                ))}
              </ul>
              <p><strong>Total:</strong> {miDetalle.total}</p>
            </div>
          )}

          {solDetalle && (
            <div style={{ marginTop: "12px", textAlign: "left", display: "inline-block", marginLeft: "30px" }}>
              <h4>Cadena generada por el juego:</h4>
              <ul>
                {solDetalle.detalles.map((d, idx) => (
                  <li key={idx}>
                    <strong>{d.palabra}</strong> — {d.puntuacion !== null ? d.puntuacion : "N/A"}
                  </li>
                ))}
              </ul>
              <p><strong>Total:</strong> {solDetalle.total}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
