import React, { useEffect, useState } from "react";
import axios from "axios";
import liga from "../functions/liga.js"; // Ajusta la ruta si es necesario

function CompetenciaSeleccionada({ competencia }) {
    const [equipos, setEquipos] = useState([]);
    const [totalGoles, setTotalGoles] = useState(null);
    const [primerAnio, setPrimerAnio] = useState(null);
    const [totalPartidos, setTotalPartidos] = useState(null);

    useEffect(() => {
        if (!competencia) return;

        liga.nombre = competencia;
        liga.pais = competencia;

        // Fetch de equipos
        axios
            .get(`http://localhost:3000/database/team/${competencia}/0`)
            .then((res) => {
                setEquipos(res.data);
                liga.equipos = res.data;
            })
            .catch((err) => console.error("Error equipos:", err));

        // Fetch de partidos
        axios
            .get(`http://localhost:3000/database/match/${competencia}/0`)
            .then((res) => {
                const partidos = res.data;
                liga.totalPartidos = partidos.length;
                setTotalPartidos(partidos.length);

                const totalG = partidos.reduce(
                    (sum, p) => sum + (p.goalsHome || 0) + (p.goalsAway || 0),
                    0
                );
                liga.totalGoles = totalG;
                setTotalGoles(totalG);

                const fechas = partidos.map((p) => p.date);
                const primer = Math.min(...fechas)
                    .toString()
                    .slice(0, 4);
                liga.primerAnio = primer;
                setPrimerAnio(primer);
            })
            .catch((err) => console.error("Error partidos:", err));
    }, [competencia]);

    if (!competencia) {
        return (
            <h2 style={{ color: "white" }}>
                No se ha seleccionado ninguna competencia
            </h2>
        );
    }

    return (
        <div style={{ color: "white" }}>
            <h1>Equipos en {liga.nombre}</h1>

            <p>Total de equipos: {equipos.length || "Cargando..."}</p>
            <p>
                Total de goles:{" "}
                {totalGoles !== null ? totalGoles : "Cargando..."}
            </p>
            <p>Primer año con registro: {primerAnio || "Cargando..."}</p>
            <p>
                Total de partidos:{" "}
                {totalPartidos !== null ? totalPartidos : "Cargando..."}
            </p>

            <ul style={{ listStyle: "none", padding: 0 }}>
                {equipos.map((team, idx) => (
                    <li key={idx}>
                        Nombre: {typeof team === "string" ? team : team.name}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default CompetenciaSeleccionada;
