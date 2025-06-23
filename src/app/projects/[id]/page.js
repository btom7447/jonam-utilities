import NoProject from "@/components/NoPoject";
import { fetchProjectById } from "@/lib/airtable";

export default async function ProjectPage({ params }) {

    const { id } = await params;
    const project = await fetchProjectById(id);

    if (!project) {
        return (
            <NoProject />
        )
    }

    return (
        <div className=" px-5 md:px-20 xl:px-30 py-10 xl:py-30 bg-blue-50">

        </div>
    );
}
