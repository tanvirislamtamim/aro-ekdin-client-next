"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import axios from "axios";
import AdminRoute from "../../../components/Routes/AdminRoute";

interface AddPlayerFormData {
  id: string;
  name: string;
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  nationality?: string;
  position: string;
  work?: string;
  imgFile: FileList;
  age: string;
  height?: string;
  weight?: string;
  jersey: string;
  Birthdate?: string;
  DominantHand?: string;
  phone?: string;
}

const AddPlayerContent = () => {
  const { register, handleSubmit, reset, watch } = useForm<AddPlayerFormData>();

  const axiosSecure = useAxiosSecure();
  const [uploadingImage, setUploadingImage] = useState(false);

  const mutation = useMutation({
    mutationFn: async (newPlayer: any) => {
      const response = await axiosSecure.post("/players", newPlayer);
      return response.data;
    },
    onSuccess: (data) => {
      if (data.insertedId) {
        Swal.fire({
          title: "Success!",
          text: "Player added to the roster successfully.",
          icon: "success",
          background: "#0f172a",
          color: "#f1f4f5",
          confirmButtonText: "Awesome",
          confirmButtonColor: "#38bdf8",
        });
        reset();
      }
    },
    onError: (error: any) => {
      console.error("Mutation Error:", error);
      Swal.fire({
        title: "Error!",
        text:
          error.response?.data?.message ||
          "Something went wrong while uploading data.",
        icon: "error",
        background: "#0f172a",
        color: "#f1f4f5",
        confirmButtonColor: "#818cf8",
      });
    },
  });

  const onSubmit = async (data: AddPlayerFormData) => {
    try {
      setUploadingImage(true);

      const imageFile = data.imgFile?.[0];
      if (!imageFile) {
        Swal.fire({
          title: "Image Required",
          text: "Please select an image.",
          icon: "warning",
          background: "#0f172a",
          color: "#f1f4f5",
        });
        setUploadingImage(false);
        return;
      }

      const formData = new FormData();
      formData.append("file", imageFile);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "aro_ekdin",
      );
      formData.append("cloud_name", process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "do8awe7fc");

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "do8awe7fc"}/image/upload`,
        formData,
      );

      const uploadedImageUrl = res.data.secure_url;

      if (!uploadedImageUrl) {
        throw new Error("Image upload failed");
      }

      const formattedPlayerDoc = {
        id: parseInt(data.id, 10),
        name: data.name,
        facebook: data.facebook,
        instagram: data.instagram,
        whatsapp: data.whatsapp,
        nationality: data.nationality,
        position: data.position,
        work: data.work,
        img: uploadedImageUrl,
        age: parseInt(data.age, 10),
        height: data.height,
        weight: data.weight,
        jersey: data.jersey,
        Birthdate: data.Birthdate,
        DominantHand: data.DominantHand,
        phone: data.phone,
      };

      mutation.mutate(formattedPlayerDoc);
    } catch (err) {
      console.error("Upload Error:", err);
      Swal.fire({
        title: "Upload Failed!",
        text: "Could not host the image to Cloudinary.",
        icon: "error",
        background: "#0f172a",
        color: "#f1f4f5",
      });
    } finally {
      setUploadingImage(false);
    }
  };

  const imgFiles = watch("imgFile");
  const selectedImage = imgFiles && imgFiles[0] ? imgFiles[0] : null;

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 flex justify-center items-center">
      <div className="max-w-4xl w-full bg-slate-900 rounded-2xl shadow-2xl border border-slate-800 p-8 sm:p-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold tracking-tight bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
            Add New Player
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Provide the required player statistics and profiles below.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[#f1f4f5]">
                Full Name
              </label>
              <input
                type="text"
                placeholder="Enter Your Full Name"
                {...register("name", { required: true })}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-[#f1f4f5] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition-all"
              />
            </div>
            {/* ID */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[#f1f4f5]">
                Player ID
              </label>
              <input
                type="number"
                placeholder="Player Id"
                {...register("id", { required: true })}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-[#f1f4f5] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition-all"
              />
            </div>

            {/* Jersey */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[#f1f4f5]">
                Jersey Number
              </label>
              <input
                type="text"
                placeholder="Enter Jersey Number"
                {...register("jersey", { required: true })}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-[#f1f4f5] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition-all"
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[#f1f4f5]">
                Position
              </label>
              <input
                type="text"
                placeholder="Enter Your Position"
                {...register("position", { required: true })}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-[#f1f4f5] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition-all"
              />
            </div>

            {/* File Upload with Preview */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-[#f1f4f5]">
                Player Photo
              </label>
              <div className="flex items-center justify-center w-full">
                {selectedImage ? (
                  <div className="relative w-full h-48 border-2 border-slate-700 rounded-lg overflow-hidden bg-slate-800 flex items-center justify-center group">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Player Preview"
                      className="h-full w-auto object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                    />

                    <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center p-4">
                      <p className="text-sm font-semibold text-[#f1f4f5] truncate max-w-xs mb-1">
                        {selectedImage.name}
                      </p>
                      <p className="text-xs text-slate-400 mb-3">
                        {(selectedImage.size / (1024 * 1024)).toFixed(2)} MB
                      </p>

                      <button
                        type="button"
                        onClick={() => reset({ ...watch(), imgFile: undefined as unknown as FileList })}
                        className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-md text-xs font-medium transition-colors cursor-pointer"
                      >
                        Remove & Change
                      </button>
                    </div>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-slate-700 border-dashed rounded-lg cursor-pointer bg-slate-800 hover:bg-slate-750 hover:border-slate-600 transition-all">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                      <svg
                        className="w-8 h-8 mb-3 text-slate-400"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 20 16"
                      >
                        <path
                          stroke="currentColor"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
                        />
                      </svg>
                      <p className="mb-2 text-sm text-slate-400">
                        <span className="font-semibold">Click to upload</span> or drag and drop
                      </p>
                      <p className="text-xs text-slate-500">
                        PNG, JPG or WEBP (MAX. 5MB)
                      </p>
                    </div>
                    <input
                      type="file"
                      accept="image/*"
                      {...register("imgFile", { required: true })}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>

            {/* Age */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[#f1f4f5]">
                Age
              </label>
              <input
                type="number"
                placeholder="Enter Your Age"
                {...register("age", { required: true })}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-[#f1f4f5] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition-all"
              />
            </div>

            {/* Birthdate */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[#f1f4f5]">
                Birthdate
              </label>
              <input
                type="text"
                placeholder="dd/mm/yyyy"
                {...register("Birthdate")}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-[#f1f4f5] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition-all"
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[#f1f4f5]">
                Height
              </label>
              <input
                type="text"
                placeholder={"0'00\""}
                {...register("height")}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-[#f1f4f5] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition-all"
              />
            </div>

            {/* Weight */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[#f1f4f5]">
                Weight
              </label>
              <input
                type="text"
                placeholder="Your Weight"
                {...register("weight")}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-[#f1f4f5] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition-all"
              />
            </div>

            {/* Dominant Hand */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[#f1f4f5]">
                Dominant Hand
              </label>
              <input
                type="text"
                placeholder="Right / Left"
                {...register("DominantHand")}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-[#f1f4f5] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition-all"
              />
            </div>

            {/* Nationality */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[#f1f4f5]">
                Nationality
              </label>
              <input
                type="text"
                defaultValue="Bangladeshi"
                placeholder="Bangladeshi"
                {...register("nationality")}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-[#f1f4f5] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition-all"
              />
            </div>

            {/* Work */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[#f1f4f5]">
                Work
              </label>
              <input
                type="text"
                placeholder="Work"
                {...register("work")}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-[#f1f4f5] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium mb-2 text-[#f1f4f5]">
                Phone
              </label>
              <input
                type="text"
                placeholder="01XXXXXXXXX"
                {...register("phone")}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-[#f1f4f5] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition-all"
              />
            </div>

            {/* Facebook Link */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-[#f1f4f5]">
                Facebook URL
              </label>
              <input
                type="url"
                placeholder="https://www.facebook.com/..."
                {...register("facebook")}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-[#f1f4f5] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition-all"
              />
            </div>

            {/* Instagram Link */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-[#f1f4f5]">
                Instagram URL
              </label>
              <input
                type="url"
                placeholder="https://www.instagram.com/..."
                {...register("instagram")}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-[#f1f4f5] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition-all"
              />
            </div>

            {/* WhatsApp Link */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-2 text-[#f1f4f5]">
                WhatsApp Link
              </label>
              <input
                type="url"
                placeholder="https://wa.me/..."
                {...register("whatsapp")}
                className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-[#f1f4f5] placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-300 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={mutation.isPending || uploadingImage}
              className="w-full py-3 px-6 rounded-lg font-bold text-slate-950 bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400 hover:brightness-110 active:scale-[0.98] transition-all duration-200 shadow-md hover:shadow-cyan-500/20 disabled:opacity-50 cursor-pointer"
            >
              {uploadingImage
                ? "Hosting Player Image..."
                : mutation.isPending
                  ? "Uploading Player Data..."
                  : "Add Player"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AddPlayerPage() {
  return (
    <AdminRoute>
      <AddPlayerContent />
    </AdminRoute>
  );
}
