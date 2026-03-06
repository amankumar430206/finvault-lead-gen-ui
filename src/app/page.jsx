import { redirect } from "next/navigation";
import React from "react";

const Page = () => {
  return redirect("/login");
};

export default Page;
