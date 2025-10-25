"use client";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import {
  Home,
  House,
  List,
  PanelLeftClose,
  PanelLeftOpen,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useRouter } from "next/navigation";
import { JSX } from "react";
import { useLocalStorage } from "usehooks-ts";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { LogoIcon } from "./icons";
import SidebarButton from "./sidebar-button";
import { ModeToggle } from "./theme-toggle";
import TooltipWrapper from "./tooltip-wrapper";

type Branch = {
  id: number;
  code: string;
  name: string;
};

type SidebarClientProps = {
  branches: Branch[];
};

// Icon mapping for branches - can be customized later
const getBranchIcon = (code: string): JSX.Element => {
  // You can add custom logic here to map codes to specific icons
  return <House />;
};

export default function SidebarClient({ branches }: SidebarClientProps) {
  const [open, setOpen] = useLocalStorage<boolean>("ui.sidebarOpen", false);
  const router = useRouter();

  return (
    <motion.div
      animate={String(open)}
      variants={{
        true: { width: 200 },
        false: { width: 0 },
      }}
      initial={String(open)}
      className="hidden md:flex flex-col max-w-[200px] min-w-min min-h-screen h-full w-full border-r bg-background overflow-y-auto overflow-x-hidden sticky top-0"
    >
      <div className="flex flex-col top-0 bg-background">
        <div className="flex justify-end p-2 z-[1] relative">
          <div
            data-state={open}
            className="absolute left-2 -translate-y-1/2 top-1/2 data-[state=false]:animate-out data-[state=false]:fade-out-0 data-[state=false]:pointer-events-none"
          >
            <TooltipWrapper content="Back to main">
              <Button
                size={"icon"}
                variant={"ghost"}
                onClick={() => router.push("https://app.idealtech.com.my")}
              >
                <LogoIcon />
              </Button>
            </TooltipWrapper>
          </div>
          <TooltipWrapper content={open ? "Close sidebar" : "Open sidebar"}>
            <Button
              variant={"ghost"}
              size="icon"
              onClick={() => setOpen((prev) => !prev)}
              className="group z-[1]"
            >
              {open ? (
                <PanelLeftClose />
              ) : (
                <>
                  <PanelLeftOpen className="group-hover:block hidden" />
                  <LogoIcon className="group-hover:hidden" />
                </>
              )}
            </Button>
          </TooltipWrapper>
        </div>
        <div className="flex flex-col p-2 gap-1">
          <SidebarButton id="/" isIcon={!open} name={"Home"}>
            <Home />{" "}
            {open && (
              <p
                data-state={open}
                className={cn(
                  "animate-in fade-in-0 data-[state=false]:animate-out data-[state=false]:fade-out-0"
                )}
              >
                Home
              </p>
            )}
          </SidebarButton>
        </div>
      </div>
      <Separator />
      <div className="h-full p-2 gap-1 flex flex-col">
        <SidebarButton
          id="/public-navbar"
          isIcon={!open}
          name={"Public Navbar"}
        >
          <List />{" "}
          {open && (
            <p
              data-state={open}
              className={cn(
                "animate-in fade-in-0 data-[state=false]:animate-out data-[state=false]:fade-out-0"
              )}
            >
              Public Navbar
            </p>
          )}
        </SidebarButton>
        <SidebarButton id="/clerk-users" isIcon={!open} name={"Clerk Users"}>
          <Users />{" "}
          {open && (
            <p
              data-state={open}
              className={cn(
                "animate-in fade-in-0 data-[state=false]:animate-out data-[state=false]:fade-out-0"
              )}
            >
              Clerk Users
            </p>
          )}
        </SidebarButton>
      </div>
      <div className="flex-1"></div>
      <div className="sticky bottom-0 p-2 w-full bg-background flex flex-wrap gap-2 border-border text-no">
        <ModeToggle />
        <UserButton
          {...(open && { showName: true })}
          appearance={{
            elements: {
              userButtonTrigger: `h-9! inline-flex! items-center! justify-center! rounded-md! border! border-foreground/10! dark:border-foreground/20! bg-background! dark:bg-foreground/5! hover:bg-foreground/6! dark:hover:bg-foreground/8! transition! ${
                open ? "px-2!" : " w-9!"
              }`,
              userButtonBox: "flex-row-reverse!",
              userButtonOuterIdentifier: "text-nowrap! truncate! max-w-[84px]!",
            },
          }}
        />
      </div>
    </motion.div>
  );
}
