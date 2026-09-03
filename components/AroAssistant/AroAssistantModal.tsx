"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  X,
  Sparkles,
  Bot,
  User,
  Trash2,
  Dumbbell,
  CheckCircle2,
  Compass,
  ExternalLink,
  Image as ImageIcon,
  Maximize2,
} from "lucide-react";
import useAxios from "@/hooks/useAxios";

interface Message {
  id: string;
  role: "user" | "model";
  text: string;
  type?: "TEXT_RESPONSE" | "FUNCTION_CALL";
  functionName?: string;
  args?: any;
  timestamp: string;
}

interface AroAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
}

// Helper to detect if a URL is an image
const isImageUrl = (url: string) => {
  if (!url || typeof url !== "string") return false;
  const clean = url.split("?")[0].toLowerCase();
  if (/\.(jpg|jpeg|png|webp|gif|svg|avif)$/i.test(clean)) return true;
  if (url.includes("cloudinary.com") && (url.includes("/image/upload/") || url.includes("/upload/"))) return true;
  if (url.includes("i.ibb.co/") || url.includes("imgbb.com/")) return true;
  if (url.includes("firebasestorage.googleapis.com") && (url.includes(".jpg") || url.includes(".png") || url.includes(".webp") || url.includes("%2F") || url.includes("alt=media"))) return true;
  return false;
};

