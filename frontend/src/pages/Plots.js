import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, Legend 
} from "recharts";
import "./Plots.css";
import API_URL from "../config";

export default function Plots({ darkMode, setDarkMode }) {
  const [partidas, setPartidas] = useState([]);
  const [selectedGrafo, setSelectedGrafo] = useState(null);

  useEffect(() => {
    const partidasGuardadas = JSON.parse(localStorage.getItem("partidas")) || [];
    setPartidas(partidasGuardadas.reverse());
  }, []);

  const graficarCadena = async (partida) => {
    try {
      const res = await fetch("`${API_URL}/grafo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cadena_usuario: partida.cadenaUsuario,
          partida: { inicio: partida.inicio, fin: partida.fin, solucion: partida.solucion },
          max_cadenas_extra: 5,
          tiempo_max: 5
        }),
      });
      const data = await res.json();
      if (data.html) setSelectedGrafo(data.html);
      else alert("Error al generar el grafo: " + data.error);
    } catch (err) {
      console.error(err);
      alert("Error al generar el grafo");
    }
  };

  const puntosData = partidas.map((p, i) => ({
    name: `P${partidas.length - i}`,
    puntos: p.puntos || 0,
  }));

  const palabrasData = partidas.map((p, i) => ({
    name: `P${partidas.length - i}`,
    palabras: p.cadenaUsuario.length,
  }));

  const total = partidas.length;
  const victorias = partidas.filter(p => p.victoria).length;
  const victoriasData = [
    { name: "Ganadas", value: victorias },
    { name: "Perdidas", value: total - victorias },
  ];
  const COLORS = ["#82ca9d", "#ff7f7f"];

  return (
    <div className={`plots-container container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <Header darkMode={darkMode} />

      {/* Toggle modo oscuro */}
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

      <h2>Estadísticas de tus partidas</h2>

      {partidas.length === 0 ? (
        <p>No hay partidas guardadas aún.</p>
      ) : (
        <>
          <div className="cards-grid">
            <div className="card">
              <h3>Puntos conseguidos</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={puntosData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="puntos" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3>Palabras usadas</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={palabrasData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="palabras" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="card">
              <h3>Porcentaje victorias</h3>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie
                    data={victoriasData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={70}
                    label
                  >
                    {victoriasData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Legend />
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <h3>Historial de partidas</h3>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Inicio</th>
                  <th>Fin</th>
                  <th>Puntos</th>
                  <th>Victoria</th>
                  <th>Cadena</th>
                  <th>Grafo</th>
                </tr>
              </thead>
              <tbody>
                {partidas.map((p, i) => (
                  <tr key={i}>
                    <td>{partidas.length - i}</td>
                    <td>{p.inicio}</td>
                    <td>{p.fin}</td>
                    <td>{p.puntos || 0}</td>
                    <td>{p.victoria ? "✅" : "❌"}</td>
                    <td>{p.cadenaUsuario.join(" → ")}</td>
                    <td>
                      <button className="boton-grafo" onClick={() => graficarCadena(p)}>
                        Graficar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedGrafo && (
            <iframe
              title="grafo-partida"
              srcDoc={selectedGrafo}
              style={{ width: "100%", height: "700px", border: "none", marginTop: "20px" }}
            />
          )}
        </>
      )}
    </div>
  );
}
