import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSendMoneyForm = create(
  persist(
    (set) => ({
      // state
      inProgress: false,
      activeStep: 0,
      user: null, // user is the remiiter in context to send money feature
      transaction: null,
      recipeint: null,
      remitter: null,
      formData: null,

      // methods
      setFormData: (data) =>
        set({
          formData: data,
        }),

      setUser: (data) =>
        set({
          user: data,
          remitter: data,
        }),

      setTransaction: (data) =>
        set({
          transaction: data,
        }),

      setRemitter: (data) =>
        set({
          user: data,
          remitter: data,
          inProgress: true,
        }),

      setRecipient: (data) =>
        set({
          recipeint: data,
        }),

      setActiveStep: (step) =>
        set({
          activeStep: step,
        }),

      clearForm: () =>
        set({
          transaction: null,
          user: null,
          remitter: null,
          formData: null,
          recipeint: null,
          activeStep: 0,
        }),
    }),
    {
      name: "send-money-form",
      skipHydration: false,
    },
  ),
);
