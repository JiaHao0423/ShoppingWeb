import { toast } from "react-hot-toast";

const notify = {
  info: (message: string) => toast(message),
  success: (message: string) => toast.success(message),
  error: (message: string) => toast.error(message),
  confirm: (message: string) => window.confirm(message),
};

export default notify;
