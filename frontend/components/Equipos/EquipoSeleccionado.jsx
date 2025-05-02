import React, { useEffect, useState } from "react";
import axios from "axios";
import CompetitionInfo from "../Competencias/CompetitionInfo.jsx";

function EquipoSeleccionado({ equipo, liga }) {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (!equipo || !liga) return;

    const fetchData = async () => {
      try {
        const [golesRes, partidosRes] = await Promise.all([
          axios.get(`http://localhost:3000/database/goals/${liga}/${equipo}`),
          axios.get(`http://localhost:3000/database/matchSimple/${liga}/${equipo}`),
        ]);

        const goles = golesRes.data.totalGoals;
        const { firstDate, totalMatches } = partidosRes.data;
        const primerAnio = firstDate.toString().slice(0, 4);

        setInfo({
          name: equipo,
          totalGoals: goles,
          totalMatches: totalMatches,
          firstSeason: primerAnio,
        });
      } catch (err) {
        console.error("Error al obtener info del equipo:", err);
      }
    };

    fetchData();
  }, [equipo, liga]);

  if (!equipo) {
    return <h2 style={{ color: "white" }}>No se ha seleccionado ningún equipo</h2>;
  }

  return (
    <div style={{ color: "white" }}>
      {info ? <CompetitionInfo liga={info} /> : <p>Cargando datos...</p>}
    </div>
  );
}

export default EquipoSeleccionado;
