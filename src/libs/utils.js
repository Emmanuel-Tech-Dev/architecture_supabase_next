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
  getSupabaseOperator(matchMode) {
    const map = {
      startsWith: "ilike", // value%
      contains: "ilike", // %value%
      notContains: "not.ilike", // not %value%
      endsWith: "ilike", // %value
      equals: "eq",
      notEquals: "neq",
      lt: "lt",
      lte: "lte",
      gt: "gt",
      gte: "gte",
    };
    return map[matchMode] || "eq";
  },

  formatFilterValue(matchMode, value) {
    if (matchMode === "contains") return `%${value}%`;
    if (matchMode === "startsWith") return `${value}%`;
    if (matchMode === "endsWith") return `%${value}`;
    if (matchMode === "notContains") return `%${value}%`;
    return value;
  },
};
