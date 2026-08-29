"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { FaTrash, FaUpload, FaSpinner } from "react-icons/fa";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import AdminRoute from "../../../components/Routes/AdminRoute";
import { PhotoItem } from "../../../types";

const PhotosContent = () => {
  const [file, setFile] = useState<File | null>(null);
  const [category, setCategory] = useState<"new" | "old">("new");
  const [title, setTitle] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const queryClient = useQueryClient();
  const axiosSecure = useAxiosSecure();

  const { data: photos = [], isLoading } = useQuery<PhotoItem[]>({
    queryKey: ["photos"],
    queryFn: async () => {
      const res = await axiosSecure.get("/photos");
      return res.data;
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file) throw new Error("Please select a file");

      const imgData = new FormData();
      imgData.append("file", file);
      imgData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "aro_ekdin",
      );

      const res = await axios.post(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "do8awe7fc"}/image/upload`,
        imgData,
      );

      return axiosSecure.post("/photos", {
        url: res.data.secure_url,
        category,
        title,
        year,
        public_id: res.data.public_id,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      setFile(null);
      setTitle("");
      Swal.fire({
        icon: "success",
        title: "Uploaded!",
        text: "Photo added successfully.",
        background: "#1a1a1a",
        color: "#fff",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => axiosSecure.delete(`/photos/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["photos"] });
      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Photo removed.",
        background: "#1a1a1a",
        color: "#fff",
      });
    },
  });

  const handleDelete = (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      background: "#1a1a1a",
      color: "#fff",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteMutation.mutate(id);
      }
    });
  };

  return (
    <div className="p-6 min-h-screen text-white">
      <h2 className="text-4xl font-bold mb-8 text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-cyan-300 pb-3 to-indigo-400">
        Gallery Management
      </h2>

      <div className="bg-white/3 p-8 rounded-3xl border border-white/10 mb-10 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-cyan-500/10 rounded-full blur-[100px]"></div>

        <h3 className="text-xl pb-2 font-bold mb-6 text-white flex items-center gap-2">
          <span className="p-2 bg-blue-500/20 rounded-lg text-blue-400">
            <FaUpload />
          </span>
          Upload Photo
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
          <div className="group">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Upload Image</label>
            <div className="bg-[#121212] p-1 rounded-xl border border-white/10 group-hover:border-cyan-500/50 transition-colors">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
                className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-cyan-500/10 file:text-cyan-400 hover:file:bg-cyan-500/20 cursor-pointer transition-all"
              />
            </div>
          </div>

          <div className="group">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Photo Title</label>
            <input
              type="text"
              placeholder="Enter title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-[#121212] p-3 rounded-xl border border-white/10 text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder-gray-700"
            />
          </div>

          <div className="group">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Year</label>
            <input
              type="number"
              placeholder="2026"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="w-full bg-[#121212] p-3 rounded-xl border border-white/10 text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all placeholder-gray-700"
            />
          </div>

          <div className="group">
            <label className="text-[10px] uppercase tracking-widest text-gray-500 font-bold mb-2 block">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as "new" | "old")}
              className="w-full bg-[#121212] p-3 rounded-xl border border-white/10 text-white outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all cursor-pointer"
            >
              <option value="new">📸 New Photos</option>
              <option value="old">🎞️ Old Photos</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => uploadMutation.mutate()}
          disabled={uploadMutation.isPending || !file}
          className="mt-8 w-full py-4 bg-linear-to-r from-blue-600 via-cyan-500 to-indigo-600 text-white font-bold rounded-2xl flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_-5px_rgba(34,211,238,0.3)] cursor-pointer"
        >
          {uploadMutation.isPending ? (
            <FaSpinner className="animate-spin text-lg" />
          ) : (
            <FaUpload className="text-lg" />
          )}
          {uploadMutation.isPending ? "Uploading..." : "Confirm Upload"}
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-cyan-400">
          <FaSpinner className="animate-spin text-5xl mx-auto" />
        </div>
      ) : (
        (["new", "old"] as const).map((cat) => (
          <div key={cat} className="mb-16">
            <div className="flex items-center gap-3 mb-8">
              <h3 className="text-3xl font-bold text-white capitalize">{cat} Photos</h3>
              <div className="h-px flex-1 bg-linear-to-r from-cyan-500/50 to-transparent"></div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {photos.filter((p) => p.category === cat).map((photo) => (
                <div
                  key={photo._id}
                  className="group relative bg-white/2 border border-white/5 rounded-3xl overflow-hidden hover:border-cyan-500/30 transition-all duration-500 hover:-translate-y-2 shadow-lg"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={photo.url}
                      alt={photo.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/20 to-transparent opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
                      <button
                        onClick={() => handleDelete(photo._id)}
                        className="absolute right-4 p-3 backdrop-blur-md text-red-400 hover:bg-red-500 hover:text-white rounded-full transition-all border border-white/10 cursor-pointer"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </div>

                  <div className="p-4 bg-white/2">
                    <h4 className="font-bold text-white truncate">{photo.title || "Untitled"}</h4>
                    <p className="text-xs font-medium text-cyan-400/80 mt-1 uppercase tracking-wider">{photo.year}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default function PhotosPage() {
  return (
    <AdminRoute>
      <PhotosContent />
    </AdminRoute>
  );
}
