"use client";

import AppPage from "@/app/components/AppPage";
import { useAuthStore } from "@/store/auth.store";

import RemitterDetail from "./RemitterDetail";
import { ProgressStepper } from "../ProgressStepper";
import { useSendMoneyForm } from "@/store/form.store";

const Page = () => {
  return (
    <div>
      <AppPage title="Remitter">
        {/* Progress indicator */}
        <ProgressStepper activeStep={2} />
        <RemitterDetail />
      </AppPage>
    </div>
  );
};

export default Page;
