"use client";

import axios, { AxiosInstance } from "axios";
import { useEffect } from "react";
import useAuth from "./useAuth";

const axiosSecure: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://aro-ekdin-server-side-my0t.onrender.com",
});

const useAxiosSecure = () => {
  const { user, logOut } = useAuth();

  useEffect(() => {
    // REQUEST INTERCEPTOR
    const requestInterceptor = axiosSecure.interceptors.request.use(
      async (config) => {
        if (user && typeof window !== "undefined") {
          const token = localStorage.getItem("access-token");
          if (token) {
            config.headers.authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // RESPONSE INTERCEPTOR
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        if (error.response?.status === 401 || error.response?.status === 403) {
          console.error("Unauthorized access");
          await logOut();
        }
        return Promise.reject(error);
      }
    );

    // CLEANUP
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [user, logOut]);

  return axiosSecure;
};

export default useAxiosSecure;
