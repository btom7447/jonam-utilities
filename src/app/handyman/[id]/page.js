"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import HandymanProfile from "@/components/HandymanProfile";
import NoHandyman from "@/components/NoHandyman";
import { DotLoader } from "react-spinners";

export default function HandymanDetailsPage() {
  const { id } = useParams();
  const [handyman, setHandyman] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    async function fetchHandyman() {
      try {
        const res = await fetch(`/api/handyman/${id}`);
        if (!res.ok) {
          console.error("No handyman found");
          setHandyman(null);
          return;
        }
        const data = await res.json();
        setHandyman(data);
      } catch (err) {
        console.error("Error loading handyman:", err);
        setHandyman(null);
      } finally {
        setLoading(false);
      }
    }

    fetchHandyman();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full py-20">
        <DotLoader size={80} color="#8b4513" />
      </div>
    );
  }

  if (!handyman) {
    return <NoHandyman />;
  }

  return (
    <div className="px-5 md:px-20 xl:px-30 py-10 xl:py-30 bg-blue-50">
      <HandymanProfile data={handyman} />
    </div>
  );
}
