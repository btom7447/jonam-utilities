"use client";

import { useEffect, useState } from "react";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css";
import { DotLoader } from "react-spinners";
import CategoryCard from "./CategoryCard";
import NoCategories from "./NoCategories";

const CategorySection = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

     useEffect(() => {
       async function loadData() {
         try {
           const res = await fetch("/api/categories");
           const data = await res.json();
           if (!Array.isArray(data)) {
             console.error("Categories not array:", data);
             setCategories([]);
           } else {
             // Filter only published categories
             const publishedCategories = data.filter(
               (cat) => cat.status === "publish"
             );
             setCategories(publishedCategories);
           }
         } catch (err) {
           console.error("Error fetching categories:", err);
           setCategories([]);
         } finally {
           setLoading(false);
         }
       }

       loadData();
     }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 5000); // 10 seconds timeout

        return () => clearTimeout(timeout);
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full py-20">
                <DotLoader size={80} color="#8b4513" />
            </div>
        );
    }

    // console.log("Categories", categories)
    
    return (
        <section className="flex flex-col items-center justify-center bg-white px-5 md:px-20 py-20">
            <h5 className="text-xl md:text-2xl text-black uppercase font-semibold mb-5">
                Premium Quality
            </h5>
            <h2 className="text-3xl md:text-7xl text-black text-center font-bold max-w-full md:max-w-5xl">
                Choose category you're interested in
            </h2>

            {categories.length === 0 ? (
                <NoCategories />
            ) : (
                <Splide
                    options={{
                        type: "loop",
                        perPage: 4,
                        perMove: 1,
                        gap: "30px",
                        autoplay: true,
                        interval: 2200,
                        arrows: true,
                        pagination: false,
                        breakpoints: {
                            1440: { perPage: 4},
                            1024: { perPage: 3 },
                            850: { perPage: 2},
                            640: { perPage: 1 },
                        },
                    }}
                    className="w-full px-10"
                >
                    {categories.map((category) => (
                        <SplideSlide key={category.id}>
                            <CategoryCard data={category} />
                        </SplideSlide>
                    ))}
                </Splide>
            )}
        </section>
    );
};

export default CategorySection;