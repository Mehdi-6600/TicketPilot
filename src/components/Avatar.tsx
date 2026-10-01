"use client";

import { useState, useRef } from "react";

type Props = {
  name: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg";
  editable?: boolean;
  onUpload?: (dataUrl: string) => void;
};

export default function Avatar({
  name,
  imageUrl,
  size = "md",
  editable = false,
  onUpload,
}: Props) {
  const [preview, setPreview] = useState<string | null>(imageUrl ?? null);
  const fileRef = useRef<HTMLInputElement>(null);

  const sizeClasses =
    size === "sm"
      ? "h-10 w-10 text-base"
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
      setPreview(dataUrl);
      onUpload?.(dataUrl);
    };
    reader.readAsDataURL(file);
  }

  return (
    <div className="relative inline-block">
      <div
        className={`${sizeClasses} flex items-center justify-center overflow-hidden rounded-full border-2 border-white bg-gradient-to-br from-violet-300 to-pink-300 font-bold text-white shadow-soft`}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
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
            className="absolute -bottom-1 -left-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-white bg-ios-blue text-xs text-white shadow-soft"
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
