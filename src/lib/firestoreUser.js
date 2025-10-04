import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Loads an existing user profile from Firestore or creates a new one if missing.
 * Ensures only authenticated users can read/write their own data.
 */
export async function loadOrCreateUserProfile(user) {
  if (!user?.uid) throw new Error("User is not authenticated");

  const userRef = doc(db, "users", user.uid);
  const snap = await getDoc(userRef);

  if (snap.exists()) {
    return snap.data();
  }

  // Create default profile for new user
  const newProfile = {
    name: user.displayName || "",
    email: user.email || "",
    phone: "",
    address: "",
    imageUrl: user.photoURL || "",
    createdAt: new Date(),
  };

  await setDoc(userRef, newProfile);
  return newProfile;
}

/**
 * Updates user profile fields safely.
 * Creates the document if it doesn't exist.
 */
export async function updateUserProfile(uid, updates = {}) {
  if (!uid) throw new Error("Missing user ID");

  const userRef = doc(db, "users", uid);
  const snap = await getDoc(userRef);

  if (!snap.exists()) {
    // Create new doc if missing
    await setDoc(userRef, { ...updates, createdAt: new Date() });
  } else {
    await updateDoc(userRef, { ...updates, updatedAt: new Date() });
  }
}
