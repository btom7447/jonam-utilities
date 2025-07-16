"use client";

import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip, useMapEvent } from "react-leaflet";
import L from "leaflet";

const MapSection = ({ lat = 40.73061, lng = -73.935242, description = "Ile Ife Branch Office" }) => {
    const [showTooltip, setShowTooltip] = useState(false);

    // Custom SVG icon for the pin
    const customIcon = L.divIcon({
        className: "custom-pin-icon",
        html: `
        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#2b7fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 21C12 21 7 13.5 7 10.5C7 7.46243 9.46243 5 12.5 5C15.5376 5 18 7.46243 18 10.5C18 13.5 12 21 12 21Z" />
            <circle cx="12" cy="10.5" r="2.5" />
        </svg>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 32],
        popupAnchor: [0, -32],
    });

    // Close tooltip if clicked outside marker
    function MapClickHandler() {
        useMapEvent("click", () => setShowTooltip(false));
        return null;
    }

    return (
        <section style={{ position: "relative", width: "100%", overflow: "hidden", zIndex: 100 }} className="h-[50dvh] lg:h-[80dvh]">
            <MapContainer
                center={[lat, lng]}
                zoom={13}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={false}
                dragging={false}
                doubleClickZoom={false}
                touchZoom={false}
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
                        click: () => {
                        setShowTooltip(true);
                        },
                    }}
                    >
                    {showTooltip && (
                        <Tooltip direction="top" offset={[0, -30]} opacity={1} permanent={false}>
                            {description}
                        </Tooltip>
                    )}
                </Marker>
            </MapContainer>

            {/* Fixed modal top right */}
            <div
                style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
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

export default MapSection;
