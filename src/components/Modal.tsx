import { useEffect, useRef, type ReactNode } from "react";
import { motion, useDragControls, useReducedMotion } from "motion/react";
import { X } from "lucide-react";

export function Modal({
  children,
  onClose,
  title,
}: {
  children: ReactNode;
  onClose: () => void;
  title: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const reduced = useReducedMotion();
  const dragControls = useDragControls();
  useEffect(() => {
    const previous = document.activeElement as HTMLElement;
    root.current?.querySelector<HTMLButtonElement>("button")?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeRef.current();
      if (event.key === "Tab") {
        const focusables = [
          ...(root.current?.querySelectorAll<HTMLElement>(
            'button, a[href], input, [tabindex="0"]',
          ) ?? []),
        ];
        const first = focusables[0],
          last = focusables.at(-1);
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, []);
  return (
    <motion.div
      className="modal-backdrop"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        ref={root}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="bottom-sheet"
        initial={{ y: reduced ? 0 : "100%" }}
        animate={{ y: 0 }}
        exit={{ y: reduced ? 0 : "100%" }}
        transition={{ type: "spring", stiffness: 320, damping: 32 }}
        onClick={(e) => e.stopPropagation()}
        drag="y"
        dragControls={dragControls}
        dragListener={false}
        dragConstraints={{ top: 0, bottom: 0 }}
        dragElastic={{ top: 0, bottom: 0.5 }}
        onDragEnd={(_, info) => {
          if (info.offset.y > 80) onClose();
        }}
      >
        <div
          className="sheet-drag-area"
          onPointerDown={(event) => dragControls.start(event)}
        >
          <div className="sheet-grip" />
        </div>
        <button
          className="icon-button sheet-close"
          aria-label="閉じる"
          onClick={onClose}
        >
          <X size={21} />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}
