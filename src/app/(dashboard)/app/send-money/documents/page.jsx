"use client";

import AppPage from "@/app/components/AppPage";
import { useSendMoneyForm } from "@/store/form.store";
import { ProgressStepper } from "../ProgressStepper";
import DocumentUploadForm from "./DocumentUploadForm";

const Page = () => {
  // const user = useAuthStore((state) => state.user);
  const remitter = useSendMoneyForm((state) => state.remitter);
  return (
    <div>
      <AppPage title="Recipient">
        {/* Progress indicator */}
        <ProgressStepper activeStep={3} />
        <DocumentUploadForm _id={remitter?._id} />
      </AppPage>
    </div>
  );
};

export default Page;
