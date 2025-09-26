import type { Metadata } from "next";
import { ReactNode } from "react";
import Sidebar from "./_content/sidebar/Sidebar";
import OrgSidebar from "./_content/org-sidebar/OrgSidebar";
import Header from "./_content/header/Header";

export const metadata: Metadata = {
  title: "Negar",
  description: "Developed by Alireza Simkesh",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <div className="flex h-[100dvh]">
      <Sidebar />
      <OrgSidebar />
      <div className="flex flex-col flex-1">
        <Header />
        {children}
      </div>
    </div>
  );
}
