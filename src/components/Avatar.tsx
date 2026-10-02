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
      className={`${sizeClasses} flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-300 to-pink-300 font-bold text-white shadow-raised`}
    >
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={image} alt={name} className="h-full w-full object-cover" />
      ) : (
        <span>{firstLetter}</span>
      )}
    </div>
  );
}
