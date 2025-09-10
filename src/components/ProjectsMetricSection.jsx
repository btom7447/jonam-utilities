"use client";

import { FoldersIcon, FolderHeartIcon, FolderSyncIcon, FolderClockIcon } from "lucide-react";

export default function ProjectsMetricSection({ projects }) {

    const projectLength = projects.length;

    // Count orders by status
    const featuredProjects = projects.filter(o => o.featured === "true").length;
    const publishedProjects = projects.filter(o => o.status === "publish").length;
    const draftProjects = projects.filter(o => o.status === "draft").length;

    const metrics = [
        {
            title: "Projects",
            value: projectLength,
            icon: FoldersIcon,
        },
        {
            title: "Featured Projects",
            value: featuredProjects,
            icon: FolderHeartIcon,
        },
        {
            title: "Published Projects",
            value: publishedProjects,
            icon: FolderSyncIcon,
        },
        {
            title: "Draft Projects",
            value: draftProjects,
            icon: FolderClockIcon,
        },
     ];

    return (
        <section className="p-5 lg:p-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {metrics.map(({ title, value, icon: Icon, extra, extraColor }) => (
                <div key={title} className="p-5 bg-white rounded-xl border-1 border-blue-500 relative group">
                    <div className="flex items-center justify-center gap-10 text-black group-hover:text-blue-500">
                        <Icon size={30} strokeWidth={1} />
                        <p className="text-lg font-semibold">{title}</p>
                    </div>
                    <h3 className="text-4xl font-semibold text-center mt-3 group-hover:text-blue-500">{value}</h3>
                    {extra && (
                        <span className={`text-lg absolute bottom-10 right-10 font-medium ${extraColor}`}>
                            {extra}
                        </span>
                    )}
                </div>
            ))}
        </section>
    );
}
