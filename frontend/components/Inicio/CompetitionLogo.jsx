import React, { useState, useEffect } from "react";

function CompeticionLogos({ competitions }) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [hoverIndex, setHoverIndex] = useState(null);
  const [isAutoSelecting, setIsAutoSelecting] = useState(true);

  // Rotación automática
  useEffect(() => {
    if (!isAutoSelecting || competitions.length === 0) return;
    const id = setInterval(() => {
      setSelectedIndex((i) => (i + 1) % competitions.length);
    }, 1000);
    return () => clearInterval(id);
  }, [isAutoSelecting, competitions.length]);

  return (
    <div className="competicion-logos">
      {competitions.map((comp, index) => {
        const name = comp.competition;
        const isHovered = hoverIndex === index;
        const isActive = isHovered || (hoverIndex === null && selectedIndex === index);
        const isSelected = isActive;

        return (
          <div
            key={index}
            className={`competicion-logo ${isSelected ? "selected" : ""}`}
            style={{ "--i": index }}
            onMouseEnter={() => {
              setHoverIndex(index);
              setIsAutoSelecting(false);
            }}
            onMouseLeave={() => {
              setHoverIndex(null);
              setIsAutoSelecting(true);
            }}
          >
            <img
              src={`/assets/${name}.webp`}
              alt={name}
              className={isSelected ? "selected" : ""}
              onError={(e) => (e.target.style.display = "none")}
            />
          </div>
        );
      })}
    </div>
  );
}

export default CompeticionLogos;
