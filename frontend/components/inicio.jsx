import axios from "axios";
import { useState, useEffect } from "react";
import {
    interceptorCompetition,
    interceptorCompetitionCountry,
} from "../functions/functions.js";
import MapaMundi from "./Inicio/MapaMundi.jsx";
import CompeticionLogos from "./Inicio/CompetitionLogo.jsx";
import "../styles/Inicio.css";

// No olvides que este objeto también lo necesitas
const leagueToCountry = {
    argentina: "Argentina",
    brazil: "Brazil",
    colombia: "Colombia",
    ecuador: "Ecuador",
    england: "United Kingdom",
    france: "France",
    germany: "Germany",
    italy: "Italy",
    netherlands: "Netherlands",
    portugal: "Portugal",
    spain: "Spain",
    uruguay: "Uruguay",
};

function Inicio() {
    const [competitions, setCompetitions] = useState([]);
    const [paisSeleccionado, setPaisSeleccionado] = useState(null);

    useEffect(() => {
        axios
            .get("http://localhost:3000/database/competitions")
            .then((res) => setCompetitions(res.data))
            .catch((err) =>
                console.error("Error al obtener competiciones:", err)
            );
    }, []);

    // Función para obtener la información de la liga por país
    const getInfoLigaPorPais = () => {
        if (!paisSeleccionado) return null;
        return (
            competitions.find(
                (c) =>
                    leagueToCountry[c.league?.toLowerCase()] === paisSeleccionado
            ) || null
        );
    };

    const info = getInfoLigaPorPais();
    const nombreLiga = info
        ? interceptorCompetition(info.league)
        : "Nombre de la Liga";
    const paisOContinente = info
        ? interceptorCompetitionCountry(info.league)
        : "Continente";

    return (
        <main className="inicio">
            <div className="logos">
                <CompeticionLogos competitions={competitions} />
            </div>

            <div className="contenido">
                <div className="panel-izquierdo">
                    <h2>{paisSeleccionado}</h2>
                    <p>{paisOContinente}</p>
                    {paisSeleccionado && (
                        <p><strong>País seleccionado: {paisSeleccionado}</strong></p>
                    )}
                </div>

                <div className="panel-derecho">
                    <MapaMundi
                        competitions={competitions}
                        onCountrySelect={setPaisSeleccionado}
                    />
                </div>
            </div>
        </main>
    );
}

export default Inicio;
