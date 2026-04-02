"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";

export function BrandLogo({
  className,
  imageClassName,
}: {
  className?: string;
  imageClassName?: string;
}) {
  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-xl border border-border/60 bg-white shadow-sm",
        className,
      )}
    >
      <Image
        src="/Logo-me.jpg"
        alt="LocalPay logo"
        fill
        priority
        className={cn("object-cover", imageClassName)}
        sizes="64px"
      />
    </div>
  );
}
