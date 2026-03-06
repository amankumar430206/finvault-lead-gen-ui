"use client";

import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useLogin = () => {
  const setAuth = useAuthStore((s) => s.setAuth);
  const router = useRouter();

  return useMutation({
    mutationFn: (data) => api.post("/auth/login", data).then((res) => res.data),

    onSuccess: (data) => {
      setAuth(data);
      const role = data?.content?.role;
      if (role === "ADMIN") router.push("/app/overview");
      if (role === "AGENT") router.push("/app/send-money");
      if (role === "STUDENT") router.push("/app/send-money");
      toast.success("Login successful!");
    },

    onError: (error) => {
      console.log("Error Message:", error.response?.data?.msg);
      toast.error(error.response?.data?.msg || error.response?.data?.message || "Error occurred during login");
    },
  });
};
