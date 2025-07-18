import Airtable from 'airtable';
import { getCachedData, setCachedData } from "@/lib/cache";

Airtable.configure({
    apiKey: process.env.AIRTABLE_API_KEY,
});

const base = Airtable.base(process.env.AIRTABLE_BASE_ID); // configured once
const categoriesTable = process.env.AIRTABLE_CATEGORIES_NAME || "Categories";
const productsTable = process.env.AIRTABLE_PRODUCTS_NAME || "Products";
const brandsTable = process.env.AIRTABLE_BRANDS_NAME || "Brands";
const projectsTable = process.env.AIRTABLE_PROJECTS_NAME || "Projects";

// console.log("AIRTABLE_API_KEY loaded?", !!process.env.AIRTABLE_API_KEY);

// ✅ Fetch categories (with caching)
export async function fetchCategories() {
    const cached = getCachedData("categories");
    if (cached) return cached;

    const records = await base(categoriesTable).select().all();
    const categories = records.map(record => ({
        id: record.id,
        ...record.fields,
    }));

    setCachedData("categories", categories);
    return categories;
}

// ✅ Fetch brands (with caching)
export async function fetchBrands() {
    const cached = getCachedData("brands");
    if (cached) return cached;

    const records = await base(brandsTable).select().all();
    const brands = records.map(record => ({
        id: record.id,
        ...record.fields,
    }));

    setCachedData("brands", brands);
    return brands;
}

// ✅ Fetch all products (with caching)
export async function fetchProducts() {
    const cached = getCachedData("products");
    if (cached) return cached;

    const records = await base(productsTable).select().all();
    const products = records.map(record => ({
        recordId: record.id,
        ...record.fields,
    }));

    setCachedData("products", products);
    return products;
}

// ✅ Fetch all projects (with caching)
export async function fetchProjects() {
    const cached = getCachedData("projects");
    if (cached) return cached;

    const records = await base(projectsTable).select().all();
    const projects = records.map(record => ({
        recordId: record.id,
        ...record.fields,
    }));

    setCachedData("projects", projects);
    return projects;
}

// ✅ Fetch product by ID (with caching)
export async function fetchProductById(id) {
    if (!id) return null;

    const cached = getCachedData(`product_${id}`);
    if (cached) return cached;

    try {
        const record = await base(productsTable).find(id);
        const product = {
            recordId: record.id,
            ...record.fields,
        };

        setCachedData(`product_${id}`, product);
        return product;
    } catch (error) {
        console.error("Error fetching product details:", error);
        return null;
    }
}

// ✅ Fetch project by ID (with caching)
export async function fetchProjectById(id) {
    if (!id) return null;

    const cached = getCachedData(`project_${id}`);
    if (cached) return cached;

    try {
        const record = await base(projectsTable).find(id);
        const project = {
            recordId: record.id,
            ...record.fields,
        };

        setCachedData(`project_${id}`, project);
        return project;
    } catch (error) {
        console.error("Error fetching project details:", error);
        return null;
    }
}
