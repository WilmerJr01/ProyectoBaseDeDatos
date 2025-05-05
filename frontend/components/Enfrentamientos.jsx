import React, { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { interceptorCompetition } from "../functions/functions";
import "../styles/Enfrentamientos.css";

function AnimatedNumber({ value }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const controls = animate(count, value, {
      duration: 1,
      ease: "easeOut",
    });
    return controls.stop;
  }, [value]);

  useEffect(() => {
    const unsubscribe = rounded.on("change", (v) => setDisplay(v));
    return () => unsubscribe();
  }, [rounded]);

  return <span>{display}</span>;
}

function Enfrentamientos() {
  const [opciones, setOpciones] = useState([]);
  const [selectedLiga, setSelectedLiga] = useState(null);
  const [equipos, setEquipos] = useState([]);
  const [equipo1, setEquipo1] = useState(null);
  const [equipo2, setEquipo2] = useState(null);
  const [enfrentamientoData, setEnfrentamientoData] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:3000/database/competitions")
      .then((response) => {
        const formateadas = response.data.map((nombre) => ({
          value: nombre,
          label: interceptorCompetition(nombre),
        }));
        setOpciones(formateadas);
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
        setEquipos(opcionesEquipos);
        setEquipo1(null);
        setEquipo2(null);
      })
      .catch((err) => console.error("Error al cargar equipos", err));
  }, [selectedLiga]);

  useEffect(() => {
    if (!selectedLiga || !equipo1 || !equipo2) {
      setEnfrentamientoData(null); // Limpia los datos si falta algo
      return;
    }

    const fetchData = async () => {
      try {
        const res = await fetch(
          `http://localhost:3000/database/enfrentamiento/${selectedLiga}/${equipo1}/${equipo2}`
        );
        const data = await res.json();
        setEnfrentamientoData(data);
      } catch (error) {
        console.error("Error fetching enfrentamiento:", error);
      }
    };

    fetchData();
  }, [selectedLiga, equipo1, equipo2]);

  useEffect(() => {
    setEquipo1(null);
    setEquipo2(null);
    setEnfrentamientoData(null);
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
      fontSize: "16px",
      color: "white",
      width: "300px",
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: "#151219",
    }),
    menuList: (provided) => ({
      ...provided,
      backgroundColor: "#151219",
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
    <main className="main-container">
      <div className="content-box">
        <label className="title">Selecciona la competencia:</label>

        <div className="select-competencia">
          <Select
            id="competencia"
            name="competencia"
            options={opciones}
            value={opciones.find((opt) => opt.value === selectedLiga)}
            onChange={(option) => setSelectedLiga(option ? option.value : null)}
            styles={customStyles}
            placeholder="-- Selecciona una competencia --"
            isClearable
          />
        </div>
        <img className="img"
          src={
            selectedLiga
              ? `../../assets/${selectedLiga}.webp`
              : `../../assets/mascota.png`
          }
          alt={selectedLiga || "Mascota"}
        />

        {selectedLiga && (
          <div className="select-row">
            <div className="select-col">
              <Select
                id="equipo1"
                name="equipo1"
                options={equipos}
                value={equipos.find((opt) => opt.value === equipo1)}
                onChange={(option) => setEquipo1(option ? option.value : null)}
                styles={customStyles}
                placeholder="-- Equipo 1 --"
                isClearable
              />
            </div>

            <div className="select-col">
              <Select
                id="equipo2"
                name="equipo2"
                options={equipos}
                value={equipos.find((opt) => opt.value === equipo2)}
                onChange={(option) => setEquipo2(option ? option.value : null)}
                styles={customStyles}
                placeholder="-- Equipo 2 --"
                isClearable
              />
            </div>
          </div>
        )}

        {enfrentamientoData && (
          <motion.div
            className="contenedor-enfrentamiento"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="grafico-enfrentamiento">
              <div className="barra-contenedor">
                <div className="titulo-barra">Goles</div>

                <div className="valores-barra">
                  <span>{enfrentamientoData.golesEquipo1}</span>
                  <span>{enfrentamientoData.golesEquipo2}</span>
                </div>

                <div className="barra">
                  <motion.div
                    className="barra-equipo1"
                    animate={{
                      width: `${
                        (enfrentamientoData.golesEquipo1 /
                          (enfrentamientoData.golesEquipo1 +
                            enfrentamientoData.golesEquipo2)) *
                        100
                      }%`,
                    }}
                    transition={{ duration: 0.8 }}
                  ></motion.div>
                  <motion.div
                    className="barra-equipo2"
                    animate={{
                      width: `${
                        (enfrentamientoData.golesEquipo2 /
                          (enfrentamientoData.golesEquipo1 +
                            enfrentamientoData.golesEquipo2)) *
                        100
                      }%`,
                    }}
                    transition={{ duration: 0.8 }}
                  ></motion.div>
                </div>
              </div>

              <div className="barra-contenedor">
                <div className="titulo-barra">Partidos Ganados</div>

                <div className="valores-barra">
                  <span>{enfrentamientoData.victoriasEquipo1}</span>
                  <span>{enfrentamientoData.victoriasEquipo2}</span>
                </div>

                <div className="barra">
                  <motion.div
                    className="barra-equipo1 gris"
                    animate={{
                      width: `${
                        (enfrentamientoData.victoriasEquipo1 /
                          (enfrentamientoData.victoriasEquipo1 +
                            enfrentamientoData.victoriasEquipo2)) *
                        100
                      }%`,
                    }}
                    transition={{ duration: 0.8 }}
                  ></motion.div>
                  <motion.div
                    className="barra-equipo2 beige"
                    animate={{
                      width: `${
                        (enfrentamientoData.victoriasEquipo2 /
                          (enfrentamientoData.victoriasEquipo1 +
                            enfrentamientoData.victoriasEquipo2)) *
                        100
                      }%`,
                    }}
                    transition={{ duration: 0.8 }}
                  ></motion.div>
                </div>
              </div>

              <div className="mayor-goleada">
                <div>
                  {enfrentamientoData.mayorVictoriaEquipo1?.marcador || "-"}
                </div>
                <div className="titulo-barra">Mayor Goleada</div>
                <div>
                  {enfrentamientoData.mayorVictoriaEquipo2?.marcador || "-"}
                </div>
              </div>

              <div className="datos-numericos">
                <div className="dato-card enfrentamientos">
                  <span className="label">Enfrentamientos</span>
                  <AnimatedNumber value={enfrentamientoData.enfrentamientos} />
                </div>
                <div className="dato-card empates">
                  <span className="label">Empates</span>
                  <AnimatedNumber value={enfrentamientoData.empates} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </main>
  );
}

export default Enfrentamientos;
