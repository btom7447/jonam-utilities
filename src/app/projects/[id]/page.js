import NoProject from "@/components/NoPoject";
import ProjectDetails from "@/components/ProjectDetails";
import ProjectGallery from "@/components/ProjectGallery";
import { fetchProjectById } from "@/lib/airtable";

export default async function ProjectPage({ params }) {
    console.log("Param", params)
    const { id } = await params;
    const project = await fetchProjectById(id);

    if (!project) {
        return (
            <NoProject />
        )
    }
    console.log("Project Data", project)

    return (
        <div className="px-5 md:px-20 xl:px-30 py-10 xl:py-30 bg-blue-50 grid grid-cols-1 xl:grid-cols-2 gap-15 lg:gap-30">
            <ProjectGallery data={project} />
            <ProjectDetails data={project} />
        </div>
    );
}
