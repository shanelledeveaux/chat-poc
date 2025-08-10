// components/NavBar/NavBar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const items = [
  { href: "/", label: "HOME" },
  { href: "/stories", label: "STORIES" },
  { href: "/profile", label: "PROFILE" },
  { href: "/help", label: "HELP" },
];

export function NavBar() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-gray-100 border-t border-gray-300 z-50">
      <ul className="flex">
        {items.map(({ href, label }) => {
          const active = pathname === href;
          return (
            <li key={href} className="flex-1">
              <Link
                href={href}
                className={[
                  "block text-center py-3 text-xs tracking-wide",
                  active ? "font-extrabold text-gray-900" : "text-gray-600",
                ].join(" ")}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
