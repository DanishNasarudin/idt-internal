import { FileText, LayoutDashboard, Settings } from "lucide-react";

export default function Home() {
  const navigationCards = [
    {
      title: "Dashboard",
      description: "View warranty cases and manage your workflow",
      icon: LayoutDashboard,
      href: "/dashboard",
      color: "text-blue-600 dark:text-blue-400",
    },
    {
      title: "Warranty Cases",
      description: "Create and manage warranty cases",
      icon: FileText,
      href: "/dashboard",
      color: "text-green-600 dark:text-green-400",
    },
    // {
    //   title: "Branch Management",
    //   description: "View and manage branch information",
    //   icon: Building2,
    //   href: "/branch",
    //   color: "text-purple-600 dark:text-purple-400",
    // },
    {
      title: "Settings",
      description: "Configure branches, staff, and system settings",
      icon: Settings,
      href: "/settings",
      color: "text-orange-600 dark:text-orange-400",
    },
  ];

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Internal Management System
        </h1>
        <p className="text-muted-foreground">
          Welcome to Ideal Tech PC Internal Management.
        </p>
      </div>
    </div>
  );
}
