import type { ReactNode } from "react";
import { AnimatePresence } from "motion/react";

export function ScreenTransition({
  reduced,
  children,
}: {
  reduced: boolean | null;
  children: ReactNode;
}) {
  // A released drag can retain Motion presence; reduced motion needs no exit wait.
  return reduced ? (
    <>{children}</>
  ) : (
    <AnimatePresence mode="wait" initial={false}>
      {children}
    </AnimatePresence>
  );
}
