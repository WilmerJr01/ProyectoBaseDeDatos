import React, { useEffect, useState } from "react";
import axios from "axios";
import liga from "../../functions/liga.js"; // Ajusta la ruta si es necesario
import CompetitionInfo from "./CompetitionInfo.jsx"; // Ajusta la ruta a donde guardaste CompetitionInfo.jsx

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

    // Fetch de goles
    axios
      .get(`http://localhost:3000/database/goals/${competencia}/0`)
      .then((res) => {
        const goles = res.data.totalGoals;
        setTotalGoles(goles);
        liga.totalGoles = goles;
      })
      .catch((err) => console.error("Error goles:", err));

    // Fetch de la primera fecha y cantidad de partidos
    axios
      .get(`http://localhost:3000/database/matchSimple/${competencia}/0`)
      .then((res) => {
        const { firstDate, totalMatches } = res.data;
        const primerAnio = firstDate.toString().slice(0, 4);
        setPrimerAnio(primerAnio);
        setTotalPartidos(totalMatches);
        liga.primerAnio = primerAnio;
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

  // Crear objeto para enviar al componente CompetitionInfo
  const leagueInfo = {
    name: competencia,
    totalGoals: totalGoles || 0,
    totalMatches: totalPartidos || 0,
    firstSeason: primerAnio || "-"
  };

  return (
    <div style={{ color: "white" }}>
      {/* Componente de información de la competencia */}
      <CompetitionInfo liga={leagueInfo} />
    </div>
  );
}

export default CompetenciaSeleccionada;
