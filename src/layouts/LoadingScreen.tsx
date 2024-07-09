import LoadingSpinner from "../components/LoadingSpinner/LoadingSpinner";
import RaspiBlitzLogoDark from "@/assets/RaspiBlitz_Logo_Main_Negative.svg?react";

// Loading Screen for the initial loading of the app
export default function LoadingScreen() {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-gray-700">
      <RaspiBlitzLogoDark className="mb-5 h-12" />
      <LoadingSpinner color="text-yellow-500" />
    </main>
  );
}
