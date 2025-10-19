import React, { useState, useEffect } from "react";

function Juego() {
  const [inicio, setInicio] = useState("");
  const [fin, setFin] = useState("");
  const [solucion, setSolucion] = useState([]);
  const [cadena, setCadena] = useState([]);
  const [palabra, setPalabra] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [terminado, setTerminado] = useState(false);
  const [puntuacion, setPuntuacion] = useState(null);

  useEffect(() => {
    const iniciar = async () => {
      const res = await fetch("http://127.0.0.1:8000/nueva_partida");
      const data = await res.json();
      setInicio(data.inicio);
      setFin(data.fin);
      setSolucion(data.solucion);
      setCadena([data.inicio]);
    };
    iniciar();
  }, []);

  const enviarPalabra = async () => {
    const actual = cadena[cadena.length - 1];
    const res = await fetch(
      `http://127.0.0.1:8000/comprobar_palabra?palabra_actual=${actual}&palabra_nueva=${palabra}`,
      { method: "POST" }
    );
    const data = await res.json();

    if (!data.valida) {
      setMensaje("❌ " + data.motivo);
      return;
    }

    const nuevaCadena = [...cadena, palabra];
    setCadena(nuevaCadena);
    setPalabra("");
    setMensaje("");

    if (palabra === fin) {
      const res2 = await fetch("http://127.0.0.1:8000/puntuacion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevaCadena),
      });
      const result = await res2.json();
      setPuntuacion(result.puntuacion);
      setTerminado(true);
    }
  };

  if (!inicio) return <h2 style={{ textAlign: "center" }}>Cargando partida...</h2>;

  return (
    <div style={{ textAlign: "center", marginTop: "40px" }}>
      <h2>Palabra inicial: {inicio}</h2>
      <h3>Palabra final: {fin}</h3>

      {!terminado ? (
        <>
          <p>Introduce una palabra vecina:</p>
          <input
            type="text"
            value={palabra}
            onChange={(e) => setPalabra(e.target.value)}
            style={{ fontSize: "18px", padding: "5px" }}
          />
          <button onClick={enviarPalabra} style={{ marginLeft: "10px", fontSize: "18px" }}>
            Enviar
          </button>
          <p>{mensaje}</p>
          <p>Tu cadena: {cadena.join(" → ")}</p>
        </>
      ) : (
        <>
          <h3>🎉 ¡Has llegado a la meta!</h3>
          <p>Tu puntuación: {puntuacion}</p>
          <p> Tu cadena: {cadena.join(" → ")}</p>
          <p>Cadena de generación: {solucion.join(" → ")}</p>
        </>
      )}
    </div>
  );
}

export default Juego;
