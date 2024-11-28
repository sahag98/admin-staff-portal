import { cn } from "@/lib/utils";
import { NotepadTextDashed } from "lucide-react";

// components/SkeletonLoader.tsx
export default function TemplateLoader({ icon }: { icon: any }) {
  return (
    <div
      className={cn(
        `w-full flex flex-col items-center gap-2 justify-center mt-3 h-80 bg-gray-100 rounded-lg animate-pulse`
      )}
    >
      {icon}
      <h3 className="text-lg font-semibold">Loading...</h3>
    </div>
  );
}
