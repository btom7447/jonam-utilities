"use client";

import { useEffect, useState } from "react";
import { DotLoader } from "react-spinners";
import AdminHeader from "@/components/AdminHeader";
import { toast } from "react-toastify";
import ProductMetricSection from "@/components/ProductMetricSection";
import AdminProductTable from "@/components/AdminProductTable";
import ProjectsMetricSection from "@/components/ProjectsMetricSection";
import AdminProjectsTable from "@/components/AdminProjectsTable";

export default function AdminBookingsPage() {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false)
    const [selectedProject, setSelectedProject] = useState(null); 
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const handleDeleteClick = (product) => {
        setDeleteTarget(product);
        setDeleteModalOpen(true);
    };

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

    if (loading) {
        return (
            <div className="flex justify-center items-center w-full h-screen py-20">
                <DotLoader size={80} color="#8b4513" />
            </div>
        );
    }

    const handleRowClick = (project) => {
        // order now includes recordId
        setSelectedProject(project);
    };

const handleUpdateProject = async (updatedRow) => {
  setUpdating(true);
  try {
    if (!updatedRow?.recordId) {
      toast.error("RecordId is missing from payload");
      setUpdating(false);
      return;
    }

    const payload = { ...updatedRow.values };

    if (payload.image && typeof payload.image === "string") {
      payload.image = [{ url: payload.image }];
    }

    const res = await fetch(`/api/projects/${updatedRow.recordId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Failed to update projects");
    }

    const updatedProject = await res.json();

    setProjects(prev =>
      prev.map(o =>
        o.recordId === updatedRow.recordId
          ? { ...o, ...updatedProject }
          : o
      )
    );

    toast.success("Project record updated successfully!");
    setSelectedProject(null);
  } catch (err) {
    console.error("Error updating project:", err);
    toast.error(`Update failed: ${err.message}`);
  } finally {
    setUpdating(false);
  }
};



    const handleDelete = async (project) => {
        if (!project?.recordId) return toast.error("No record ID found for deletion");

        setUpdating(true); // optional: disables buttons while deleting
        try {
            const res = await fetch(`/api/projects/${product.recordId}`, { method: "DELETE" });

            if (!res.ok) {
            const errData = await res.json();
            throw new Error(errData.error || "Failed to delete project");
            }

            // Remove from local state so both table and metrics update instantly
            setProjects(prev => prev.filter(o => o.recordId !== project.recordId));

            toast.success("Project deleted successfully!");
        } catch (err) {
            console.error("Delete failed:", err);
            toast.error(`Delete failed: ${err.message}`);
        } finally {
            setUpdating(false);
        }
    };


    console.log("Projects", projects)
    return (
        <>
            <AdminHeader title="Products Management" />
            <ProjectsMetricSection projects={projects} />

            <AdminProjectsTable
                data={projects}
                onEdit={handleUpdateProject}
                onDelete={handleDelete}
            />
        </>
    );
}
