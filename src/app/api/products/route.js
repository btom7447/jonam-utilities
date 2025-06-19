import { NextResponse } from "next/server";

export async function GET() {
  const apiToken = process.env.AIRTABLE_API_TOKEN;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_PRODUCTS_NAME || "Products";

  if (!apiToken || !baseId || !tableName) {
    return NextResponse.json(
      { error: "Missing Airtable environment variables for products" },
      { status: 500 }
    );
  }

  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${tableName}`, {
    headers: {
      Authorization: `Bearer ${apiToken}`,
    },
  });

  if (!res.ok) {
    return NextResponse.json(
      { error: "Failed to fetch products from Airtable" },
      { status: 500 }
    );
  }

  const data = await res.json();
  const products = data.records.map((record) => ({
    recordId: record.id,
    ...record.fields,
  }));

  return NextResponse.json(products);
}
