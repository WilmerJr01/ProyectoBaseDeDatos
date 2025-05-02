import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2"; // Importar el componente de gráfica
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import liga from "../../functions/liga.js"; // Ajusta la ruta si es necesario
import CompetitionInfo from "./CompetitionInfo.jsx"; // Ajusta la ruta a donde guardaste CompetitionInfo.jsx

// Registrar los componentes de Chart.js
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
  const [golesPorTemporada, setGolesPorTemporada] = useState([]); // Datos de goles por temporada
  const [anios, setAnios] = useState([]); // Años correspondientes

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

    // Fetch de goles por temporada
    axios
      .get(`http://localhost:3000/database/goalsBySeason/${competencia}`)
      .then((res) => {
        const { seasons, goals } = res.data;
        setAnios(seasons); // Guardar los años
        setGolesPorTemporada(goals); // Guardar los goles por temporada
      })
      .catch((err) => console.error("Error goles por temporada:", err));
  }, [competencia]);

  if (!competencia) {
    return (
      <h2 style={{ color: "white" }}>
        No se ha seleccionado ninguna competencia
      </h2>
    );
  }

  // Configuración de los datos para la gráfica
  const data = {
    labels: anios, // Años como etiquetas
    datasets: [
      {
        label: "Goles por temporada",
        data: golesPorTemporada, // Goles por temporada
        backgroundColor: "rgba(75, 192, 192, 0.6)", // Color de las barras
        borderColor: "rgba(75, 192, 192, 1)", // Color del borde
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
        text: `Goles por temporada en ${competencia}`,
      },
    },
  };

  return (
    <div style={{ color: "white" }}>
      {/* Componente de información de la competencia */}
      <CompetitionInfo
        liga={{
          name: competencia,
          totalGoals: totalGoles || 0,
          totalMatches: totalPartidos || 0,
          firstSeason: primerAnio || "-",
        }}
      />

      {/* Contenedor para la gráfica */}
      <div
        id="chart-container"
        style={{ marginTop: "20px", textAlign: "center" }}
      >
        <h3>Gráfica de datos</h3>
        <div style={{ width: "80%", margin: "0 auto", height: "400px" }}>
          {/* Renderizar la gráfica */}
          <Bar data={data} options={options} />
        </div>
      </div>
    </div>
  );
}

export default CompetenciaSeleccionada;
