import dynamic from "next/dynamic";

const MapSectionClient = dynamic(() => import("./MapSectionClient"), {
    ssr: false, // this disables server-side rendering
});

export default function MapSection(props) {
    return <MapSectionClient {...props} />;
}
