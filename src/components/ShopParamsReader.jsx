"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";

const ShopParamsReader = ({ onParams }) => {
  const searchParams = useSearchParams();

  useEffect(() => {
    const category = searchParams.get("category") || "";
    const brand = searchParams.get("brand") || "";
    const search = searchParams.get("search") || "";
    onParams({ category, brand, search });
  }, [searchParams, onParams]);

  return null;
};

export default ShopParamsReader;
