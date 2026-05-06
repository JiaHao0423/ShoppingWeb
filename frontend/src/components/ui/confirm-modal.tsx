import { useCallback, useEffect, useRef, useState } from "react";
import { registerConfirmHandler, type ConfirmOptions } from "@/hooks/use-confirm";
import "./confirm-modal.scss";

type ConfirmState = ConfirmOptions & {
  open: boolean;
};

const initialState: ConfirmState = {
  open: false,
  title: "",
  message: "",
  confirmText: "確認",
  cancelText: "取消",
  variant: "default",
  closeOnBackdrop: true,
  closeOnEscape: true,
};

export function ConfirmModalProvider() {
  const [state, setState] = useState<ConfirmState>(initialState);
  const [, setResolver] = useState<((value: boolean) => void) | null>(null);
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);
  const cancelButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    registerConfirmHandler((options) => {
      return new Promise<boolean>((resolve) => {
        setState({
          open: true,
          title: options.title ?? "請確認",
          message: options.message,
          confirmText: options.confirmText ?? "確認",
          cancelText: options.cancelText ?? "取消",
          variant: options.variant ?? "default",
          closeOnBackdrop: options.closeOnBackdrop ?? (options.variant !== "destructive"),
          closeOnEscape: options.closeOnEscape ?? (options.variant !== "destructive"),
        });
        setResolver(() => resolve);
      });
    });

    return () => {
      registerConfirmHandler(null);
    };
  }, []);

  const close = useCallback((value: boolean) => {
    setResolver((r: ((v: boolean) => void) | null) => {
      r?.(value);
      return null;
    });
    setState(initialState);
  }, []);

  useEffect(() => {
    if (!state.open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    confirmButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        if (state.closeOnEscape) {
          event.preventDefault();
          close(false);
        }
        return;
      }

      if (event.key === "Enter") {
        event.preventDefault();
        close(true);
        return;
      }

      if (event.key === "Tab") {
        const focusableElements = [cancelButtonRef.current, confirmButtonRef.current].filter(Boolean) as HTMLElement[];
        if (focusableElements.length === 0) return;

        const activeIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
        const nextIndex = event.shiftKey
          ? (activeIndex <= 0 ? focusableElements.length - 1 : activeIndex - 1)
          : (activeIndex + 1) % focusableElements.length;

        event.preventDefault();
        focusableElements[nextIndex].focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [close, state.closeOnEscape, state.open]);

  if (!state.open) return null;

  return (
    <div className="confirm-modal__backdrop" onClick={() => state.closeOnBackdrop && close(false)}>
      <div
        className={`confirm-modal confirm-modal--${state.variant}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        aria-describedby="confirm-modal-message"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="confirm-modal__content">
          <h3 id="confirm-modal-title" className="confirm-modal__title">
            {state.title}
          </h3>
          <p id="confirm-modal-message" className="confirm-modal__message">
            {state.message}
          </p>
        </div>
        <div className="confirm-modal__actions">
          <button ref={cancelButtonRef} className="confirm-modal__btn confirm-modal__btn--cancel" onClick={() => close(false)}>
            {state.cancelText}
          </button>
          <button
            ref={confirmButtonRef}
            className={`confirm-modal__btn confirm-modal__btn--confirm confirm-modal__btn--confirm-${state.variant}`}
            onClick={() => close(true)}
          >
            {state.confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
