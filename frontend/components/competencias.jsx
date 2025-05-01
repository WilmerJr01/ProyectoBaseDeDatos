import { useEffect, useState } from "react";
import Select from "react-select";
import axios from "axios";
import { interceptorCompetition } from "../functions/functions";
import "../styles/Competencias.css";
import CompetenciaSeleccionada from "./Competencias/competenciaSeleccionada.jsx"; // Ajusta la ruta si es necesario

function Competencias() {
    const [opciones, setOpciones] = useState([]);
    const [selectedCompetencia, setSelectedCompetencia] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:3000/database/competitions")
            .then((response) => {
                const formateadas = response.data.map((nombre) => ({
                    value: nombre, // Usamos el nombre directamente
                    label: interceptorCompetition(nombre), // Solo modificamos la etiqueta que se mostrará
                }));
                setOpciones(formateadas);
            })
            .catch((error) => {
                console.error("Error al obtener competencias:", error);
            });
    }, []);

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: "transparent",
            border: "none",
            borderBottom: "2px solid white",
            borderRadius: 0,
            boxShadow: "none",
            minHeight: "30px",
            fontSize: "15px",
            color: "white",
            width: "300px", // ← fuerza ancho de 100px
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: "transparent", // ← menú transparente
            boxShadow: "none", // opcional: quita sombra
        }),
        menuList: (provided) => ({
            ...provided,
            backgroundColor: "transparent", // ← lista transparente
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

    const handleChange = (selectedOption) => {
        setSelectedCompetencia(selectedOption ? selectedOption.value : null); // Guardamos solo el valor
        console.log(
            "Seleccionaste:",
            selectedOption ? selectedOption.value : null
        );
    };

    return (
        <main className="competencias-main">
            <label htmlFor="competencia" style={{ color: "white" }}>
                Selecciona una competencia:
            </label>
            <div className="competencias-select">
                <Select
                    id="competencia"
                    name="competencia"
                    options={opciones}
                    value={opciones.find(
                        (option) => option.value === selectedCompetencia
                    )} // Filtramos la opción seleccionada
                    onChange={handleChange}
                    styles={customStyles}
                    placeholder="-- Selecciona una opción --"
                    isClearable
                />
            </div>
            <CompetenciaSeleccionada competencia={selectedCompetencia} />{" "}
            {/* Pasamos el valor directamente */}
        </main>
    );
}

export default Competencias;
