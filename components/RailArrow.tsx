"use client";

/**
 * The blueprint's yellow chevron-pair arrow, shared by the two rails. Drawn
 * with a purple keyline under the yellow so it survives both the purple and the
 * cream ground without a second colour token.
 */
export default function RailArrow({
  direction,
  onClick,
  disabled,
  label,
  tone = "yellow",
}: {
  direction: "prev" | "next";
  onClick: () => void;
  disabled: boolean;
  label: string;
  tone?: "yellow" | "purple";
}) {
  const isPrev = direction === "prev";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className={[
        "flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition",
        tone === "yellow" ? "text-yellow" : "text-magenta",
        "hover:scale-110 disabled:cursor-default disabled:opacity-35 disabled:hover:scale-100",
      ].join(" ")}
    >
      <svg
        width="30"
        height="30"
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={isPrev ? "" : "rotate-180"}
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
