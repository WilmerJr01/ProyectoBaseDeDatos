import axios from "axios";
import { useState, useEffect } from "react";
import {
  interceptorCompetition,
  interceptorCompetitionCountry,
} from "../functions/functions.js";
import MapaMundi from "./Inicio/MapaMundi.jsx";
import CompeticionLogos from "./Inicio/CompetitionLogo.jsx";
import { motion } from "framer-motion";
import Typewriter from "typewriter-effect";
import "../styles/Inicio.css";
import Select from "react-select";

function Inicio() {
  const [paisSeleccionado, setPaisSeleccionado] = useState(null);
  const [competitionsInfo, setCompetitionsInfo] = useState([]);
  const [filtroContinente, setFiltroContinente] = useState(null);
  const [textoTerminado, setTextoTerminado] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3000/database/competitionsInfo")
      .then((res) => setCompetitionsInfo(res.data))
      .catch((err) => console.error("Error al obtener info:", err));
  }, []);

  useEffect(() => {
    const fullText =
      "Tu base de datos de futbol preferida donde podrás ver el recuento histórico de las principales ligas del mundo";
    let index = 0;
    const interval = setInterval(() => {
      setTexto((prev) => prev + fullText.charAt(index));
      index++;
      if (index === fullText.length) clearInterval(interval);
    }, 30);
    return () => clearInterval(interval);
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
    { value: null, label: "Todos" },
    { value: "Europe", label: "Competencias europeas" },
    { value: "South America", label: "Competencias sudamericanas" },
    { value: "goles", label: "Cantidad de goles" },
  ];

  return (
    <main className="inicio">
      <section className="bienvenida">
        <h1>¡Bienvenidos a Futbol DB!</h1>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          {!textoTerminado ? (
            <Typewriter
              onInit={(typewriter) => {
                typewriter
                  .typeString(
                    "Tu base de datos de futbol preferida donde podrás ver el recuento histórico de las principales ligas del mundo"
                  )
                  .callFunction(() => setTextoTerminado(true))
                  .start();
              }}
              options={{
                delay: 30,
                cursor: "",
              }}
            />
          ) : (
            <p>
              Tu base de datos de futbol preferida donde podrás ver el recuento
              histórico de las principales ligas del mundo
            </p>
          )}
        </motion.div>
      </section>

      <motion.div
        className="logos"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
      >
        <CompeticionLogos competitions={competitionsInfo} />
      </motion.div>

      <motion.div
        className="contenido"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
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
              onChange={(e) => setFiltroContinente(e ? e.value : null)}
              styles={customStyles}
              placeholder="-- Selecciona un continente --"
              isClearable
            />
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <MapaMundi
              competitionsInfo={competitionsInfo}
              filtroContinente={filtroContinente}
              onCountrySelect={setPaisSeleccionado}
              modoGoles={filtroContinente === "goles"}
            />
          </motion.div>
        </div>
      </motion.div>
    </main>
  );
}

export default Inicio;
