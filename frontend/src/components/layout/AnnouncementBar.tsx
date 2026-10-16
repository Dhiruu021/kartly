"use client";

import React from "react";
import Link from "next/link";
import { Sparkles, Truck, RotateCcw } from "lucide-react";

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-ink text-canvas text-[11px] sm:text-xs py-2 px-4 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between font-mono tracking-tight">
        <div className="hidden md:flex items-center gap-2 text-canvas/70">
          <Sparkles className="size-3 text-butter" />
          <span>Calm objects for slow homes</span>
        </div>

        <div className="mx-auto md:mx-0 flex items-center gap-3 text-center">
          <span className="flex items-center gap-1.5 font-medium">
            <Truck className="size-3.5 text-sage" />
            Solid oak, bouclé & hand-thrown clay · Dispatched in 48 hours
          </span>
          <span className="hidden sm:inline text-canvas/40">|</span>
          <span className="hidden sm:inline text-canvas/80">
            Worldwide express delivery · Free over ₹1,999
          </span>
        </div>

        <div className="hidden lg:flex items-center gap-4 text-canvas/70">
          <Link href="/shop" className="hover:text-canvas transition-colors">
            Explore 2026 Collection →
          </Link>
        </div>
      </div>
    </div>
  );
};
