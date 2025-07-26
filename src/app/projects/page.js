"use client"

import React, { useEffect, useState } from 'react'
import { DotLoader } from "react-spinners";
import ProjectCard from '@/components/ProjectCard';
import NoProject from '@/components/NoPoject';
import AOS from "aos";
import "aos/dist/aos.css";

const ProjectPage = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        async function loadProducts() {
            const res = await fetch("/api/projects");
            const data = await res.json();
            if (!Array.isArray(data)) {
                console.error("Projects not array:", data);
                setProjects([]);
            } else {
                setProjects(data);
            }
            setLoading(false);
        }

        loadProducts();
    }, []);

    useEffect(() => {
        AOS.init({ duration: 600 });
    }, []);
    
    useEffect(() => {
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 5000); // 5 seconds timeout

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
        <section className='flex flex-col items-center justify-center bg-blue-50 px-5 md:px-20 py-20'>
            {projects.length === 0 ? (
                <NoProject />
            ) : (
                <>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-20 justify-center mt-10">
                        {projects.map((project, idx) => (
                            <div
                                key={project.recordId}
                                data-aos="fade-up"
                                data-aos-delay={idx * 150}
                                data-aos-duration="600"
                            >
                                <ProjectCard data={project} />
                            </div>
                        ))}
                    </div>
                </>
            )}
        </section>
    )
}

export default ProjectPage