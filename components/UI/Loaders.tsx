import { ArrowPathIcon } from "@heroicons/react/24/solid";

export const LoaderLarge = () => (
  <div className="text-2xl italic flex justify-center items-center py-32 text-zinc-400">
    <ArrowPathIcon className="animate-spin h-8 w-8 mr-3" />
    <span>Loading...</span>
  </div>
);
