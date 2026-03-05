"use client";
import { ButtonHTMLAttributes } from "react";

interface WithdrawButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  text: string;
  loading?: boolean;
}

export const WithdrawButton = ({
  text,
  loading,
  ...props
}: WithdrawButtonProps) => {
  return (
    <button
      className="flex justify-center gap-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-1 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-blue-500"
      {...props}
    >
      {text}

      {loading && (
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
      )}
    </button>
  );
};
