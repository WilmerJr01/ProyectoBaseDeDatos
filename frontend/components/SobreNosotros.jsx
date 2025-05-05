import React from "react";
import "../styles/SobreNosotros.css";
import mascotaSaltando from "../assets/mascotaSaltando.png"; 
import githubLogo from "../assets/Github.png";
import beSoccerLogo from "../assets/BeSoccer.png";

function SobreNosotros() {
  return (
    <div className="sobre-nosotros-container">
      <div className="sobre-nosotros-content">
        <img
          src={mascotaSaltando}
          alt="Mascota Saltando"
          className="mascota-img"
        />
        <h1 className="sobre-nosotros-title">Sobre Nosotros</h1>
        <p className="sobre-nosotros-text">
          Para el desarrollo de nuestro proyecto en la materia de bases de
          datos, decidimos crear una aplicación web enfocada en el análisis
          estadístico de partidos de fútbol profesional debido al amplio interés
          global que despierta este deporte y la gran cantidad de información
          que genera a lo largo del tiempo.
          <br />
          <br />
          Escogimos este tema porque el fútbol no solo es una fuente inagotable
          de datos históricos, sino también un excelente caso de estudio para
          aplicar conceptos clave del manejo de bases de datos extensas,
          consultas complejas y visualización de información relevante para el
          usuario.
          <br />
          <br />
          Nuestro objetivo principal con esta aplicación es proporcionar una
          herramienta interactiva y flexible que permita explorar, comparar y
          entender distintos aspectos de las competiciones futbolísticas más
          importantes del mundo, como la liga española, la Premier League, la
          liga colombiana y la UEFA Champions League, entre otras.
          <br />
          <br />
          Creemos que esta herramienta puede ser útil tanto para aficionados
          interesados en conocer más sobre sus equipos favoritos, como para
          periodistas, analistas deportivos o incluso desarrolladores que
          busquen un ejemplo práctico de cómo estructurar, consultar y
          visualizar grandes volúmenes de información de manera eficiente.
          <br />
          <br />
          Con este proyecto buscamos demostrar cómo el análisis de datos puede
          aportar valor incluso en contextos tan populares como el deporte,
          acercando al usuario final a una experiencia informativa basada en
          datos confiables, precisos y fáciles de explorar.
        </p>

        <div className="links-importantes">
          <h2>Links importantes</h2>
          <div className="logos-enlaces">
            <a href="https://github.com/schochastics/football-data" target="_blank" rel="noopener noreferrer">
              <img src={githubLogo} alt="GitHub" />
            </a>
            <a href="https://api.besoccer.com" target="_blank" rel="noopener noreferrer">
              <img src={beSoccerLogo} alt="BeSoccer" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SobreNosotros;
