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

  // Nueva gráfica: Partidos jugados por año
  const [partidosPorAnio, setPartidosPorAnio] = useState([]);
  const [aniosPartidos, setAniosPartidos] = useState([]);
  const [anioInicioPartidos, setAnioInicioPartidos] = useState("");
  const [anioFinalPartidos, setAnioFinalPartidos] = useState("");

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

  useEffect(() => {
    if (!competencia) return;

    // Determinar la URL según si se ingresaron fechas o no
    const url =
      anioInicioPartidos && anioFinalPartidos
        ? `http://localhost:3000/database/matchByYear/${anioInicioPartidos}/${anioFinalPartidos}/${competencia}`
        : `http://localhost:3000/database/matchByYear/0/0/${competencia}`; // Sin fechas, obtener todos los datos históricos

    // Fetch de partidos por temporada
    axios
      .get(url)
      .then((res) => {
        const { years, matches } = res.data;
        setAniosPartidos(years);
        setPartidosPorAnio(matches);
      })
      .catch((err) => console.error("Error partidos por temporada:", err));
  }, [competencia, anioInicioPartidos, anioFinalPartidos]);

  if (!competencia) {
    return (
      <h2 style={{ color: "white" }}>
        No se ha seleccionado ninguna competencia
      </h2>
    );
  }

  // Configuración de los datos para la gráfica de goles
  const dataGoles = {
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

  const optionsGoles = {
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

  // Configuración de los datos para la gráfica de partidos
  const dataPartidos = {
    labels: aniosPartidos,
    datasets: [
      {
        label: "Partidos por Año",
        data: partidosPorAnio,
        backgroundColor: "rgba(255, 99, 132, 0.6)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const optionsPartidos = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Partidos por Año en ${competencia}`,
      },
    },
  };

  // ... Todo el código anterior permanece igual ...

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

    {/* CONTENEDOR CENTRAL GENERAL */}
    <div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Centrado horizontal
    width: "100%",
    marginTop: "60px", // Más espacio respecto a la tarjeta
  }}
>
      {/* Selectores de rango de años para goles */}
      <div style={{ marginBottom: "30px" }}>
        <label htmlFor="anioInicio" style={{ marginRight: "10px", color: "white" }}>
          Año de Inicio (Goles):
        </label>
        <input
          type="number"
          id="anioInicio"
          value={anioInicio}
          onChange={(e) => setAnioInicio(e.target.value)}
          style={{
            marginRight: "20px",
            backgroundColor: "transparent",
            border: "none",
            borderBottom: "1px solid white",
            color: "white",
            outline: "none",
          }}
        />
        <label htmlFor="anioFinal" style={{ marginRight: "10px", color: "white" }}>
          Año Final (Goles):
        </label>
        <input
          type="number"
          id="anioFinal"
          value={anioFinal}
          onChange={(e) => setAnioFinal(e.target.value)}
          style={{
            backgroundColor: "transparent",
            border: "none",
            borderBottom: "1px solid white",
            color: "white",
            outline: "none",
          }}
        />
      </div>

      {/* Gráfica de Goles */}
      <div
    id="chart-container-goles"
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
    }}
  >
    <h3 style={{ color: "white", textAlign: "center" }}>Gráfica de Goles</h3>
    <div style={{ width: "60%", maxWidth: "800px", height: "400px" }}>
      <Bar data={dataGoles} options={optionsGoles} />
    </div>
  </div>



      {/* Selectores de rango de años para partidos */}

      <div
  style={{
    display: "flex",
    flexDirection: "column",
    alignItems: "center", // Centrado horizontal
    width: "100%",
    marginTop: "100px", // Más espacio respecto a la tarjeta
  }}
></div>
      <div style={{ marginBottom: "20px" }}>
        <label htmlFor="anioInicioPartidos" style={{ marginRight: "10px", color: "white" }}>
          Año de Inicio (Partidos):
        </label>
        <input
          type="number"
          id="anioInicioPartidos"
          value={anioInicioPartidos}
          onChange={(e) => setAnioInicioPartidos(e.target.value)}
          style={{
            marginRight: "20px",
            backgroundColor: "transparent",
            border: "none",
            borderBottom: "1px solid white",
            color: "white",
            outline: "none",
          }}
        />
        <label htmlFor="anioFinalPartidos" style={{ marginRight: "10px", color: "white" }}>
          Año Final (Partidos):
        </label>
        <input
          type="number"
          id="anioFinalPartidos"
          value={anioFinalPartidos}
          onChange={(e) => setAnioFinalPartidos(e.target.value)}
          style={{
            backgroundColor: "transparent",
            border: "none",
            borderBottom: "1px solid white",
            color: "white",
            outline: "none",
          }}
        />
      </div>

      {/* Gráfica de Partidos */}
      <div
    id="chart-container-partidos"
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      width: "100%",
    }}
  >
    <h3 style={{ color: "white", textAlign: "center" }}>Gráfica de Partidos</h3>
    <div style={{ width: "60%", maxWidth: "800px", height: "400px" }}>
      <Bar data={dataPartidos} options={optionsPartidos} />
    </div>
  </div>
    </div>
  </div>
);
}

export default CompetenciaSeleccionada;
