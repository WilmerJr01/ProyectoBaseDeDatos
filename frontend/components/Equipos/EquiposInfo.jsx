import React from "react";
import { motion } from "framer-motion";
import '../../styles/CompetitionInfo.css'; // Asegúrate de crear este archivo CSS
import { interceptorCompetition } from "../../functions/functions"; // Ajusta la ruta si es necesario
import { interceptorCompetitionCountry } from "../../functions/functions";

function EquiposInfo({ liga }) {
  const { name, totalGoals, totalMatches, firstDate } = liga;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="competition-card"
    >
      <h2 className="competition-title">{name}</h2>

      {/* Aquí añadimos la región/pais debajo del nombre */}
      <p className="competition-country">
        {interceptorCompetitionCountry(name)}
      </p>
      
      <div className="competition-stats">
        <div className="stat-item">
          <span className="stat-value">{totalGoals}</span>
          <span className="stat-label">Número de goles</span>
        </div>
        <div className="stat-separator" />
        <div className="stat-item">
          <span className="stat-value">{totalMatches}</span>
          <span className="stat-label">Cantidad de partidos</span>
        </div>
        <div className="stat-separator" />
        <div className="stat-item">
          <span className="stat-value">{firstDate}</span>
          <span className="stat-label">Primera fecha</span>
        </div>
      </div>
    </motion.div>
  );
}

export default EquiposInfo;
