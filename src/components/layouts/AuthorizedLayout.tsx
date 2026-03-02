import React from "react";
import { cn } from "@/lib/utils";

interface AuthorizedLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthorizedLayout({
  children,
  className,
}: AuthorizedLayoutProps) {
  return (
    <div
      className={cn("flex h-screen bg-background text-foreground", className)}
    >
      {/* Sidebar / Navigation */}
      <aside className="w-64 border-r bg-muted/10 hidden md:flex md:flex-col">
        <div className="flex h-16 items-center px-6 border-b font-semibold tracking-tight">
          IDRMC Dashboard
        </div>
        <nav className="p-4 space-y-1">
          {/* Navigation Links */}
          <div className="px-3 py-2 text-sm font-medium rounded-md bg-secondary text-secondary-foreground cursor-pointer transition-colors">
            Dashboard
          </div>
          <div className="px-3 py-2 text-sm font-medium rounded-md hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
            Settings
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b flex items-center px-6 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="font-semibold md:hidden">IDRMC</div>
          <div className="ml-auto flex items-center space-x-4">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium text-sm">
              AD
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-auto p-6 md:p-8">
          <div className="mx-auto max-w-6xl">{children}</div>
        </div>
      </main>
    </div>
  );
}
