import RaspiBlitzLogoDark from "@/assets/RaspiBlitz_Logo_Main_Negative.svg?react";
import { Spinner } from "@heroui/react";

// Loading Screen for the initial loading of the app
export default function LoadingScreen() {
  return (
    <main className="flex h-screen w-screen flex-col items-center justify-center bg-gray-700">
      <RaspiBlitzLogoDark className="mb-5 h-12" />
      <Spinner size="lg" />
    </main>
  );
}
