type ConfirmOptions = {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  closeOnBackdrop?: boolean;
  closeOnEscape?: boolean;
};

type ConfirmHandler = (options: ConfirmOptions) => Promise<boolean>;

let confirmHandler: ConfirmHandler | null = null;

export const registerConfirmHandler = (handler: ConfirmHandler | null) => {
  confirmHandler = handler;
};

export const openConfirm = async (options: ConfirmOptions): Promise<boolean> => {
  if (confirmHandler) {
    return confirmHandler(options);
  }
  return window.confirm(options.message);
};

export type { ConfirmOptions };
