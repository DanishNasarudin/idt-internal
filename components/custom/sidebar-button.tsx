"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { Button } from "../ui/button";
import TooltipWrapper from "./tooltip-wrapper";

type Props = {
  name?: string;
  id?: string;
  isIcon?: boolean;
  children?: React.ReactNode;
};

export default function SidebarButton({
  name = "default",
  id = "/",
  isIcon = false,
  children,
}: Props) {
  const pathname = usePathname();
  const isActive = useMemo(() => pathname === `${id}`, [pathname, id]);

  return (
    <TooltipWrapper content={name} side="right" disabled={!isIcon}>
      <Link href={`${id}`}>
        <Button
          variant={isActive ? "secondary" : "ghost"}
          size={isIcon ? "icon" : "default"}
          className={cn("px-2!", !isIcon && "w-full justify-start")}
        >
          {children ? children : <p className="truncate">{name}</p>}
        </Button>
      </Link>
    </TooltipWrapper>
  );
}
