// Header.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./Header.css";

export default function Header({ darkMode }) {
  const navigate = useNavigate();
  const location = useLocation();

  // Ajustamos las rutas a las que realmente existen
  const menuItems = [
    { name: "Inicio", path: "/" },
    { name: "Jugar", path: "/juego" },
    { name: "Gráficas", path: "/plots" },
  ];

  return (
    <header className={`header ${darkMode ? "dark-mode" : "light-mode"}`}>
      <div className="header-left">
        <h1>W[ojo]rd Ladder</h1>
      </div>
      <nav className="header-right">
        {menuItems.map((item) => (
          <button
            key={item.path}
            className={location.pathname === item.path ? "active" : ""}
            onClick={() => navigate(item.path)}
          >
            {item.name}
          </button>
        ))}
      </nav>
    </header>
  );
}
