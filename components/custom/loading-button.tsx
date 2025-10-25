import { Button } from "@/components/ui/button";
import { Loader2, type LucideIcon } from "lucide-react";
import * as React from "react";

export interface LoadingButtonProps
  extends React.ComponentProps<typeof Button> {
  /**
   * Whether the button is in a loading state
   */
  isLoading: boolean;
  /**
   * Text to display when loading
   */
  loadingText?: string;
  /**
   * Icon to display when not loading
   */
  icon?: LucideIcon;
  /**
   * Whether to show the icon
   * @default true
   */
  showIcon?: boolean;
}

/**
 * LoadingButton - A button component with built-in loading state
 * Automatically disables the button and shows a spinner when loading
 */
export const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  LoadingButtonProps
>(
  (
    {
      isLoading,
      loadingText,
      icon: Icon,
      showIcon = true,
      children,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <Button
        ref={ref}
        disabled={disabled || isLoading}
        className={className}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingText || children}
          </>
        ) : (
          <>
            {showIcon && Icon && <Icon className="h-4 w-4" />}
            {children}
          </>
        )}
      </Button>
    );
  }
);

LoadingButton.displayName = "LoadingButton";
