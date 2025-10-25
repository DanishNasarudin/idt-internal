import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

export default function TooltipWrapper({
  children,
  content,
  disabled = false,
  alwaysOpen = false,
  side,
  align,
}: {
  children: React.ReactNode;
  content: string;
  disabled?: boolean;
  alwaysOpen?: boolean;
  side?: "top" | "right" | "bottom" | "left";
  align?: "center" | "start" | "end";
}) {
  return (
    <TooltipProvider>
      <Tooltip
        {...(alwaysOpen && !disabled && { defaultOpen: true, open: true })}
        {...(disabled && { defaultOpen: false, open: false })}
        delayDuration={200}
      >
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent
          {...(side && { side })}
          className={cn("text-foreground bg-background! border")}
          classNameArrow={"bg-background fill-background border-border"}
          side={side}
          align={align}
        >
          <p>{content}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
