import Airtable from 'airtable';

Airtable.configure({
    apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID); // configured once
const categoriesTable = process.env.AIRTABLE_CATEGORIES_NAME || "Categories";
const productsTable = process.env.AIRTABLE_PRODUCTS_NAME || "Products";
const brandsTable = process.env.AIRTABLE_BRANDS_NAME || "Brands";

console.log("AIRTABLE_API_KEY loaded?", !!process.env.AIRTABLE_API_KEY);


// ✅ Fetch categories
export async function fetchCategories() {
    const records = await base(categoriesTable).select().all();
    return records.map(record => ({
        id: record.id,
        ...record.fields,
    }));
}

// ✅ Fetch brands
export async function fetchBrands() {
    const records = await base(brandsTable).select().all();
    return records.map(record => ({
        id: record.id,
        ...record.fields,
    }));
}

// ✅ Fetch all products
export async function fetchProducts() {
    const records = await base(productsTable).select().all();
    return records.map(record => ({
        recordId: record.id,
        ...record.fields,
    }));
}

// ✅ Fetch product by ID
export async function fetchProductById(id) {
    if (!id) return null;

    try {
        const record = await base(productsTable).find(id);
        return {
        recordId: record.id,
        ...record.fields,
        };
    } catch (error) {
        console.error("Error fetching product details:", error);
        return null;
    }
}
