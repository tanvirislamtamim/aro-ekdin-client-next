"use client";

import { motion, AnimatePresence, Variants } from "framer-motion";
import { useState } from "react";
import {
  FaFacebookF,
  FaTiktok,
  FaYoutube,
  FaEnvelope,
  FaPhoneAlt,
} from "react-icons/fa";

const Footer = () => {
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);

  const showCopyToast = (text: string, message: string) => {
    navigator.clipboard.writeText(text);

    setToastMessage(message);
    setShowToast(true);

    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

  // Social links data
  const socialLinks = [
    {
      icon: FaFacebookF,
      url: "https://www.facebook.com/profile.php?id=61577587537905",
      label: "Facebook",
      color: "hover:bg-blue-600",
    },
    {
      icon: FaTiktok,
      url: "https://www.tiktok.com/@aro.ekdin",
      label: "TikTok",
      color: "hover:bg-black",
    },
    {
      icon: FaYoutube,
      url: "https://www.youtube.com/@Aro-Ekdin41",
      label: "YouTube",
      color: "hover:bg-red-600",
    },
  ];

  const brandCardVariants: Variants = {
    hidden: { opacity: 0, rotateX: -15, rotateY: 5, y: 40 },
    visible: {
      opacity: 1,
      rotateX: 0,
      rotateY: 0,
      y: 0,
      transition: { duration: 0.9, ease: [0.34, 1.2, 0.64, 1] },
    },
  };

  const logoVariants: Variants = {
    hidden: { rotateY: -180, scale: 0.2, opacity: 0 },
    visible: {
      rotateY: 0,
      scale: 1,
      opacity: 1,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  const teamTextVariants: Variants = {
    hidden: { y: -80, opacity: 0, skewY: 5 },
    visible: {
      y: 0,
      opacity: 1,
      skewY: 0,
      transition: {
        duration: 0.7,
        type: "spring",
        stiffness: 120,
      },
    },
  };

  const brandNameVariants: Variants = {
    hidden: { scale: 0.2, rotate: -10, opacity: 0 },
    visible: {
      scale: 1,
      rotate: 0,
      opacity: 1,
      transition: { duration: 0.6, delay: 0.1, type: "spring" },
    },
  };

  const descriptionVariants: Variants = {
    hidden: { x: -40, opacity: 0, filter: "blur(4px)" },
    visible: {
      x: 0,
      opacity: 1,
      filter: "blur(0px)",
      transition: { duration: 0.7, delay: 0.2 },
    },
  };

  const socialContainerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.3 },
    },
  };

  const getSocialVariant = (index: number): Variants => ({
    hidden: {
      x: index === 0 ? -50 : index === 1 ? 0 : 50,
      y: index === 1 ? -50 : 0,
      opacity: 0,
      rotate: index === 0 ? -30 : index === 2 ? 30 : 0,
    },
    visible: {
      x: 0,
      y: 0,
      opacity: 1,
      rotate: 0,
      transition: { duration: 0.5, type: "spring" },
    },
  });

  const contactCardVariants: Variants = {
    hidden: { x: 100, opacity: 0, skewX: 5 },
    visible: {
      x: 0,
      opacity: 1,
      skewX: 0,
      transition: {
        duration: 0.8,
        type: "spring",
        damping: 15,
      },
    },
  };

  const emailVariants: Variants = {
    hidden: { x: -70, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: 0.1,
        type: "tween",
      },
    },
  };

  const phoneVariants: Variants = {
    hidden: { x: 70, opacity: 0, scale: 0.9 },
    visible: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6, delay: 0.3 },
    },
  };

  const statusVariants: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        duration: 0.4,
        delay: 0.5,
        type: "spring",
      },
    },
  };

  const watermarkVariants: Variants = {
    hidden: {
      scale: 0.6,
      opacity: 0,
      rotate: -10,
      x: -80,
    },
    visible: {
      scale: 1,
      opacity: 0.02,
      rotate: 0,
      x: 0,
      transition: {
        duration: 1.2,
        ease: "easeOut",
        delay: 0.2,
      },
    },
  };

  return (
    <footer className="relative bg-[#020202] text-white pt-20 md:pt-28 pb-12 px-6 overflow-hidden select-none">
      {/* 3D Toast */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{
              opacity: 0,
              y: -40,
              x: 40,
              scale: 0.7,
              rotateX: -40,
              rotateY: 20,
            }}
            animate={{
              opacity: 1,
              y: 20,
              x: 0,
              scale: 1,
              rotateX: 0,
              rotateY: 0,
            }}
            exit={{
              opacity: 0,
              y: -30,
              x: 30,
              scale: 0.8,
            }}
            transition={{
              duration: 0.6,
              type: "spring",
              stiffness: 220,
              damping: 18,
            }}
            className="fixed top-5 right-5 z-50"
          >
            <div className="relative px-5 py-3 rounded-2xl border border-white/20 bg-linear-to-br from-indigo-600/90 to-purple-700/90 backdrop-blur-xl shadow-2xl shadow-indigo-900/50 text-white font-semibold tracking-wide">
              <div className="absolute inset-0 rounded-2xl bg-white/10 blur-md" />
              <div className="relative flex items-center gap-2">
                <span className="text-lg">📋</span>
                <span>{toastMessage}</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          whileInView={{ rotate: 360 }}
          viewport={{ margin: "150px" }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear",
          }}
          style={{ willChange: "transform", transform: "translateZ(0)", backfaceVisibility: "hidden" }}
          className="absolute top-[-10%] left-[-10%] w-75 md:w-125 h-75 md:h-125 border border-blue-500/10 rounded-full shadow-[0_0_50px_rgba(37,99,235,0.05)]"
        />
        <div className="absolute top-1/4 left-1/3 w-64 md:w-96 h-64 md:h-96 bg-blue-600/5 blur-[100px] animate-pulse" style={{ willChange: "opacity, transform", transform: "translateZ(0)", backfaceVisibility: "hidden" }} />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left */}
          <motion.div
            variants={brandCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="lg:col-span-7 group relative"
          >
            <div className="h-full p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-linear-to-br from-white/10 to-white/2 border border-white/10 backdrop-blur-2xl transition-all duration-500 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10">
              <motion.div
                variants={logoVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                className="relative mb-8 md:mb-10 inline-block"
              >
                <motion.img
                  src="https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145975/Logo_qzb1xk.jpg"
                  alt="Team Logo"
                  className="relative w-28 h-28 md:w-36 md:h-36 rounded-4xl md:rounded-[2.5rem] object-cover border-2 border-white/20 shadow-2xl cursor-pointer transition-all duration-300 hover:scale-110 hover:rotate-6 hover:border-blue-400"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </motion.div>

              <motion.h2
                variants={teamTextVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                className="text-5xl md:text-7xl font-black italic transition-all duration-300 group-hover:tracking-wider"
              >
                TEAM
              </motion.h2>

              <motion.span
                variants={brandNameVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                className="inline-block text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-white to-red-500 text-5xl md:text-7xl font-black italic transition-all duration-500 group-hover:scale-105 group-hover:from-blue-300 group-hover:via-gray-100 group-hover:to-red-400"
              >
                ARO EKDIN
              </motion.span>

              <motion.p
                variants={descriptionVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                className="text-gray-400 text-lg md:text-xl max-w-lg mb-10 transition-all duration-300 group-hover:text-gray-300"
              >
                Beyond the court, we build legacies.
              </motion.p>

              {/* Social Links */}
              <motion.div
                variants={socialContainerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                className="flex gap-4 mt-6"
              >
                {socialLinks.map((social, index) => (
                  <motion.a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    variants={getSocialVariant(index)}
                    custom={index}
                    whileHover={{
                      scale: 1.2,
                      rotate: 5,
                      transition: { type: "spring", stiffness: 400 },
                    }}
                    whileTap={{ scale: 0.9 }}
                    className={`w-12 h-12 rounded-full bg-white/10 flex items-center justify-center transition-all duration-300 ${social.color} hover:shadow-lg hover:shadow-blue-500/30 group/social`}
                  >
                    <social.icon className="text-white text-xl transition-all duration-300 group-hover/social:scale-110" />
                  </motion.a>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Right */}
          <motion.div
            variants={contactCardVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: false, amount: 0.2 }}
            className="lg:col-span-5 p-8 md:p-12 rounded-[2.5rem] md:rounded-[3.5rem] bg-white/3 border border-white/10 transition-all duration-500 hover:border-blue-500/30 hover:shadow-2xl hover:shadow-blue-500/10"
          >
            <motion.h3
              className="text-blue-500 font-bold uppercase text-xs mb-12 tracking-wider transition-all duration-300 hover:tracking-widest hover:text-blue-400"
              whileHover={{ x: 5 }}
            >
              Contact Us
            </motion.h3>

            <div className="space-y-10">
              {/* Email */}
              <motion.div
                variants={emailVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                className="group/item cursor-pointer relative"
                onClick={() =>
                  showCopyToast("aroekdin41@gmail.com", "Email copied")
                }
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.p
                  className="text-gray-500 text-xs font-bold uppercase mb-2 transition-all duration-300 group-hover/item:text-blue-400"
                  whileHover={{ scale: 1.05 }}
                >
                  Official Mail
                </motion.p>
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaEnvelope className="text-blue-400 text-xl" />
                  </motion.div>
                  <p className="text-white text-xl md:text-2xl font-medium italic transition-all duration-300 group-hover/item:text-blue-300 group-hover/item:translate-x-2">
                    aroekdin41@gmail.com
                  </p>
                </div>
                <div className="absolute inset-0 bg-linear-to-r from-blue-500/0 via-blue-500/0 to-blue-500/0 rounded-lg transition-all duration-500 group-hover/item:from-blue-500/5 group-hover/item:via-blue-500/5" />
              </motion.div>

              {/* Phone */}
              <motion.div
                variants={phoneVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: false }}
                className="group/item cursor-pointer relative"
                onClick={() =>
                  showCopyToast("+8801828034641", "Number copied")
                }
                whileHover={{ x: 10 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <motion.p
                  className="text-gray-500 text-xs font-bold uppercase mb-2 transition-all duration-300 group-hover/item:text-green-400"
                  whileHover={{ scale: 1.05 }}
                >
                  Support Hotline
                </motion.p>
                <div className="flex items-center gap-3">
                  <motion.div
                    whileHover={{ rotate: 360, scale: 1.2 }}
                    transition={{ duration: 0.5 }}
                  >
                    <FaPhoneAlt className="text-green-400 text-xl" />
                  </motion.div>
                  <p className="text-white text-xl md:text-2xl font-medium italic transition-all duration-300 group-hover/item:text-green-300 group-hover/item:translate-x-2">
                    +880 1828 034641
                  </p>
                </div>
                <div className="absolute inset-0 bg-linear-to-r from-green-500/0 via-green-500/0 to-green-500/0 rounded-lg transition-all duration-500 group-hover/item:from-green-500/5 group-hover/item:via-green-500/5" />
              </motion.div>
            </div>

            <motion.div
              variants={statusVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: false }}
              className="mt-16 flex items-center gap-2 text-gray-600 text-[10px] font-bold uppercase"
            >
              <motion.span
                className="w-1.5 h-1.5 bg-green-500 rounded-full"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [1, 0.5, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              Always Online
            </motion.div>
          </motion.div>
        </div>

        {/* Watermark */}
        <motion.div
          variants={watermarkVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false }}
          className="absolute bottom-0 right-0 text-white text-9xl font-black select-none pointer-events-none"
          style={{ opacity: 0.02 }}
        >
          ARO EKDIN
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
