"use client";

import React, { useEffect } from "react";
import CountUp from "react-countup";
import AOS from "aos";
import "aos/dist/aos.css";
import { useInView } from "react-intersection-observer"; 

const metrics = [
    { label: "Happy Clients", end: 180 },
    { label: "Years", end: 10 },
    { label: "Projects Completed", end: 1200 },
    { label: "Products Offered", end: 80 },
];

const MetricsSection = () => {
    useEffect(() => {
        AOS.init({ duration: 800, once: true });
    }, []);

    return (
        <section className="bg-blue-50 py-20 px-5 md:px-20">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
                {metrics.map(({ label, end }, i) => {
                    const { ref, inView } = useInView({ triggerOnce: true });

                    return (
                        <div
                            ref={ref}
                            key={label}
                            data-aos="fade-up"
                            data-aos-delay={i * 200}
                            className="flex flex-col items-center"
                        >
                            <h2 className="text-5xl lg:text-7xl font-bold text-blue-500">
                                {inView ? <CountUp end={end} duration={2} /> : 0}
                                {label === "Projects Completed" ? "" : "+"}
                            </h2>
                            <p className="mt-2 text-2xl text-gray-700 font-semibold">{label}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default MetricsSection;
