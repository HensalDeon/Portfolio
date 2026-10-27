import Image, { type StaticImageData } from "next/image";

import { Parallax } from "@/components/ui/parallax";
import { cn } from "@/lib/utils";

type ProjectCoverProps = {
  image: StaticImageData;
  alt: string;
  /** Backdrop colour behind the framed screenshot. */
  tint: string;
  sizes: string;
  /** Load immediately at high priority; for a cover that is above the fold. */
  eager?: boolean;
  /** Drift the screenshot inside its frame while scrolling. */
  parallax?: boolean;
  className?: string;
};

/**
 * A project screenshot framed on a tinted backdrop. Showing the capture at
 * its own aspect ratio, inset from the edges, keeps it sharp (the source
 * images are 1200px wide) and uncropped, and the tint gives every project a
 * colour of its own. Hover zoom keys off a `group` ancestor.
 */
export function ProjectCover({
  image,
  alt,
  tint,
  sizes,
  eager,
  parallax = false,
  className,
}: ProjectCoverProps) {
  const shot = (
    <Image
      src={image}
      alt={alt}
      sizes={sizes}
      loading={eager ? "eager" : undefined}
      fetchPriority={eager ? "high" : undefined}
      className="h-auto w-full rounded-[3px] shadow-[0_30px_60px_-20px_rgb(0_0_0/0.45)] transition-transform duration-1000 ease-out-expo group-hover:scale-[1.03]"
    />
  );

  return (
    <figure
      className={cn(
        "relative flex aspect-[16/10] items-center justify-center overflow-hidden rounded-sm",
        className,
      )}
      style={{ backgroundColor: tint }}
    >
      <div className="w-[84%]">
        {parallax ? <Parallax range={[18, -18]}>{shot}</Parallax> : shot}
      </div>
    </figure>
  );
}
