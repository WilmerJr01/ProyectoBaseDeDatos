import axios from "axios";
import { useState, useEffect } from "react";
import {
  interceptorCompetition,
  interceptorCompetitionCountry,
} from "../functions/functions.js";
import MapaMundi from "./Inicio/MapaMundi.jsx";
import CompeticionLogos from "./Inicio/CompetitionLogo.jsx";
import "../styles/Inicio.css";
import Select from "react-select";

function Inicio() {
  const [paisSeleccionado, setPaisSeleccionado] = useState(null);
  const [competitionsInfo, setCompetitionsInfo] = useState([]);
  const [filtroContinente, setFiltroContinente] = useState(null); // Cambiar "" a null

  useEffect(() => {
    axios
      .get("http://localhost:3000/database/competitionsInfo")
      .then((res) => setCompetitionsInfo(res.data))
      .catch((err) => console.error("Error al obtener info:", err));
  }, []);

  const customStyles = {
    control: (provided) => ({
      ...provided,
      backgroundColor: "transparent",
      border: "none",
      borderBottom: "2px solid white",
      borderRadius: 0,
      boxShadow: "none",
      minHeight: "30px",
      fontSize: "15px",
      color: "white",
      width: "300px",
    }),
    menu: (provided) => ({
        ...provided,
        backgroundColor: "transparent",
        zIndex: 9999,
        position: "absolute",
      }),
    menuList: (provided) => ({
      ...provided,
      backgroundColor: "transparent",
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused ? "rgb(83, 79, 79)" : "#151219",
      color: "white",
      cursor: "pointer",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "white",
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      color: "white",
      padding: "2px",
    }),
    indicatorSeparator: () => ({ display: "none" }),
  };

  const continentes = [
    { value: null, label: "Todos" }, // Cambiar "" a null
    { value: "Europe", label: "Competencias europeas" },
    { value: "South America", label: "Competencias sudamericanas" },
    { value: "goles", label: "Cantidad de goles" },
  ];
  

  return (
    <main className="inicio">
      <div className="logos">
        <CompeticionLogos competitions={competitionsInfo} />
      </div>

      <div className="contenido">
        <div className="panel-izquierdo">
          <img
            src={
              paisSeleccionado
                ? `../../assets/${paisSeleccionado}.webp`
                : `../../assets/mascota.png`
            }
            alt={paisSeleccionado || "Mascota"}
          />
          <h2>{interceptorCompetition(paisSeleccionado)}</h2>
          <p>{interceptorCompetitionCountry(paisSeleccionado)}</p>
        </div>

        <div className="panel-derecho">
          <div className="filtro-continente">
            <label htmlFor="filtro">Filtrar por:</label>
            <Select
              id="filtro"
              className="select"
              options={continentes}
              value={continentes.find((c) => c.value === filtroContinente)}
              onChange={(e) => setFiltroContinente(e ? e.value : null)} // Manejar null correctamente
              styles={customStyles}
              placeholder="-- Selecciona un continente --"
              isClearable
            />
          </div>

          <MapaMundi
            competitionsInfo={competitionsInfo}
            filtroContinente={filtroContinente}
            onCountrySelect={setPaisSeleccionado}
            modoGoles={filtroContinente === "goles"}
          />
        </div>
      </div>
    </main>
  );
}

export default Inicio;
