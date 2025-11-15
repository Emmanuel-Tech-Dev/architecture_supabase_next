import { toast } from "sonner";
import Model from "./config/model";
import { toastRef } from "./toastRef";
export const utils = {
  showToast: (type = "info", message = "Attention", description = "") => {
    const options = {
      description: description,
      duration: 4000,
    };

    switch (type) {
      case "success":
        toast.success(message, options);
        break;
      case "error":
        toast.error(message, options);
        break;
      case "warning":
        toast.warning(message, options);
        break;
      case "info":
        toast.info(message, options);
        break;
      default:
        toast(message, options);
    }
  },

  showToastV2: (
    severity = "info",
    summary = "Attention",
    detail = "",
    life = 4000
  ) => {
    if (!toastRef?.current) return;
    toastRef.current.show({
      severity,
      summary,
      detail,
      life,
    });
  },

  logError: async ({ message, stack, userId, page }) => {
    try {
      await Model.insert("error_logs", {
        message,
        stack,
        user_id: userId,
        page,
      });
    } catch (e) {}
  },
};
