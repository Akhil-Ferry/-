import React, { useEffect } from "react";

const FinisherHeader = () => {
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "/finisher-header.es5.min.js";
        script.type = "text/javascript";
        script.onload = () => {
            if (window && window.FinisherHeader) {
                new window.FinisherHeader({
                    count: 100,
                    size: { min: 2, max: 8, pulse: 0 },
                    speed: { x: { min: 0, max: 0.4 }, y: { min: 0, max: 0.6 } },
                    colors: {
                        background: "#2a1c9c",
                        particles: ["#ffffff", "#ffffff", "#ffffff"],
                    },
                    blending: "overlay",
                    opacity: { center: 1, edge: 0 },
                    skew: -2,
                    shapes: ["c"],
                });
            }
        };
        document.body.appendChild(script);

        return () => {
            // cleanup script if still present
            if (document.body.contains(script)) document.body.removeChild(script);
        };
    }, []);

    return (
        <div className="header finisher-header" style={{ width: "100%", height: "300px" }}>
            <h1 style={{ color: "#fff", textAlign: "center", paddingTop: "100px" }}>
                Logo, Navigation, etc.
            </h1>
        </div>
    );
};

export default FinisherHeader;
