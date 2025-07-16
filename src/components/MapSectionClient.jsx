"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMapEvent } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const customIcon = L.icon({
    iconUrl: "/custom-pin-icon.png",
    iconSize: [40, 40],
    iconAnchor: [20, 40],
});

    const MapSectionClient = ({
    lat = 7.48864257057822,
    lng = 4.543036457671419,
    description = "Ile Ife Branch Office",
    address = "10 idiomo Street,opposite. UBA Bank lagere, ILE-IFE, Osun State"
}) => {
    const [showTooltip, setShowTooltip] = useState(false);

    function MapClickHandler() {
        useMapEvent("click", () => setShowTooltip(false));
        return null;
    }

    return (
        <section
            style={{ position: "relative", width: "100%", overflow: "hidden", zIndex: 100 }}
            className="h-[50dvh] lg:h-[80dvh]"
        >
            <MapContainer
                center={[lat, lng]}
                zoom={17}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
                dragging={true}
                doubleClickZoom={true}
                touchZoom={true}
                boxZoom={false}
                keyboard={false}
                tap={false}
                zoomControl={false}
            >
                <MapClickHandler />
                <TileLayer
                    attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                    position={[lat, lng]}
                    icon={customIcon}
                    eventHandlers={{
                        click: () => setShowTooltip(true),
                    }}
                >
                    {showTooltip && (
                        <Tooltip
                            direction="top"
                            offset={[0, -30]}
                            opacity={1}
                            permanent={false}
                            className="custom-tooltip"
                        >
                            <div className="tooltip-content">
                                <h5 className="text-xl font-semibold text-gray-900 mb-3">{description}</h5>
                                <p className="text-md text-gray-700">{address}</p>
                            </div>
                        </Tooltip>


                    )}
                </Marker>
            </MapContainer>

            {/* Get Directions Button */}
            <div
                style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    backgroundColor: "#2b7fff",
                    color: "white",
                    padding: "15px 35px",
                    fontWeight: "600",
                    cursor: "pointer",
                    zIndex: 400,
                    userSelect: "none",
                }}
                    onClick={() => {
                    if (typeof window !== "undefined") {
                        window.open(
                        `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
                        "_blank"
                        );
                    }
                }}
                title="Get Directions"
            >
                Get Directions
            </div>
        </section>
    );
};

export default MapSectionClient;