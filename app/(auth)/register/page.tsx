"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import auth from "../../../firebase/firebase.config";
import useAxios from "../../../hooks/useAxios";
import SocialLogin from "../../../components/SocialLogin/SocialLogin";
import Swal from "sweetalert2";

const Register = () => {
  const router = useRouter();
  const axiosPublic = useAxios();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [isOtpStage, setIsOtpStage] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImage(e.target.files[0]);
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Invalid email address";
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await axiosPublic.post("/send-otp", { 
          email: formData.email,
          name: formData.name
        });

        if (response.data?.success || response.status === 200) {
          Swal.fire({
            title: "Verification Code Sent!",
            text: `A 6-digit OTP has been sent to ${formData.email}`,
            icon: "success",
            confirmButtonColor: "#3b82f6",
            background: "#0f172a",
            color: "#fff",
          });
          setIsOtpStage(true);
        }
      } catch (error: any) {
        console.error("OTP Send Error:", error);
        setErrors((prev) => ({ 
          ...prev, 
          firebase: error.response?.data?.message || "Failed to send OTP. Try again." 
        }));
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleVerifyAndRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError("");
    
    if (otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    try {
      const verifyResponse = await axiosPublic.post("/verify-otp", {
        email: formData.email,
        otp: otp,
      });

      if (verifyResponse.data?.success) {
        let imageUrl = "";

        if (image) {
          const formDataImage = new FormData();
          formDataImage.append("file", image);
          formDataImage.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "aro_ekdin");

          const imgRes = await fetch("https://api.cloudinary.com/v1_1/do8awe7fc/image/upload", {
            method: "POST",
            body: formDataImage,
          });
          const imgData = await imgRes.json();
          imageUrl = imgData.secure_url || "";
        }

        await createUserWithEmailAndPassword(auth, formData.email, formData.password);

        const userInfo = {
          name: formData.name,
          email: formData.email,
          photoURL: imageUrl,
          role: "user",
          isVerified: true,
          last_login: new Date(),
          createdAt: new Date(),
        };

        const mongoResponse = await axiosPublic.post("/users", userInfo);

        if (mongoResponse.data?.insertedId) {
          Swal.fire({
            title: "Registration Success!",
            text: "Your account has been verified and registered successfully.",
            icon: "success",
            confirmButtonText: "Go to Home",
            confirmButtonColor: "#10b981",
            background: "#0f172a",
            color: "#fff",
          }).then((result) => {
            if (result.isConfirmed) {
              router.push("/");
            }
          });
        }
      }
    } catch (error: any) {
      console.error("Verification/Registration Error:", error);
      const errMsg = error.response?.data?.message || error.message || "Something went wrong!";
      setOtpError(errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="w-full flex items-center justify-center">
      <div className="relative w-full max-w-md">
        <div className="bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400 mb-2">
              {isOtpStage ? "Verify Email" : "Create Account"}
            </h2>
            <p className="text-gray-400 text-sm">
              {isOtpStage
                ? `Enter the 6-digit code sent to ${formData.email}`
                : "Register to continue your journey"}
            </p>
          </div>

          {errors.firebase && (
            <p className="text-red-400 text-xs text-center bg-red-500/10 p-2 rounded-lg mb-4 border border-red-500/20">
              {errors.firebase}
            </p>
          )}

          {!isOtpStage ? (
            <form onSubmit={handleSendOtp} className="space-y-5">
              {/* Name Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your Name"
                  className={`w-full px-4 py-3 bg-white/5 border ${errors.name ? "border-red-500/50" : "border-white/10"} rounded-xl text-white focus:outline-none focus:border-blue-400/50 transition-all`}
                />
                {errors.name && <p className="text-red-400 text-xs">{errors.name}</p>}
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={`w-full px-4 py-3 bg-white/5 border ${errors.email ? "border-red-500/50" : "border-white/10"} rounded-xl text-white focus:outline-none focus:border-blue-400/50 transition-all`}
                />
                {errors.email && <p className="text-red-400 text-xs">{errors.email}</p>}
              </div>

              {/* Profile Image */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Profile Image</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-blue-500/20 file:text-blue-300 cursor-pointer"
                />
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={`w-full px-4 py-3 bg-white/5 border ${errors.password ? "border-red-500/50" : "border-white/10"} rounded-xl text-white focus:outline-none focus:border-blue-400/50 transition-all`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 text-xs cursor-pointer"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
                {errors.password && <p className="text-red-400 text-xs">{errors.password}</p>}
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-linear-to-r from-blue-400 via-cyan-300 to-indigo-400 text-white font-semibold rounded-xl hover:opacity-90 transition-all disabled:opacity-50 cursor-pointer"
              >
                {isLoading ? "Sending OTP..." : "Register & Send OTP"}
              </button>

              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-[#0a0a0a] text-gray-500">Or continue with</span>
                </div>
              </div>
              
              <SocialLogin />

              {/* Login Link */}
              <p className="text-center mt-6 text-gray-400 text-sm">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300 hover:from-blue-300 hover:to-cyan-200 font-semibold transition-all duration-300"
                >
                  Sign In
                </Link>
              </p>
            </form>
          ) : (
            <form onSubmit={handleVerifyAndRegister} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300 text-center block">
                  Enter Verification Code
                </label>

                {/* OTP Individual Boxes */}
                <div className="flex justify-center gap-3">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <div key={index} className="relative">
                      <input
                        type="text"
                        maxLength={1}
                        value={otp[index] || ""}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "");
                          const newOtp = otp.split("");
                          newOtp[index] = value;
                          setOtp(newOtp.join(""));

                          if (value && index < 5) {
                            const nextInput = ((e.currentTarget as HTMLElement).parentElement?.parentElement?.children[index + 1] as HTMLElement)?.querySelector("input");
                            if (nextInput) nextInput.focus();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" && !otp[index] && index > 0) {
                            const prevInput = ((e.currentTarget as HTMLElement).parentElement?.parentElement?.children[index - 1] as HTMLElement)?.querySelector("input");
                            if (prevInput) prevInput.focus();
                          }
                        }}
                        onPaste={(e) => {
                          e.preventDefault();
                          const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
                          setOtp(pastedData);
                        }}
                        className="w-12 h-14 sm:w-14 sm:h-16 text-center text-xl sm:text-2xl font-bold bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/20 focus:bg-white/10 transition-all duration-300"
                        style={{ caretColor: "#60a5fa" }}
                      />
                      {otp[index] && (
                        <div className="absolute bottom-1 left-2 right-2 h-0.5 bg-linear-to-r from-blue-400 to-cyan-300 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  ))}
                </div>

                {otpError && (
                  <p className="text-red-400 text-xs text-center mt-2 flex items-center justify-center gap-1">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {otpError}
                  </p>
                )}

                <div className="text-center mt-4">
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    className="text-sm text-gray-400 hover:text-blue-400 transition-colors duration-300 cursor-pointer"
                  >
                    Didn&apos;t receive code? <span className="text-blue-400 hover:text-cyan-300">Resend</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading || otp.length < 6}
                className="w-full py-3 bg-linear-to-r from-green-400 to-emerald-500 text-white font-semibold rounded-xl hover:from-green-500 hover:to-emerald-600 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
              >
                {isLoading ? "Registering..." : "Verify & Register Account"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsOtpStage(false);
                  setOtp("");
                  setOtpError("");
                }}
                className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors duration-300 flex items-center justify-center gap-1 group cursor-pointer"
              >
                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Registration
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="text-white text-center">Loading...</div>}>
      <Register />
    </Suspense>
  );
}
