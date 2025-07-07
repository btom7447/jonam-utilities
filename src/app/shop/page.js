"use client";

import React, { useEffect, useState } from "react";
import NoProduct from "@/components/NoProduct";
import { DotLoader } from "react-spinners";
import ShopDisplay from "@/components/ShopDisplay";
import ShopFilter from "@/components/ShopFilter";
import ShopFilterMobile from "@/components/ShopFilterMobile";
import { useSearchParams } from "next/navigation";

const ShopPage = () => {
    const searchParams = useSearchParams();
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

    // Filter by search params, category 
    useEffect(() => {
        const categoryFromUrl = searchParams.get('category');
        if (categoryFromUrl) {
            setSelectedCategory(categoryFromUrl);
        }
    }, [searchParams]);

    // Fetch products on mount
    useEffect(() => {
        async function loadProducts() {
            const res = await fetch("/api/products");
            const data = await res.json();

            if (!Array.isArray(data)) {
                console.error("Products not array:", data);
                setProducts([]);
            } else {
                setProducts(data);
            }

            setLoading(false);
        }

        loadProducts();
    }, []);

    // Filter by category, brand, and search
    useEffect(() => {
        const tempFiltered = products.filter((product) => {
        const matchesCategory = selectedCategory
            ? Array.isArray(product.category)
            ? product.category.includes(selectedCategory)
            : product.category === selectedCategory
            : true;

        const matchesSearch = search
            ? product.name.toLowerCase().includes(search.toLowerCase())
            : true;

        const matchesBrand = selectedBrand
    ? Array.isArray(product.brand_name) &&
        product.brand_name.includes(selectedBrand)
    : true;
        return matchesCategory && matchesSearch && matchesBrand;
    });

        const prices = tempFiltered.map((p) => p.price || 0);
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

    // Further filter by price range
    useEffect(() => {
        const priceFiltered = filteredProducts.filter(
        (product) =>
            typeof product.price === "number" &&
            product.price >= priceRange[0] &&
            product.price <= priceRange[1]
        );

        setDisplayedProducts(priceFiltered);
    }, [filteredProducts, priceRange]);

    // Extract unique categories
    const categories = Array.from(
        new Set(
        (products || []).flatMap((product) =>
            Array.isArray(product?.category) && product.category.length > 0
            ? product.category
            : ["Uncategorized"]
        )
        )
    );

        // Extract unique brands
        const brands = Array.from(
        new Set(
            products.flatMap((p) =>
            Array.isArray(p.brand_name)
                ? p.brand_name.filter(Boolean) 
                : p.brand_name
                ? [p.brand_name]
                : []
            )
        )
    );

    // Handle toggles
    const toggleCategory = (category) => {
        setSelectedCategory((prev) => (prev === category ? "" : category));
    };

    const toggleBrand = (brand) => {
        setSelectedBrand((prev) => (prev === brand ? "" : brand));
    };

    // console.log("Products", products)
    if (loading) {
        return (
            <div className="flex justify-center items-center w-full py-20">
                <DotLoader size={80} color="#8b4513" />
            </div>
        );
    }

    return (
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
    );
};

export default ShopPage;
