import "./globals.css";
import { NavBar } from "./components/NavBar/NavBar";
import { Suspense } from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white h-screen">
        <Suspense>
          <main className="px-4 pt-4 pb-14 h-full">{children}</main>
        </Suspense>
        <NavBar />
      </body>
    </html>
  );
}
