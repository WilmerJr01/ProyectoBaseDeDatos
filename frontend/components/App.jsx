import { useState } from "react";
import { useEffect } from "react";
import "../styles/App.css";
import Header from "./header.jsx";
import axios from "axios";
import MapaMundi from "./MapaMundi.jsx";
import { formDate } from "../functions/functionsDB.js";

function App() {
  // Espacio para estados
  // const [count, setCount] = useState(0)
  //onClick={() => setCount((count) => count + 1)}
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

  //Espacio del return
  return (
    <>
      <Header />
      <main>
        <div className="hero">
          <h1>Bienvenido a la App de Fútbol</h1>
          <p>
            Tu fuente de información sobre competiciones y partidos en directo.
          </p>
        </div>
        <div className="content">
          <h2>Últimos Partidos</h2>
          <ul className="match-list">
            {
              partidos.map((partido, index) => (
                <li key={index} className="match-item">
                  <p>Fecha {formDate(partido.date)}</p>
                </li>
              ))
            }
          </ul>
        </div>
      </main>
      <div className="mapa">
        <MapaMundi/>
      </div>
        
    </>
  );
}

export default App;
