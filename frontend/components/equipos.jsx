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
    console.log("Cargando ligas desde el backend...");
    axios
      .get("http://localhost:3000/database/competitions")
      .then((response) => {
        const opciones = response.data.map((liga) => ({
          value: liga.name,
          label: liga.name,
        }));
        
        setLigas(opciones);
      })
      .catch((err) => console.error("Error al cargar ligas", err));
  }, []);

  useEffect(() => {
    if (!selectedLiga) return;
    axios
      .get(`http://localhost:3000/database/teams/${selectedLiga}/0`)
      .then((response) => {
        const opcionesEquipos = response.data.map((nombre) => ({
          value: nombre,
          label: nombre,
        }));
        setEquipos(opcionesEquipos);
      })
      .catch((err) => console.error("Error al cargar equipos", err));
  }, [selectedLiga]);

  const customStyles = { /* puedes reutilizar el objeto customStyles que ya tienes */ };

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
