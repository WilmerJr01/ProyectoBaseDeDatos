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
import liga from "../../functions/liga.js";
import CompetitionInfo from "./CompetitionInfo.jsx";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function CompetenciaSeleccionada({ competencia }) {
  const [equipos, setEquipos] = useState([]);
  const [totalGoles, setTotalGoles] = useState(null);
  const [primerAnio, setPrimerAnio] = useState(null);
  const [totalPartidos, setTotalPartidos] = useState(null);
  const [golesPorTemporada, setGolesPorTemporada] = useState([]);
  const [anios, setAnios] = useState([]);
  const [anioInicio, setAnioInicio] = useState("");
  const [anioFinal, setAnioFinal] = useState("");

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

  useEffect(() => {
    if (!competencia) return;

    // Determinar la URL según si se ingresaron fechas o no
    const url =
      anioInicio && anioFinal
        ? `http://localhost:3000/database/goalsByYear/${anioInicio}/${anioFinal}/${competencia}`
        : `http://localhost:3000/database/goalsByYear/0/0/${competencia}`; // Sin fechas, obtener todos los datos históricos

    // Fetch de goles por temporada
    axios
      .get(url)
      .then((res) => {
        const { years, goals } = res.data;
        setAnios(years);
        setGolesPorTemporada(goals);
        liga.golesPorTemporada = goals;
      })
      .catch((err) => console.error("Error goles por temporada:", err));
  }, [competencia, anioInicio, anioFinal]);

  if (!competencia) {
    return (
      <h2 style={{ color: "white" }}>
        No se ha seleccionado ninguna competencia
      </h2>
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
        text: `Goles por Año en ${competencia}`,
      },
    },
  };

  return (
    <div style={{ color: "white" }}>
      <CompetitionInfo
        liga={{
          name: competencia,
          totalGoals: totalGoles || 0,
          totalMatches: totalPartidos || 0,
          firstSeason: primerAnio || "-",
        }}
      />

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

export default CompetenciaSeleccionada;
