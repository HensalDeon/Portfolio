import type { ReactNode } from "react";

import { SplitLines } from "@/components/ui/split-lines";

type SectionTitleProps = {
  index: string;
  title: string;
  /** Short line beside the title on wide screens, below it on narrow ones. */
  note?: ReactNode;
};

/** Numbered, oversized section title in the condensed display cut. */
export function SectionTitle({ index, title, note }: SectionTitleProps) {
  return (
    <div className="flex flex-col gap-6 border-b border-line pb-8 lg:flex-row lg:items-end lg:justify-between">
      <div className="flex flex-col items-start gap-2 sm:flex-row sm:gap-4">
        <span className="font-eyebrow text-muted tabular-nums sm:mt-[0.6em]">({index})</span>
        <SplitLines as="h2" text={title} className="font-display text-[clamp(3.5rem,15vw,15rem)]" />
      </div>
      {note ? (
        <p className="max-w-sm text-base leading-relaxed text-muted lg:pb-3 lg:text-right">
          {note}
        </p>
      ) : null}
    </div>
  );
}
