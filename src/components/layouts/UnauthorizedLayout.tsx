import React from "react";
import { cn } from "@/lib/utils";

interface UnauthorizedLayoutProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  subtitle?: string;
}

export function UnauthorizedLayout({
  children,
  className,
  title = "IDRMC Portal",
  subtitle = "Welcome back. Please sign in to continue.",
}: UnauthorizedLayoutProps) {
  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center bg-muted/30 p-4 md:p-8",
        className,
      )}
    >
      <div className="w-full max-w-md">
        <div className="mb-8 text-center flex flex-col space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle && (
            <p className="text-sm text-muted-foreground">{subtitle}</p>
          )}
        </div>

        {/* The actual page content (e.g., Login Form) goes here */}
        <div className="bg-background rounded-xl border shadow-sm p-6 md:p-8">
          {children}
        </div>

        <div className="mt-8 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} IDRMC. All rights reserved.
        </div>
      </div>
    </div>
  );
}
