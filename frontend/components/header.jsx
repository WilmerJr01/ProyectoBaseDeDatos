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
            <a href="#">Inicio</a>
          </li>
          <li className="nav-item">
            <a href="#" onMouseEnter={()=>{setMouseIn('competencias')}} onMouseLeave={()=>{setMouseIn('')}}>Competencias</a>
          </li>
          <li className="nav-item">
            <a href="#" onMouseEnter={()=>{setMouseIn('partidos')}} onMouseLeave={()=>{setMouseIn('')}}>Partidos</a>
          </li>
          <li className="nav-item">
            <a href="#" onMouseEnter={()=>{setMouseIn('equipos')}} onMouseLeave={()=>{setMouseIn('')}}>Equipos</a>
          </li>
        </ul>
      </nav>
      <a href="#" className="btn">
        <button>Sobre nosotros</button>
      </a>
    </header>
  );
}

export default Header;