// Subcomponent for interactive in-chat player image display with lightbox zoom
const ChatImageCard: React.FC<{ src: string; alt?: string }> = ({
  src,
  alt = "প্লেয়ারের ছবি",
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  if (hasError) {
    return (
      <a
        href={src}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 my-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/35 border border-cyan-500/40 text-cyan-300 hover:text-cyan-100 text-xs font-semibold transition-all shadow-xs"
      >
        <ImageIcon className="w-4 h-4 text-cyan-400 shrink-0" />
        <span className="break-all">{alt || "ছবি দেখুন"}</span>
        <ExternalLink className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
      </a>
    );
  }

  return (
    <div className="my-2 max-w-[280px] sm:max-w-[340px]">
      {/* Thumbnail Card */}
      <div
        onClick={() => setIsZoomed(true)}
        className="relative group rounded-2xl overflow-hidden border border-cyan-500/30 bg-[#040817] shadow-[0_8px_25px_rgba(0,0,0,0.6)] cursor-pointer transition-all hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(6,182,212,0.35)]"
      >
        {isLoading && (
          <div className="w-full h-44 sm:h-52 bg-slate-900/80 animate-pulse flex flex-col items-center justify-center text-cyan-400 text-xs gap-2 p-4">
            <Sparkles className="w-5 h-5 animate-spin" />
            <span className="font-medium text-cyan-300">ছবি লোড হচ্ছে...</span>
          </div>
        )}

        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            setIsLoading(false);
            setHasError(true);
          }}
          className={`w-full max-h-56 sm:max-h-64 object-cover object-top transition-transform duration-300 group-hover:scale-105 ${
            isLoading ? "hidden" : "block"
          }`}
        />

        {!isLoading && (
          <>
            {/* Top Badge */}
            <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-xs border border-white/10 text-[10px] font-semibold text-cyan-300 flex items-center gap-1">
              <ImageIcon className="w-3 h-3 text-cyan-400" />
              <span>{alt || "ফটো"}</span>
            </div>

            {/* Bottom Overlay with Zoom Trigger */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-between p-2.5">
              <span className="text-xs text-white font-medium drop-shadow-md">
                বড় করে দেখতে ট্যাপ করুন
              </span>
              <div className="p-1.5 rounded-lg bg-cyan-500 text-black shadow-lg">
                <Maximize2 className="w-3.5 h-3.5" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Lightbox / Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-2xl w-full max-h-[90vh] bg-[#070d1e] border border-cyan-500/40 rounded-3xl p-3 sm:p-4 shadow-[0_0_60px_rgba(6,182,212,0.3)] flex flex-col items-center overflow-hidden cursor-default"
            >
              {/* Controls */}
              <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-white/10">
                <div className="flex items-center gap-2 text-cyan-300 font-semibold text-sm">
                  <ImageIcon className="w-4 h-4 text-cyan-400" />
                  <span>{alt || "প্লেয়ারের ছবি"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-cyan-500 hover:text-black text-gray-300 transition-all text-xs flex items-center gap-1 cursor-pointer font-medium"
                    title="আসল ছবি খুলুন"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                  <button
                    onClick={() => setIsZoomed(false)}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-red-500 text-white transition-all cursor-pointer"
                    title="বন্ধ করুন"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Full Image */}
              <div className="w-full flex-1 flex items-center justify-center overflow-hidden rounded-2xl bg-black/40">
                <img
                  src={src}
                  alt={alt}
                  className="max-h-[72vh] w-auto max-w-full object-contain rounded-xl"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const AroAssistantModal: React.FC<AroAssistantModalProps> = ({
  isOpen,
  onClose,
}) => {
  const axiosInstance = useAxios();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome-1",
      role: "model",
      text: "আমি 'Aro Ekdin' ভলিবল ক্লাবের এআই সহকারী।\n\nআপনি আমাকে টিমের প্লেয়ারদের তথ্য ও ছবি, হোম গ্রাউন্ড, সোশ্যাল মিডিয়া লিঙ্ক (ফেসবুক, টিকটক, ইউটিউব, হোয়াটসঅ্যাপ), ভলিবল রোটেশন বা খেলার নিয়ম সম্পর্কে প্রশ্ন করতে পারেন। কী জানতে চান?",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  // Helper to render Markdown images, links and raw URLs as interactive clickable elements / images
  const renderMessageContent = (text: string) => {
    if (!text) return null;

    // Pattern to match markdown images, markdown links, or standalone URLs
    const tokenRegex = /(!?\[[^\]]*\]\(https?:\/\/[^\s\)]+\)|https?:\/\/[^\s)]+|mailto:[^\s)]+)/g;
    const parts = text.split(tokenRegex);

    return parts.map((part, index) => {
      if (!part) return null;

      // 1. Markdown image: ![Title](URL)
      const imgMatch = part.match(/^!\[(.*?)\]\((https?:\/\/[^\s\)]+)\)$/);
      if (imgMatch) {
        const [, title, url] = imgMatch;
        return <ChatImageCard key={index} src={url} alt={title || "প্লেয়ারের ছবি"} />;
      }

      // 2. Markdown link: [Title](URL)
      const mdMatch = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)$/);
      if (mdMatch) {
        const [, title, url] = mdMatch;
        if (isImageUrl(url)) {
          return <ChatImageCard key={index} src={url} alt={title || "প্লেয়ারের ছবি"} />;
        }
        return (
          <a
            key={index}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 mx-0.5 my-0.5 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-300 hover:text-cyan-100 border border-cyan-500/40 hover:border-cyan-400 font-semibold text-xs sm:text-sm underline underline-offset-2 break-all max-w-full transition-all shadow-xs"
          >
            <span className="break-all">{title}</span>
            <ExternalLink className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
          </a>
        );
      }

      // 3. Raw URL (http / https)
      if (/^https?:\/\/[^\s)]+$/i.test(part)) {
        // Strip trailing punctuation like .,:; if captured
        let cleanUrl = part;
        let trailingPunct = "";
        const punctMatch = cleanUrl.match(/([.,;:!?]+)$/);
        if (punctMatch) {
          trailingPunct = punctMatch[1];
          cleanUrl = cleanUrl.slice(0, -trailingPunct.length);
        }

        if (isImageUrl(cleanUrl)) {
          return (
            <React.Fragment key={index}>
              <ChatImageCard src={cleanUrl} alt="প্লেয়ারের ছবি" />
              {trailingPunct}
            </React.Fragment>
          );
        }

        return (
          <React.Fragment key={index}>
            <a
              href={cleanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mx-0.5 my-0.5 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-300 hover:text-cyan-100 border border-cyan-500/40 hover:border-cyan-400 font-semibold text-xs sm:text-sm underline underline-offset-2 break-all max-w-full transition-all shadow-xs cursor-pointer"
            >
              <span className="break-all">{cleanUrl}</span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0 text-cyan-400" />
            </a>
            {trailingPunct}
          </React.Fragment>
        );
      }

      // 4. Mailto link
      if (/^mailto:[^\s)]+$/i.test(part)) {
        return (
          <a
            key={index}
            href={part}
            className="inline-flex items-center gap-1 mx-0.5 my-0.5 px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/35 text-cyan-300 hover:text-cyan-100 border border-cyan-500/40 font-semibold text-xs sm:text-sm underline underline-offset-2 break-all max-w-full transition-all"
          >
            <span>{part.replace("mailto:", "")}</span>
          </a>
        );
      }

      return <span key={index}>{part}</span>;
    });
  };

  // Auto scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 250);
    }
  }, [isOpen]);

  // Execute Website Action (Function Calling Handler)
  const executeSiteAction = (functionName: string, args: any) => {
    if (functionName === "navigateToSection" && args?.sectionId) {
      const targetId = args.sectionId.replace("#", "");
      const elem = document.getElementById(targetId);
      if (elem) {
        elem.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        if (targetId.includes("about")) window.location.href = "/about";
        else if (targetId.includes("matches")) window.location.href = "/matches";
        else if (targetId.includes("gallery")) window.location.href = "/gallery";
        else if (targetId.includes("videos")) window.location.href = "/videos";
      }
    }
  };

  // Clear Chat History
  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        role: "model",
        text: "চ্যাট রিসেট করা হয়েছে। 'Aro Ekdin' টিম বা ভলিবল সম্পর্কে যেকোনো কিছু জানতে পারেন!",
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      },
    ]);
  };

  // Send Message to Server
  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isThinking) return;

    const userMsgId = `user-${Date.now()}`;
    const newMsg: Message = {
      id: userMsgId,
      role: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMessage("");
    setIsThinking(true);

    try {
      // Build history payload (exclude greetings)
      const historyPayload = messages
        .filter((m) => !m.id.startsWith("welcome-") && (m.role === "user" || m.role === "model"))
        .slice(-8)
        .map((m) => ({
          role: m.role,
          text: m.text,
        }));

      const res = await axiosInstance.post("/api/ai/chat", {
        message: query,
        history: historyPayload,
      });

      if (res.data?.success && res.data?.data) {
        const aiData = res.data.data;
        const responseText = aiData.textResponse || "আমি আপনার অনুরোধটি গ্রহণ করেছি।";

        const botMsg: Message = {
          id: `bot-${Date.now()}`,
          role: "model",
          text: responseText,
          type: aiData.type,
          functionName: aiData.functionName,
          args: aiData.args,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        };

        setMessages((prev) => [...prev, botMsg]);

        // If function calling, execute UI action
        if (aiData.type === "FUNCTION_CALL" && aiData.functionName) {
          executeSiteAction(aiData.functionName, aiData.args);
        }
      } else {
        throw new Error(res.data?.message || "Invalid server response");
      }
    } catch (err: any) {
      console.error("AI Assistant Error:", err);
      const errorMsg: Message = {
        id: `error-${Date.now()}`,
        role: "model",
        text: `দুঃখিত, সার্ভারের সাথে সংযোগে সাময়িক সমস্যা হয়েছে। (${err.response?.data?.message || err.message})`,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsThinking(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div key="aro-assistant-root">
          {/* Mobile Backdrop (only on small screens, no blocking overlay on desktop) */}
          <motion.div
            key="aro-mobile-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs sm:hidden pointer-events-auto"
          />

          {/* Main Assistant Modal / Side Widget */}
          <motion.div
            key="aro-modal-widget"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 md:right-8 z-50 w-full sm:w-[420px] md:w-[440px] h-[100dvh] sm:h-[620px] max-h-[100dvh] sm:max-h-[82vh] bg-gradient-to-b from-[#0a0f1e] via-[#050914] to-[#02040a] border-0 sm:border sm:border-cyan-500/30 sm:rounded-3xl rounded-none shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col overflow-hidden text-white font-sans pointer-events-auto"
          >
        {/* Header */}
        <div className="relative px-5 py-3.5 sm:py-4 bg-[#0a1024]/95 border-b border-cyan-500/20 flex items-center justify-between backdrop-blur-xl">
          {/* Title */}
          <div className="flex items-center gap-3">
            <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-600 to-indigo-600 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <div className="w-full h-full bg-[#040817] rounded-2xl flex items-center justify-center">
                <Bot className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 border-2 border-[#040817] rounded-full" />
            </div>

            <div>
              <h2 className="text-base font-bold tracking-wide text-white flex items-center gap-1.5">
                Aro Ekdin <span className="text-cyan-400">AI Assistant</span>
              </h2>
            </div>
          </div>

          {/* Controls (Clear Chat / Close) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={clearChat}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:text-cyan-300 transition-all text-gray-400 cursor-pointer"
              title="চ্যাট রিসেট করুন"
            >
              <Trash2 className="w-4 h-4" />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 border border-white/10 hover:bg-red-500/20 hover:border-red-500/40 hover:text-red-400 transition-all text-gray-400 cursor-pointer"
              title="বন্ধ করুন"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.role === "model";
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex gap-2.5 sm:gap-3 w-full ${isBot ? "justify-start" : "justify-end"}`}
              >
                {isBot && (
                  <div className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-300 mt-1">
                    <Bot className="w-3.5 h-3.5" />
                  </div>
                )}

                <div className="max-w-[88%] sm:max-w-[84%] min-w-0 space-y-1">
                  <div
                    className={`p-3.5 sm:p-4 rounded-2xl text-sm leading-relaxed break-words [overflow-wrap:anywhere] overflow-hidden ${
                      isBot
                        ? "bg-[#0b1329]/95 border border-cyan-500/20 text-gray-200 rounded-tl-sm shadow-md"
                        : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-tr-sm shadow-[0_4px_15px_rgba(6,182,212,0.25)]"
                    }`}
                  >
                    {/* Formatted Content */}
                    <div className="whitespace-pre-wrap break-words [overflow-wrap:anywhere] font-sans">{renderMessageContent(msg.text)}</div>

                    {/* Quick suggestion prompt chips on welcome message */}
                    {msg.id === "welcome-1" && messages.length === 1 && (
                      <div className="mt-3 pt-2.5 border-t border-cyan-500/20 flex flex-wrap gap-1.5">
                        {[
                          "দলের অধিনায়ক ও সেরা খেলোয়াড় কে?",
                          "সেরা অ্যাটাকার ও সেরা লিবারো কে?",
                          "টিমের সেরা সেটার কে?",
                          "টিমের প্লেয়ারদের তালিকা",
                          "সোশ্যাল মিডিয়া লিঙ্ক দিন",
                          "ভলিবল রোটেশন নিয়ম কি?",
                        ].map((promptText, pIdx) => (
                          <button
                            key={pIdx}
                            onClick={() => handleSendMessage(promptText)}
                            className="text-xs px-2.5 py-1 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 hover:text-cyan-100 transition-all cursor-pointer font-medium"
                          >
                            {promptText}
                          </button>
                        ))}
                      </div>
                    )}

                    {/* Training Routine Drill Card */}
                    {msg.type === "FUNCTION_CALL" &&
                      msg.functionName === "saveTrainingRoutine" &&
                      msg.args && (
                        <div className="mt-3 p-3 bg-black/50 border border-emerald-500/40 rounded-xl space-y-2">
                          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                            <Dumbbell className="w-4 h-4" />
                            <span>ভলিবল ট্রেনিং ড্রিল প্ল্যান</span>
                          </div>
                          <div className="text-xs text-gray-300 space-y-1">
                            <p>
                              <strong className="text-white">পজিশন:</strong> {msg.args.position} |{" "}
                              <strong className="text-white">ফোকাস:</strong> {msg.args.focusArea}
                            </p>
                            {Array.isArray(msg.args.drills) && (
                              <ul className="list-disc pl-4 space-y-1 mt-1 text-gray-200">
                                {msg.args.drills.map((drill: any, idx: number) => (
                                  <li key={idx}>
                                    <span className="font-semibold text-cyan-300">
                                      {drill.drillName}
                                    </span>{" "}
                                    ({drill.setsReps}): {drill.instructions}
                                  </li>
                                ))}
                              </ul>
                            )}
                            {msg.args.coachTips && (
                              <p className="text-[11px] text-amber-300 mt-1 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20">
                                টিপস: {msg.args.coachTips}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-2">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>ডাটাবেজে সংরক্ষণ করা হয়েছে</span>
                          </div>
                        </div>
                      )}

                    {/* Navigation Action Tag */}
                    {msg.type === "FUNCTION_CALL" &&
                      msg.functionName === "navigateToSection" && (
                        <div className="mt-2 flex items-center gap-2 p-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-xs text-cyan-300">
                          <Compass className="w-3.5 h-3.5 text-cyan-400" />
                          <span>
                            {msg.args?.sectionId} সেকশনে নিয়ে যাওয়া হয়েছে
                          </span>
                        </div>
                      )}
                  </div>

                  <div
                    className={`text-[10px] sm:text-[11px] text-gray-500 px-1 ${
                      isBot ? "text-left" : "text-right"
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>

                {!isBot && (
                  <div className="w-7 h-7 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0 text-blue-300 mt-1">
                    <User className="w-3.5 h-3.5" />
                  </div>
                )}
              </motion.div>
            );
          })}

          {isThinking && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-7 h-7 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                <Bot className="w-3.5 h-3.5" />
              </div>
              <div className="p-3 bg-[#0b1329] border border-cyan-500/20 rounded-2xl rounded-tl-sm flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400 animate-spin" />
                <span className="text-xs text-cyan-300 font-medium animate-pulse">
                  Aro লিখছে...
                </span>
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Text Input Box */}
        <div className="p-3 sm:p-4 bg-[#070d1e] border-t border-cyan-500/20 flex items-center gap-2 sm:gap-3">
          <div className="flex-1 relative flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="টিমের প্লেয়ার, গ্রাউন্ড, রোটেশন বা নিয়ম সম্পর্কে লিখুন..."
              className="w-full bg-[#02050f] border border-cyan-500/30 focus:border-cyan-400 rounded-2xl px-4 py-3 sm:py-3.5 text-sm text-white placeholder-gray-500 outline-none transition-all pr-12 shadow-inner"
            />

            {/* Send Button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputMessage.trim() || isThinking}
              className="absolute right-2 p-2 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-600 text-white disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 transition-all cursor-pointer"
              title="পাঠান"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </div>
    )}
  </AnimatePresence>
  );
};

export default AroAssistantModal;
