import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AzureAutoLab",
  description: "AZ-104 Hands-On Lab Dashboard",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-bg-primary text-text-primary min-h-screen">
        {children}
      </body>
    </html>
  );
}
