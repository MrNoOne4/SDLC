"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "cn";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import {
  LayoutDashboardIcon,
  FileTextIcon,
  BookOpenIcon,
  ClipboardCheckIcon,
  CreditCardIcon,
} from "lucide-react";

interface RailItem {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
}

const NAV: RailItem[] = [
  {
    id: "Dashboard",
    label: "Dashboard",
    href: "/dashboard",
    icon: <LayoutDashboardIcon aria-hidden="true" />,
  },
  {
    id: "DocumentRequest",
    label: "Document Request",
    href: "/dashboard/DocumentRequest",
    badge: 12,
    icon: <FileTextIcon aria-hidden="true" />,
  },
  {
    id: "Grades&Subjects",
    label: "Grades & Subjects",
    href: "/dashboard/Grades&Subjects",
    icon: <BookOpenIcon aria-hidden="true" />,
  },
  {
    id: "Clearance",
    label: "Clearance",
    href: "/dashboard/Clearance",
    icon: <ClipboardCheckIcon aria-hidden="true" />,
  },
  {
    id: "Payments",
    label: "Payments",
    href: "/dashboard/Payments",
    icon: <CreditCardIcon aria-hidden="true" />,
  },
];

function RailNav() {
  const pathname = usePathname();

  return (
    <SidebarGroup className="space-y-6 px-3 py-4">
      <SidebarGroupContent>
        <SidebarMenu className="space-y-2">
          {NAV.map((item) => {
            const isActive =
              pathname === item.href 
            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  render={
                    <Link
                      href={item.href}
                      aria-label={item.label}
                      aria-current={isActive ? "page" : undefined}
                    />
                  }
                  isActive={isActive}
                  tooltip={item.label}
                  className={cn(
                    "h-11 rounded-lg px-3 text-sm font-medium",
                    "transition-all duration-200",
                    "text-white/80",
                    "hover:bg-white/50 hover:text-white",
                    "data-[active=true]:bg-white",
                    "data-[active=true]:text-[#0f4526]",
                    "data-[active=true]:font-semibold"
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </SidebarMenuButton>

                {item.badge ? (
                  <SidebarMenuBadge
                    className={cn(
                      "right-3 rounded-full px-2 text-xs",
                      "bg-white/10 text-white",
                      "group-hover/menu-item:bg-[#0f4526]/10",
                      "group-hover/menu-item:text-[#0f4526]"
                    )}
                  >
                    {item.badge}
                  </SidebarMenuBadge>
                ) : null}
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function BrandButton() {
  return (
    <div className="w-full min-w-0 px-2 py-3">
      <Link
        href="/dashboard"
        aria-label="CayoTech SSIS"
        className={cn(
          "flex w-full min-w-0 items-center gap-3",
          "rounded-lg p-2 transition-colors",
          "hover:bg-white/10"
        )}
      >
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center",
            "rounded-full bg-green-600 text-sm font-bold text-white",
            "xl:size-12 xl:text-base"
          )}
          aria-hidden="true"
        >
          UC
        </span>

        <span className="grid min-w-0 flex-1 leading-tight group-data-[collapsible=icon]:hidden">
          <span className="truncate text-sm font-bold text-white">
            CayoTech SSIS
          </span>

          <span className="mt-1 line-clamp-2 text-xs text-white/60">
            Student Portal
          </span>
        </span>
      </Link>
    </div>
  );
}

function AccountButton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          tooltip="Nadia Rahman"
          render={
            <button
              type="button"
              aria-label="Nadia Rahman, Owner"
            />
          }
        >
          <Avatar>
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt=""
            />
            <AvatarFallback>NR</AvatarFallback>
          </Avatar>

          <span className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:sr-only">
            <span className="truncate text-sm font-medium">
              Nadia Rahman
            </span>

            <span className="truncate text-xs text-white/70">
              Owner
            </span>
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

export default function Pattern() {
  return (
    <SidebarProvider className="relative h-dvh min-h-0 w-full overflow-hidden">
      <Sidebar
        collapsible="icon"
        className={cn(
          "absolute h-full bg-[#0f4526] text-white",
          "[&_[data-sidebar=sidebar]]:bg-[#0f4526]",
          "[&_[data-sidebar=sidebar]]:text-white"
        )}
      >
        <SidebarHeader>
          <BrandButton />
        </SidebarHeader>

        <SidebarContent
          role="navigation"
          aria-label="Primary"
        >
          <RailNav />
        </SidebarContent>

        <SidebarFooter>
          <AccountButton />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset className="min-w-0 overflow-hidden">
        <header
          className={cn(
            "mt-6 h-12 shrink-0 items-center gap-2",
            "border-b px-3 md:hidden"
          )}
        >
          <SidebarTrigger aria-label="Toggle sidebar" />
        </header>

        {/* Render your current page content here. */}
      </SidebarInset>
    </SidebarProvider>
  );
}