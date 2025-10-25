import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { type LucideIcon } from "lucide-react";
import * as React from "react";

export interface IconButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "size"> {
  /**
   * The icon to display
   */
  icon: LucideIcon;
  /**
   * The size of the button
   * @default "default"
   */
  size?: "sm" | "default" | "lg";
  /**
   * Screen reader label for accessibility
   */
  label: string;
}

/**
 * IconButton - A button component that displays only an icon
 * Ideal for toolbar actions, table row actions, etc.
 */
export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ icon: Icon, size = "default", label, className, ...props }, ref) => {
    const sizeClasses = {
      sm: "size-8",
      default: "size-9",
      lg: "size-10",
    };

    const iconSizeClasses = {
      sm: "h-3.5 w-3.5",
      default: "h-4 w-4",
      lg: "h-5 w-5",
    };

    return (
      <Button
        ref={ref}
        size="icon"
        className={cn(sizeClasses[size], className)}
        aria-label={label}
        title={label}
        {...props}
      >
        <Icon className={iconSizeClasses[size]} />
      </Button>
    );
  }
);

IconButton.displayName = "IconButton";
