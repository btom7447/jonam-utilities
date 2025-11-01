import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Loads or creates a user profile in Firestore.
 * Keeps field names consistent with ProfileSection expectations.
 */
export async function loadOrCreateUserProfile(user) {
  if (!user?.uid) throw new Error("User is not authenticated");

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  const role = user.email?.toLowerCase().endsWith("@jonam.ng")
    ? "staff"
    : "user";

  if (snap.exists()) {
    const existing = snap.data();

    // 🔧 Fix: keep "name" field consistent
    const updatedData = {
      name: user.displayName || existing.name || "",
      email: user.email || existing.email || "",
      role: existing.role || role,
      updatedAt: new Date(),
    };

    await updateDoc(userRef, updatedData);

    return { ...existing, ...updatedData };
  }

  // 🔧 New profile always uses "name"
  const newProfile = {
    name: user.displayName || "",
    email: user.email || "",
    phone: "",
    deliveryAddress: {
      address: "",
      state: "",
      deliveryPrice: 0,
    },
    imageUrl: user.photoURL || "",
    role,
    createdAt: new Date(),
  };

  await setDoc(userRef, newProfile);
  return newProfile;
}


/**
 * Updates an existing user profile in Firestore.
 * Only updates provided fields.
 */
export async function updateUserProfile(uid, updates = {}) {
  if (!uid) throw new Error("User ID is required for update");

  const userRef = doc(db, "users", uid);

  // Normalize field names (in case we get displayName instead of name)
  const normalizedUpdates = {
    ...updates,
    updatedAt: new Date(),
  };

  // If deliveryAddress is provided, make sure it’s fully structured
  if (normalizedUpdates.deliveryAddress) {
    normalizedUpdates.deliveryAddress = {
      address: normalizedUpdates.deliveryAddress.address || "",
      state: normalizedUpdates.deliveryAddress.state || "",
      deliveryPrice: normalizedUpdates.deliveryAddress.deliveryPrice || 0,
    };
  }

  await updateDoc(userRef, normalizedUpdates);
}