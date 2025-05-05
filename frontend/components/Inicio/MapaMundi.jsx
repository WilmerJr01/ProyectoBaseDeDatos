import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";

// Colores para el modo continente (varios tonos)
const continentColors = [
  "#F94144", "#F3722C", "#F8961E", "#F9844A", "#F9C74F",
  "#90BE6D", "#43AA8B", "#577590", "#277DA1", "#4D908E",
  "#FF006E", "#8338EC"
];

// Gradiente de rojos para modo goles
const goalsGradient = [
  "#ffcccc", "#ff9999", "#ff6666", "#ff3333", "#ff0000"
];

const leagueToCountry = {
  argentina: "Argentina",
  brazil: "Brazil",
  colombia: "Colombia",
  ecuador: "Ecuador",
  england: "United Kingdom",
  france: "France",
  germany: "Germany",
  italy: "Italy",
  netherlands: "Netherlands",
  portugal: "Portugal",
  spain: "Spain",
  uruguay: "Uruguay",
};

const MapaMundi = ({ competitionsInfo, onCountrySelect, filtroContinente = null }) => {
  const [geoData, setGeoData] = useState(null);
  const [paisSeleccionado, setPaisSeleccionado] = useState(null);
  const [error, setError] = useState(null);

  // Calcula goles por país a partir de totalGoals
  const { goalsByCountry, minGoals, maxGoals, countriesByGoalsMode } = useMemo(() => {
    const map = {};
    competitionsInfo.forEach(({ competition, totalGoals }) => {
      const country = leagueToCountry[competition];
      if (country) map[country] = (map[country] || 0) + totalGoals;
    });
    const vals = Object.values(map);
    const min = vals.length ? Math.min(...vals) : 0;
    const max = vals.length ? Math.max(...vals) : 0;
    return { goalsByCountry: map, minGoals: min, maxGoals: max, countriesByGoalsMode: Object.keys(map) };
  }, [competitionsInfo]);

  // Define países a mostrar según filtro
  const paisesPermitidos = useMemo(() => {
    if (filtroContinente === "goles") return countriesByGoalsMode;
    if (!filtroContinente) {
      return competitionsInfo.map(item => leagueToCountry[item.competition]).filter(Boolean);
    }
    return competitionsInfo
      .filter(item => item.continent === filtroContinente)
      .map(item => leagueToCountry[item.competition])
      .filter(Boolean);
  }, [competitionsInfo, filtroContinente, countriesByGoalsMode]);

  // Eliminar la selección predeterminada de un país
  useEffect(() => {
    if (paisesPermitidos.length > 0) {
      setPaisSeleccionado(null); // No seleccionar un país inicialmente
    }
  }, [paisesPermitidos]);

  // Carga y filtra geojson
  useEffect(() => {
    axios.get("https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json")
      .then(res => {
        // Filtra las geometrías que coinciden con los países permitidos
        const feats = res.data.features.filter(f => paisesPermitidos.includes(f.properties.name));
        setGeoData({ type: "FeatureCollection", features: feats });
      })
      .catch(err => {
        console.error("Error al cargar el mapa:", err);
        setError("No se pudo cargar el mapa.");
      });
  }, [paisesPermitidos]);

  // Obtiene color en modo goles
  const getColorByGoals = goals => {
    if (maxGoals === minGoals) return goalsGradient[0];
    const ratio = (goals - minGoals) / (maxGoals - minGoals);
    const idx = Math.min(goalsGradient.length - 1, Math.floor(ratio * goalsGradient.length));
    return goalsGradient[idx];
  };

  const estiloPorPais = feature => {
    const name = feature.properties.name;
    const isSel = name === paisSeleccionado;
    let fillColor = "#ccc";

    if (filtroContinente === "goles") {
      const g = goalsByCountry[name] || 0;
      fillColor = getColorByGoals(g);
    } else {
      const key = Object.entries(leagueToCountry).find(([, v]) => v === name)?.[0];
      const idx = key ? Object.keys(leagueToCountry).indexOf(key) : -1;
      fillColor = idx >= 0 ? continentColors[idx % continentColors.length] : "#ccc";
    }

    return {
      fillColor,
      weight: isSel ? 3 : 1.5,
      color: isSel ? "black" : "transparent",
      fillOpacity: 0.7,
    };
  };

  const alClickear = e => {
    const cn = e.target.feature.properties.name;
    if (!paisesPermitidos.includes(cn)) return;
    setPaisSeleccionado(cn);
    const key = Object.entries(leagueToCountry).find(([, v]) => v.toLowerCase() === cn.toLowerCase())?.[0] || null;
    onCountrySelect?.(key);
  };

  const onEachCountry = (feature, layer) => {
    layer.on({ click: alClickear, mouseover: () => layer.getElement().style.cursor = 'pointer' });
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {geoData && geoData.features.length > 0 ? (

        <MapContainer center={[-10, -65]} zoom={4} minZoom={3} maxZoom={4} maxBounds={[[-90,-180],[90,180]]} style={{ height: "600px", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <GeoJSON key={`${filtroContinente || "all"}-${paisSeleccionado || "default"}`} data={geoData} style={estiloPorPais} onEachFeature={onEachCountry} />
        </MapContainer>
      ) : <p>Cargando mapa...</p>}
    </div>
  );
};

export default MapaMundi;
