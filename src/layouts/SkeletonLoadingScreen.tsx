import LoadingSpinner from "@/components/LoadingSpinner/LoadingSpinner";

// Loading Screen when sidebar is visible but not usable
export default function SkeletonLoadingScreen() {
  return (
    <>
      <header className="fixed top-0 z-10 mx-auto flex h-16 w-full items-center justify-between border-b border-gray-300 px-8 shadow-md transition-colors bg-gray-800 text-gray-300"></header>
      <nav className="content-container fixed mb-16 hidden w-full flex-col justify-between px-2 pt-8 shadow-lg transition-colors bg-gray-800 md:flex md:w-2/12"></nav>
      <main className="content-container page-container flex items-center justify-center bg-gray-700">
        <LoadingSpinner color="text-yellow-500" />
      </main>
    </>
  );
}
