"use client";

export interface RailArrowProps {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
  label: string;
  tone?: "yellow" | "purple";
  /** Placement only. The button's own size and colour live here. */
  className?: string;
}

/**
 * The blueprint's yellow chevron-pair arrow, shared by the two rails.
 *
 * On the Locations rail the blueprint puts it beside the cards at mid-height
 * (Lessons 20). It draws only the Previous arrow, on the purple ground; a rail
 * needs both, and the Next one lands over the cream card that bleeds off the
 * right edge, where yellow on cream is a 1.2:1 fill and reads as damage rather
 * than a control. So the yellow pair sits on a purple disc: invisible against
 * the purple pattern, where the blueprint's own arrow lives, and an unmistakable
 * control against a card. Yellow on purple is 8:1.
 */
export default function RailArrow({
  direction,
  onClick,
  disabled,
  label,
  tone = "yellow",
  className = "",
}: RailArrowProps) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={[
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition",
        tone === "yellow" ? "bg-purple text-yellow lg:h-14 lg:w-14" : "text-magenta",
        "hover:scale-110 disabled:cursor-default disabled:opacity-35 disabled:hover:scale-100",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={[
          tone === "yellow" ? "h-[26px] w-[26px] lg:h-9 lg:w-9" : "h-[30px] w-[30px]",
          isPrev ? "" : "rotate-180",
        ].join(" ")}
      >
        <path
          d="M13 5.5 6.5 12l6.5 6.5M19 5.5 12.5 12l6.5 6.5"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}
