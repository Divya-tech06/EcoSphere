"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { navigationConfig, SidebarGroup, SidebarItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Menu, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const SidebarContext = createContext<{
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
}>({ collapsed: false, setCollapsed: () => {} });

export function ShellProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <SidebarContext.Provider value={{ collapsed, setCollapsed }}>
      <div className="flex min-h-screen bg-[#0d0d0d] text-foreground font-sans">
        {/* Sidebar Container */}
        <Sidebar />
        
        {/* Main Content Area */}
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

  // Find active group
  const activeGroup = navigationConfig.find(
    (g) => pathname === g.href || pathname.startsWith(g.href + "/")
  );

  return (
    <aside
      className={cn(
        "flex flex-col bg-[#141414] border-r border-white/10 transition-all duration-300 relative z-20",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Sidebar Header */}
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

      {/* Navigation Groups */}
      <div className="flex-1 overflow-y-auto py-4 space-y-6 px-3">
        {navigationConfig.map((group) => {
          const isGroupActive = pathname === group.href || pathname.startsWith(group.href + "/");
          const GroupIcon = group.icon;

          return (
            <div key={group.name} className="space-y-1">
              {/* Group Trigger / Title */}
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

              {/* Sub-items (only if not collapsed) */}
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

      {/* Sidebar Footer User Info */}
      <div className="p-4 border-t border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm shrink-0">
          A
        </div>
        {!collapsed && (
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-white truncate">Administrator</p>
            <p className="text-[10px] text-gray-400 truncate">admin@ecosphere.local</p>
          </div>
        )}
      </div>
    </aside>
  );
}

function TopNavBar() {
  const pathname = usePathname();

  // Find active group for the top tabs
  const activeGroup = navigationConfig.find(
    (g) => pathname === g.href || pathname.startsWith(g.href + "/")
  ) || navigationConfig[0];

  // Helper mapping for accent colors
  const getAccentBorderClass = (groupName: string) => {
    switch (groupName) {
      case "Environmental":
        return "border-green-500 text-green-500";
      case "Social":
        return "border-blue-500 text-blue-500";
      case "Governance":
        return "border-purple-500 text-purple-500";
      case "Gamification":
        return "border-orange-500 text-orange-500";
      case "Dashboard":
        return "border-blue-400 text-blue-400";
      case "Reports":
        return "border-amber-500 text-amber-500";
      default:
        return "border-white text-white";
    }
  };

  const getAccentBgClass = (groupName: string) => {
    switch (groupName) {
      case "Environmental":
        return "bg-green-500/20 text-green-400 border border-green-500/30";
      case "Social":
        return "bg-blue-500/20 text-blue-400 border border-blue-500/30";
      case "Governance":
        return "bg-purple-500/20 text-purple-400 border border-purple-500/30";
      case "Gamification":
        return "bg-orange-500/20 text-orange-400 border border-orange-500/30";
      case "Dashboard":
        return "bg-blue-400/20 text-blue-300 border border-blue-400/30";
      case "Reports":
        return "bg-amber-500/20 text-amber-400 border border-amber-500/30";
      default:
        return "bg-white/10 text-white";
    }
  };

  return (
    <header className="bg-[#141414] border-b border-white/10 flex flex-col z-10 shrink-0">
      {/* Row 1: Top Level Module Tabs */}
      <div className="flex items-center justify-between px-6 h-14 border-b border-white/5">
        <nav className="flex space-x-6 h-full items-end">
          {navigationConfig.map((group) => {
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

        {/* Top-Right Quick actions / User */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 bg-white/5 px-2.5 py-1 rounded border border-white/10">
            Local DB Mode
          </span>
        </div>
      </div>

      {/* Row 2: Module Sub-tabs (Second Level Sections) */}
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
