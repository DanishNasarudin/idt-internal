"use client";

import { Button } from "@/components/ui/button";
import { useEffect } from "react";

type Props = {
  error: Error;
  reset: () => void;
};

export default function ClerkUsersError({ error, reset }: Props) {
  useEffect(() => {
    // Log to console so developers see the stack in dev tools
    // In production, consider sending this to a logging service
    // (Sentry, LogRocket, etc.)
    console.error("ClerkUsers segment error:", error);
  }, [error]);

  return (
    <div className="container mx-auto py-6">
      <div className="rounded-md border bg-background p-6">
        <h2 className="text-2xl font-semibold mb-2">Something went wrong</h2>
        <p className="text-sm text-muted-foreground mb-4">
          An unexpected error occurred while loading Clerk users.
        </p>
        <pre className="rounded bg-muted p-3 text-xs overflow-auto mb-4">
          {error?.message}
        </pre>
        <div className="flex gap-2">
          <Button onClick={() => reset()}>Retry</Button>
        </div>
      </div>
    </div>
  );
}
