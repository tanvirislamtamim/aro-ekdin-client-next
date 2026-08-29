"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, Variants } from "framer-motion";
import "yet-another-react-lightbox/styles.css";
import LoadingSpinner from '../../../components/LoadingSpinner/LoadingSpinner';
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../hooks/useAxiosSecure";
import { PhotoItem } from "../../../types";

import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Download from "yet-another-react-lightbox/plugins/download";

// Dynamically import Lightbox only when needed
const Lightbox = dynamic(() => import("yet-another-react-lightbox"), { ssr: false });

const Gallery = () => {
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"new" | "old">("new");
  const axiosSecure = useAxiosSecure();

  const { data: allPhotos = [], isLoading } = useQuery<PhotoItem[]>({
    queryKey: ["photos"],
    queryFn: async () => {
      const res = await axiosSecure.get("/photos");
      return res.data;
    },
  });

  const currentPhotos = Array.isArray(allPhotos) 
    ? allPhotos.filter((item) => item?.category === activeTab) 
    : [];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 40,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.5,
        ease: [0.2, 0.9, 0.4, 1.1],
      },
    },
    hover: {
      y: -10,
      scale: 1.02,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      },
    },
    tap: {
      scale: 0.98,
    },
  };

  const tabVariants: Variants = {
    inactive: { scale: 1, opacity: 0.7 },
    active: { scale: 1.05, opacity: 1 },
    hover: { scale: 1.08, opacity: 0.9 },
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen bg-black text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-sans">
      {/* Background with will-change */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-cyan-600/10 rounded-full blur-3xl animate-pulse-slow will-change-transform" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse-slower will-change-transform" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* TITLE */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 overflow-visible px-2 sm:px-4"
        >
          <h2 className="text-5xl sm:text-7xl md:text-8xl font-black tracking-tight overflow-visible whitespace-normal wrap-break-word inline-block max-w-full px-2">
            <span className="bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400 bg-clip-text text-transparent">
              GALLERY
            </span>
          </h2>

          <div className="h-1 bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400 mx-auto mt-4 rounded-full w-24" />

          <p className="text-gray-400 mt-4 text-lg">
            Capturing moments, creating memories
          </p>
        </motion.div>

        {/* TAB BUTTONS */}
        <div className="flex justify-center gap-6 mb-12 flex-wrap">
          <motion.button
            variants={tabVariants}
            initial="inactive"
            animate={activeTab === "new" ? "active" : "inactive"}
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab("new")}
            className={`relative px-8 py-3 rounded-xl font-bold text-lg backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
              activeTab === "new"
                ? "border-cyan-500 text-white"
                : "border-white/20 text-gray-300 hover:text-white"
            }`}
            style={{
              background:
                activeTab === "new"
                  ? "linear-gradient(135deg, rgba(6,182,212,0.2), rgba(59,130,246,0.2))"
                  : "rgba(255,255,255,0.05)",
            }}
          >
            <span className="relative z-10">📸 New Photos</span>
            {activeTab === "new" && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-xl bg-linear-to-r from-cyan-500/20 to-black"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
          </motion.button>

          <motion.button
            variants={tabVariants}
            initial="inactive"
            animate={activeTab === "old" ? "active" : "inactive"}
            whileHover="hover"
            whileTap={{ scale: 0.97 }}
            onClick={() => setActiveTab("old")}
            className={`relative px-8 py-3 rounded-xl font-bold text-lg backdrop-blur-sm border transition-all duration-300 cursor-pointer ${
              activeTab === "old"
                ? "border-cyan-500 text-white"
                : "border-white/20 text-gray-300 hover:text-white"
            }`}
            style={{
              background:
                activeTab === "old"
                  ? "linear-gradient(135deg, rgba(139,92,246,0.2), rgba(6,182,212,0.2))"
                  : "rgba(255,255,255,0.05)",
            }}
          >
            <span className="relative z-10">🎞️ Old Photos</span>
            {activeTab === "old" && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-xl bg-linear-to-r from-black to-cyan-500/20"
                transition={{ type: "spring", duration: 0.5 }}
              />
            )}
          </motion.button>
        </div>

        {/* IMAGE GRID */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 cv-auto"
            style={{ perspective: 1200 }}
          >
            {currentPhotos.map((image, i) => (
              <motion.div
                key={`${activeTab}-${image._id || i}`}
                variants={cardVariants}
                whileHover="hover"
                whileTap="tap"
                className="group cursor-pointer will-change-transform"
                style={{
                  transformStyle: "preserve-3d",
                  willChange: "transform, opacity",
                }}
                onClick={() => {
                  setIndex(i);
                  setOpen(true);
                }}
              >
                <div className="relative overflow-hidden rounded-2xl border border-white/20 bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm shadow-2xl transition-all duration-300">
                  <div className="absolute inset-0 bg-linear-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                  <div className="relative overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.title}
                      className="w-full h-72 md:h-80 object-cover object-center transform transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      decoding="async"
                      style={{ willChange: "transform" }}
                    />

                    <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300" />
                    <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-cyan-400/50 transition-all duration-300 pointer-events-none" />
                  </div>

                  <div className="absolute bottom-0 w-full p-4 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-center text-lg font-bold italic tracking-wide">
                      {image.title}
                    </p>

                    {image.year && (
                      <p className="text-center text-sm text-cyan-400 font-medium mt-1">
                        {image.year}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        <div className="text-center mt-12 text-gray-500 text-sm">
          {currentPhotos.length} photos •{" "}
          {activeTab === "new" ? "Latest moments" : "Cherished memories"}
        </div>
      </div>

      {open && (
        <Lightbox
          open={open}
          close={() => setOpen(false)}
          index={index}
          slides={currentPhotos.map((img) => ({
            src: img.url,
            title: img.title,
            description: String(img.year || ""),
          }))}
          plugins={[Zoom, Download]}
          carousel={{
            finite: false,
            preload: 1,
          }}
          zoom={{
            maxZoomPixelRatio: 3,
            zoomInMultiplier: 1.5,
          }}
          controller={{
            closeOnBackdropClick: true,
          }}
          styles={{
            container: { backgroundColor: "rgba(0,0,0,0.95)" },
            button: {
              filter: "drop-shadow(0 0 10px rgba(0,0,0,0.5))",
            },
          }}
        />
      )}
    </div>
  );
};

export default Gallery;
