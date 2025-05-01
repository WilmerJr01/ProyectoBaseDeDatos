import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import axios from "axios";
import { useEffect, useState } from "react";

const paisesPermitidos = [
    "Spain",
    "Germany",
    "Italy",
    "United Kingdom",
    "France",
    "Portugal",
    "Netherlands",
    "Argentina",
    "Brazil",
    "Colombia",
    "Uruguay",
    "Ecuador",
];

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

const MapaMundi = () => {
    const [geoData, setGeoData] = useState(null);
    const [paisSeleccionado, setPaisSeleccionado] = useState(null);

    useEffect(() => {
        axios
            .get(
                "https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json"
            )
            .then((res) => {
                const filtrados = res.data.features.filter((feature) => {
                    const nombre = feature.properties.name;
                    return paisesPermitidos.includes(nombre);
                });
                setGeoData({ type: "FeatureCollection", features: filtrados });
            });
    }, []);

    const estiloPorPais = (feature) => {
        const index = paisesPermitidos.indexOf(feature.properties.name);
        return {
            fillColor: colores[index] || "#ccc",
            weight: 1,
            color: "black",
            fillOpacity: 0.7,
        };
    };

    const alClickear = (e) => {
        const pais = e.target.feature.properties.name;
        setPaisSeleccionado(pais);
    };

    const onEachCountry = (feature, layer) => {
        layer.on({
            click: alClickear,
        });
    };

    return (
        <div>
            <h2>Mapa Interactivo de Países Seleccionados</h2>
            {paisSeleccionado && (
                <p>
                    País seleccionado: <strong>{paisSeleccionado}</strong>
                </p>
            )}
            <MapContainer
                center={[10, 0]}
                zoom={4}
                minZoom={3} // Zoom mínimo permitido
                maxZoom={5} // Zoom máximo permitido
                maxBounds={[
                    [-70, -180], // esquina suroeste (mín latitud, mín longitud)
                    [75, 180], // esquina noreste (máx latitud, máx longitud)
                ]}
                style={{ height: "600px", width: "100%" }}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {geoData && (
                    <GeoJSON
                        data={geoData}
                        style={estiloPorPais}
                        onEachFeature={onEachCountry}
                    />
                )}
            </MapContainer>
        </div>
    );
};

export default MapaMundi;