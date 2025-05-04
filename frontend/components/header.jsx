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
            <Link to="/competencias" onMouseEnter={() => { setMouseIn('competencias') }} onMouseLeave={() => { setMouseIn('') }}>Competencias</Link>
          </li>
          <li className="nav-item">
            <Link to="/enfrentamientos" onMouseEnter={() => { setMouseIn('enfrentamientos') }} onMouseLeave={() => { setMouseIn('') }}>Enfrentamientos</Link>
          </li>
          <li className="nav-item">
            <Link to="equipos" onMouseEnter={() => { setMouseIn('equipos') }} onMouseLeave={() => { setMouseIn('') }}>Equipos</Link>
          </li>
        </ul>
      </nav>
      <Link to="/SobreNosotros" className="btn">
        <button>Sobre nosotros</button>
      </Link>
    </header>
  );
}

export default Header;

