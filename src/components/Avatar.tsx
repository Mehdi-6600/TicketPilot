"use client";

import { useEffect, useState } from "react";

type Props = {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
};

const AVATAR_KEY = "tp_avatar";

export default function Avatar({ name, size = "md" }: Props) {
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    function load() {
      try {
        const saved = localStorage.getItem(AVATAR_KEY);
        if (saved) setImage(saved);
        else setImage(null);
      } catch {
        // ignore
      }
    }
    load();

    function onStorage(e: StorageEvent) {
      if (e.key === AVATAR_KEY) load();
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const sizeClasses =
    size === "sm"
      ? "h-11 w-11 text-lg"
      : size === "xl"
        ? "h-24 w-24 text-4xl"
        : size === "lg"
          ? "h-20 w-20 text-3xl"
          : "h-14 w-14 text-xl";

  const firstLetter = name.trim().charAt(0) || "؟";

  return (
    <div
      className={`${sizeClasses} relative flex items-center justify-center overflow-hidden rounded-full border border-white/80 bg-plush-blue font-bold text-white shadow-plush transition-all duration-200`}
    >
      <span
        className="pointer-events-none absolute inset-0 rounded-full"
        style={{
          boxShadow:
            "inset 0 2px 6px rgba(255,255,255,0.55), inset 0 -3px 8px rgba(15,27,61,0.18)",
        }}
      />
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={image}
          alt={name}
          className="relative h-full w-full object-cover"
        />
      ) : (
        <span className="relative">{firstLetter}</span>
      )}
    </div>
  );
}
