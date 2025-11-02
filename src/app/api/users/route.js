// app/api/admin/users/route.js
import { NextResponse } from "next/server";
import { adminAuth, adminDb } from "@/lib/firebaseAdmin";

async function verifySuperAdmin(req) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader?.startsWith("Bearer ")) return null;

    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await adminAuth.verifyIdToken(idToken);

    const userDoc = await adminDb.collection("users").doc(decoded.uid).get();
    const userData = userDoc.data();

    if (userData?.role === "super-admin" && userData?.access === true) {
      return decoded;
    }

    return null;
  } catch (err) {
    console.error("verifySuperAdmin error:", err);
    return null;
  }
}

// GET all staff & super-admin users
export async function GET(req) {
  const superAdmin = await verifySuperAdmin(req);
  if (!superAdmin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const snapshot = await adminDb
    .collection("users")
    .where("role", "in", ["staff", "super-admin"])
    .get();

  const users = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return NextResponse.json(users);
}

// PATCH: toggle access field
export async function PATCH(req) {
  const superAdmin = await verifySuperAdmin(req);
  if (!superAdmin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { id, access } = await req.json();
    if (!id || typeof access !== "boolean") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    await adminDb.collection("users").doc(id).update({ access });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("PATCH /api/admin/users error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
