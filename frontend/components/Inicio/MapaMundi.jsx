import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";

const colores = [
  "#F94144",
  "#F3722C",
  "#F8961E",
  "#F9844A",
  "#F9C74F",
  "#90BE6D",
  "#43AA8B",
  "#577590",
  "#277DA1",
  "#4D908E",
  "#FF006E",
  "#8338EC",
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

const normalize = (s) => s.trim().toLowerCase();

const MapaMundi = ({ competitions, onCountrySelect }) => {
  const [geoData, setGeoData] = useState(null);
  const [paisSeleccionado, setPaisSeleccionado] = useState(null);
  const [error, setError] = useState(null);

  const paisesPermitidos = useMemo(() => {
    return Array.from(
      new Set(
        competitions
          .map(normalize)
          .map((liga) => leagueToCountry[liga])
          .filter(Boolean)
      )
    );
  }, [competitions]);

  useEffect(() => {
    axios
      .get(
        "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
      )
      .then((res) => {
        const filtrados = res.data.features.filter((f) =>
          paisesPermitidos.includes(f.properties.name)
        );
        setGeoData({ type: "FeatureCollection", features: filtrados });
      })
      .catch((err) => {
        console.error("Error al cargar el mapa:", err);
        setError("No se pudo cargar el mapa. Intenta más tarde.");
      });
  }, [paisesPermitidos]);

  const estiloPorPais = (feature) => {
    const nombre = feature.properties.name;
    const idx = paisesPermitidos.indexOf(nombre);
    const esSeleccionado = nombre === paisSeleccionado;

    return {
      fillColor: colores[idx % colores.length] || "#ccc",
      weight: esSeleccionado ? 3 : 1.5, // más grosor si está seleccionado
      color: esSeleccionado ? "black" : "transparent", // borde negro si está seleccionado
      fillOpacity: 0.7,
    };
  };

  const alClickear = (e) => {
    const countryName = e.target.feature.properties.name;
    setPaisSeleccionado(countryName);
    if (onCountrySelect) onCountrySelect(countryName);
  };

  const onEachCountry = (feature, layer) => {
    layer.on({ click: alClickear });
    // No mostramos tooltip ni ningún texto flotante
  };

  return (
    <div>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {geoData && geoData.features.length > 0 ? (
        <MapContainer
          center={[20, 0]}
          zoom={3}
          minZoom={3}
          maxZoom={4}
          maxBounds={[
            [-90, -180],
            [90, 180],
          ]}
          style={{ height: "600px", width: "100%" }}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <GeoJSON
            key={paisSeleccionado || "default"} // esto obliga a que se vuelva a renderizar
            data={geoData}
            style={estiloPorPais}
            onEachFeature={onEachCountry}
          />
        </MapContainer>
      ) : (
        <p>Cargando mapa con países seleccionados...</p>
      )}
    </div>
  );
};

export default MapaMundi;
