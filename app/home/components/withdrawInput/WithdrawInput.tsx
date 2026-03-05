"use client";

import { InputHTMLAttributes, ChangeEvent, useState, FocusEvent } from "react";

export interface WithdrawInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  valueAdapter?: (value: string) => string | number;
}

export const WithdrawInput = ({
  label,
  onChange,
  onBlur,
  valueAdapter,
  value: inputValue,
  ...inputProps
}: WithdrawInputProps) => {
  const [value, setValue] = useState(inputValue);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    const adaptedValue = valueAdapter?.(value) ?? value;

    setValue(adaptedValue);
    onChange?.(e);
  };

  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    onBlur?.({ ...e, target: { ...e.target, value: value as string } });
  };

  return (
    <div className="flex gap-y-0.5 flex-col">
      <label htmlFor="amount" className="font-medium text-sm text-white">
        {label}
      </label>

      <input
        {...inputProps}
        value={value}
        className="bg-white rounded-md text-black px-1"
        onChange={handleChange}
        onBlur={handleBlur}
      />
    </div>
  );
};
