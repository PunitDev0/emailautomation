import React from "react";
import { Inter } from "next/font/google";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Mail Automation Tool",
  description: "Professional email marketing automation platform",
};

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black text-white`}>
        <SidebarProvider defaultOpen={true}>
          <div className="flex h-screen w-screen overflow-hidden">
            {/* Sidebar (Left) */}
            <div className="w-64 bg-black border-r border-white/10">
              <AppSidebar />
            </div>

            {/* Main Content (Right) */}
            <main className="flex-1 overflow-y-auto p-4">
              <div className="w-full h-full">{children}</div>
            </main>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
}
