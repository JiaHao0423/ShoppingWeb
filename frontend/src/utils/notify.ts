import { toast } from "../hooks/use-toast";
import { openConfirm, type ConfirmOptions } from "../hooks/use-confirm";

const notify = {
  info: (message: string) =>
    toast({
      title: "通知",
      description: message,
      variant: "default",
    }),
  success: (message: string) =>
    toast({
      title: "成功",
      description: message,
      variant: "default",
    }),
  error: (message: string) =>
    toast({
      title: "錯誤",
      description: message,
      variant: "destructive",
    }),
  confirm: (message: string, options?: Omit<ConfirmOptions, "message">) =>
    openConfirm({
      title: options?.title ?? "操作確認",
      message,
      confirmText: options?.confirmText ?? "確認",
      cancelText: options?.cancelText ?? "取消",
      variant: options?.variant ?? "default",
    }),
};

export default notify;
