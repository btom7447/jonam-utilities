"use client";

import { useState, useEffect } from "react";
import { auth } from "../lib/firebase";
import { onAuthStateChanged, updateProfile } from "firebase/auth";
import { loadOrCreateUserProfile, updateUserProfile } from "../lib/firestoreUser";
import { MoonLoader } from "react-spinners";
import { toast } from "react-toastify";
import { CameraIcon, ChevronDown, Pencil, Save, X } from "lucide-react";

const stateOptions = {
  Abia: 3000,
  Adamawa: 4500,
  "Akwa Ibom": 3000,
  Anambra: 2500,
  Bauchi: 4000,
  Bayelsa: 3000,
  Benue: 3500,
  Borno: 5000,
  "Cross River": 3000,
  Delta: 3000,
  Ebonyi: 2800,
  Edo: 2500,
  Ekiti: 2500,
  Enugu: 2700,
  "FCT - Abuja": 2000,
  Gombe: 4500,
  Imo: 2600,
  Jigawa: 5000,
  Kaduna: 3800,
  Kano: 4000,
  Katsina: 5000,
  Kebbi: 5000,
  Kogi: 3000,
  Kwara: 2800,
  Lagos: 1500,
  Nasarawa: 2500,
  Niger: 3000,
  Ogun: 2000,
  Ondo: 2500,
  Osun: 2300,
  Oyo: 2200,
  Plateau: 3600,
  Rivers: 3200,
  Sokoto: 5000,
  Taraba: 4800,
  Yobe: 5200,
  Zamfara: 5000,
};

