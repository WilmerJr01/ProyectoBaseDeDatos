import axios from "axios";
import { useState, useEffect } from "react";
import { formDate } from "../functions/functions.js";
import MapaMundi from "./Inicio/MapaMundi.jsx";

function Inicio() {
    const [partidos, setPartidos] = useState([]);

    useEffect(() => {
        axios
            .get("http://localhost:3000/database/last")
            .then((response) => {
                setPartidos(response.data);
            })
            .catch((error) => {
                console.error("Error al obtener los partidos:", error);
            });
    }, []);

    return (
        <main>
            <div className="hero">
                <h1>Bienvenido a la App de Fútbol</h1>
                <p>
                    Tu fuente de información sobre competiciones y partidos en
                    directo.
                </p>
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
            <div className="mapa">
                <MapaMundi />
            </div>
        </main>
    );
}

export default Inicio;
