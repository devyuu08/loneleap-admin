import Link from "next/link";
import { cn } from "@/lib/shared/utils";

export default function SidebarMenuItem({
  href,
  label,
  icon: Icon,
  isActive,
  isSidebarOpen,
}) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center px-3 py-2 rounded-md transition-colors duration-200",
        isActive
          ? "bg-gray-900 text-white font-semibold"
          : "text-gray-700 hover:bg-gray-100"
      )}
    >
      <Icon size={20} className="shrink-0" />
      <div
        className={cn(
          "ml-2 origin-left transition-all duration-200",
          isSidebarOpen
            ? "scale-x-100 opacity-100 visible"
            : "scale-x-0 opacity-0 invisible"
        )}
      >
        <span className="inline-block whitespace-nowrap">{label}</span>
      </div>
    </Link>
  );
}
