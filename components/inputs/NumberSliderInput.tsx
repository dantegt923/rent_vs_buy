"use client";

import { useEffect, useId, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface NumberSliderInputProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
  format?: "currency" | "percent" | "number";
  suffix?: string;
  description?: string;
  className?: string;
}

const INPUT_DEBOUNCE_MS = 50;

export function NumberSliderInput({
  label,
  value,
  min,
  max,
  step,
  onChange,
  format = "number",
  suffix,
  description,
  className,
}: NumberSliderInputProps) {
  const id = useId();
  const onChangeRef = useRef(onChange);
  const [draftValue, setDraftValue] = useState(formatDraftValue(value, step));
  const [isEditingNumber, setIsEditingNumber] = useState(false);
  const sliderValue = clampToRange(value, min, max);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    setDraftValue(formatDraftValue(value, step));
  }, [step, value]);

  useEffect(() => {
    if (!isEditingNumber) {
      return;
    }

    const numericValue = Number(draftValue);

    if (!Number.isFinite(numericValue)) {
      return;
    }

    const clamped = clampToRange(numericValue, min, max);

    if (clamped === sliderValue) {
      return;
    }

    const timeout = window.setTimeout(() => {
      onChangeRef.current(clamped);
    }, INPUT_DEBOUNCE_MS);

    return () => window.clearTimeout(timeout);
  }, [draftValue, isEditingNumber, max, min, sliderValue]);

  const commitDraftValue = () => {
    const numericValue = Number(draftValue);

    if (!Number.isFinite(numericValue)) {
      setDraftValue(formatDraftValue(sliderValue, step));
      return;
    }

    const clamped = clampToRange(numericValue, min, max);

    if (clamped !== sliderValue) {
      onChangeRef.current(clamped);
    }

    setDraftValue(formatDraftValue(clamped, step));
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-[0.12em]" htmlFor={id}>
            {label}
          </label>
          {description ? (
            <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
          ) : null}
        </div>
        <div className="flex items-center rounded-sm border border-primary/15 bg-background/45 px-2 py-1 shadow-inner">
          {format === "currency" ? (
            <span className="text-sm text-muted-foreground">$</span>
          ) : null}
          <input
            id={id}
            className="w-24 bg-transparent text-right text-sm font-bold tabular-nums outline-none"
            inputMode="decimal"
            type="number"
            min={min}
            max={max}
            step={step}
            value={draftValue}
            onFocus={() => setIsEditingNumber(true)}
            onBlur={() => {
              commitDraftValue();
              setIsEditingNumber(false);
            }}
            onChange={(event) => setDraftValue(event.target.value)}
          />
          {format === "percent" ? (
            <span className="pl-1 text-sm text-muted-foreground">%</span>
          ) : null}
          {suffix ? (
            <span className="pl-1 text-sm text-muted-foreground">{suffix}</span>
          ) : null}
        </div>
      </div>
      <input
        aria-label={`${label} slider`}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-none bg-secondary accent-primary"
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={(event) => {
          const next = clampToRange(Number(event.target.value), min, max);
          onChangeRef.current(next);
          setDraftValue(formatDraftValue(next, step));
        }}
      />
      <div className="flex justify-between text-[11px] tabular-nums text-muted-foreground">
        <span>{formatTick(min, format, suffix)}</span>
        <span>{formatTick(max, format, suffix)}</span>
      </div>
      <p className="text-[10px] font-bold uppercase tracking-[0.28em] text-primary/80">
        Source: Manual
      </p>
    </div>
  );
}

function clampToRange(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function formatDraftValue(value: number, step: number): string {
  const decimals = decimalPlaces(step);
  if (decimals === 0) {
    return String(Math.round(value));
  }

  return value
    .toFixed(decimals)
    .replace(/(\.\d*?)0+$/, "$1")
    .replace(/\.$/, "");
}

function decimalPlaces(value: number): number {
  const [, decimals = ""] = String(value).split(".");
  return decimals.length;
}

function formatTick(
  value: number,
  format: NonNullable<NumberSliderInputProps["format"]>,
  suffix: string | undefined,
): string {
  if (format === "currency") {
    return `$${value.toLocaleString()}`;
  }

  if (format === "percent") {
    return `${value}%`;
  }

  return `${value.toLocaleString()}${suffix ? ` ${suffix}` : ""}`;
}
