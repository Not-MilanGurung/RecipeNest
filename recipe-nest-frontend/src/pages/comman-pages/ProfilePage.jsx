import React, { useState, useContext } from "react";
import { useForm } from "react-hook-form";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import privateAxios from "../../helpers/userAxiosPrivate";
import {
  apiGetProfileRoute,
  apiUploadProfilePicRoute,
} from "../../helpers/constants";
import NavBar from "../../components/NavBar";
import { UserContext } from "../../helpers/contexts";

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);
  const queryClient = useQueryClient();
  const api = privateAxios();

  const { data: profileData, isLoading } = useQuery({
    queryKey: ["userProfile"],
    queryFn: () =>
      api.get(apiGetProfileRoute).then((res) => res.data.data.user),
  });

  // --- MUTATIONS WITH LOADING STATES ---

  const { setData } = useContext(UserContext); // Access your context setter

  const updateMutation = useMutation({
    mutationFn: (formData) => api.put(apiGetProfileRoute, formData),
    onSuccess: (response) => {
      // 1. Extract the updated user from the response
      // Assuming your backend structure is response.data.data.updated
      const updatedUser = response.data.data.updated;

      // 2. Update the Global Context
      // We keep the existing accessToken but swap the user object
      setData((prev) => ({
        ...prev,
        user: updatedUser,
      }));

      // 3. Invalidate queries to keep cache in sync
      queryClient.invalidateQueries(["userProfile"]);

      setIsEditing(false);
    },
    onError: (error) => {
      console.error("Update failed:", error);
    },
  });

  const avatarMutation = useMutation({
    mutationFn: (file) => {
      const formData = new FormData();
      formData.append("avatar", file);
      return api.put(apiUploadProfilePicRoute, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    onSuccess: () => queryClient.invalidateQueries(["userProfile"]),
  });

  const { register, handleSubmit } = useForm({
    values: profileData,
  });

  if (isLoading)
    return (
      <div className="min-h-screen bg-secondary flex items-center justify-center font-bold italic">
        Setting the table...
      </div>
    );

  return (
    <div className="min-h-screen bg-secondary">
      <NavBar />

      <main className="max-w-4xl mx-auto py-20 px-6">
        <div className="bg-white rounded-[3rem] border border-border overflow-hidden shadow-2xl shadow-primary/5">
          <div className="h-32 bg-primary/5" />

          <div className="px-12 pb-12 -mt-16">
            <div className="flex flex-col md:flex-row items-end gap-8 mb-12">
              {/* AVATAR SECTION WITH LOADING OVERLAY */}
              <div className="relative group">
                <div
                  className={`w-40 h-40 rounded-full border-8 border-white bg-secondary overflow-hidden shadow-xl transition-opacity ${avatarMutation.isPending ? "opacity-50" : "opacity-100"}`}
                >
                  {profileData?.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-primary/20 text-4xl font-bold">
                      {profileData?.name?.[0]}
                    </div>
                  )}
                </div>

                {/* Upload Spinner Overlay */}
                {avatarMutation.isPending && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}

                <label
                  className={`absolute bottom-2 right-2 p-3 bg-primary text-white rounded-full cursor-pointer shadow-lg hover:scale-110 transition-transform ${avatarMutation.isPending ? "pointer-events-none opacity-50" : ""}`}
                >
                  <input
                    type="file"
                    className="hidden"
                    onChange={(e) => avatarMutation.mutate(e.target.files[0])}
                    accept="image/*"
                    disabled={avatarMutation.isPending}
                  />
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                    />
                  </svg>
                </label>
              </div>

              <div className="flex-grow pb-4">
                <h2 className="text-3xl font-bold tracking-tight text-neutral">
                  {profileData?.name}
                </h2>
                <p className="text-primary font-bold uppercase text-[10px] tracking-widest">
                  {profileData?.role}
                </p>
              </div>
            </div>

            {/* FORM WITH BUTTON LOADING STATE */}
            <form
              onSubmit={handleSubmit((val) => updateMutation.mutate(val))}
              className={`space-y-8 transition-opacity ${updateMutation.isPending ? "opacity-60 pointer-events-none" : ""}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-4">
                    Full Name
                  </label>
                  <input
                    {...register("name")}
                    disabled={!isEditing}
                    className={`w-full p-5 rounded-[1.5rem] outline-none transition-all ${isEditing ? "bg-secondary ring-2 ring-primary/5" : "bg-transparent border-none"}`}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-primary/50 ml-4">
                    Phone Number
                  </label>
                  <input
                    {...register("phone")}
                    disabled={!isEditing}
                    className={`w-full p-5 rounded-[1.5rem] outline-none transition-all ${isEditing ? "bg-secondary ring-2 ring-primary/5" : "bg-transparent border-none"}`}
                  />
                </div>
              </div>

              <div className="pt-8 flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setIsEditing(!isEditing)}
                  className="px-8 py-4 font-bold text-[10px] uppercase tracking-widest text-neutral/40 hover:text-neutral"
                >
                  {isEditing ? "Cancel" : "Edit"}
                </button>

                {isEditing && (
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="px-12 py-4 bg-primary text-white rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-xl shadow-primary/20 hover:bg-neutral transition-all flex items-center gap-3"
                  >
                    {updateMutation.isPending ? (
                      <>
                        <div className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        Saving...
                      </>
                    ) : (
                      "Confirm Changes"
                    )}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
