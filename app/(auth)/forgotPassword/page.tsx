"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../hooks/useAxiosSecure";

const ForgotPassword = () => {
    const router = useRouter();

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [stage, setStage] = useState<1 | 2 | 3>(1); 
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [otpError, setOtpError] = useState("");
    const axiosSecure = useAxiosSecure();

    // Stage 1: Send OTP
    const handleSendOtp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!email) return;

        setIsLoading(true);
        setOtpError("");
        try {
            const response = await axiosSecure.post("/forgot-password-otp", { email });
            
            if (response.data?.success) {
                Swal.fire({
                    title: "OTP Sent!",
                    text: `A 6-digit verification code has been sent to ${email}`,
                    icon: "success",
                    confirmButtonColor: "#3b82f6",
                    background: "#0f172a",
                    color: "#fff",
                });
                setStage(2);
            }
        } catch (error: any) {
            console.error("OTP Send Error:", error);
            Swal.fire({
                title: "Error!",
                text: error.response?.data?.message || "Something went wrong! Please check backend server.",
                icon: "error",
                confirmButtonColor: "#ef4444",
                background: "#0f172a",
                color: "#fff",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Stage 2: Verify OTP
    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length !== 6) return;

        setIsLoading(true);
        setOtpError("");
        try {
            const response = await axiosSecure.post("/verify-forgot-otp", { email, otp });
            
            if (response.data?.success) {
                Swal.fire({
                    title: "OTP Verified!",
                    text: "Now you can set a new password.",
                    icon: "success",
                    confirmButtonColor: "#06b6d4",
                    background: "#0f172a",
                    color: "#fff",
                });
                setStage(3);
            }
        } catch (error: any) {
            setOtpError(error.response?.data?.message || "The code you entered is incorrect.");
            Swal.fire({
                title: "Invalid OTP",
                text: error.response?.data?.message || "The code you entered is incorrect.",
                icon: "error",
                confirmButtonColor: "#ef4444",
                background: "#0f172a",
                color: "#fff",
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Stage 3: Update Password
    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            Swal.fire({ 
                title: "Error", 
                text: "Password must be at least 6 characters", 
                icon: "warning",
                background: "#0f172a",
                color: "#fff",
            });
            return;
        }
        if (newPassword !== confirmPassword) {
            Swal.fire({ 
                title: "Error", 
                text: "Passwords do not match!", 
                icon: "warning",
                background: "#0f172a",
                color: "#fff",
            });
            return;
        }

        setIsLoading(true);
        try {
            const response = await axiosSecure.post("/reset-password", { 
                email, 
                otp, 
                newPassword 
            });

            if (response.data?.success) {
                Swal.fire({
                    title: "Success!",
                    text: "Your password has been updated successfully.",
                    icon: "success",
                    confirmButtonText: "Login Now",
                    confirmButtonColor: "#3b82f6",
                    background: "#0f172a",
                    color: "#fff",
                }).then((result) => {
                    if (result.isConfirmed) {
                        router.push("/login");
                    }
                });
            }
        } catch (error: any) {
            Swal.fire({
                title: "Update Failed",
                text: error.response?.data?.message || "Failed to reset password. Try again.",
                icon: "error",
                confirmButtonColor: "#ef4444",
                background: "#0f172a",
                color: "#fff",
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full flex items-center justify-center">
            <div className="relative w-full max-w-md">
                <div className="bg-[#0a0a0a]/80 backdrop-blur-3xl border border-white/10 rounded-3xl p-8 sm:p-10 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.7)]">
                    
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-cyan-300 mb-2">
                            {stage === 1 && "Reset Password"}
                            {stage === 2 && "Enter OTP"}
                            {stage === 3 && "New Password"}
                        </h2>
                        <p className="text-gray-400 text-sm">
                            {stage === 1 && "Enter your email to receive an OTP code"}
                            {stage === 2 && `Enter the 6-digit code sent to ${email}`}
                            {stage === 3 && "Create a secure new password for your account"}
                        </p>
                    </div>

                    {/* STAGE 1: EMAIL INPUT */}
                    {stage === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Email Address</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="name@example.com"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-400/50 transition-all placeholder-gray-600"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-linear-to-r from-blue-400 to-cyan-300 hover:from-blue-300 hover:to-cyan-200 text-black font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] disabled:opacity-50 cursor-pointer"
                            >
                                {isLoading ? "Sending OTP..." : "Send OTP Verification"}
                            </button>
                        </form>
                    )}

                    {/* STAGE 2: OTP INPUT */}
                    {stage === 2 && (
                        <form onSubmit={handleVerifyOtp} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300 text-center block">
                                    Enter Verification Code
                                </label>

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
                                className="w-full py-3 bg-linear-to-r from-blue-400 to-cyan-300 hover:from-blue-300 hover:to-cyan-200 text-black font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none cursor-pointer"
                            >
                                {isLoading ? "Verifying..." : "Verify OTP Code"}
                            </button>

                            <button
                                type="button"
                                onClick={() => {
                                    setStage(1);
                                    setOtp("");
                                    setOtpError("");
                                }}
                                className="w-full text-center text-sm text-gray-400 hover:text-white transition-colors duration-300 flex items-center justify-center gap-1 group cursor-pointer"
                            >
                                <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                Change Email
                            </button>
                        </form>
                    )}

                    {/* STAGE 3: NEW PASSWORD INPUT */}
                    {stage === 3 && (
                        <form onSubmit={handleUpdatePassword} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        placeholder="Min 6 characters"
                                        className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-400/50 transition-all placeholder-gray-600"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-400 text-xs transition-colors cursor-pointer"
                                    >
                                        {showPassword ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-gray-300">Confirm Password</label>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder="Repeat your password"
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-blue-400/50 transition-all placeholder-gray-600"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 bg-linear-to-r from-blue-400 to-cyan-300 hover:from-blue-300 hover:to-cyan-200 text-black font-bold rounded-xl transition-all duration-300 shadow-[0_0_20px_rgba(59,130,246,0.2)] hover:shadow-[0_0_25px_rgba(34,211,238,0.4)] disabled:opacity-50 cursor-pointer"
                            >
                                {isLoading ? "Updating..." : "Reset & Update Password"}
                            </button>
                        </form>
                    )}

                    <div className="text-center mt-6 border-t border-white/5 pt-4">
                        <Link href="/login" className="text-xs text-gray-400 hover:text-blue-400 transition-colors">
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
