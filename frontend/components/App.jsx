import { Routes, Route, Link } from "react-router-dom";
import "../styles/App.css";

//Componentes 
import Header from "./header.jsx";
import Inicio from "./inicio.jsx"; 
import Enfrentamientos from "./Enfrentamientos.jsx";
import Competencias from "./competencias.jsx";
import Equipos from "./equipos.jsx";
import SobreNosotros from "./SobreNosotros.jsx";

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={ <Inicio /> } />
        <Route path="/enfrentamientos" element={<Enfrentamientos />} />
        <Route path="/competencias" element={<Competencias />} />
        <Route path="/equipos" element={<Equipos />} />
        <Route path="/SobreNosotros" element={<SobreNosotros />} />
        <Route path="*" element={<Inicio />} />
      </Routes>
    </>
  );
}

export default App;
