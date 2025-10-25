"use client";
import { cn } from "@/lib/utils";
import {
  ChevronUp,
  Home,
  House,
  LayoutDashboard,
  Settings,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { JSX, useMemo, useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

type Branch = {
  id: number;
  code: string;
  name: string;
};

type SidebarMobileProps = {
  branches: Branch[];
};

// Icon mapping for branches - can be customized later
const getBranchIcon = (code: string): JSX.Element => {
  // You can add custom logic here to map codes to specific icons
  return <House className="h-4 w-4" />;
};

export default function SidebarMobile({ branches }: SidebarMobileProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Check if current path is a branch path
  const currentBranch = useMemo(() => {
    const branchMatch = (pathname ?? "").match(/^\/branch\/(\d+)/);
    if (branchMatch) {
      const branchId = parseInt(branchMatch[1]);
      return branches.find((branch) => branch.id === branchId);
    }
    return null;
  }, [pathname, branches]);

  // Navigation items for the bottom bar
  const navItems = [
    {
      id: "/",
      name: "Home",
      icon: <Home className="h-5 w-5" />,
      isActive: pathname === "/",
    },
    {
      id: "/dashboard",
      name: "Dashboard",
      icon: <LayoutDashboard className="h-5 w-5" />,
      isActive: pathname === "/dashboard",
    },
    {
      id: "/settings",
      name: "Settings",
      icon: <Settings className="h-5 w-5" />,
      isActive: pathname === "/settings",
    },
  ];

  return (
    <div
      className="fixed bottom-0 left-0 right-0 bg-background border-t border-border z-50 md:hidden"
      style={{
        paddingBottom: "max(0.5rem, env(safe-area-inset-bottom))",
        paddingLeft: "max(0px, env(safe-area-inset-left))",
        paddingRight: "max(0px, env(safe-area-inset-right))",
      }}
    >
      <div className="flex items-center justify-center px-4 py-2">
        {/* Logo/Home button */}
        {/* <Button
          size="sm"
          variant="ghost"
          onClick={() => router.push("https://app.idealtech.com.my")}
          className="p-2"
        >
          <LogoIcon className="h-5 w-5" />
        </Button> */}

        {/* Navigation items */}
        <div className="flex items-center gap-1">
          {navItems.map((item, idx) => (
            <Button
              key={idx}
              size="sm"
              variant={item.isActive ? "secondary" : "ghost"}
              onClick={() => router.push(item.id)}
              className="flex flex-col gap-1 h-auto py-2 px-3"
            >
              {item.icon}
              <span className="text-xs">{item.name}</span>
            </Button>
          ))}

          {/* Branch dropdown */}
          {branches.length > 0 && (
            <DropdownMenu
              open={isDropdownOpen}
              onOpenChange={setIsDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <Button
                  size="sm"
                  variant={currentBranch ? "secondary" : "ghost"}
                  className="flex flex-col gap-1 h-auto py-2 px-3"
                >
                  <div className="flex items-center gap-1">
                    <House className="h-4 w-4" />
                    <ChevronUp
                      className={cn(
                        "h-3 w-3 transition-transform",
                        isDropdownOpen ? "rotate-180" : ""
                      )}
                    />
                  </div>
                  <span className="text-xs truncate max-w-16">
                    {currentBranch ? currentBranch.name : "Branch"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="top"
                className="w-48 max-h-60 overflow-y-auto"
              >
                {branches.map((branch, bidx) => (
                  <DropdownMenuItem
                    key={bidx}
                    onClick={() => {
                      router.push(`/branch/${branch.id}`);
                      setIsDropdownOpen(false);
                    }}
                    className={cn(
                      "flex items-center gap-2",
                      currentBranch?.id === branch.id && "bg-secondary"
                    )}
                  >
                    {getBranchIcon(branch.code)}
                    <span className="truncate">{branch.name}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Empty space to balance the layout */}
        {/* <div className="w-10"></div> */}
      </div>
    </div>
  );
}
