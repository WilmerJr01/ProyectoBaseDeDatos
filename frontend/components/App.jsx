import { Routes, Route } from "react-router-dom";
import "../styles/App.css";

//Componentes 
import Header from "./header.jsx";
import Inicio from "./inicio.jsx"; 
import Partidos from "./partidos.jsx";
import Competencias from "./competencias.jsx";
import Equipos from "./equipos.jsx";
import SobreNosotros from "./SobreNosotros.jsx"; // ➡️ Agregado aquí

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={ <Inicio /> } />
        <Route path="/partidos" element={<Partidos />} />
        <Route path="/competencias" element={<Competencias />} />
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/SobreNosotros" element={<SobreNosotros />} />
      </Routes>
    </>
  );
}

export default App;
