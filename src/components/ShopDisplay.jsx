"use client";

import React, { useState, useEffect } from "react";
import ProductCard from "./ProductCard";
import NoFiltered from "./NoFiltered";
import { ChevronLeft, ChevronRight, ListFilter } from "lucide-react";
import CustomSelect from "./CustomSelect"; 

const ShopDisplay = ({ products = [], isOpen, setIsOpen }) => {
    const itemsPerPage = 9;
    const [currentPage, setCurrentPage] = useState(1);
    const [sortOrder, setSortOrder] = useState("highest");
    const [sortedProducts, setSortedProducts] = useState([]);

    useEffect(() => {
        let sorted = [...products];
        if (sortOrder === "highest") {
        sorted.sort((a, b) => (b.price || 0) - (a.price || 0));
        } else {
        sorted.sort((a, b) => (a.price || 0) - (b.price || 0));
        }
        setSortedProducts(sorted);
        setCurrentPage(1); // reset page on sort change
    }, [products, sortOrder]);

    const totalPages = Math.ceil(sortedProducts.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const currentItems = sortedProducts.slice(startIndex, startIndex + itemsPerPage);
    const endIndex = startIndex + currentItems.length;

    const goToPage = (page) => setCurrentPage(page);

    // Map sortOrder to display label
    const sortLabel = sortOrder === "highest" ? "High to Low" : "Low to High";

    // Options for CustomSelect
    const sortOptions = ["High to Low", "Low to High"];

    // Map display label back to sortOrder key
    const handleSortChange = (selectedLabel) => {
        if (selectedLabel === "High to Low") setSortOrder("highest");
        else if (selectedLabel === "Low to High") setSortOrder("lowest");
    };

    return (
        <section className="col-span-1 xl:col-span-2 w-full">
            {/* Showing text and sort dropdown */}
            <div className="flex justify-between items-center mb-10">
                <div className="w-full flex flex-wrap justify-between items-start gap-5">
                    <p className="text-lg font-medium text-gray-700">
                        Showing {startIndex + 1}–{endIndex} of {products.length} products
                    </p>

                    <CustomSelect
                        label="Sort by"
                        options={sortOptions}
                        value={sortLabel}
                        onChange={handleSortChange}
                    />
                </div>

                {/* Toggle button for mobile */}
                <button
                    className="xl:hidden text-black"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <ListFilter size={30} />
                </button>
            </div>

            {/* Grid layout */}
            {currentItems.length === 0 ? (
                <NoFiltered />
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-10">
                    {currentItems.map((product) => (
                        <ProductCard key={product.id} data={product} />
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mt-20 gap-2 items-center">
                    {currentPage > 1 && (
                        <button
                            onClick={() => goToPage(currentPage - 1)}
                            className="p-3 w-15 h-15 flex justify-center items-center bg-gray-900 text-white border border-brown hover:bg-brown hover:text-white hover:border-brown cursor-pointer"
                        >
                            <ChevronLeft size={20} />
                        </button>
                    )}

                    {Array.from({ length: totalPages }, (_, index) => (
                        <button
                            key={index}
                            onClick={() => goToPage(index + 1)}
                            className={`p-3 w-15 h-15 flex justify-center items-center border text-xl text-center font-semibold cursor-pointer ${
                                currentPage === index + 1
                                ? "bg-blue-500 text-white border-blue-500 hover:opacity-80"
                                : "bg-white text-blue-500 border-blue-500 hover:bg-blue-50"
                            }`}
                        >
                            {index + 1}
                        </button>
                    ))}

                    {currentPage < totalPages && (
                        <button
                            onClick={() => goToPage(currentPage + 1)}
                            className="p-3 w-15 h-15 flex justify-center items-center bg-gray-900 text-white border border-gray-900 hover:bg-brown hover:text-white hover:border-brown cursor-pointer"
                        >
                            <ChevronRight size={20} />
                        </button>
                    )}
                </div>
            )}
        </section>
    );
};
export default ShopDisplay;