"use client";

import { api } from "@/lib/axios";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useOtpVerify = () => {
  const router = useRouter();
  return useMutation({
    mutationFn: (data) => api.post("/auth/verify-otp", data).then((res) => res.data),
    onSuccess: (data) => {
      console.log("data", data);
      toast.success(data?.msg || "Login successful!");
      router.replace("/login");
    },

    onError: (error) => {
      console.log("Error Message:", error.response?.data?.msg);
      toast.error(error.response?.data?.msg || error.response?.data?.message || "Error occurred during login");
    },
  });
};
