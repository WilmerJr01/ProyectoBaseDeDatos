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

  // Estados para la nueva gráfica
  const [partidosPorAnio, setPartidosPorAnio] = useState([]);
  const [aniosPartidos, setAniosPartidos] = useState([]);
  const [anioInicioPartidos, setAnioInicioPartidos] = useState("");
  const [anioFinalPartidos, setAnioFinalPartidos] = useState("");

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
      anioInicio.trim() !== "" && anioFinal.trim() !== ""
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

  // Nueva lógica para la gráfica de partidos por año
  useEffect(() => {
    if (!equipo || !liga) return;

    // Determinar la URL según si se ingresaron fechas o no
    const url =
      anioInicioPartidos.trim() !== "" && anioFinalPartidos.trim() !== ""
        ? `http://localhost:3000/database/matchByYearTeam/${anioInicioPartidos}/${anioFinalPartidos}/${liga}/${equipo}`
        : `http://localhost:3000/database/matchByYearTeam/0/0/${liga}/${equipo}`; // Sin fechas, obtener todos los datos históricos

    // Fetch de partidos por temporada
    axios
      .get(url)
      .then((res) => {
        const { years, matches } = res.data;
        setAniosPartidos(years);
        setPartidosPorAnio(matches);
      })
      .catch((err) =>
        console.error("Error partidos por temporada del equipo:", err)
      );
  }, [equipo, liga, anioInicioPartidos, anioFinalPartidos]);

  if (!equipo) {
    return (
      <h2 style={{ color: "white" }}>No se ha seleccionado ningún equipo</h2>
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
        text: `Goles por Año de ${equipo} en ${liga}`,
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
        text: `Partidos por Año de ${equipo} en ${liga}`,
      },
    },
  };

  return (
    <div style={{ color: "white" }}>
      {info ? <EquiposInfo liga={info} /> : <p>Cargando datos...</p>}

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
export default EquipoSeleccionado;
