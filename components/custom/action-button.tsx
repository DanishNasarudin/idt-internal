import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Check,
  Loader2,
  Pencil,
  Plus,
  Save,
  Trash2,
  X,
  type LucideIcon,
} from "lucide-react";
import * as React from "react";

type ActionType =
  | "create"
  | "add"
  | "edit"
  | "delete"
  | "save"
  | "cancel"
  | "submit"
  | "confirm"
  | "custom";

const actionConfig: Record<
  Exclude<ActionType, "custom">,
  {
    icon?: LucideIcon;
    label: string;
    variant:
      | "default"
      | "destructive"
      | "outline"
      | "secondary"
      | "ghost"
      | "link";
  }
> = {
  create: {
    icon: Plus,
    label: "Create",
    variant: "default",
  },
  add: {
    icon: Plus,
    label: "Add",
    variant: "default",
  },
  edit: {
    icon: Pencil,
    label: "Edit",
    variant: "outline",
  },
  delete: {
    icon: Trash2,
    label: "Delete",
    variant: "destructive",
  },
  save: {
    icon: Save,
    label: "Save",
    variant: "default",
  },
  cancel: {
    icon: X,
    label: "Cancel",
    variant: "outline",
  },
  submit: {
    icon: Check,
    label: "Submit",
    variant: "default",
  },
  confirm: {
    icon: Check,
    label: "Confirm",
    variant: "default",
  },
};

export interface ActionButtonProps
  extends Omit<React.ComponentProps<typeof Button>, "variant"> {
  /**
   * The action type - determines the icon, label, and styling
   */
  action: ActionType;
  /**
   * Custom label to override the default action label
   */
  label?: string;
  /**
   * Whether to show the icon
   * @default true
   */
  showIcon?: boolean;
  /**
   * Custom icon to override the default action icon
   */
  icon?: LucideIcon;
  /**
   * Whether the button is in a loading state
   * @default false
   */
  isLoading?: boolean;
  /**
   * Loading text to show when isLoading is true
   */
  loadingText?: string;
  /**
   * Custom variant to override the default action variant
   */
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
  /**
   * Whether to show only the icon (no text)
   * @default false
   */
  iconOnly?: boolean;
}

export const ActionButton = React.forwardRef<
  HTMLButtonElement,
  ActionButtonProps
>(
  (
    {
      action,
      label,
      showIcon = true,
      icon,
      isLoading = false,
      loadingText,
      variant,
      iconOnly = false,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const config = action !== "custom" ? actionConfig[action] : undefined;
    const Icon = icon || config?.icon;
    const buttonLabel = label || config?.label || "";
    const buttonVariant = variant || config?.variant || "default";

    const displayText = isLoading
      ? loadingText || buttonLabel
      : children || buttonLabel;

    return (
      <Button
        ref={ref}
        variant={buttonVariant}
        className={cn(iconOnly && "px-2", className)}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            {!iconOnly && displayText}
          </>
        ) : (
          <>
            {showIcon && Icon && <Icon className="h-4 w-4" />}
            {!iconOnly && displayText}
          </>
        )}
      </Button>
    );
  }
);

ActionButton.displayName = "ActionButton";
