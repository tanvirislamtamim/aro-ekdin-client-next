"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaHeart,
  FaHome,
  FaUserEdit,
  FaUserPlus,
  FaBook,
  FaImage,
  FaTrophy,
} from "react-icons/fa";
import { FaUserShield } from "react-icons/fa6";
import useAuth from "../../hooks/useAuth";
import useUserRole from "../../hooks/useUserRole";
import PrivateRoute from "../../components/Routes/PrivateRoute";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { role, roleLoading } = useUserRole();
  const { user } = useAuth();

  const menuItems = [
    {
      label: "MENU",
      items: [
        { name: "Home", path: "/", icon: <FaHome /> },
        { name: "Rules", path: "/dashboard/rules", icon: <FaBook /> },
        { name: "Favorite Players", path: "/dashboard/favorites", icon: <FaHeart /> },
        // ADMIN ONLY ROUTES
        ...(!roleLoading && (role === "admin" || role === "developer")
          ? [
              { name: "Manage Matches", path: "/dashboard/manageMatches", icon: <FaTrophy /> },
              { name: "Add Player", path: "/dashboard/addPlayer", icon: <FaUserPlus /> },
              { name: "Update Player", path: "/dashboard/updatePlayer", icon: <FaUserEdit /> },
              { name: "Manage Photos", path: "/dashboard/photos", icon: <FaImage /> },
            ]
          : []),

        ...(!roleLoading && role === "developer"
          ? [
              { name: "Make Admin", path: "/dashboard/makeAdmin", icon: <FaUserShield /> },
            ]
          : []),
      ],
    },
  ];

  return (
    <PrivateRoute>
      <div className="drawer lg:drawer-open bg-[#0b0f12]">
        <input id="dashboard-drawer" type="checkbox" className="drawer-toggle" />

        <div className="drawer-content flex flex-col min-h-screen">
          <header className="h-20 bg-[#111820] border-b border-white/5 flex items-center justify-between px-4 md:px-8 sticky top-0 z-40">
            <label htmlFor="dashboard-drawer" className="btn btn-square btn-ghost lg:hidden text-white cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="w-6 h-6 stroke-current"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </label>
            
            <div className="ml-auto flex items-center gap-3 border-l border-white/10 pl-6">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-white">{user?.displayName || user?.email || "User Name"}</p>
                <span className="text-[11px] text-gray-400 capitalize">{role || "User"}</span>
              </div>
              <div className="avatar">
                <div className="w-10 rounded-full ring-2 ring-cyan-300 overflow-hidden">
                  <img src={user?.photoURL || "https://i.ibb.co/m096m9m/user.png"} alt="User" />
                </div>
              </div>
            </div>
          </header>

          <main className="p-4 md:p-8 grow bg-[#0b0f12]">
            {children}
          </main>
        </div>

        <div className="drawer-side z-50">
          <label htmlFor="dashboard-drawer" className="drawer-overlay"></label>
          <div className="w-72 min-h-full bg-[#111820] border-r border-white/5 flex flex-col">
            <div className="p-6 pb-2 mt-2">
              <Link href="/">
                <div className="flex items-center gap-3 bg-white/5 p-3 rounded-2xl border border-white/5 hover:border-cyan-400/30 transition-all">
                  <img src="https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145975/Logo_qzb1xk.jpg" className="w-10 h-10 rounded-xl object-cover ring-2 ring-cyan-300" alt="Logo" />
                  <h2 className="font-black text-lg text-white">Aro Ekdin</h2>
                </div>
              </Link>
            </div>

            <div className="grow px-4 mt-6">
              {menuItems.map((section, idx) => (
                <div key={idx} className="mb-6">
                  <h3 className="px-4 text-[10px] font-bold text-gray-500 tracking-[0.2em] mb-3 uppercase">{section.label}</h3>
                  <ul className="space-y-1">
                    {section.items.map((item) => {
                      const isActive = pathname === item.path;
                      return (
                        <li key={item.path}>
                          <Link
                            href={item.path}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                              isActive
                                ? "bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400 text-slate-900"
                                : "text-gray-400 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <span className="text-lg">{item.icon}</span>
                            {item.name}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </PrivateRoute>
  );
}
