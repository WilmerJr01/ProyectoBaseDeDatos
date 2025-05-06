import React from "react";
import "../../styles/UltimosPartidos.css";
import {
    interceptorCompetition,
    interceptorCompetitionCountry,
} from "../../functions/functions";

function UltimosPartidos({ partido }) {
    const formatearFecha = (fecha) => {
        const year = String(fecha).slice(0, 4);
        const month = String(fecha).slice(4, 6);
        const day = String(fecha).slice(6, 8);
        return `${day}/${month}/${year}`;
    };

    return (
        <section className="partido-card">
            <div className="partido-contenedor">
                <img
                    className="img"
                    src={`../../assets/${partido.competition}.webp`}
                    alt=""
                />
                <div className="equipos">
                    <div className="equipo">
                        <h2>{partido.teamHome}</h2>
                    </div>
                    <div className="vs">
                        <h2>
                            {partido.goalsAway} VS {partido.goalsHome}
                        </h2>
                    </div>
                    <div className="equipo">
                        <h2>{partido.teamAway}</h2>
                    </div>
                </div>
                <div className="partido-info">
                    <p>
                        {formatearFecha(partido.date)}
                        <br />
                        {interceptorCompetition(partido.competition)}
                        <br />
                        {interceptorCompetitionCountry(partido.competition)}
                    </p>
                </div>
            </div>
        </section>
    );
}

export default UltimosPartidos;
