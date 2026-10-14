"use client";

import type { ReactNode } from "react";
import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BookOpenIcon,
  ClipboardCheckIcon,
  CreditCardIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  LoaderCircle,
} from "lucide-react";

import { cn } from "cn";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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

interface RailItem {
  id: string;
  label: string;
  href: string;
  icon: ReactNode;
  badge?: number;
}

const NAV: RailItem[] = [
  {
    id: "student",
    label: "Dashboard",
    href: "/student",
    icon: <LayoutDashboardIcon aria-hidden="true" />,
  },
  {
    id: "documentRequest",
    label: "Document Request",
    href: "/student/documentRequest",
    icon: <FileTextIcon aria-hidden="true" />,
  },
  {
    id: "grade",
    label: "Grades & Subjects",
    href: "/student/grade",
    icon: <BookOpenIcon aria-hidden="true" />,
  },
  {
    id: "clearance",
    label: "Clearance",
    href: "/student/clearance",
    icon: <ClipboardCheckIcon aria-hidden="true" />,
  },
  {
    id: "payments",
    label: "Payments",
    href: "/student/payments",
    icon: <CreditCardIcon aria-hidden="true" />,
  },
];

function RailNav() {
  const pathname = usePathname();
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [pendingNavigation, setPendingNavigation] = useState<{
    href: string;
    fromPathname: string;
  } | null>(null);

  function handleNavigate(href: string) {
    if (href === pathname || isPending) return;

    setPendingNavigation({ href, fromPathname: pathname });

    startTransition(() => {
      router.push(href);
    });
  }

  return (
    <SidebarGroup className="space-y-6 px-3 py-4">
      <SidebarGroupContent>
        <SidebarMenu className="space-y-2">
          {NAV.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/student" &&
                pathname.startsWith(`${item.href}/`));

            const isLoading =
              isPending &&
              pendingNavigation?.fromPathname === pathname &&
              pendingNavigation.href === item.href;

            return (
              <SidebarMenuItem key={item.id}>
                <SidebarMenuButton
                  render={
                    <button
                      type="button"
                      onClick={() => handleNavigate(item.href)}
                      aria-label={item.label}
                      aria-current={isActive ? "page" : undefined}
                      aria-busy={isLoading}
                      disabled={isPending}
                    />
                  }
                  isActive={isActive}
                  tooltip={item.label}
                  className={cn(
                    "h-11 rounded-lg px-3 text-md font-medium",
                    "transition-colors duration-200",
                    "text-white/80 hover:bg-white/15 hover:text-white cursor-pointer",
                    "data-[active=true]:bg-white",
                    "data-[active=true]:text-[#0f4526]",
                    "data-[active=true]:font-semibold",
                    "disabled:cursor-wait disabled:opacity-70",
                  )}
                >
                  {isLoading ? (
                    <LoaderCircle
                      className="size-5 shrink-0 animate-spin"
                      aria-hidden="true"
                    />
                  ) : (
                    item.icon
                  )}

                  <span>{item.label}</span>
                </SidebarMenuButton>

                {item.badge ? (
                  <SidebarMenuBadge
                    className={cn(
                      "right-3 rounded-full px-2 text-xs",
                      "bg-white/10 text-white",
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
      <h1
        aria-label="CayoTech SSIS"
        className={cn(
          "flex w-full min-w-0 items-center gap-3",
          "rounded-lg p-2 transition-colors",
          "hover:bg-white/10",
        )}
      >
        <span
          className={cn(
            "flex size-10 shrink-0 items-center justify-center",
            "rounded-full bg-green-600 text-sm font-bold text-white",
            "xl:size-12 xl:text-base",
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
      </h1>
    </div>
  );
}

function AccountButton() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <SidebarMenuButton
          size="lg"
          tooltip="Michael Jordan"
          className="text-white hover:bg-white/10 hover:text-white"
          render={
            <button
              type="button"
              className="cursor-pointer"
              aria-label="Michael Jordan, Student"
            />
          }
        >
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" alt="" />
            <AvatarFallback>MJ</AvatarFallback>
          </Avatar>

          <span className="grid min-w-0 flex-1 text-left leading-tight group-data-[collapsible=icon]:sr-only">
            <span className="truncate text-sm font-medium text-white">
              Michael Jordan
            </span>
            <span className="truncate text-xs text-white/70">
              Student
            </span>
          </span>
        </SidebarMenuButton>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

interface PatternProps {
  children: ReactNode;
}

export default function Pattern({ children }: PatternProps) {
  return (
    <SidebarProvider className="relative flex h-dvh min-h-0 w-full overflow-hidden">
      <Sidebar
        collapsible="icon"
        className={cn(
          "h-full bg-[#0f4526] text-white",
          "[&[data-sidebar=sidebar]]:bg-[#0f4526]",
          "[&[data-sidebar=sidebar]]:text-white",
        )}
      >
        <SidebarHeader className="bg-[#0f4526] text-white">
          <BrandButton />
        </SidebarHeader>

        <SidebarContent
          role="navigation"
          aria-label="Primary"
          className="bg-[#0f4526] text-white"
        >
          <RailNav />
        </SidebarContent>

        <SidebarFooter className="bg-[#0f4526] text-white">
          <AccountButton />
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      <SidebarInset className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <header
          className={cn(
            "flex h-14 shrink-0 items-center gap-3",
            "border-b border-green-900/20 bg-[#0f4526] px-4",
            "text-white md:hidden",
          )}
        >
          <SidebarTrigger
            aria-label="Toggle sidebar"
            className="text-white hover:bg-white/15 hover:text-white"
          />
          <span className="text-sm font-semibold">
            CayoTech SSIS
          </span>
        </header>

        <main className="relative min-h-0 min-w-0 flex-1 overflow-auto">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}