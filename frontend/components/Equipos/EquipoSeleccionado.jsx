import React, { useEffect, useState } from "react";
import axios from "axios";
import EquiposInfo from "./EquiposInfo.jsx";

function EquipoSeleccionado({ equipo, liga }) {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (!equipo || !liga) return;

    const fetchData = async () => {
      try {
        const [golesRes, fechasRes] = await Promise.all([
          axios.get(`http://localhost:3000/database/goalsByTeam/${liga}/${equipo}`),
          axios.get(`http://localhost:3000/database/matchTeam/${liga}/0/0/${equipo}`)
        ]);

        const { team, totalGoals } = golesRes.data;
        const fechas = fechasRes.data;

        setInfo({
          name: team,
          totalGoals,
          totalMatches: fechas.length,
          firstDate: fechas[0].toString().slice(0,4) || "No disponible"
        });

        console.log(info)
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
      {info ? <EquiposInfo liga={info} /> : <p>Cargando datos...</p>}
    </div>
  );
}

export default EquipoSeleccionado;
