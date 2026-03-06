"use client";

import AppPage from "@/app/components/AppPage";
import { useSendMoneyForm } from "@/store/form.store";
import { ProgressStepper } from "../ProgressStepper";
import RecipeintForm from "./RecipientForm";

const Page = () => {
  // const user = useAuthStore((state) => state.user);
  const user = useSendMoneyForm((state) => state.user);
  return (
    <div>
      <AppPage title="Recipient">
        {/* Progress indicator */}
        <ProgressStepper activeStep={3} />
        <RecipeintForm _id={user?._id} />
      </AppPage>
    </div>
  );
};

export default Page;
