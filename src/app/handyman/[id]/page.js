import HandymanProfile from "@/components/HandymanProfile";
import NoHandyman from "@/components/NoHandyman";
import { fetchHandymanById } from "@/lib/airtable";

export default async function HandymanDetailsPage({ params }) {
    console.log("Param", params)
    const { id } = await params;
    const handyman = await fetchHandymanById(id);

    if (!handyman) {
        return (
            <NoHandyman />
        )
    }
    console.log("Handy Man Data", handyman)

    return (
        <div className="px-5 md:px-20 xl:px-30 py-10 xl:py-30 bg-blue-50">
            <HandymanProfile data={handyman} />
        </div>
    );
}
