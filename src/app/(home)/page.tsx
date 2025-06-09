import BusinessForm from "../components/business-form";
import { auth } from "@clerk/nextjs/server";

export default function Home() {
  // auth.protect();
  return (
    <div className="flex items-center justify-center w-full">
      <BusinessForm />
    </div>
  );
}
