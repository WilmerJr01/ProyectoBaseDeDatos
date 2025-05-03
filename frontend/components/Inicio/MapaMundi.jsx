import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useEffect, useState, useMemo } from "react";

const colores = [
    "#F94144", "#F3722C", "#F8961E", "#F9844A", "#F9C74F",
    "#90BE6D", "#43AA8B", "#577590", "#277DA1", "#4D908E",
    "#FF006E", "#8338EC",
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
    uruguay: "Uruguay"
};

const normalize = (s) => s.trim().toLowerCase();

// 1) Aquí desestructuramos onCountrySelect junto a competitions
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
        const idx = paisesPermitidos.indexOf(feature.properties.name);
        return {
            fillColor: colores[idx % colores.length] || "#ccc",
            weight: 1.5,
            color: "black",
            fillOpacity: 0.7,
        };
    };

    const alClickear = (e) => {
        const countryName = e.target.feature.properties.name;
        setPaisSeleccionado(countryName);
        // 2) Llamamos a onCountrySelect si fue pasada desde el padre
        if (onCountrySelect) onCountrySelect(countryName);
    };

    const onEachCountry = (feature, layer) => {
        layer.on({ click: alClickear });
        layer.bindTooltip(feature.properties.name);
    };

    return (
        <div>
            <h2>Mapa Interactivo de Países</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {geoData && geoData.features.length > 0 ? (
                <MapContainer
                    center={[20, 0]}
                    zoom={3}
                    minZoom={3}
                    maxZoom={6}
                    maxBounds={[
                        [-90, -180],
                        [90, 180],
                    ]}
                    style={{ height: "600px", width: "100%" }}
                >
                    <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                    <GeoJSON
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
