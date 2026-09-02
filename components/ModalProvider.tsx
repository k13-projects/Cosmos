"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { menuPopup, orderPopup } from "@/lib/content";
import Modal from "./Modal";
import OrderPanel from "./OrderPanel";
import MenuPanel from "./MenuPanel";

type Ctx = {
  /** Opens the ORDER ONLINE pop-up. Pass a location id to highlight that row. */
  openOrder: (locationId?: string) => void;
  /** Opens the CHECK OUT OUR MENU pop-up. */
  openMenu: () => void;
};

const ModalCtx = createContext<Ctx | null>(null);

export function useModals() {
  const ctx = useContext(ModalCtx);
  if (!ctx) throw new Error("useModals must be used inside <ModalProvider>");
  return ctx;
}

/**
 * Holds the two pop-ups the blueprint calls for (facts SS5):
 *   CHECK OUT OUR MENU -> the menu grid
 *   ORDER ONLINE       -> per-location Toast / DoorDash links
 *
 * A location card's own Order button passes its id, so a guest who is already
 * looking at Little Italy lands on the Little Italy row rather than hunting for
 * it in a list of five.
 */
export default function ModalProvider({ children }: { children: React.ReactNode }) {
  const [order, setOrder] = useState(false);
  const [menu, setMenu] = useState(false);
  const [focusLocation, setFocusLocation] = useState<string | undefined>(undefined);

  const openOrder = useCallback((locationId?: string) => {
    setFocusLocation(locationId);
    setOrder(true);
  }, []);

  const openMenu = useCallback(() => setMenu(true), []);

  const value = useMemo<Ctx>(() => ({ openOrder, openMenu }), [openOrder, openMenu]);

  return (
    <ModalCtx.Provider value={value}>
      {children}

      <Modal
        open={order}
        onClose={() => setOrder(false)}
        title={orderPopup.title}
        subtitle={orderPopup.subtitle}
      >
        <OrderPanel focusLocation={focusLocation} />
      </Modal>

      <Modal
        open={menu}
        onClose={() => setMenu(false)}
        title={menuPopup.title}
        subtitle={menuPopup.subtitle}
        size="lg"
      >
        <MenuPanel
          onOrder={() => {
            setMenu(false);
            openOrder();
          }}
        />
      </Modal>
    </ModalCtx.Provider>
  );
}
