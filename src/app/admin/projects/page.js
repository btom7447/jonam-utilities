"use client";

import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import AdminHeader from "@/components/AdminHeader";
import { toast } from "react-toastify";
import ProjectsMetricSection from "@/components/ProjectsMetricSection";
import AdminProjectsTable from "@/components/AdminProjectsTable";
import { normalizePayload } from "@/lib/normalizePayload";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);

  // --- Fetch all projects ---
  useEffect(() => { 
    async function loadData() {
      try {
        const res = await fetch("/api/projects");
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setProjects([]);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  // --- Loader ---
  if (loading) {
    return (
      <div className="flex justify-center items-center w-full h-screen py-20">
        <DotLoader size={80} color="#8b4513" />
      </div>
    );
  }

  // --- Helper: format images for Airtable ---
  const formatImages = (images) => {
    if (!images) return [];
    if (typeof images === "string") return [{ url: images }];
    if (Array.isArray(images))
      return images.map((img) =>
        typeof img === "string" ? { url: img } : { url: img.url }
      );
    if (images.url) return [{ url: images.url }];
    return [];
  };

  // --- Create or Update Project ---
  const handleUpdateProject = async ({ recordId, values }) => {
    setUpdating(true);
    try {
      // Normalize payload for Airtable
      const payload = normalizePayload(values, {
        numberFields: ["client_rating"],
        imageFields: ["images"],
        selectFields: ["status", "featured"]
      });

      // Format image arrays
      if (payload.image) payload.image = formatImages(payload.image);
      if (payload.images) payload.images = formatImages(payload.images);

      let updatedProject;

      if (!recordId) {
        // ✅ CREATE
        const res = await fetch(`/api/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        updatedProject = await res.json();

        setProjects((prev) => [...prev, updatedProject]);
        toast.success("Project created successfully!");
      } else {
        // ✅ UPDATE
        const res = await fetch(`/api/projects/${recordId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        updatedProject = await res.json();

        setProjects((prev) =>
          prev.map((o) =>
            o.recordId === recordId ? { ...o, ...updatedProject } : o
          )
        );
        toast.success("Project updated successfully!");
      }

      setSelectedProject(null);
    } catch (err) {
      toast.error(`Operation failed: ${err.message}`);
      console.error("Update project failed:", err);
    } finally {
      setUpdating(false);
    }
  };

  // --- Delete Project ---
  const handleDelete = async (project) => {
    if (!project?.recordId)
      return toast.error("No record ID found for deletion");

    setUpdating(true);
    try {
      const res = await fetch(`/api/projects/${project.recordId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to delete project");
      }

      setProjects((prev) =>
        prev.filter((o) => o.recordId !== project.recordId)
      );
      toast.success("Project deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(`Delete failed: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

  console.log("Projects data", projects);

  return (
    <>
      <AdminHeader title="Projects Management" />
      <ProjectsMetricSection projects={projects} />

      <AdminProjectsTable
        data={projects}
        onEdit={handleUpdateProject}
        onDelete={handleDelete}
        updating={updating}
      />
    </>
  );
}
