import Image, { type StaticImageData } from "next/image";

import { Monogram } from "@/components/brand/monogram";
import { cn } from "@/lib/utils";

type PortraitProps = {
  image?: StaticImageData;
  alt: string;
  className?: string;
};

/**
 * A 4:5 portrait that sits in black and white and warms to colour on hover.
 * Touch screens cannot hover, so they get the colour photo straight away.
 * Until a photo is supplied it renders a framed placeholder with the
 * monogram, sized exactly like the real thing so the layout does not shift
 * when the photo arrives.
 */
export function Portrait({ image, alt, className }: PortraitProps) {
  return (
    <figure
      className={cn("group relative aspect-[4/5] overflow-hidden rounded-sm bg-subtle", className)}
    >
      {image ? (
        <Image
          src={image}
          alt={alt}
          fill
          sizes="(min-width: 1024px) 30vw, 90vw"
          placeholder="blur"
          className="object-cover transition-[filter,scale] duration-1000 ease-out-expo group-hover:scale-[1.02] pointer-fine:grayscale pointer-fine:group-hover:grayscale-0"
        />
      ) : (
        <div
          role="img"
          aria-label="Portrait placeholder"
          className="absolute inset-0 flex flex-col justify-between [background-image:linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] [background-size:2.5rem_2.5rem] [background-position:-1px_-1px] p-5"
        >
          <span className="font-eyebrow text-muted">Portrait</span>
          <Monogram className="mx-auto h-auto w-2/5 text-line" />
          <span className="self-end font-eyebrow text-muted">4 : 5</span>
        </div>
      )}
    </figure>
  );
}
