"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { DotLoader } from "react-spinners";
import ProjectDetails from "@/components/ProjectDetails";
import ProjectGallery from "@/components/ProjectGallery";
import NoProject from "@/components/NoPoject";

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchProject() {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (!res.ok) {
          console.error("No project found");
          setProject(null);
          return;
        }
        const data = await res.json();
        setProject(data);
      } catch (err) {
        console.error("Error loading project:", err);
        setProject(null);
      } finally {
        setLoading(false);
      }
    }

    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full py-20">
        <DotLoader size={80} color="#8b4513" />
      </div>
    );
  }

  if (!project) {
    return <NoProject />;
  }

  return (
    <div className="px-5 md:px-20 xl:px-30 py-10 xl:py-30 bg-blue-50 grid grid-cols-1 xl:grid-cols-2 gap-15 lg:gap-30">
      <ProjectGallery data={project} />
      <ProjectDetails data={project} />
    </div>
  );
}
