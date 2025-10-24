// composables/useNotification.ts
import { useToast } from "vue-toastification";

type NotificationType = "success" | "error" | "info" | "warning";

export function useNotification() {
  const toast = useToast();

  const notify = (type: NotificationType, message: string) => {
    switch (type) {
      case "success":
        toast.success(message);
        break;
      case "error":
        toast.error(message);
        break;
      case "info":
        toast.info(message);
        break;
      case "warning":
        toast.warning(message);
        break;
      default:
        toast(message);
    }
  };

  return { notify };
}