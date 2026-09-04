"use client";

import React, { useState, use } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useTransform,
  useSpring,
} from "framer-motion";
import { FaFacebook, FaInstagram, FaWhatsapp } from "react-icons/fa";
import {
  User,
  Flag,
  Calendar,
  Ruler,
  Weight,
  HandMetal,
  Phone,
  ArrowLeft,
  ShieldCheck,
  Heart,
  Edit,
  Trash2,
} from "lucide-react";
import useAxiosSecure from "../../../../hooks/useAxiosSecure";
import useAuth from "../../../../hooks/useAuth";
import useUserRole from "../../../../hooks/useUserRole";
import Swal from "sweetalert2";


interface PageProps {
  params: Promise<{ id: string }>;
}

const PlayerDetailsPage = ({ params }: PageProps) => {
  const resolvedParams = use(params);
  const id = resolvedParams.id;
  const router = useRouter();
  const pathname = usePathname();
  const [showToast, setShowToast] = useState(false);
  const axiosSecure = useAxiosSecure();
  const { user } = useAuth();
  const { role } = useUserRole();
  const [newCommentText, setNewCommentText] = useState("");

  const {
    data: singlePlayer,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["player", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/players/${id}`);
      return res.data;
    },
  });

  // Favorites Query
  const { data: favoriteData, refetch: refetchFavoriteStatus } = useQuery({
    queryKey: ["favoriteStatus", id, user?.email],
    queryFn: async () => {
      if (!user?.email) return { isFavorite: false };
      const res = await axiosSecure.get(`/favorites/${id}`);
      return res.data;
    },
    enabled: !!user?.email,
  });

  const isFavorite = favoriteData?.isFavorite || false;

  // Comments Query
  const { data: comments = [], refetch: refetchComments } = useQuery({
    queryKey: ["comments", id],
    queryFn: async () => {
      const res = await axiosSecure.get(`/comments/${id}`);
      return res.data;
    },
  });

  const handleFavoriteToggle = async () => {
    if (!user?.email) {
      router.push(`/login?from=${encodeURIComponent(pathname)}`);
      return;
    }

    try {
      if (isFavorite) {
        await axiosSecure.delete(`/favorites/${id}`);
      } else {
        await axiosSecure.post("/favorites", {
          playerId: singlePlayer?.id,
          name: singlePlayer?.name,
          jersey: singlePlayer?.jersey,
          position: singlePlayer?.position,
          img: singlePlayer?.img,
        });
      }
      refetchFavoriteStatus();
    } catch (err) {
      console.error("Favorite toggle error:", err);
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    try {
      await axiosSecure.post("/comments", {
        playerId: id,
        name: user?.displayName || "Anonymous",
        email: user?.email,
        photo: user?.photoURL || "https://i.ibb.co/m096m9m/user.png",
        comment: newCommentText.trim(),
      });
      setNewCommentText("");
      refetchComments();
      Swal.fire({
        icon: "success",
        title: "Comment posted!",
        showConfirmButton: false,
        timer: 1500,
        background: "#0f172a",
        color: "#fff",
      });
    } catch (err) {
      console.error("Error posting comment:", err);
    }
  };

  const handleCommentDelete = async (commentId: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#ef4444",
      confirmButtonText: "Yes, delete it!",
      background: "#0f172a",
      color: "#fff",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axiosSecure.delete(`/comments/${commentId}`);
          refetchComments();
          Swal.fire({
            title: "Deleted!",
            text: "Your comment has been deleted.",
            icon: "success",
            background: "#0f172a",
            color: "#fff",
          });
        } catch (err) {
          console.error("Error deleting comment:", err);
        }
      }
    });
  };

  const handleCommentEditSwal = async (c: any) => {
    const { value: text } = await Swal.fire({
      title: 'Edit Comment',
      input: 'textarea',
      inputLabel: 'Update your comment',
      inputValue: c.comment,
      showCancelButton: true,
      background: "#0f172a",
      color: "#fff",
      confirmButtonColor: "#6366f1",
      cancelButtonColor: "#ef4444",
      inputValidator: (value) => {
        if (!value) {
          return 'You need to write something!'
        }
      }
    });

    if (text) {
      try {
        await axiosSecure.patch(`/comments/${c._id}`, { comment: text.trim() });
        refetchComments();
        Swal.fire({
          icon: "success",
          title: "Comment updated!",
          showConfirmButton: false,
          timer: 1500,
          background: "#0f172a",
          color: "#fff",
        });
      } catch (err) {
        console.error("Error editing comment:", err);
      }
    }
  };

  // High-performance 3D Animation Logic without state re-renders
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [10, -10]);
  const rotateY = useTransform(x, [-100, 100], [-10, 10]);
  const springRotateX = useSpring(rotateX, { damping: 25, stiffness: 350 });
  const springRotateY = useSpring(rotateY, { damping: 25, stiffness: 350 });

  const [isHovering, setIsHovering] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(e.clientX - (rect.left + rect.width / 2));
    y.set(e.clientY - (rect.top + rect.height / 2));
    e.currentTarget.style.setProperty('--glow-x', `${(mouseX / rect.width) * 100}%`);
    e.currentTarget.style.setProperty('--glow-y', `${(mouseY / rect.height) * 100}%`);
  };

  const copyNumber = () => {
    if (singlePlayer?.phone) {
      navigator.clipboard.writeText(singlePlayer.phone);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 2000);
    }
  };

  if (isLoading)
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center p-6 font-sans">
        <div className="w-full max-w-5xl rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-md p-8 flex flex-col md:flex-row gap-8 animate-pulse">
          <div className="w-full md:w-2/5 flex flex-col items-center">
            <div className="w-52 h-52 md:w-64 md:h-64 rounded-full bg-white/10 mb-8" />
            <div className="w-40 h-8 rounded-lg bg-white/10 mb-3" />
            <div className="w-24 h-4 rounded bg-white/5" />
          </div>
          <div className="w-full md:w-3/5 space-y-8">
            <div className="w-32 h-6 rounded bg-white/10" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="w-20 h-4 rounded bg-white/10" />
                  <div className="w-full h-8 rounded-lg bg-white/5" />
                </div>
              ))}
            </div>
            <div className="w-full h-20 rounded-2xl bg-white/5" />
          </div>
        </div>
      </div>
    );

  if (error || !singlePlayer)
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-red-500">
        Error loading player data!
      </div>
    );

  const { name, facebook, position, whatsapp, img, jersey, nationality, age, height, weight, DominantHand, Birthdate, phone, instagram, work } = singlePlayer;

  return (
    <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-start py-16 px-6 gap-8 relative overflow-hidden font-sans">
      <AnimatePresence>
        {showToast && (
          <motion.div initial={{ opacity: 0, y: -40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="fixed top-5 right-5 z-50">
            <div className="px-5 py-3 rounded-2xl border border-white/20 bg-linear-to-br from-indigo-600 to-purple-700 text-white shadow-2xl">
              📋 Number copied
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-900/20 rounded-full blur-[180px] will-change-transform" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-700/20 rounded-full blur-[180px] will-change-transform" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="w-full max-w-5xl z-10">
        <motion.div
          style={{ rotateX: springRotateX, rotateY: springRotateY, transformStyle: "preserve-3d", willChange: "transform" }}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => { x.set(0); y.set(0); setIsHovering(false); }}
          onMouseEnter={() => setIsHovering(true)}
          className="relative rounded-3xl overflow-hidden border border-white/20 bg-linear-to-tr from-white/5 to-indigo-900/10 backdrop-blur-2xl shadow-2xl shadow-indigo-900/40 transition-transform duration-500 hover:scale-[1.02]"
        >
          <div 
            className="absolute inset-0 pointer-events-none transition-opacity duration-300" 
            style={{ 
              opacity: isHovering ? 1 : 0, 
              background: `radial-gradient(600px circle at var(--glow-x, 50%) var(--glow-y, 50%), rgba(99,102,241,0.2), transparent 40%)` 
            }} 
          />

          <button onClick={() => router.back()} className="absolute top-5 left-5 z-20 flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full pl-3 pr-4 py-2 border border-white/20 hover:bg-white/20 text-white cursor-pointer">
            <ArrowLeft size={18} className="text-indigo-300" /> Back
          </button>

          {user && (
            <button 
              onClick={handleFavoriteToggle} 
              className="absolute top-5 right-5 z-20 flex items-center gap-2 bg-white/10 backdrop-blur-md rounded-full px-4 py-2 border border-white/20 hover:bg-white/20 transition-all duration-300 active:scale-95 text-white cursor-pointer"
            >
              <Heart size={18} className={isFavorite ? "text-red-500 fill-red-500" : "text-indigo-300"} />
              <span className="font-semibold text-sm">{isFavorite ? "Favorited" : "Favorite"}</span>
            </button>
          )}

          <div className="flex flex-col md:flex-row mt-12 md:mt-0">
            <div className="w-full md:w-2/5 p-8 flex flex-col items-center justify-center border-r border-white/10">
              <div className="relative">
                <div className="w-52 h-52 md:w-64 md:h-64 rounded-full overflow-hidden border border-purple-500 p-2 bg-black/30">
                  <img src={img} alt={name} className="w-full h-full object-cover rounded-full" loading="eager" decoding="async" />
                </div>
                <div className="absolute top-8 right-2 bg-linear-to-tr from-indigo-500 to-purple-500 text-white w-14 h-14 rounded-full flex items-center justify-center text-xl font-black shadow-lg">
                  {jersey}
                </div>
              </div>
              <div className="mt-8 text-center">
                <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-white">{name}</h2>
                <p className="text-indigo-300 uppercase text-sm mt-1">{position}</p>
                {work && (
                  <div className="flex justify-center items-center gap-2 mt-4 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                    <ShieldCheck size={16} className="text-indigo-400" />
                    <span className="text-xs text-slate-300 font-semibold uppercase">
                      {work}
                    </span>
                  </div>
                )}
                <div className="flex justify-center items-center gap-6 mt-4 bg-white/5 px-4 py-1.5 rounded-full border border-white/10">
                  <a href={facebook || "#"} target="_blank" rel="noopener noreferrer"><FaFacebook color="white" size={24} /></a>
                  <a href={instagram || "#"} target="_blank" rel="noopener noreferrer"><FaInstagram color="white" size={24} /></a>
                  <a href={whatsapp || "#"} target="_blank" rel="noopener noreferrer"><FaWhatsapp color="white" size={24} /></a>
                </div>
              </div>
            </div>

            <div className="w-full md:w-3/5 p-8 md:p-12">
              <h3 className="text-xl font-semibold text-white uppercase mb-8">Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <DetailItem icon={<Flag size={18} />} label="Nationality" value={nationality} />
                <DetailItem icon={<User size={18} />} label="Age" value={age ? `${age} Years` : "N/A"} />
                <DetailItem icon={<Ruler size={18} />} label="Height" value={height} />
                <DetailItem icon={<Weight size={18} />} label="Weight" value={weight} />
                <DetailItem icon={<HandMetal size={18} />} label="Dominant Hand" value={DominantHand} />
                <DetailItem icon={<Calendar size={18} />} label="Birth Date" value={Birthdate} />
              </div>

              <div onClick={copyNumber} className="mt-10 p-5 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl flex items-center justify-between cursor-pointer hover:bg-indigo-500/10">
                <div className="flex items-center gap-3">
                  <div className="bg-indigo-500/20 p-2 rounded-lg text-indigo-400"><Phone size={20} /></div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase">Contact</p>
                    <p className="text-slate-200 font-semibold">{phone}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* Comments Section */}
      <div className="w-full max-w-5xl z-10 space-y-8 mt-4 cv-auto">
        <style>{`
          @keyframes marquee {
            0% { transform: translate3d(0, 0, 0); }
            100% { transform: translate3d(-50%, 0, 0); }
          }
          .animate-marquee {
            display: flex;
            animation: marquee 25s linear infinite;
            width: max-content;
            will-change: transform;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}</style>

        {/* Live Comments Marquee */}
        {comments.length > 0 && (
          <div className="relative w-full overflow-hidden bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-2xl shadow-xl">
            <h4 className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-400 mb-6 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
              Comments
            </h4>
            <div className="relative w-full overflow-hidden flex">
              <div className="animate-marquee gap-6">
                {(() => {
                  let repeated = [...comments];
                  while (repeated.length < 8 && comments.length > 0) {
                    repeated = [...repeated, ...comments];
                  }
                  return [...repeated, ...repeated].map((c: any, idx: number) => {
                    const isOwner = user && user.email === c.email;
                    const isAdmin = role === "admin" || role === "developer";
                    const canEditOrDelete = isOwner || isAdmin;

                    return (
                      <div key={idx} className="shrink-0 flex items-center justify-between gap-3 bg-black/40 border border-white/5 px-4 py-3 rounded-2xl min-w-[280px]">
                        <div className="flex items-center gap-3">
                          <img 
                            src={c.photo || "https://i.ibb.co/m096m9m/user.png"} 
                            alt={c.name} 
                            loading="lazy"
                            decoding="async"
                            className="w-10 h-10 rounded-full ring-2 ring-cyan-300 object-cover" 
                          />
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-white truncate">{c.name}</p>
                            <p className="text-sm text-gray-300 truncate max-w-37.5">{c.comment}</p>
                          </div>
                        </div>

                        {canEditOrDelete && (
                          <div className="flex items-center gap-1.5 pl-2 border-l border-white/10">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCommentEditSwal(c);
                              }} 
                              className="p-1 rounded bg-white/5 hover:bg-indigo-500/30 text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                              title="Edit"
                            >
                              <Edit size={12} />
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCommentDelete(c._id);
                              }} 
                              className="p-1 rounded bg-white/5 hover:bg-red-500/30 text-red-400 hover:text-red-300 transition-colors cursor-pointer"
                              title="Delete"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        )}

        {/* Add Comment Form */}
        <div className="space-y-4">
          {user ? (
            <form onSubmit={handleCommentSubmit} className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-2xl shadow-xl space-y-4">
              <h4 className="text-lg font-bold text-indigo-300 flex items-center gap-2">
                Share Your Thoughts
              </h4>
              <div className="flex gap-4">
                <img 
                  src={user?.photoURL || "https://i.ibb.co/m096m9m/user.png"} 
                  alt={user?.displayName || "User"} 
                  className="w-12 h-12 rounded-full object-cover ring-2 ring-indigo-400" 
                  loading="lazy"
                  decoding="async"
                />
                <div className="grow space-y-4">
                  <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Write a public comment..."
                    rows={3}
                    className="w-full bg-black/40 border border-white/10 focus:border-indigo-400 rounded-2xl px-4 py-3 text-white outline-none placeholder-gray-500 resize-none transition-all duration-300 focus:ring-1 focus:ring-indigo-400"
                    required
                  />
                  <button 
                    type="submit" 
                    className="w-full md:w-auto px-6 py-3 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-2xl shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
                  >
                    Post Comment
                  </button>
                </div>
              </div>
            </form>
          ) : (
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 text-center text-gray-400 backdrop-blur-2xl shadow-xl">
              Please <Link href={`/login?from=${encodeURIComponent(pathname)}`} className="text-cyan-400 hover:underline font-bold">login</Link> to join the discussion and post comments.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({ icon, label, value }: { icon: React.ReactNode; label: string; value?: string | number }) => (
  <div className="p-4 rounded-2xl hover:bg-indigo-500/10 transition-all">
    <div className="flex items-center gap-3 mb-1 text-indigo-400">
      {icon}
      <span className="text-xs text-slate-400 uppercase font-bold">{label}</span>
    </div>
    <p className="text-white font-semibold text-lg ml-7">{value || "N/A"}</p>
  </div>
);

export default PlayerDetailsPage;
