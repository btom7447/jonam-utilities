import { NextResponse } from "next/server";
import { adminDb } from "src/lib/firebaseAdmin";

// --- GET all staff/super-admin users ---
export async function GET() {
  try {
    const snapshot = await adminDb.collection("users").get();
    const users = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filtered = users.filter(
      (u) => u.role === "staff" || u.role === "super-admin"
    );

    return NextResponse.json(filtered);
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json(
      { error: "Failed to fetch users", details: err.message },
      { status: 500 }
    );
  }
}

// --- PATCH user role (toggle) ---
export async function PATCH(req) {
  try {
    const { id, role } = await req.json();

    const userRef = adminDb.collection("users").doc(id);
    await userRef.update({ role });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Error updating user role:", err);
    return NextResponse.json(
      { error: "Failed to update user role", details: err.message },
      { status: 500 }
    );
  }
}
