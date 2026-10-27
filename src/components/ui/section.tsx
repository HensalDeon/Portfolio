import type { ComponentProps } from "react";

import { Container } from "@/components/ui/container";
import type { SectionId } from "@/content/nav";
import { cn } from "@/lib/utils";

type SectionProps = Omit<ComponentProps<"section">, "id"> & {
  id: SectionId;
  containerClassName?: string;
};

export function Section({ id, className, containerClassName, children, ...props }: SectionProps) {
  return (
    <section id={id} className={cn("py-24 sm:py-36", className)} {...props}>
      <Container className={containerClassName}>{children}</Container>
    </section>
  );
}
