"use client";

import { menuSection } from "@/lib/content";
import { useModals } from "./ModalProvider";

/**
 * Opens the ORDER ONLINE pop-up. Pass `locationId` to land on that row.
 *
 * `variant` exists because the same control appears on two grounds. Yellow is
 * the blueprint's pill on purple; on the cream location cards a yellow pill has
 * almost no separation from the card, so those use the purple pill, which is
 * the pairing the blueprint itself uses for ORDER CATERING on cream.
 */
export function OrderOnlineButton({
  className = "",
  locationId,
  label = menuSection.orderCta,
  variant = "yellow",
}: {
  className?: string;
  locationId?: string;
  label?: string;
  variant?: "yellow" | "purple";
}) {
  const { openOrder } = useModals();
  return (
    <button
      type="button"
      onClick={() => openOrder(locationId)}
      className={
        variant === "purple"
          ? `btn btn-purple ${className}`
          : `btn btn-yellow sheen sheen-hover ${className}`
      }
    >
      {label}
    </button>
  );
}

/** Opens the CHECK OUT OUR MENU pop-up. */
export function CheckMenuButton({ className = "" }: { className?: string }) {
  const { openMenu } = useModals();
  return (
    <button
      type="button"
      onClick={openMenu}
      className={`btn btn-yellow sheen sheen-hover ${className}`}
    >
      {menuSection.menuCta}
    </button>
  );
}
