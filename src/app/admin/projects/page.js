"use client";

import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import AdminHeader from "@/components/AdminHeader";
import { toast } from "react-toastify";
import ProjectsMetricSection from "@/components/ProjectsMetricSection";
import AdminProjectsTable from "@/components/AdminProjectsTable";

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  // --- Fetch all projects from MongoDB ---
  useEffect(() => {
    async function loadData() {
      try {
        const res = await fetch("/api/projects");
        if (!res.ok) throw new Error("Failed to fetch projects");
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

  // --- Create or Update Project ---
  const handleUpdateProject = async ({ _id, values }) => {
    setUpdating(true);
    try {
      let updatedProject;

      if (!_id) {
        // ✅ CREATE
        const res = await fetch(`/api/projects`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        updatedProject = await res.json();
        setProjects((prev) => [...prev, updatedProject]);
        toast.success("Project created successfully!");
      } else {
        // ✅ UPDATE
        const res = await fetch(`/api/projects/${_id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        updatedProject = await res.json();

        setProjects((prev) =>
          prev.map((p) => (p._id === _id ? { ...p, ...updatedProject } : p))
        );
        toast.success("Project updated successfully!");
      }
    } catch (err) {
      toast.error(`Operation failed: ${err.message}`);
      console.error("Update project failed:", err);
    } finally {
      setUpdating(false);
    }
  };

  // --- Delete Project ---
  const handleDelete = async (project) => {
    if (!project?._id) return toast.error("No project ID found for deletion");

    setUpdating(true);
    try {
      const res = await fetch(`/api/projects/${project._id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error((await res.json()).error);

      setProjects((prev) => prev.filter((p) => p._id !== project._id));
      toast.success("Project deleted successfully!");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error(`Delete failed: ${err.message}`);
    } finally {
      setUpdating(false);
    }
  };

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
