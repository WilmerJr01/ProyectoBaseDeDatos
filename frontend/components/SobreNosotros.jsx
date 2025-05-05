import React from "react";

function SobreNosotros() {
  return (
    <div style={{ backgroundColor: "#1d1922", minHeight: "100vh", padding: "2rem" }}>
      <div
        style={{
          backgroundColor: "#0f0d13",
          color: "white",
          border: "2px solid white",
          borderRadius: "10px",
          padding: "3rem 2rem",
          textAlign: "center",
          maxWidth: "900px",
          margin: "0 auto",
        }}
      >
        <h1 style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>Sobre nosotros</h1>
        <p style={{ fontSize: "1.2rem", color: "#b0b0b0" }}>
        Para el desarrollo de nuestro proyecto en la materia de bases de datos, decidimos crear una aplicación web enfocada en el análisis estadístico de partidos de fútbol profesional debido al amplio interés global que despierta este deporte y la gran cantidad de información que genera a lo largo del tiempo. Escogimos este tema porque el fútbol no solo es una fuente inagotable de datos históricos, sino también un excelente caso de estudio para aplicar conceptos clave del manejo de bases de datos extensas, consultas complejas y visualización de información relevante para el usuario. Nuestro objetivo principal con esta aplicación es proporcionar una herramienta interactiva y flexible que permita explorar, comparar y entender distintos aspectos de las competiciones futbolísticas más importantes del mundo, como la liga española, la Premier League, la liga colombiana y la UEFA Champions League, entre otras. La plataforma permite al usuario consultar estadísticas detalladas de los partidos jugados, ya sea a lo largo de toda la historia de una competición o en un rango de años específico, así como estudiar el rendimiento histórico de equipos en términos de goles y partidos disputados. Creemos que esta herramienta puede ser útil tanto para aficionados interesados en conocer más sobre sus equipos favoritos, como para periodistas, analistas deportivos o incluso desarrolladores que busquen un ejemplo práctico de cómo estructurar, consultar y visualizar grandes volúmenes de información de manera eficiente. Con este proyecto buscamos demostrar cómo el análisis de datos puede aportar valor incluso en contextos tan populares como el deporte, acercando al usuario final a una experiencia informativa basada en datos confiables, precisos y fáciles de explorar.

        </p>
      </div>
    </div>
  );
}

export default SobreNosotros;
