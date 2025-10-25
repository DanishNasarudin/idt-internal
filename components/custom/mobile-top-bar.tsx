"use client";
import { UserButton } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { LogoIcon } from "./icons";
import { ModeToggle } from "./theme-toggle";

export default function MobileTopBar() {
  const router = useRouter();
  return (
    <div className="fixed top-0 left-0 right-0 bg-background/95 backdrop-blur-sm border-b border-border z-40 md:hidden">
      <div
        className="flex items-center justify-between px-4 py-2"
        style={{
          paddingTop: "max(0.5rem, env(safe-area-inset-top))",
          paddingLeft: "max(1rem, env(safe-area-inset-left))",
          paddingRight: "max(1rem, env(safe-area-inset-right))",
        }}
      >
        <Button
          size="sm"
          variant="nothing"
          onClick={() => router.push("https://app.idealtech.com.my")}
          className="p-0!"
        >
          <LogoIcon className="size-9" />
        </Button>
        <div className="flex items-center gap-2">
          <ModeToggle />
          <UserButton
            appearance={{
              elements: {
                userButtonTrigger:
                  "size-9! inline-flex! items-center! justify-center! rounded-md! border! border-foreground/10! dark:border-foreground/20! bg-background! dark:bg-foreground/5! hover:bg-foreground/6! dark:hover:bg-foreground/8! transition!",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
