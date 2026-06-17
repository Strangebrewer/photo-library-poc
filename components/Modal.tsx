"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";

type ModalProps = {
  close?: () => void;
  children: React.ReactNode;
  closeOnOutsideClick?: boolean;
};

export default function Modal({
  close,
  children,
  closeOnOutsideClick = true,
}: ModalProps) {
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close?.();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [close]);

  function onClickBackdrop(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget && closeOnOutsideClick) close?.();
  }

  return createPortal(
    <div
      className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
      onClick={onClickBackdrop}
    >
      <button
        onClick={close}
        className="absolute top-4 right-4 text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.8)] cursor-pointer"
        aria-label="Close"
      >
        <svg
          className="h-7 w-7"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
      {children}
    </div>,
    document.body,
  );
}
