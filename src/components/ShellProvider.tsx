"use client";

import React, { createContext, useContext, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationConfig } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, LogOut, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const SidebarContext = createContext<{
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}>({ collapsed: false, setCollapsed: () => {} });

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const { data: session } = useSession();

  // Do not render shell wrapper on login page
  const pathname = usePathname();
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="flex min-h-screen bg-[#0d0d0d] text-foreground font-sans">
        <Sidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <TopNavBar />
          <main className="flex-1 p-6 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarContext.Provider>
  );
}

function Sidebar() {
  const { collapsed, setCollapsed } = useContext(SidebarContext);
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "EMPLOYEE";

  return (
    <aside
      className={cn(
        "flex flex-col bg-[#141414] border-r border-white/10 transition-all duration-300 relative z-20",
        collapsed ? "w-16" : "w-64"
      )}
    >
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/10">
        {!collapsed && (
          <Link href="/dashboard" className="flex items-center gap-2 font-bold text-xl tracking-tight text-white">
            <span className="text-green-500">Eco</span>
            <span>sphere</span>
          </Link>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-gray-400 hover:text-white hover:bg-white/5 ml-auto"
        >
          {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-6 px-3">
        {navigationConfig.map((group) => {
          // Hide settings module for non-admins
          if (group.name === "Settings" && userRole !== "ADMIN") {
            return null;
          }

          const isGroupActive = pathname === group.href || pathname.startsWith(group.href + "/");
          const GroupIcon = group.icon;

          return (
            <div key={group.name} className="space-y-1">
              <Link
                href={group.items.length > 0 ? group.items[0].href : group.href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all group",
                  isGroupActive
                    ? "bg-white/10 text-white font-semibold"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                <GroupIcon
                  size={20}
                  className={cn(
                    "shrink-0 transition-transform group-hover:scale-110",
                    isGroupActive ? group.accentColor : "text-gray-400"
                  )}
                />
                {!collapsed && <span>{group.name}</span>}
              </Link>

              {!collapsed && group.items.length > 0 && isGroupActive && (
                <div className="ml-4 pl-4 border-l border-white/5 space-y-1 mt-1">
                  {group.items.map((subItem) => {
                    const isSubActive = pathname === subItem.href;
                    const SubIcon = subItem.icon;
                    return (
                      <Link
                        key={subItem.name}
                        href={subItem.href}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-md text-xs font-medium transition-all",
                          isSubActive
                            ? "text-white bg-white/5 font-semibold"
                            : "text-gray-500 hover:text-white hover:bg-white/5"
                        )}
                      >
                        {SubIcon && (
                          <SubIcon
                            size={14}
                            className={cn(isSubActive ? group.accentColor : "text-gray-500")}
                          />
                        )}
                        <span>{subItem.name}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {session?.user && (
        <div className="p-4 border-t border-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
            {session.user.name?.[0] || session.user.email?.[0].toUpperCase()}
          </div>
          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold text-white truncate">{session.user.name}</p>
              <p className="text-[10px] text-gray-400 truncate uppercase tracking-wider font-bold">
                {userRole}
              </p>
            </div>
          )}
        </div>
      )}
    </aside>
  );
}

function TopNavBar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.role || "EMPLOYEE";

  const activeGroup = navigationConfig.find(
    (g) => pathname === g.href || pathname.startsWith(g.href + "/")
  ) || navigationConfig[0];

  const getAccentBorderClass = (groupName: string) => {
    switch (groupName) {
      case "Environmental": return "border-green-500 text-green-500";
      case "Social": return "border-blue-500 text-blue-500";
      case "Governance": return "border-purple-500 text-purple-500";
      case "Gamification": return "border-orange-500 text-orange-500";
      case "Dashboard": return "border-blue-400 text-blue-400";
      case "Reports": return "border-amber-500 text-amber-500";
      default: return "border-white text-white";
    }
  };

  const getAccentBgClass = (groupName: string) => {
    switch (groupName) {
      case "Environmental": return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "Social": return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "Governance": return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
      case "Gamification": return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
      case "Dashboard": return "bg-blue-400/20 text-blue-300 border border-blue-400/30";
      case "Reports": return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
      default: return "bg-white/10 text-white";
    }
  };

  return (
    <header className="bg-[#141414] border-b border-white/10 flex flex-col z-10 shrink-0">
      <div className="flex items-center justify-between px-6 h-14 border-b border-white/5">
        <nav className="flex space-x-6 h-full items-end">
          {navigationConfig.map((group) => {
            if (group.name === "Settings" && userRole !== "ADMIN") {
              return null;
            }

            const isGroupActive = pathname === group.href || pathname.startsWith(group.href + "/");
            const targetHref = group.items.length > 0 ? group.items[0].href : group.href;

            return (
              <Link
                key={group.name}
                href={targetHref}
                className={cn(
                  "pb-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all",
                  isGroupActive
                    ? getAccentBorderClass(group.name)
                    : "border-transparent text-gray-400 hover:text-white"
                )}
              >
                {group.name}
              </Link>
            );
          })}
        </nav>

        {/* User drop menu */}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 hover:bg-white/5 px-3 py-1.5 rounded-lg border border-white/10 transition-colors">
              <span className="w-5 h-5 rounded-full bg-green-500/20 text-green-400 flex items-center justify-center text-xs font-bold uppercase">
                {session?.user?.name?.[0] || "U"}
              </span>
              <span className="text-xs text-white hidden md:inline font-medium">
                {session?.user?.name || session?.user?.email}
              </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-[#141414] border border-white/10 text-white w-56">
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold">{session?.user?.name}</p>
                  <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="text-xs focus:bg-white/5 cursor-pointer">
                Role: <span className="text-green-400 font-bold ml-1">{userRole}</span>
              </DropdownMenuItem>
              {userRole === "APPROVER" && (
                <DropdownMenuItem className="text-xs text-blue-400 focus:bg-white/5 cursor-pointer">
                  Approval Queue Access Active
                </DropdownMenuItem>
              )}
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="text-xs text-red-400 focus:bg-white/5 cursor-pointer flex items-center gap-2"
              >
                <LogOut size={14} />
                <span>Log Out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {activeGroup.items.length > 0 && (
        <div className="flex items-center px-6 h-12 bg-[#181818]/60 overflow-x-auto gap-2">
          {activeGroup.items.map((subItem) => {
            const isSubActive = pathname === subItem.href;
            return (
              <Link
                key={subItem.name}
                href={subItem.href}
                className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0",
                  isSubActive
                    ? getAccentBgClass(activeGroup.name)
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                )}
              >
                {subItem.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}
