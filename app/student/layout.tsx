import type { ReactNode } from "react";
import SideBar from "@/components/sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return <SideBar>{children}</SideBar>;
}