export default function ProfileSection() {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    deliveryAddress: {
      address: "",
      state: "",
      deliveryPrice: 0,
    },
    imageUrl: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeInput, setActiveInput] = useState(null);
  const [selectedState, setSelectedState] = useState("");

  // Load user & profile
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        try {
          const data = await loadOrCreateUserProfile(currentUser);

          setProfile({
            name: data?.name || "",
            email: data?.email || currentUser.email || "",
            phone: data?.phone || "",
            deliveryAddress: data?.deliveryAddress || {
              address: "",
              state: "",
              deliveryPrice: 0,
            },
            imageUrl: data?.imageUrl || "",
          });

          // 👇 Add this line to sync dropdown with Firestore data
          setSelectedState(data?.deliveryAddress?.state || "");
        } catch (error) {
          console.error("Error loading profile:", error);
          toast.error("Failed to load profile data");
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  // Handle profile image upload
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();

      if (data.url) {
        await updateUserProfile(user.uid, { imageUrl: data.url });
        setProfile((prev) => ({ ...prev, imageUrl: data.url }));
        toast.success("Profile picture updated!");
      } else {
        toast.error("Upload failed. No URL returned.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  // Handle text input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  // Handle address inputs safely
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      deliveryAddress: {
        ...prev.deliveryAddress,
        [name]: value,
      },
    }));
  };

  // Handle state selection
  const handleStateSelect = (state) => {
    const deliveryPrice = stateOptions[state] || 0;

    setProfile((prev) => ({
      ...prev,
      deliveryAddress: {
        ...prev.deliveryAddress,
        state,
        deliveryPrice,
      },
    }));

    setSelectedState(state);
    setActiveInput(null);
  };

  // Save changes
  const saveProfile = async () => {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, {
        name: profile.name,
        phone: profile.phone,
        deliveryAddress: profile.deliveryAddress,
      });

      if (profile.name !== user.displayName) {
        await updateProfile(user, { displayName: profile.name });
      }

      setEditMode(false);
      toast.success("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      toast.error("Error saving profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <MoonLoader color="#1d4ed8" size={40} />
      </div>
    );
  }

  return (
    <section className="w-full p-5 lg:p-10">
      <h2 className="text-3xl font-semibold text-gray-900 mb-5">
        Profile Details
      </h2>

      <div className="bg-white grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Left - Profile Image */}
        <div className="flex flex-col items-center justify-start">
          <div className="relative w-40 h-40 lg:w-80 lg:h-80 rounded-full overflow-hidden border border-gray-200 shadow-sm">
            <img
              src={profile.imageUrl || "/avatar.jpg"}
              alt="Profile"
              className="w-full h-full object-cover object-top"
            />
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-white/70">
                <MoonLoader size={20} color="#1d4ed8" />
              </div>
            )}
          </div>

          <label className="mt-5 cursor-pointer bg-blue-500 text-white text-md lg:text-xl font-medium flex justify-center items-center gap-2 py-5 px-5 hover:bg-brown transition-all">
            <CameraIcon size={20} strokeWidth={1.5} />
            <span>Change Photo</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Right - Profile Info */}
        <div className="lg:col-span-2 space-y-5 grid grid-cols-1 md:grid-cols-2 gap-10">
          {[
            { label: "Full Name", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email", disabled: true },
            { label: "Phone", name: "phone", type: "text" },
          ].map(({ label, name, type, disabled }) => (
            <div key={name} className="relative group">
              <label className="text-xl font-semibold text-gray-700">
                {label}
              </label>
              <input
                type={type}
                name={name}
                value={profile[name]}
                onChange={handleInputChange}
                disabled={disabled || !editMode}
                onFocus={() => setActiveInput(name)}
                onBlur={() => setActiveInput(null)}
                className={`w-full py-5 border-b-1 border-gray-500 text-xl outline-none bg-transparent text-black transition-all ${
                  editMode && !disabled
                    ? ""
                    : "border-gray-200 bg-gray-50 text-gray-600 cursor-not-allowed"
                }`}
              />
              <span
                className={`absolute left-0 bottom-0 h-0.5 transition-all duration-200 ${
                  activeInput === name
                    ? "w-full bg-blue-500"
                    : "w-0 bg-gray-900"
                } group-hover:w-full group-hover:bg-blue-500`}
              ></span>
            </div>
          ))}

          {/* State Dropdown */}
          <div className="relative group">
            <label className="text-xl font-semibold text-gray-700">State</label>
            <button
              type="button"
              disabled={!editMode}
              onClick={() =>
                editMode &&
                setActiveInput(activeInput === "state" ? null : "state")
              }
              className={`w-full flex justify-between items-center py-5 border-b-1 border-gray-500 text-xl bg-transparent ${
                editMode ? "cursor-pointer" : "text-gray-400 cursor-not-allowed"
              } ${selectedState ? "text-black" : "text-gray-500"}`}
            >
              {selectedState || "Choose State"}
              <ChevronDown size={20} />
            </button>

            {activeInput === "state" && (
              <ul className="stateOption absolute z-10 w-full max-h-80 overflow-y-auto bg-gray-900 border border-gray-900 mt-2">
                {Object.keys(stateOptions).map((state) => (
                  <li
                    key={state}
                    onClick={() => handleStateSelect(state)}
                    className={`p-3 cursor-pointer text-xl text-white capitalize hover:bg-gray-700 ${
                      selectedState === state ? "bg-blue-500" : ""
                    }`}
                  >
                    {state}
                  </li>
                ))}
              </ul>
            )}

            <span
              className={`absolute left-0 bottom-0 h-0.5 transition-all duration-200 ${
                activeInput === "state"
                  ? "w-full bg-blue-500"
                  : "w-0 bg-gray-900"
              } group-hover:w-full group-hover:bg-blue-500`}
            ></span>
          </div>

          {/* Address */}
          <div className="relative group col-span-2 border-b border-gray-600">
            <label className="text-xl font-semibold text-gray-700">
              Delivery Address
            </label>
            <textarea
              name="address"
              rows="3"
              value={profile.deliveryAddress.address}
              onChange={handleAddressChange}
              disabled={!editMode}
              onFocus={() => setActiveInput("address")}
              onBlur={() => setActiveInput(null)}
              className={`w-full py-5 text-xl outline-none bg-transparent text-black transition-all ${
                editMode ? "" : "cursor-not-allowed text-gray-600"
              }`}
            />
            <span
              className={`absolute left-0 bottom-0 h-0.5 transition-all duration-200 ${
                activeInput === "address"
                  ? "w-full bg-blue-500"
                  : "w-0 bg-gray-900"
              } group-hover:w-full group-hover:bg-blue-500`}
            ></span>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 pt-4">
            {!editMode ? (
              <button
                onClick={() => setEditMode(true)}
                className="bg-blue-500 text-white text-md lg:text-xl font-medium flex justify-center items-center gap-2 py-5 px-5 cursor-pointer hover:bg-brown transition-all"
              >
                <Pencil size={20} /> Edit Profile
              </button>
            ) : (
              <>
                <button
                  onClick={saveProfile}
                  disabled={saving}
                  className="bg-blue-500 text-white text-md lg:text-xl font-medium flex justify-center items-center gap-2 py-5 px-5 cursor-pointer hover:bg-brown transition-all"
                >
                  <Save size={20} />
                  {saving ? <MoonLoader size={20} color="#1d4ed8" /> : "Save"}
                </button>
                <button
                  onClick={async () => {
                    setEditMode(false);
                    const refreshed = await loadOrCreateUserProfile(user);
                    setProfile(refreshed);
                  }}
                  className="bg-gray-500 text-white text-md lg:text-xl font-medium flex items-center gap-2 py-5 px-5 cursor-pointer hover:bg-gray-800"
                >
                  <X size={20} /> Cancel
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
