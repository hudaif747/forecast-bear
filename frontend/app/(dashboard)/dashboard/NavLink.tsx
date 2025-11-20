"use client";

import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<LinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;
  children?: ReactNode;
}

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  ({ className, activeClassName, pendingClassName, href, ...props }, ref) => {
    const pathname = usePathname();
    const hrefString = typeof href === "string" ? href : href.pathname || "";
    const isActive = 
      hrefString === "/dashboard" 
        ? pathname === "/dashboard"
        : pathname?.startsWith(hrefString);

    return (
      <Link
        className={cn(
          className,
          isActive && activeClassName,
          pendingClassName
        )}
        href={href}
        ref={ref}
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };
