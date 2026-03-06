"use client";

import AppPage from "@/app/components/AppPage";
import { useAuthStore } from "@/store/auth.store";
import { useSendMoneyForm } from "@/store/form.store";
import { useEffect } from "react";
import { ProgressStepper } from "./ProgressStepper";
import SendMoneyForm from "./SendMoneyForm";

const Page = () => {
  const currentUser = useAuthStore((s) => s.user);
  const { remitter, setRemitter, clearForm } = useSendMoneyForm((s) => s);

  useEffect(() => {
    if (!remitter) return;
    clearForm();
  }, []);

  useEffect(() => {
    if (currentUser?.role === "STUDENT") setRemitter(currentUser);
  }, [currentUser]);

  const activeStep = remitter ? 1 : 0;

  return (
    <div>
      <AppPage title="Send Money">
        {/* Progress indicator */}
        <ProgressStepper activeStep={activeStep} />
        {/* form */}
        <SendMoneyForm />
      </AppPage>
    </div>
  );
};

export default Page;
