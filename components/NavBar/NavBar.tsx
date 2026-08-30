"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useContext } from "react";
import { AuthContext } from "../../contexts/AuthContext";
import { usePWAInstall } from "../../hooks/usePWAInstall";
import "./NavBar.css";

const Navbar = () => {
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);

  const authContext = useContext(AuthContext);
  const user = authContext?.user;
  const logOut = authContext?.logOut;
  const { showInstallButton, installApp } = usePWAInstall();

  // Handle scroll behavior (Hide on scroll down, show on scroll up / bottom for desktop)
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Bottom of page check (within 50px buffer)
      const isAtBottom = windowHeight + currentScrollY >= documentHeight - 50;

      if (currentScrollY <= 50 || isAtBottom) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + 10) {
        // Scrolling down
        setIsVisible(false);
        setIsDropdownOpen(false);
      } else if (currentScrollY < lastScrollY.current - 10) {
        // Scrolling up
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Premium Active/Inactive Style with subtle glow
  const getNavItemStyle = (isActive: boolean) =>
    `relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-2xl sm:rounded-full transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${
      isActive
        ? "text-[#ea580c] sm:bg-white/10 sm:text-white drop-shadow-[0_0_12px_rgba(234,88,12,0.4)]"
        : "text-gray-400 hover:text-white hover:bg-white/5"
    }`;

  const isHomeActive = pathname === "/";
  const isPlayersActive = pathname.startsWith("/players");
  const isGalleryActive = pathname.startsWith("/gallery");
  const isDashboardActive = pathname.startsWith("/dashboard");
  const isLoginActive = pathname === "/login";
  const isRegisterActive = pathname === "/register";
  const isMatchesActive = pathname.startsWith("/matches");
  const isVideosActive = pathname.startsWith("/videos");
  const isAboutActive = pathname.startsWith("/about");

  return (
    <nav
      className={`fixed bottom-4 sm:bottom-8 left-1/2 -translate-x-1/2 w-[95%] sm:w-auto z-50 transition-all duration-500 ease-in-out ${
        isVisible
          ? "translate-y-0 opacity-100 pointer-events-auto"
          : "translate-y-0 sm:translate-y-32 sm:opacity-0 sm:pointer-events-none"
      }`}
    >
      {/* Glassmorphism Container with Optimized Spacing */}
      <div className="flex items-center justify-around sm:justify-center gap-1 sm:gap-4 bg-[#0a0a0a]/80 backdrop-blur-3xl px-3 py-2 rounded-[2.5rem] sm:rounded-full border border-white/10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] w-full">
        {/* Left Side Items */}
        <div className="flex items-center gap-1 sm:gap-3">
          <Link href="/" className={getNavItemStyle(isHomeActive)}>
            <svg
              className={`w-6 h-6 sm:w-5 sm:h-5 transition-transform duration-300 ${
                isHomeActive ? "scale-110" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={isHomeActive ? 2.5 : 2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="text-[10px] sm:text-sm font-semibold tracking-wide">
              Home
            </span>
          </Link>

          <Link href="/players" className={getNavItemStyle(isPlayersActive)}>
            <svg
              className={`w-6 h-6 sm:w-5 sm:h-5 transition-transform duration-300 ${
                isPlayersActive ? "scale-110" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={isPlayersActive ? 2.5 : 2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span className="text-[10px] sm:text-sm font-semibold tracking-wide">
              Players
            </span>
          </Link>
        </div>

        {/* Center Logo Section */}
        <Link href="/">
          <div className="relative mx-1 sm:mx-3 shrink-0">
            <div className="absolute inset-0 bg-[#ea580c]/20 blur-xl rounded-full"></div>
            <img
              src="https://res.cloudinary.com/do8awe7fc/image/upload/q_auto/f_auto/v1777145975/Logo_qzb1xk.jpg"
              alt="Logo"
              className="relative w-11 h-11 sm:w-12 sm:h-12 rounded-full object-cover border-2 border-white/20 shadow-2xl transition-transform duration-500 hover:rotate-360"
            />
          </div>
        </Link>

        {/* Right Side Items */}
        <div className="flex items-center gap-1 sm:gap-3">
          <Link href="/gallery" className={getNavItemStyle(isGalleryActive)}>
            <svg
              className={`w-6 h-6 sm:w-5 sm:h-5 transition-transform duration-300 ${
                isGalleryActive ? "scale-110" : ""
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={isGalleryActive ? 2.5 : 2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <span className="text-[10px] sm:text-sm font-semibold tracking-wide">
              Gallery
            </span>
          </Link>

          {/* More Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="relative flex flex-col sm:flex-row items-center justify-center gap-1 sm:gap-2 px-3 py-2 sm:px-5 sm:py-2.5 rounded-2xl sm:rounded-full transition-all duration-500 ease-in-out text-gray-400 hover:text-white hover:bg-white/5"
            >
              <svg
                className="w-6 h-6 sm:w-5 sm:h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4.5 10.5L12 3m0 0l7.5 7.5M12 3v18"
                />
              </svg>
              <span className="text-[10px] sm:text-sm font-semibold tracking-wide">
                More
              </span>
            </button>

            {/* Dropdown Menu - Opens Upwards */}
            <div
              className={`absolute bottom-full mb-2 right-0 sm:right-auto sm:left-1/2 sm:-translate-x-1/2 w-40 bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 rounded-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)] overflow-hidden transition-all duration-300 ease-in-out ${
                isDropdownOpen
                  ? "opacity-100 translate-y-0 visible"
                  : "opacity-0 translate-y-2 invisible"
              }`}
            >
              {/* Dashboard Link */}
              <Link
                href="/dashboard/rules"
                onClick={() => setIsDropdownOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 ${
                  isDashboardActive
                    ? "text-[#ea580c] bg-white/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                  />
                </svg>
                Dashboard
              </Link>

              {user ? (
                /* LOGOUT LINK */
                <button
                  onClick={() => {
                    logOut?.()
                      .then(() => {
                        setIsDropdownOpen(false);
                      })
                      .catch((error) => console.error(error));
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 text-gray-400 hover:text-red-400 hover:bg-white/5 text-left"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                  Logout
                </button>
              ) : (
                /* LOGIN & REGISTER LINKS */
                <>
                  <Link
                    href="/login"
                    onClick={() => setIsDropdownOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 ${
                      isLoginActive
                        ? "text-[#ea580c] bg-white/5"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                      />
                    </svg>
                    Login
                  </Link>

                  <Link
                    href="/register"
                    onClick={() => setIsDropdownOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 ${
                      isRegisterActive
                        ? "text-[#ea580c] bg-white/5"
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                      />
                    </svg>
                    Register
                  </Link>
                </>
              )}


              <Link
                href="/matches"
                onClick={() => setIsDropdownOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 ${
                  isMatchesActive
                    ? "text-[#ea580c] bg-white/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
                Matches
              </Link>

              <Link
                href="/videos"
                onClick={() => setIsDropdownOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 ${
                  isVideosActive
                    ? "text-[#ea580c] bg-white/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14m-6 4h4a2 2 0 002-2V8a2 2 0 00-2-2H9a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Videos
              </Link>

              {showInstallButton && (
                <button
                  onClick={() => {
                    installApp();
                    setIsDropdownOpen(false);
                  }}
                  className="w-full flex items-center justify-between px-4 py-3 text-sm font-semibold transition-all duration-300 text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950/40 text-left cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <svg
                      className="w-4 h-4 text-cyan-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    <span>Install App</span>
                  </div>
                  <span className="text-[9px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-mono font-bold">
                    PWA
                  </span>
                </button>
              )}

              <Link
                href="/about"
                onClick={() => setIsDropdownOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 text-sm transition-all duration-300 ${
                  isAboutActive
                    ? "text-[#ea580c] bg-white/5"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                About
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
