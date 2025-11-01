"use client";

import { ShoppingCartIcon, PercentIcon, StarIcon, ChevronsDownIcon } from "lucide-react";

export default function ProductMetricSection({ product }) {

    const productLength = product.length;

    // Count orders by status
    const featuredProducts = product.filter(o => o.featured === true).length;
    const discountProducts = product.filter(o => o.discount).length;
    const lowProducts = product.filter(o => o.quantity !== null && o.quantity <= 20).length;

    const metrics = [
        {
            title: "Products",
            value: productLength,
            icon: ShoppingCartIcon,
        },
        {
            title: "Featured Products",
            value: featuredProducts,
            icon: StarIcon,
        },
        {
            title: "Discounted Products",
            value: discountProducts,
            icon: PercentIcon,
        },
        {
            title: "Low Products",
            value: lowProducts,
            icon: ChevronsDownIcon,
        },
     ];

    return (
        <section className="p-5 lg:p-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {metrics.map(({ title, value, icon: Icon, extra, extraColor }) => (
                <div key={title} className="p-5 bg-white rounded-xl border-1 border-blue-500 relative group">
                    <div className="flex items-center justify-center gap-10 text-black group-hover:text-blue-500">
                        <Icon size={30} strokeWidth={1} />
                        <p className="text-lg font-semibold">{title}</p>
                    </div>
                    <h3 className="text-4xl font-semibold text-center mt-3 group-hover:text-blue-500">{value}</h3>
                    {extra && (
                        <span className={`text-lg absolute bottom-10 right-10 font-medium ${extraColor}`}>
                            {extra}
                        </span>
                    )}
                </div>
            ))}
        </section>
    );
}
