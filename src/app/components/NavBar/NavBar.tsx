"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function NavBar() {
  const pathname = usePathname();

  const linkBase = "flex-1 text-center py-3 transition-colors duration-200";
  const active = "bg-gray-800 text-white font-semibold";
  const inactive = "bg-gray-900 text-gray-400 hover:text-white";

  return (
    <nav className="fixed bottom-0 left-0 w-full flex border-t border-gray-700 bg-gray-900 z-50">
      <Link
        href="/"
        className={`${linkBase} ${pathname === "/" ? active : inactive}`}
      >
        Home
      </Link>
      <Link
        href="/chat"
        className={`${linkBase} ${pathname === "/chat" ? active : inactive}`}
      >
        Chat
      </Link>
      <Link
        href="/profile"
        className={`${linkBase} ${pathname === "/profile" ? active : inactive}`}
      >
        Profile
      </Link>
    </nav>
  );
}
