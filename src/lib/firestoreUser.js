import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Loads or creates a user profile in Firestore.
 * Ensures consistent field names and default access for new users.
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

    const updatedData = {
      name: user.displayName || existing.name || "",
      email: user.email || existing.email || "",
      role: existing.role || role,
      access: typeof existing.access === "boolean" ? existing.access : false, // ensure access is boolean
      updatedAt: new Date(),
    };

    await updateDoc(userRef, updatedData);

    return { ...existing, ...updatedData };
  }

  // New user profile
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
    access: false, // default false for new users
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

  // Normalize fields
  const normalizedUpdates = {
    ...updates,
    updatedAt: new Date(),
  };

  // Ensure deliveryAddress is fully structured
  if (normalizedUpdates.deliveryAddress) {
    normalizedUpdates.deliveryAddress = {
      address: normalizedUpdates.deliveryAddress.address || "",
      state: normalizedUpdates.deliveryAddress.state || "",
      deliveryPrice: normalizedUpdates.deliveryAddress.deliveryPrice || 0,
    };
  }

  await updateDoc(userRef, normalizedUpdates);
}
