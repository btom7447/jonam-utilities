"use client";

import ContactPoster from "@/components/ContactPoster";
import dynamic from "next/dynamic";

const MapSection = dynamic(() => import("@/components/MapSection"), {
    ssr: false,
});

export default function ContactPage() {
    return (
        <>
            <ContactPoster />
            <MapSection />
        </>
    );
}
