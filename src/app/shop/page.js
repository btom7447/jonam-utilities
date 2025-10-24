"use client";

import React, { useEffect, useState } from "react";
import NoProduct from "@/components/NoProduct";
import { DotLoader } from "react-spinners";
import ShopDisplay from "@/components/ShopDisplay";
import ShopFilter from "@/components/ShopFilter";
import ShopFilterMobile from "@/components/ShopFilterMobile";
import ShopParamsReader from "@/components/ShopParamsReader";

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState([0, 0]);
  const [userAdjustedPrice, setUserAdjustedPrice] = useState(false);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [displayedProducts, setDisplayedProducts] = useState([]);

  // Fetch products from MongoDB API
useEffect(() => {
  async function loadProducts() {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();

      if (!Array.isArray(data)) {
        console.error("Products not array:", data);
        setProducts([]);
      } else {
        const normalized = data
          .map((product) => {
            // ✅ Convert discount like "7%" → 0.07
            let discount = product.discount;
            if (typeof discount === "string" && discount.includes("%")) {
              discount = parseFloat(discount.replace("%", "")) / 100;
            } else if (typeof discount === "number" && discount > 1) {
              discount = discount / 100;
            } else if (!discount) {
              discount = 0;
            }

            return { ...product, discount };
          })
          .filter((product) => {
            // ✅ Keep only those with proper ObjectId references
            const hasValidCategory =
              typeof product.category_link === "string" &&
              /^[0-9a-fA-F]{24}$/.test(product.category_link);

            const hasValidBrand =
              typeof product.brand_link === "string" &&
              /^[0-9a-fA-F]{24}$/.test(product.brand_link);

            return hasValidCategory && hasValidBrand;
          });

        setProducts(normalized);
      }
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
    }
    setLoading(false);
  }

  loadProducts();
}, []);


// console.log("Products", products)
  // Filtering logic
  useEffect(() => {
    const tempFiltered = products.filter((product) => {
      const category = (product.category || "").toLowerCase();
      const brand = (product.brand_name || "").toLowerCase();
      const productName = (product.name || "").toLowerCase();

      const matchesCategory = selectedCategory
        ? category === selectedCategory.toLowerCase()
        : true;

      const matchesBrand = selectedBrand
        ? brand === selectedBrand.toLowerCase()
        : true;

      const matchesSearch = search
        ? productName.includes(search.toLowerCase())
        : true;

      return matchesCategory && matchesBrand && matchesSearch;
    });

    const prices = tempFiltered.map((p) => Number(p.price) || 0);
    const newMinPrice = prices.length ? Math.min(...prices) : 0;
    const newMaxPrice = prices.length ? Math.max(...prices) : 0;

    setFilteredProducts(tempFiltered);
    setMinPrice(newMinPrice);
    setMaxPrice(newMaxPrice);

    if (!userAdjustedPrice) {
      setPriceRange([newMinPrice, newMaxPrice]);
      setDisplayedProducts(tempFiltered);
    }
  }, [products, selectedCategory, selectedBrand, search]);

  // Filter by price range
 useEffect(() => {
   if (!filteredProducts.length) {
     setDisplayedProducts([]);
     return;
   }

   const priceFiltered = filteredProducts.filter((product) => {
     const price = Number(product.price) || 0;
     return price >= priceRange[0] && price <= priceRange[1];
   });

   setDisplayedProducts(priceFiltered);
 }, [filteredProducts, priceRange]);

  // Unique categories and brands
  const categories = Array.from(
    new Set(
      products.map((product) =>
        product.category ? product.category : "Uncategorized"
      )
    )
  );

 const brands = Array.from(
   new Set(
     products.map((product) =>
       product.brand_name ? product.brand_name : "Unbranded"
     )
   )
 );

  const toggleCategory = (category) =>
    setSelectedCategory((prev) => (prev === category ? "" : category));

  const toggleBrand = (brand) =>
    setSelectedBrand((prev) => (prev === brand ? "" : brand));

  if (loading) {
    return (
      <div className="flex justify-center items-center w-full py-20">
        <DotLoader size={80} color="#8b4513" />
      </div>
    );
  }

  return (
    <>
      <ShopParamsReader
        onParams={({ category, brand, search }) => {
          setSelectedCategory(category);
          setSelectedBrand(brand);
          setSearch(search);
        }}
      />

      <div className="px-5 md:px-20 xl:px-30 py-10 xl:py-30 bg-blue-50 grid grid-cols-1 xl:grid-cols-3 items-start gap-10">
        <ShopDisplay
          products={displayedProducts}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
        />

        <ShopFilter
          categories={categories}
          brands={brands}
          minPrice={minPrice}
          maxPrice={maxPrice}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedCategory={selectedCategory}
          setSelectedCategory={toggleCategory}
          selectedBrand={selectedBrand}
          setSelectedBrand={toggleBrand}
          setSearch={setSearch}
          setUserAdjustedPrice={setUserAdjustedPrice}
        />

        <ShopFilterMobile
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          categories={categories}
          brands={brands}
          minPrice={minPrice}
          maxPrice={maxPrice}
          priceRange={priceRange}
          setPriceRange={setPriceRange}
          selectedCategory={selectedCategory}
          setSelectedCategory={toggleCategory}
          selectedBrand={selectedBrand}
          setSelectedBrand={toggleBrand}
          setSearch={setSearch}
          setUserAdjustedPrice={setUserAdjustedPrice}
        />
      </div>
    </>
  );
};

export default ShopPage;