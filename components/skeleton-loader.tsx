import { cn } from "@/lib/utils";

// components/SkeletonLoader.tsx
export default function SkeletonLoader() {
  return (
    <div
      className={cn(`w-full mt-3 h-44 bg-gray-100 rounded-lg animate-pulse`)}
    />
  );
}
