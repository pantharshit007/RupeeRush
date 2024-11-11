import { LuLoader2 } from "react-icons/lu";

function LoadingState() {
  return (
    <div className="h-full w-full flex items-center justify-center">
      <LuLoader2 className="h-8 w-8 animate-spin text-primary text-white" />
      <span className="sr-only">Loading</span>
    </div>
  );
}

export default LoadingState;
