import { navigationConfig } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import React from "react";
interface PagePlaceholderProps {
  title: string;
  moduleName: string;
}

export function PagePlaceholder({ title, moduleName }: PagePlaceholderProps) {
  const group = navigationConfig.find(g => g.name === moduleName);

  const getAccentBorder = () => {
    switch (moduleName) {
      case "Environmental": return "border-green-500/20";
      case "Social": return "border-blue-500/20";
      case "Governance": return "border-purple-500/20";
      case "Gamification": return "border-orange-500/20";
      case "Reports": return "border-amber-500/20";
      default: return "border-white/10";
    }
  };

  const getAccentText = () => {
    switch (moduleName) {
      case "Environmental": return "text-green-400";
      case "Social": return "text-blue-400";
      case "Governance": return "text-purple-400";
      case "Gamification": return "text-orange-400";
      case "Reports": return "text-amber-400";
      default: return "text-blue-400";
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Top Breadcrumb header */}
      <div className="flex items-center justify-between">
        <div>
          <span className={cn("text-xs font-semibold uppercase tracking-wider", getAccentText())}>
            {moduleName}
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mt-1">
            {title}
          </h1>
        </div>
      </div>

      {/* Main card panel */}
      <div className={cn("bg-[#141414] rounded-xl border p-8 flex flex-col items-center justify-center min-h-[350px] text-center", getAccentBorder())}>
        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4 border border-white/10">
          {group?.icon && React.createElement(group.icon, { className: cn("w-8 h-8", getAccentText()) })}
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Module Scaffolding Active</h3>
        <p className="text-sm text-gray-400 max-w-md">
          This is a placeholder page for <span className="text-white font-semibold">{title}</span> under the <span className={cn("font-semibold", getAccentText())}>{moduleName}</span> module.
          Data models, interactive forms, and analytical charts will be integrated in subsequent prompt stages.
        </p>
      </div>
    </div>
  );
}
