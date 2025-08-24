"use client";
import { LogOut } from "lucide-react";
import { signOut } from "next-auth/react";

interface LogoutButtonProps {
  className?: string; // Optional prop for custom styling  e.g. "w-16 h-16" or "text-xl"
}
export default function LogoutButton({ className }: LogoutButtonProps) {
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Sign-out failed:", error);
    }
  };
  return (
    <button
      type="button"
      onClick={handleSignOut}
      className={`w-full flex gap-1  text-default-700 text-base capitalize px-[10px] items-center font-medium py-2 rounded cursor-pointer hover:bg-primary hover:text-default-100 ${className}`}
    >
      <LogOut size={16} />
      Logout
    </button>
  );
}
