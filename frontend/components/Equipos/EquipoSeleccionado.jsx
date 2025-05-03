import React, { useEffect, useState } from "react";
import axios from "axios";
import EquiposInfo from "./EquiposInfo.jsx";

function EquipoSeleccionado({ equipo, liga }) {
  const [info, setInfo] = useState(null);

  useEffect(() => {
    if (!equipo || !liga) return;

    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/database/goalsByTeam/${liga}/${equipo}`
        );

        const { team, totalGoals } = res.data;

        setInfo({
          name: team,
          totalGoals,
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
      {info ? <EquiposInfo liga={info} /> : <p>Cargando datos...</p>}
    </div>
  );
}

export default EquipoSeleccionado;
