import type { ComponentProps } from "react";

import { cn } from "@/lib/utils";

/** Full-bleed content area with the same gutters as the header. */
export function Container({ className, ...props }: ComponentProps<"div">) {
  return (
    <div
      className={cn("mx-auto w-full max-w-[100rem] px-5 sm:px-8 lg:px-12", className)}
      {...props}
    />
  );
}
