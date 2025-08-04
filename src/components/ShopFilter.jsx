"use client";

import { MinusIcon, PlusIcon, SearchIcon } from 'lucide-react';
import React, { useState } from 'react'

const ShopFilter = ({
    categories,
    brands,
    minPrice,
    maxPrice,
    priceRange,
    setPriceRange,
    selectedCategory,
    setSelectedCategory,
    selectedBrand, 
    setSelectedBrand, 
    setSearch,
    setUserAdjustedPrice,
}) => {
    console.log("passed brands", brands)
    const [activeInput, setActiveInput] = useState(null);
    const [localSearch, setLocalSearch] = useState("");

    const handleSearchChange = (e) => {
        setLocalSearch(e.target.value);
        setSearch(e.target.value);
    };

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
    };

    return (
        <section className="searchFilter hidden xl:flex sticky top-29 bg-white p-10 max-h-screen overflow-y-auto flex-col">
            <h4 className="text-2xl font-bold mb-5">Search</h4>
            <div className="relative group mb-10">
                <div className="flex items-center border-b border-gray-300">
                    <input
                        type="text"
                        name="search"
                        id="search"
                        placeholder="Search for a product ..."
                        value={localSearch}
                        onChange={handleSearchChange}
                        onFocus={() => setActiveInput("search")}
                        onBlur={() => setActiveInput(null)}
                        className="w-full text-xl py-2 outline-none bg-transparent text-black placeholder:text-gray-500"
                    />
                    <button type="button" className="cursor-pointer z-10">
                        <SearchIcon size={20} strokeWidth={1} />
                    </button>
                </div>
                <span
                    className={`absolute left-0 bottom-0 h-0.5 transition-all duration-200
                        ${activeInput === "search" ? "w-full bg-blue-500" : "w-0 bg-gray-300"}
                        group-hover:w-full group-hover:bg-blue-500`}
                ></span>
            </div>

            <h4 className="text-2xl font-bold mb-5">Categories</h4>
            <ul className="mb-10 flex flex-row flex-wrap items-start gap-5 text-lg font-light capitalize cursor-pointer">
                {categories && categories.length > 0 ? (
                    categories.map((category, idx) => (
                        <li
                            key={idx}
                            className={`py-2 px-3  text-gray-500  border ${
                                selectedCategory === category ? "bg-blue-500 border-blue-500 text-white" : "bg-white border-gray-500 hover:border-blue-500 hover:text-blue-500"
                            }`}
                            onClick={() => handleCategoryClick(category)}
                        >
                            {category}
                        </li>
                    ))
                    ) : (
                        <li>No categories</li>
                )}
            </ul>

            <h4 className="text-2xl font-bold mb-5">Brands</h4>
            <ul className="mb-10 flex flex-row flex-wrap items-start gap-5 text-lg font-light capitalize cursor-pointer">
                {brands.map((brand, idx) => (
                    <li
                        key={idx}
                        className={`py-2 px-3  text-gray-500  border ${
                            selectedBrand === brand ? "bg-blue-500 border-blue-500 text-white" : "bg-white border-gray-500 hover:border-blue-500 hover:text-blue-500"
                        }`}
                        onClick={() => setSelectedBrand(brand)}
                    >
                        {brand}
                    </li>
                ))}
            </ul>

            <h4 className="text-2xl font-bold mb-5">Price</h4>
            <p className='text-gray-500 text-xl mb-5'>
                Min - Max: ₦ {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}
            </p>
            <div className="relative group mb-10">
                <div className="flex items-center border-b border-gray-300">
                    <input
                        type="number"
                        value={priceRange[0] ?? ""}
                        min={minPrice}
                        max={priceRange[1]}
                        onChange={(e) => {
                            const value = e.target.value;
                            setUserAdjustedPrice(true);
                            setPriceRange([value ? Number(value) : 0, priceRange[1]]);
                        }}
                        onFocus={() => setActiveInput("search")}
                        onBlur={() => setActiveInput(null)}
                        className="w-full text-xl py-2 outline-none bg-transparent text-black placeholder:text-gray-500"
                    />
                    <button type="button" className="cursor-pointer z-10">
                        <MinusIcon size={20} strokeWidth={1} />
                    </button>
                </div>
                <span
                    className={`absolute left-0 bottom-0 h-0.5 transition-all duration-200
                        ${activeInput === "search" ? "w-full bg-blue-500" : "w-0 bg-gray-300"}
                        group-hover:w-full group-hover:bg-blue-500`}
                ></span>
            </div>
            <div className="relative group mb-10">
                <div className="flex items-center border-b border-gray-300">
                    <input
                        type="number"
                        value={priceRange[1] ?? ""}
                        min={priceRange[0]}
                        max={maxPrice}
                        onChange={(e) => {
                            const value = e.target.value;
                            setUserAdjustedPrice(true);
                            setPriceRange([priceRange[0], value ? Number(value) : 0]);
                        }}
                        onFocus={() => setActiveInput("search")}
                        onBlur={() => setActiveInput(null)}
                        className="w-full text-xl py-2 outline-none bg-transparent text-black placeholder:text-gray-500"
                    />
                    <button type="button" className="cursor-pointer z-10">
                        <PlusIcon size={20} strokeWidth={1} />
                    </button>
                </div>
                <span
                    className={`absolute left-0 bottom-0 h-0.5 transition-all duration-200
                        ${activeInput === "search" ? "w-full bg-blue-500" : "w-0 bg-gray-300"}
                        group-hover:w-full group-hover:bg-blue-500`}
                ></span>
            </div>
            <button
                className='py-3 text-xl border border-gray-500 hover:bg-gray-500 hover:text-white cursor-pointer'
                onClick={() => {
                    setUserAdjustedPrice(false);
                    setSelectedCategory("");
                    setSelectedBrand("");
                    setSearch("");
                    setPriceRange([minPrice, maxPrice]);
                }}
            >
                Reset Filters
            </button>
        </section>
    );
};

export default ShopFilter