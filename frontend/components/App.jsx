import { Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import "../styles/App.css";
import Header from "./header.jsx";
import Partidos from "./partidos.jsx";
import axios from "axios";
import { formDate } from "../functions/functions.js";

function App() {
  const [partidos, setPartidos] = useState([]);

  useEffect(() => {
    axios.get('http://localhost:3000/database/last')
    .then((response) => {
      setPartidos(response.data);
    })
    .catch((error) => {
      console.error('Error al obtener los partidos:', error);
    })
  }, []);

  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={
          <main>
            <div className="hero">
              <h1>Bienvenido a la App de Fútbol</h1>
              <p>Tu fuente de información sobre competiciones y partidos en directo.</p>
            </div>
            <div className="content">
              <h2>Últimos Partidos</h2>
              <ul className="match-list">
                {partidos.map((partido, index) => (
                  <li key={index} className="match-item">
                    <p>Fecha {formDate(partido.date)}</p>
                  </li>
                ))}
              </ul>
            </div>
          </main>
        } />
        <Route path="/partidos" element={<Partidos />} />
      </Routes>
    </>
  );
}

export default App;
