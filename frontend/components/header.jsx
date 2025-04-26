import { Link } from "react-router-dom";
import { useState } from "react";

function Header() {
  const [mouseIn, setMouseIn] = useState('');

  return (
    <header className={`header ${mouseIn}`}>
      <div className="logo">
        <img src="../assets/Logo.png" alt="Logo" />
      </div>
      <nav>
        <ul className="nav-list">
          <li className="nav-item">
            <Link to="/">Inicio</Link>
          </li>
          <li className="nav-item">
            <Link to="/competencias" onMouseEnter={() => { setMouseIn('competencias') }} onMouseLeave={() => { setMouseIn('') }}>Competencias</Link> {/* ➡️ Modificado aquí */}
          </li>
          <li className="nav-item">
            <Link to="/partidos" onMouseEnter={() => { setMouseIn('partidos') }} onMouseLeave={() => { setMouseIn('') }}>Partidos</Link>
          </li>
          <li className="nav-item">
            <Link to="#" onMouseEnter={() => { setMouseIn('equipos') }} onMouseLeave={() => { setMouseIn('') }}>Equipos</Link>
          </li>
        </ul>
      </nav>
      <Link to="#" className="btn">
        <button>Sobre nosotros</button>
      </Link>
    </header>
  );
}

export default Header;
