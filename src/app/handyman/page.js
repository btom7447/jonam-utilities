"use client";

import React, { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import AOS from "aos";
import "aos/dist/aos.css";
import HandymanCard from "@/components/HandymanCard";
import NoHandyman from "@/components/NoHandyman";

const HandymanPage = () => {
  const [handyman, setHandyman] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHandyman() {
      try {
        const res = await fetch("/api/handyman");
        const data = await res.json();

        if (!Array.isArray(data)) {
          console.error("Handyman not array:", data);
          setHandyman([]);
        } else {
          // ✅ Only keep handymen with status === "available"
          const available = data.filter((h) => h.availability === "available");
          setHandyman(available);
        }
      } catch (err) {
        console.error("Failed to load handymen:", err);
        setHandyman([]);
      } finally {
        setLoading(false);
      }
    }

    loadHandyman();
  }, []);

  useEffect(() => {
    AOS.init({ duration: 600 });
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => setLoading(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full py-20">
        <DotLoader size={80} color="#8b4513" />
      </div>
    );
  }

  return (
    <section className="flex flex-col items-center justify-center bg-blue-50 px-5 md:px-20 py-20">
      {handyman.length === 0 ? (
        <NoHandyman />
      ) : (
        <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-20 justify-center mt-10">
          {handyman.map((handy, idx) => (
            <div
              key={handy._id || handy.recordId || idx}
              data-aos="fade-up"
              data-aos-delay={idx * 150}
              data-aos-duration="600"
            >
              <HandymanCard data={handy} />
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default HandymanPage;