"use client";

import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type MouseEvent,
} from "react";
import { createPortal } from "react-dom";

interface InfoTooltipProps {
  text: string;
}

interface TooltipCoords {
  top: number;
  left: number;
  placement: "right" | "bottom";
}

export function InfoTooltip({ text }: InfoTooltipProps) {
  const [open, setOpen] = useState(false);
  const [useHover, setUseHover] = useState(true);
  const [coords, setCoords] = useState<TooltipCoords>({
    top: 0,
    left: 0,
    placement: "right",
  });
  const triggerRef = useRef<HTMLButtonElement>(null);
  const tooltipId = useId();

  useEffect(() => {
    const media = window.matchMedia("(hover: hover) and (pointer: fine)");
    const updateMode = () => setUseHover(media.matches);
    updateMode();
    media.addEventListener("change", updateMode);
    return () => media.removeEventListener("change", updateMode);
  }, []);

  const updatePosition = useCallback(() => {
    const trigger = triggerRef.current;
    if (!trigger) {
      return;
    }

    const rect = trigger.getBoundingClientRect();
    const tooltipWidth = 288;
    const tooltipHeight = 120;
    const gap = 10;
    const viewportPadding = 12;
    const placeRight =
      rect.right + gap + tooltipWidth <= window.innerWidth - viewportPadding;

    if (placeRight) {
      setCoords({
        top: Math.min(
          Math.max(viewportPadding + tooltipHeight / 2, rect.top + rect.height / 2),
          window.innerHeight - viewportPadding - tooltipHeight / 2,
        ),
        left: rect.right + gap,
        placement: "right",
      });
      return;
    }

    setCoords({
      top: rect.bottom + gap,
      left: Math.max(
        viewportPadding,
        Math.min(rect.left, window.innerWidth - tooltipWidth - viewportPadding),
      ),
      placement: "bottom",
    });
  }, []);

  const show = () => {
    updatePosition();
    setOpen(true);
  };

  const hide = () => setOpen(false);

  const toggle = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setOpen((current) => {
      if (current) {
        return false;
      }
      updatePosition();
      return true;
    });
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    updatePosition();

    const closeOnOutsideClick = (event: Event) => {
      const target = event.target;
      if (
        target instanceof Node &&
        !triggerRef.current?.contains(target) &&
        !(target instanceof Element && target.closest("[data-info-tooltip]"))
      ) {
        setOpen(false);
      }
    };

    window.addEventListener("scroll", updatePosition, true);
    window.addEventListener("resize", updatePosition);
    document.addEventListener("pointerdown", closeOnOutsideClick);

    return () => {
      window.removeEventListener("scroll", updatePosition, true);
      window.removeEventListener("resize", updatePosition);
      document.removeEventListener("pointerdown", closeOnOutsideClick);
    };
  }, [open, updatePosition]);

  return (
    <>
      <button
        ref={triggerRef}
        aria-describedby={open ? tooltipId : undefined}
        aria-expanded={open}
        aria-label="More information"
        className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-primary/30 text-[10px] font-bold text-primary transition hover:border-primary hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40"
        onClick={useHover ? undefined : toggle}
        onFocus={useHover ? show : undefined}
        onBlur={useHover ? hide : undefined}
        onMouseEnter={useHover ? show : undefined}
        onMouseLeave={useHover ? hide : undefined}
        type="button"
      >
        ?
      </button>
      {open && typeof document !== "undefined"
        ? createPortal(
            <div
              className="pointer-events-none fixed z-[100] w-72 max-w-[calc(100vw-24px)] rounded-sm border border-primary/25 bg-card p-3 text-xs font-normal normal-case leading-relaxed tracking-normal text-muted-foreground shadow-[0_0_28px_hsl(var(--primary)/0.16)]"
              data-info-tooltip
              id={tooltipId}
              role="tooltip"
              style={{
                top: coords.top,
                left: coords.left,
                transform:
                  coords.placement === "right"
                    ? "translateY(-50%)"
                    : undefined,
              }}
            >
              {text}
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
