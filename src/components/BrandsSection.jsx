"use client";

import { useEffect, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { DotLoader } from "react-spinners";
import ErrorFetching from "./ErrorFetching";
import Image from "next/image";

const BrandsSection = () => {
    const [brands, setBrands] = useState([]);
    const [loading, setLoading] = useState(true);
    const [timestamp, setTimestamp] = useState("");

    useEffect(() => {
        async function loadData() {
            try {
                const res = await fetch("/api/brands");
                const data = await res.json();
                if (!Array.isArray(data)) {
                    console.error("Categories not array:", data);
                    setBrands([]);
                } else {
                    setBrands(data);
                }
            } catch (err) {
                console.error("Error fetching brands:", err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 10000); // 10 seconds timeout

        return () => clearTimeout(timeout);
    }, []);

    useEffect(() => {
        setTimestamp(`?t=${Date.now()}`);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full py-50">
                <DotLoader size={80} color="#8b4513" />
            </div>
        );
    }
    
    return (
        <section className="flex flex-col-reverse lg:flex-row gap-10 items-center justify-center bg-white px-5 md:px-20 py-20">

            {brands.length === 0 ? (
                <ErrorFetching />
            ) : (
                <>
                    <Splide
                        options={{
                            type: "loop",
                            perPage: 4,
                            perMove: 1,
                            gap: "20px",
                            autoplay: true,
                            interval: 2000,
                            arrows: false,
                            pagination: false,
                            breakpoints: {
                                1440: { perPage: 4},
                                1024: { perPage: 3 },
                                768: { perPage: 3},
                                640: { perPage: 2 },
                            },
                        }}
                        className="w-full -mt-20"
                    >
                        {brands.map((brand) => (
                            <SplideSlide key={brand.id}>
                                <div className="flex justify-center">
                                    {brand.image?.[0]?.url && (
                                        <Image
                                            src={`${brand.image[0].url}${timestamp}`}
                                            alt={`${brand.name} logo`}
                                            width={70}
                                            height={40}
                                            className=' w-60 h-30 object-contain transition-opacity duration-300 opacity-50 hover:opacity-100'
                                            unoptimized
                                        />
                                    )}
                                </div>
                            </SplideSlide>
                        ))}
                    </Splide>
                    <h4 className="text-3xl lg:text-5xl font-semibold text-center lg:text-left">We Work with the best brands</h4>
                </>
            )}
        </section>
    );
};

export default BrandsSection;