"use client";

import { useEffect, useState, useRef } from "react";

type Props = {
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
  editable?: boolean;
};

const STORAGE_KEY = "tp_avatar";

export default function Avatar({
  name,
  size = "md",
  editable = false,
}: Props) {
  const [image, setImage] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // بارگذاری تصویر ذخیره‌شده
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) setImage(saved);
    } catch {
      // ignore
    }
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

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = String(reader.result);
      setImage(dataUrl);
      try {
        localStorage.setItem(STORAGE_KEY, dataUrl);
      } catch {
        // ignore
      }
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="relative inline-block">
      <div
        className={`${sizeClasses} flex items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-violet-300 to-pink-300 font-bold text-white shadow-raised`}
      >
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          <span>{firstLetter}</span>
        )}
      </div>

      {editable && (
        <>
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            className="absolute -bottom-1 -left-1 flex h-7 w-7 items-center justify-center rounded-full bg-ios-blue text-xs text-white shadow-ios-blue"
            aria-label="تغییر تصویر"
          >
            ✎
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="hidden"
          />
        </>
      )}
    </div>
  );
}
