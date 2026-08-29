"use client";

import { useState } from "react";
import { FaFilePdf, FaChevronDown } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const pdfUrl = "/FIVB-Volleyball_Rules2025_2028.pdf";

const Rules = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const rulesData = [
    {
      title: "খেলোয়াড় ও পজিশন",
      desc: "প্রতিটি দলে ৬ জন খেলোয়াড় থাকে। খেলার সময় রোটেশন অনুযায়ী তাদের পজিশন পরিবর্তন করতে হয়।",
    },
    {
      title: "স্কোরিং সিস্টেম",
      desc: "প্রথম ৪ সেট ২৫ পয়েন্টের এবং ৫ম সেট ১৫ পয়েন্টের হয়। প্রতি সেট জেতার জন্য কমপক্ষে ২ পয়েন্টের ব্যবধান থাকতে হয়।",
    },
    {
      title: "বল স্পর্শের নিয়ম",
      desc: "একটি দল বলটি প্রতিপক্ষের কোর্টে পাঠানোর আগে সর্বোচ্চ ৩ বার স্পর্শ করতে পারে। একই খেলোয়াড় পরপর দুইবার বল টাচ করতে পারবে না।",
    },
    {
      title: "সার্ভিং ও ফাউল",
      desc: "সার্ভ লাইন স্পর্শ করা নিষেধ। নেট টাচ করা বা নেট পার হয়ে অন্য কোর্টে যাওয়া ফাউল হিসেবে গণ্য হয়।",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto p-6 bg-[#0a0a0a] rounded-3xl border border-white/10 shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold pt-2 text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400">
          FIVB ভলিবল নিয়মাবলী
        </h2>
        <p className="text-gray-400 mt-2">
          খেলা সম্পর্কে বিস্তারিত জানতে নিচের নিয়মগুলো পড়ুন
        </p>
      </div>

      {/* Rules Accordion */}
      <div className="space-y-4">
        {rulesData.map((item, index) => (
          <div
            key={index}
            className="border border-white/10 rounded-xl overflow-hidden bg-white/5"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full flex justify-between items-center p-4 text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <span className="font-semibold">{item.title}</span>
              <motion.div
                animate={{ rotate: openIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <FaChevronDown
                  className={
                    openIndex === index ? "text-cyan-400" : "text-blue-400"
                  }
                />
              </motion.div>
            </button>

            {/* Smooth Height Animation */}
            <AnimatePresence>
              {openIndex === index && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="p-4 text-gray-400 text-sm border-t border-white/5">
                    {item.desc}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* Download Section */}
      <div className="mt-8 p-6 bg-linear-to-r from-blue-400/10 via-cyan-300/10 to-indigo-400/10 rounded-2xl border border-white/10 text-center">
        <h3 className="text-white font-semibold mb-2">
          পূর্ণাঙ্গ নিয়মাবলী ডাউনলোড করুন
        </h3>
        <a
          href={pdfUrl}
          download="FIVB_Volleyball_Rules_2025-2028.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400 text-black font-bold rounded-xl hover:opacity-90 transition-all shadow-lg hover:shadow-cyan-500/20 cursor-pointer"
        >
          <FaFilePdf /> Download PDF
        </a>
      </div>
    </div>
  );
};

export default Rules;
