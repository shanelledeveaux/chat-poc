import "./globals.css";
import { NavBar } from "./components/NavBar/NavBar";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="pb-16 bg-gray-950 text-white">
        <main className="px-4 pt-4 pb-4">{children}</main>
        <NavBar />
      </body>
    </html>
  );
}
