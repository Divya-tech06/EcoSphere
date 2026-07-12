import { 
  LayoutDashboard, 
  Leaf, 
  Users, 
  Scale, 
  Gamepad2, 
  FileText, 
  Settings as SettingsIcon,
  ChevronLeft,
  ChevronRight,
  Menu,
  LineChart,
  Boxes,
  Coins,
  Target,
  HeartHandshake,
  UserCheck,
  Building2,
  FileCheck,
  ShieldCheck,
  ClipboardList,
  AlertTriangle,
  Trophy,
  Flame,
  Award,
  Gift,
  ListOrdered
} from "lucide-react";

export type SidebarItem = {
  name: string;
  href: string;
  icon?: any;
};

export type SidebarGroup = {
  name: string;
  href: string; // Base href for the module
  accentColor: string; // hex or Tailwind color class
  icon: any;
  items: SidebarItem[];
};

export const navigationConfig: SidebarGroup[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    accentColor: "text-blue-400",
    icon: LayoutDashboard,
    items: []
  },
  {
    name: "Environmental",
    href: "/environmental",
    accentColor: "text-green-500",
    icon: Leaf,
    items: [
      { name: "Emission Factors", href: "/environmental/emission-factors", icon: LineChart },
      { name: "Product ESG Profiles", href: "/environmental/product-esg-profiles", icon: Boxes },
      { name: "Carbon Transactions", href: "/environmental/carbon-transactions", icon: Coins },
      { name: "Environmental Goals", href: "/environmental/goals", icon: Target }
    ]
  },
  {
    name: "Social",
    href: "/social",
    accentColor: "text-blue-500",
    icon: Users,
    items: [
      { name: "CSR Activities", href: "/social/csr-activities", icon: HeartHandshake },
      { name: "Employee Participation", href: "/social/employee-participation", icon: UserCheck },
      { name: "Diversity Dashboard", href: "/social/diversity-dashboard", icon: Building2 }
    ]
  },
  {
    name: "Governance",
    href: "/governance",
    accentColor: "text-purple-500",
    icon: Scale,
    items: [
      { name: "Policies", href: "/governance/policies", icon: FileCheck },
      { name: "Policy Acknowledgements", href: "/governance/acknowledgements", icon: ShieldCheck },
      { name: "Audits", href: "/governance/audits", icon: ClipboardList },
      { name: "Compliance Issues", href: "/governance/compliance-issues", icon: AlertTriangle }
    ]
  },
  {
    name: "Gamification",
    href: "/gamification",
    accentColor: "text-orange-500",
    icon: Gamepad2,
    items: [
      { name: "Challenges", href: "/gamification/challenges", icon: Trophy },
      { name: "Challenge Participation", href: "/gamification/participation", icon: Flame },
      { name: "Badges", href: "/gamification/badges", icon: Award },
      { name: "Rewards", href: "/gamification/rewards", icon: Gift },
      { name: "Leaderboard", href: "/gamification/leaderboard", icon: ListOrdered }
    ]
  },
  {
    name: "Reports",
    href: "/reports",
    accentColor: "text-amber-500",
    icon: FileText,
    items: [
      { name: "Environmental Report", href: "/reports/environmental", icon: Leaf },
      { name: "Social Report", href: "/reports/social", icon: Users },
      { name: "Governance Report", href: "/reports/governance", icon: Scale },
      { name: "ESG Summary", href: "/reports/esg-summary", icon: LayoutDashboard },
      { name: "Custom Report Builder", href: "/reports/custom-builder", icon: FileText }
    ]
  },
  {
    name: "Settings",
    href: "/settings",
    accentColor: "text-gray-400",
    icon: SettingsIcon,
    items: [
      { name: "Departments", href: "/settings/departments" },
      { name: "Categories", href: "/settings/categories" },
      { name: "ESG Configuration", href: "/settings/esg-config" },
      { name: "Notification Settings", href: "/settings/notifications" }
    ]
  }
];
