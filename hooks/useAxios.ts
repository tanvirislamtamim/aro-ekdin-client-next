import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "https://aro-ekdin-server-side-my0t.onrender.com",
});

const useAxios = () => {
  return axiosInstance;
};

export default useAxios;
