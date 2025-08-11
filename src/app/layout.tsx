import "./globals.css";
import { NavBar } from "./components/NavBar/NavBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-950 text-white h-screen">
        <main className="px-4 pt-4 pb-14 h-full">{children}</main>
        <NavBar />
      </body>
    </html>
  );
}
