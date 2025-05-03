import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import EquiposInfo from "./EquiposInfo.jsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function EquipoSeleccionado({ equipo, liga }) {
  const [info, setInfo] = useState(null);
  const [golesPorTemporada, setGolesPorTemporada] = useState([]);
  const [anios, setAnios] = useState([]);
  const [anioInicio, setAnioInicio] = useState("");
  const [anioFinal, setAnioFinal] = useState("");

  useEffect(() => {
    if (!equipo || !liga) return;

    const fetchData = async () => {
      try {
        const [golesRes, fechasRes] = await Promise.all([
          axios.get(
            `http://localhost:3000/database/goalsByTeam/${liga}/${equipo}`
          ),
          axios.get(
            `http://localhost:3000/database/matchTeam/${liga}/0/0/${equipo}`
          ),
        ]);

        const { team, totalGoals } = golesRes.data;
        const fechas = fechasRes.data;

        setInfo({
          name: team,
          totalGoals,
          totalMatches: fechas.length,
          firstDate: fechas[0]?.toString().slice(0, 4) || "No disponible",
        });
      } catch (err) {
        console.error("Error al obtener info del equipo:", err);
      }
    };

    fetchData();
  }, [equipo, liga]);

  useEffect(() => {
    if (!equipo || !liga) return;

    // Determinar la URL según si se ingresaron fechas o no
    const url =
      anioInicio && anioFinal
        ? `http://localhost:3000/database/goalsByYearTeam/${anioInicio}/${anioFinal}/${liga}/${equipo}`
        : `http://localhost:3000/database/goalsByYearTeam/0/0/${liga}/${equipo}`; // Sin fechas, obtener todos los datos históricos

    // Fetch de goles por temporada
    axios
      .get(url)
      .then((res) => {
        const { years, goals } = res.data;
        setAnios(years);
        setGolesPorTemporada(goals);
      })
      .catch((err) =>
        console.error("Error goles por temporada del equipo:", err)
      );
  }, [equipo, liga, anioInicio, anioFinal]);

  if (!equipo) {
    return (
      <h2 style={{ color: "white" }}>No se ha seleccionado ningún equipo</h2>
    );
  }

  // Configuración de los datos para la gráfica
  const data = {
    labels: anios,
    datasets: [
      {
        label: "Goles por Año",
        data: golesPorTemporada,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Goles por Año de ${equipo} en ${liga}`,
      },
    },
  };

  return (
    <div style={{ color: "white" }}>
      {info ? <EquiposInfo liga={info} /> : <p>Cargando datos...</p>}

      {/* Selectores de rango de años */}
      <div style={{ marginTop: "20px" }}>
        <label htmlFor="anioInicio" style={{ marginRight: "10px" }}>
          Año de Inicio:
        </label>
        <input
          type="number"
          id="anioInicio"
          value={anioInicio}
          onChange={(e) => setAnioInicio(e.target.value)}
          style={{ marginRight: "20px" }}
        />
        <label htmlFor="anioFinal" style={{ marginRight: "10px" }}>
          Año Final:
        </label>
        <input
          type="number"
          id="anioFinal"
          value={anioFinal}
          onChange={(e) => setAnioFinal(e.target.value)}
        />
      </div>

      {/* Contenedor para la gráfica */}
      <div
        id="chart-container"
        style={{ marginTop: "20px", textAlign: "center" }}
      >
        <h3>Gráfica de datos</h3>
        <div style={{ width: "80%", margin: "0 auto", height: "400px" }}>
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default EquipoSeleccionado;
