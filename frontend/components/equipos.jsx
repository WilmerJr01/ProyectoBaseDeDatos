import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import "../styles/Competencias.css"; // reutilizamos estilos
import EquipoSeleccionado from "./Equipos/EquipoSeleccionado.jsx";
import { interceptorCompetition } from "../functions/functions";

function Equipos() {
  const [ligas, setLigas] = useState([]);
  const [equipos, setEquipos] = useState([]);
  const [selectedLiga, setSelectedLiga] = useState(null);
  const [selectedEquipo, setSelectedEquipo] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/database/competitions")
      .then((response) => {
        const formateadas = response.data.map((nombre) => ({
          value: nombre, // Usamos el nombre directamente
          label: interceptorCompetition(nombre), // Solo modificamos la etiqueta que se mostrará
        }));
        setLigas(formateadas);
      })
      .catch((error) => {
        console.error("Error al obtener competencias:", error);
      });
  }, []);

  useEffect(() => {
    if (!selectedLiga) return;
    axios
      .get(`http://localhost:3000/database/team/${selectedLiga}/0`)
      .then((response) => {
        const opcionesEquipos = response.data.map((nombre) => ({
          value: nombre,
          label: nombre,
        }));
        setEquipos(opcionesEquipos); // Configurar correctamente el estado
        console.log("Equipos:", opcionesEquipos);
      })
      .catch((err) => console.error("Error al cargar equipos", err));
  }, [selectedLiga]);

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

  return (
    <main className="competencias-main">
      <label style={{ color: "white" }}>Selecciona una liga:</label>
      <div className="competencias-select">
        <Select
          options={ligas}
          value={ligas.find((l) => l.value === selectedLiga)}
          onChange={(e) => {
            setSelectedLiga(e ? e.value : null);
            setSelectedEquipo(null);
          }}
          styles={customStyles}
          placeholder="-- Selecciona una liga --"
          isClearable
        />
      </div>

      {selectedLiga && (
        <>
          <label style={{ color: "white", marginTop: "1rem" }}>
            Selecciona un equipo:
          </label>
          <div className="competencias-select">
            <Select
              options={equipos}
              value={equipos.find((e) => e.value === selectedEquipo)}
              onChange={(e) => setSelectedEquipo(e ? e.value : null)}
              styles={customStyles}
              placeholder="-- Selecciona un equipo --"
              isClearable
            />
          </div>
        </>
      )}

      <EquipoSeleccionado equipo={selectedEquipo} liga={selectedLiga} />
    </main>
  );
}

export default Equipos;
