import Airtable from 'airtable';
import { getCachedData, setCachedData } from "@/lib/cache";

Airtable.configure({
    apiKey: process.env.AIRTABLE_API_KEY,
});

const AIRTABLE_BASE = process.env.AIRTABLE_BASE_ID;
const API_KEY = process.env.AIRTABLE_API_KEY;
const base = Airtable.base(process.env.AIRTABLE_BASE_ID); // configured once
const categoriesTable = process.env.AIRTABLE_CATEGORIES_NAME || "Categories";
const productsTable = process.env.AIRTABLE_PRODUCTS_NAME || "Products";
const brandsTable = process.env.AIRTABLE_BRANDS_NAME || "Brands";
const projectsTable = process.env.AIRTABLE_PROJECTS_NAME || "Projects";
const handymanTable = process.env.AIRTABLE_HANDYMAN_NAME || "Handyman";
const ordersTable = process.env.AIRTABLE_ORDERS_NAME || "Orders";
const bookingsTable = process.env.AIRTABLE_BOOKINGS_NAME || "Bookings"

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

// ✅ Fetch all handymen (with caching)
export async function fetchHandyman() {
    const cached = getCachedData("handyman");
    if (cached) return cached;

    const records = await base(handymanTable).select().all();
    const handyman = records.map(record => ({
        recordId: record.id,
        ...record.fields,
    }));

    setCachedData("handyman", handyman);
    return handyman;
}

// ✅ Fetch all orders (with caching)
export async function fetchOrders() {
    const cached = getCachedData("orders");
    if (cached) return cached;

    const records = await base(ordersTable).select().all();
    const orders = records.map(record => ({
        recordId: record.id,
        ...record.fields,
    }));

    setCachedData("order", orders);
    return orders;
}

// ✅ Fetch all Bookings (with caching)
export async function fetchBookings() {
    const cached = getCachedData("bookings");
    if (cached) return cached;

    const records = await base(bookingsTable).select().all();
    const bookings = records.map(record => ({
        recordId: record.id,
        ...record.fields,
    }));

    setCachedData("Bookings", bookings);
    return bookings;
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

// ✅ Fetch handyman by ID (with caching)
export async function fetchHandymanById(id) {
    if (!id) return null;

    const cached = getCachedData(`handyman_${id}`);
    if (cached) return cached;

    try {
        const record = await base(handymanTable).find(id);
        const handyman = {
            recordId: record.id,
            ...record.fields,
        };

        setCachedData(`handyman_${id}`, handyman);
        return handyman;
    } catch (error) {
        console.error("Error fetching handyman details:", error);
        return null;
    }
}

// Create Record for Orders and Order Item after payment
export const createRecord = async (table, fields) => {
    const res = await fetch(`https://api.airtable.com/v0/${AIRTABLE_BASE}/${encodeURIComponent(table)}`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ fields }),
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error?.message || "Airtable error");
    }

    return data;
};

// Create Booking record for hiring Handyman
export const createBooking = async (bookingData) => {
    try {
        const created = await base('Bookings').create([
            {
                fields: {
                    handyman: bookingData.handyman,
                    "customer_name": bookingData.customer_name,
                    "customer_email": bookingData.customer_email,
                    "customer_number": bookingData.customer_number,
                    "customer_address": bookingData.customer_address,
                    "service_type": bookingData.service_type,
                    "booking_date": bookingData.booking_date,
                    "status": "pending",
                    "additional_notes": bookingData.additonal_notes || "",
                },
            },
        ]);
        return { success: true, id: created[0].id };
    } catch (error) {
        console.error("Airtable booking error:", error);
        return { success: false, error };
    }
};

// Create Request Quote record 
export const requestQuote = async (quoteData) => {
    try {
        const created = await base('Quotes').create([
            {
                fields: {
                    "full_name": quoteData.full_name,
                    "phone_number": quoteData.phone_number,
                    "email_address": quoteData.email_address,
                    "description": quoteData.description,
                    "service_type": quoteData.service_type,
                    "status": "pending"
                },
            },
        ]);
        return { success: true, id: created[0].id };
    } catch (error) {
        console.error("Airtable request quote error:", error);
        return { success: false, error };
    }
};

// Create Contact Form record 
export const contactForm = async (contactData) => {
    try {
        const created = await base('Contact').create([
            {
                fields: {
                    "full_name": contactData.full_name,
                    "phone_number": contactData.phone_number,
                    "message": contactData.message,
                    "state": contactData.state,
                    "status": "pending"
                },
            },
        ]);
        return { success: true, id: created[0].id };
    } catch (error) {
        console.error("Airtable contact form error:", error);
        return { success: false, error };
    }
};

// Create Newsletter record 
export const newsletter = async (newData) => {
    try {
        const created = await base('Newsletter').create([
            {
                fields: {
                    "email_address": newData.email_address,
                    "status": "pending"
                },
            },
        ]);
        return { success: true, id: created[0].id };
    } catch (error) {
        console.error("Airtable newsletter error:", error);
        return { success: false, error };
    }
};

// Update Order Record
export async function updateOrders(tableName, recordId, data) {
  try {
    console.log("Updating Airtable:", { tableName, recordId, data });

    const record = await base(tableName).update([
      {
        id: recordId,
        fields: data,
      },
    ]);

    console.log("Airtable responded with:", record);

    return { id: record[0].id, ...record[0].fields };
  } catch (error) {
    console.error("Airtable updateOrders error:", error);
    throw error;
  }
}

// Delete Order Record
export async function deleteOrder(tableName, recordId) {
    try {
        const deletedRecord = await base(tableName).destroy(recordId);
        return deletedRecord; // contains id & deleted boolean
    } catch (error) {
        console.error("Error deleting order:", error);
        throw error;
    }
}