import { NextResponse } from 'next/server';

export async function GET() {
  const apiToken = process.env.AIRTABLE_API_KEY;
  const baseId = process.env.AIRTABLE_BASE_ID;
  const tableName = process.env.AIRTABLE_BRANDS_NAME || "Brands";

  if (!apiToken || !baseId || !tableName) {
    return NextResponse.json(
      { error: "Missing Airtable environment variables" },
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
      { error: "Failed to fetch data from Airtable" },
      { status: 500 }
    );
  }

  const data = await res.json();
  const brands = data.records.map((record) => ({
    id: record.id,
    ...record.fields,
  }));

  return NextResponse.json(brands);
}
