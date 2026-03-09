"use client";

import { api } from "@/lib/axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const usePassportVerify = () => {
  return useMutation({
    mutationFn: (payload) => api.post("/kyc/passport/verify", payload).then((res) => res.data),
    onSuccess: (data) => {
      console.log("data", data);
      toast.success(data?.msg || "Passport Verified Successfully!");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg || error.response?.data?.message || "An Error Occurred During Verification",
      );
    },
  });
};

export const usePassportConfirm = () => {
  return useMutation({
    mutationFn: (payload) => api.put("/kyc/passport/confirm", payload).then((res) => res.data),
    onSuccess: (data) => {
      toast.success("Passport Details Saved Successfully!");
    },
    onError: (error) => {
      console.log("Error Message:", error.response?.data?.msg);
      toast.error(
        error.response?.data?.msg || error.response?.data?.message || "An Error Occurred During Verification",
      );
    },
  });
};

export const usePanConfirm = () => {
  return useMutation({
    mutationFn: (payload) => api.put("/kyc/pan/confirm", payload).then((res) => res.data),
    onSuccess: (data) => {
      toast.success("PAN Details Saved Successfully!");
    },
    onError: (error) => {
      console.log("Error Message:", error.response?.data?.msg);
      toast.error(
        error.response?.data?.msg || error.response?.data?.message || "An Error Occurred During Verification",
      );
    },
  });
};

export const usePanVerify = () => {
  return useMutation({
    mutationFn: (payload) => api.post("/kyc/pan/verify", payload).then((res) => res.data),
    onSuccess: (data) => {
      toast.success("Passport Verified Successfully!");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.msg || error.response?.data?.message || "An Error Occurred During Verification",
      );
    },
  });
};
