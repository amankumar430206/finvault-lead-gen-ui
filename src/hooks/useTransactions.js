"use client";

import toast from "react-hot-toast";

import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import { useSendMoneyForm } from "@/store/form.store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { getQueryParams } from "@/lib/api-utils";
import { useRouter } from "next/navigation";

export const useTransactions = ({ query = {}, params = {}, payload = {} }) => {
  const user = useAuthStore((s) => s.user);
  return useQuery({
    queryKey: ["transactions", user?._id],
    queryFn: (data) => api.post("/transactions" + getQueryParams(query), payload).then((res) => res.data),
  });
};

export const useCreateTransaction = () => {
  const { setTransaction, setUser, setFormData } = useSendMoneyForm((s) => s);
  const user = useAuthStore((s) => s.user);

  return useMutation({
    mutationFn: (data) => api.post("/transaction/create" + getQueryParams(), data).then((res) => res.data),
    onSuccess: (data) => {
      toast.success("Transaction intiated successfully!");
      setTransaction(data.content);
      return data;
    },
    onError: (error) => {
      console.log("Error Message:", error.response?.data?.msg);
      toast.error(error.response?.data?.msg || error.response?.data?.message || "An Error Occurred While Processing");
    },
  });
};

export const useCancelTransaction = () => {
  const { setTransaction } = useSendMoneyForm((s) => s);

  return useMutation({
    mutationFn: (id) => api.delete(`/transaction/${id}/cancel`).then((res) => res.data),
    onSuccess: (data) => {
      toast.success("Transaction cancelled successfully!");
      setTransaction(null);
      return data;
    },
    onError: (error) => {
      console.log("Error Message:", error.response?.data?.msg);
      toast.error(error.response?.data?.msg || error.response?.data?.message || "An Error Occurred While Processing");
    },
  });
};
