import ProductDetailsSection from "@/components/ProductDetailsSection";
import { fetchProductById } from "@/lib/airtable";

export default async function ProductPage({ params }) {

    const { id } = await params;
    const product = await fetchProductById(id);

    console.log("product id", id)

    if (!product) {
        return <div>Product not found</div>;
    }

    return (
        <div className="p-6 max-w-2xl mx-auto">
            {/* <ProductDetailsSection product={product} /> */}
        </div>
    );
}
