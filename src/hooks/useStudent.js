"use client";

import { getQueryParams } from "@/lib/api-utils";
import { api } from "@/lib/axios";
import { useAuthStore } from "@/store/auth.store";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export const useCreateStudent = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: (data) => api.post("/users/create/student", data).then((res) => res.data),
    onSuccess: (data) => {
      toast.success("Student created successfully!");
      router.push("/login");
    },
    onError: (error) => {
      console.log("Error Message:", error.response?.data?.msg);
      toast.error(
        error.response?.data?.msg || error.response?.data?.message || "An Error Occurred During Registration",
      );
    },
  });
};

export const useStudents = ({ query = {}, params = {}, payload = {} }) => {
  return useQuery({
    queryKey: ["user", query],
    queryFn: async () => {
      const { data } = await api.post(`/users` + getQueryParams(query));
      return data;
    },
  });
};

export const useGetUserById = ({ query = {}, params = {}, payload = {} }) => {
  return useQuery({
    queryKey: ["user", query, params],
    queryFn: async () => {
      const { data } = await api.get(`/users/${params?._id}` + getQueryParams(query));
      return data;
    },
    enabled: !!params?._id,
  });
};
