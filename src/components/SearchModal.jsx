import { SearchIcon } from 'lucide-react';
import React, { useState } from 'react'

const SearchModal = () => {
    const [activeInput, setActiveInput] = useState(null);
    const [selectedState, setSelectedState] = useState("");
    
    const fields = [
        { label: "Search for a product", name: "search", type: "text" },
    ];

    return (
        <div className="flex flex-col w-full rounded shadow-lg text-white">
            <h2 className="text-2xl font-bold mb-5">Search</h2>

            {/* Cart Items */}
            <div className="cartItems flex flex-col gap-5 h-[75dvh] lg:max-h-70 overflow-y-scroll">
                {fields.map(({ label, name, type }) => (
                    <div key={name} className="relative group">
                        <div className='flex items-center border-b-1  border-white'>
                            <input
                                type={type}
                                name={name}
                                id={name}
                                placeholder={label}
                                onFocus={() => setActiveInput(name)}
                                onBlur={() => setActiveInput(null)}
                                className="w-full text-2xl py-5 outline-none bg-transparent text-white transition-all duration-300 placeholder-shown:text-2xl placeholder-shown:font-light placeholder-shown:text-gray-500"
                            />
                            <button type="button" className='cursor-pointer z-10'>
                                <SearchIcon size={25} strokeWidth={1} />
                            </button>
                        </div>
                        <span
                            className={`absolute left-0 bottom-0 h-0.5 
                            transition-all duration-200
                            ${activeInput === name ? "w-full bg-blue-500" : "w-0 bg-gray-900"} 
                            group-hover:w-full group-hover:bg-blue-500`}
                        ></span>
                    </div>
                ))}   
            </div>

        </div>
    )
}

export default SearchModal