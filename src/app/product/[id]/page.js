import NoProduct from "@/components/NoProduct";
import ProductDetailsSection from "@/components/ProductDetailsSection";
import { fetchProductById } from "@/lib/airtable";

export default async function ProductPage({ params }) {

    const { id } = await params;
    const product = await fetchProductById(id);

    if (!product) {
        return (
            <NoProduct />
        )
    }

    return (
        <div className=" px-5 md:px-20 py-30 bg-blue-50">
            <ProductDetailsSection product={product} />
        </div>
    );
}
