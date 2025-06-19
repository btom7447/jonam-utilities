import Airtable from 'airtable';

const apiKey = process.env.AIRTABLE_API_KEY;
const baseId = process.env.AIRTABLE_BASE_ID;
const categoriesTable = process.env.AIRTABLE_CATEGORIES_NAME || "Categories";
const productsTable = process.env.AIRTABLE_PRODUCTS_NAME || "Products";

function getBase() {
    if (!apiKey || !baseId) {
        throw new Error("Missing Airtable environment variables");
    }
    Airtable.configure({ apiKey });
    return Airtable.base(baseId);
}

// Fetch categories
export async function fetchCategories() {
    const base = getBase();
    const records = await base(categoriesTable).select().all();

    return records.map(record => ({
        id: record.id,
        ...record.fields,
    }));
}

// Fetch all products
export async function fetchProducts() {
    const base = getBase();
    const records = await base(productsTable).select().all();

    return records.map(record => ({
        recordId: record.id,
        ...record.fields,
    }));
}

// Fetch product by ID
export async function fetchProductById(id) {
    if (!id) return null;

    try {
        const base = getBase();
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

console.log("Airtable API key:", process.env.AIRTABLE_API_KEY);
console.log("Airtable Base ID:", process.env.AIRTABLE_BASE_ID);

