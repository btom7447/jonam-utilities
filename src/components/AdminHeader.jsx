"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
<<<<<<< HEAD
import { auth } from "src/lib/firebase";
import { loadOrCreateUserProfile } from "src/lib/firestoreUser";
=======
import { auth } from "@/lib/firebase";
import { loadOrCreateUserProfile } from "@/lib/firestoreUser";
import { BellIcon } from "lucide-react";
>>>>>>> 32ddb45 (role display on admin)
import Image from "next/image";

export default function AdminHeader({ title }) {
  const [userProfile, setUserProfile] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const profile = await loadOrCreateUserProfile(user);
          setUserProfile(profile);
        } catch (error) {
          console.error("Failed to load user profile:", error);
        }
      } else {
        setUserProfile(null);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <header className="bg-transparent py-5 px-5 lg:px-10 flex justify-between items-center">
      <h3 className="text-2xl text-black font-semibold">{title}</h3>

<<<<<<< HEAD
      <div className="flex items-center gap-6">
=======
      <div className="flex flex-row-reverse items-center gap-6">
>>>>>>> 32ddb45 (role display on admin)

        {/* User info */}
        {userProfile && (
          <div
<<<<<<< HEAD
            className="flex flex-row-reverse items-center gap-3 cursor-pointer"
=======
            className="flex items-center gap-3 cursor-pointer"
>>>>>>> 32ddb45 (role display on admin)
            onClick={() => router.push("/profile")}
          >
            <Image
              src={userProfile.imageUrl || "/header-logo.png"}
              alt="User profile picture"
              width={36}
              height={36}
<<<<<<< HEAD
              className="w-15 h-15 rounded-full border border-gray-300 object-cover object-top"
=======
              className="w-15 h-15 rounded-full border border-gray-300 object-cover"
>>>>>>> 32ddb45 (role display on admin)
              unoptimized
            />
            <div className="hidden md:flex flex-col text-right">
              <span className="text-sm font-semibold text-gray-800">
                {userProfile.name || "User"}
              </span>
              <span className="text-xs text-gray-500 capitalize">
                {userProfile.role || "user"}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
<<<<<<< HEAD
}
=======
}
>>>>>>> 32ddb45 (role display on admin)
