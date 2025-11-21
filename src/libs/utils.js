import { toast } from "sonner";
import Model from "./config/model";
import { toastRef } from "./toastRef";
import moment from "moment";
import dayjs from "dayjs";
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
  calculateDataOfAndArray: (data, value) => {
    const totalValue = data?.reduce((acc, item) => acc + item[value], 0);
    return totalValue;
  },

  getBase64: (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    }),

  handleDownloadCSV: (data, filename) => {
    const csvData = data?.map((item) => Object.values(item));
    const csvHeaders = Object.keys(data[0]);
    const csvContent = [csvHeaders, ...csvData]
      .map((row) => row.join(","))
      .join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `${filename}.csv`);
  },

  currencyConvertor: (amount, currency = "GHS") => {
    // Using Intl.NumberFormat for currency formatting
    const formatter = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency,
    });
    return formatter.format(amount); // $123,456.7
  },

  dateFormatter: (date) => {
    const dateFormatter = new Intl.DateTimeFormat("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    // Check if date is already a Date object, otherwise convert it
    const validDate = date instanceof Date ? date : new Date(date);

    // Check if the conversion to Date was successful
    if (isNaN(validDate)) {
      console.error("Invalid date:", date);
      return "Invalid date";
    }

    return dateFormatter.format(validDate);
  },

  // format a number as a percentage
  percentageFormatter: (value) => {
    const percentageFormatter = new Intl.NumberFormat("en-US", {
      style: "percent",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return percentageFormatter.format(value / 100);
  },

  formatNumber: (value) => {
    value = Number(value);
    console.log("Converted to number:", value); // Debugging statement
    if (isNaN(value)) return "0";
    if (value < 1000) return value.toString();
    const units = ["", "K", "M", "B", "T", "Q"];
    let unitIndex = 0;

    while (value >= 1000 && unitIndex < units.length - 1) {
      value /= 1000;
      unitIndex++;
      console.log("Value after division:", value, "Unit index:", unitIndex); // Debugging statement
    }

    const formattedValue =
      value.toFixed(1).replace(/\.0$/, "") + units[unitIndex];
    console.log("Formatted value:", formattedValue); // Debugging statement
    return formattedValue;
  },
  // Purals
  purals: (text) => {
    const pluralize = new Intl.PluralRules("en");
    return pluralize.select(text);
  },

  //Format relative time
  relativeTimeFormart: (date) => {
    const relativeTimeFormatter = new Intl.RelativeTimeFormat("en", {
      numeric: "auto",
    });
    const now = new Date();
    const differenceInMs = date - now;

    // Calculate time differences
    const seconds = Math.round(differenceInMs / 1000);
    const minutes = Math.round(differenceInMs / (1000 * 60));
    const hours = Math.round(differenceInMs / (1000 * 60 * 60));
    const days = Math.round(differenceInMs / (1000 * 60 * 60 * 24));

    // Determine the appropriate unit and return the formatted string
    if (Math.abs(days) >= 1) {
      return relativeTimeFormatter.format(days, "day");
    } else if (Math.abs(hours) >= 1) {
      return relativeTimeFormatter.format(hours, "hour");
    } else if (Math.abs(minutes) >= 1) {
      return relativeTimeFormatter.format(minutes, "minute");
    } else {
      return relativeTimeFormatter.format(seconds, "second");
    }
  },

  generateRandomColor: () => {
    const letter = "BCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letter[Math.floor(Math.random() * letter.length)];
    }

    return color;
  },

  hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function (m, r, g, b) {
      return r + r + g + g + b + b;
    });

    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  },

  // Helper function to convert RGB decimal values back to a hexadecimal string.
  rgbToHex(r, g, b) {
    const componentToHex = (c) => {
      const hex = c.toString(16);
      return hex.length === 1 ? "0" + hex : hex;
    };
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
  },

  shadeColor(hex, percent) {
    const rgb = utils.hexToRgb(hex);
    if (!rgb) return hex; // Return original if conversion fails

    let r = rgb.r;
    let g = rgb.g;
    let b = rgb.b;

    // Apply shading: Multiply by (1 + percent/100)
    // If percent is -30, factor is 0.7 (darker). If percent is 30, factor is 1.3 (lighter).
    const factor = 1 + percent / 100;

    r = Math.round(Math.min(255, Math.max(0, r * factor)));
    g = Math.round(Math.min(255, Math.max(0, g * factor)));
    b = Math.round(Math.min(255, Math.max(0, b * factor)));

    return utils.rgbToHex(r, g, b);
  },

  generateShadedColors() {
    const randomHex = Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, "0");
    const baseColor = "#" + randomHex.toUpperCase();
    const lighterColor = utils.shadeColor(baseColor, 50);
    const darkerColor = utils.shadeColor(baseColor, -30);

    return {
      lighterColor: lighterColor,
      darker: darkerColor,
    };
  },

  dateConvertor: (date) => {
    const formateDate = moment(date).format("MMMM DD, YYYY hh:mm:ss a");
    return formateDate;
  },
  dateConvertorV2: (date) => {
    const formateDate = moment(date).format("MMMM DD, YYYY");
    return formateDate;
  },

  printReceipts: (printableId) => {
    const printable = document.getElementById(printableId);
    if (!printable) {
      console.error(`Element with ID "${printableId}" not found.`);
      return;
    }

    // Ensure a single print window instance
    let printWindow = window.open("", "printWindow", "width=1000,height=1000");
    if (!printWindow) {
      console.error(
        "Failed to open print window. Please check browser popup settings."
      );
      return;
    }

    // Fetch styles from the current document
    const styles = Array.from(
      document.querySelectorAll("link[rel='stylesheet'], style")
    )
      .map((style) => style.outerHTML)
      .join("\n");

    const html = printable.innerHTML;

    // Write the printable content with styles
    printWindow.document.write(`
    <html>
      <head>
        ${styles} <!-- Inject styles -->
      </head>
      <body>${html}</body>
    </html>
  `);

    setTimeout(() => {
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 500);

    // Delay by 0ms to allow the DOM to update
  },

  // generatePdf: (ref) => {
  //   const element = document.getElementById(ref);

  //   html2canvas(element, {
  //     scale: 2,
  //     useCORS: true,
  //     logging: false,
  //   })
  //     .then((canvas) => {
  //       const imgData = canvas.toDataURL("image/png");
  //       const pdf = new jsPDF({
  //         orientation: "landscape",
  //         unit: "px",
  //         format: "a5",
  //         // margins: 20
  //       });
  //       const imgProps = pdf.getImageProperties(imgData);
  //       const pdfWidth = pdf.internal.pageSize.getWidth() - 10;
  //       const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  //       pdf.addImage(
  //         imgData,
  //         "PNG",
  //         0,
  //         0,
  //         pdfWidth,
  //         pdfHeight,
  //         undefined,
  //         "FAST"
  //       );

  //       pdf.save(`Receipt-${new Date().toISOString().slice(0, 10)}.pdf`);
  //     })
  //     .catch((error) => {
  //       console.error("PDF Generation Error:", error);
  //       message.error("Failed to generate PDF");
  //     });
  // },
  truncateText: (title, maxLength) => {
    if (title.length > maxLength) {
      return title.slice(0, maxLength - 3) + "...";
    }
    return title;
  },
  getInitials: (data) => {
    const firstLetter = data.charAt(0).toUpperCase();

    return firstLetter;
  },

  getInitials_v2: (name) => {
    const syllabul = name
      ?.split(" ")
      ?.map((word) => word[0]?.toUpperCase())
      ?.join("");

    return syllabul;
  },

  copyToClipboard: async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success("Copied to clipboard");
    } catch (error) {
      console.log(error);
      return message.error("Failed to copy to clipboard");
    }
  },

  // formatter: (value) => {
  //   return <CountUp end={value} separator="," />;
  // },

  fromNow(date) {
    const SECOND = 1000;
    const MINUTE = 60 * SECOND;
    const HOUR = 60 * MINUTE;
    const DAY = 24 * HOUR;
    const WEEK = 7 * DAY;
    const MONTH = 30 * DAY;
    const YEAR = 365 * DAY;
    const units = [
      {
        max: 30 * SECOND,
        divisor: 1,
        past1: "just now",
        pastN: "just now",
        future1: "just now",
        futureN: "just now",
      },
      {
        max: MINUTE,
        divisor: SECOND,
        past1: "a second ago",
        pastN: "# seconds ago",
        future1: "in a second",
        futureN: "in # seconds",
      },
      {
        max: HOUR,
        divisor: MINUTE,
        past1: "a minute ago",
        pastN: "# minutes ago",
        future1: "in a minute",
        futureN: "in # minutes",
      },
      {
        max: DAY,
        divisor: HOUR,
        past1: "an hour ago",
        pastN: "# hours ago",
        future1: "in an hour",
        futureN: "in # hours",
      },
      {
        max: WEEK,
        divisor: DAY,
        past1: "yesterday",
        pastN: "# days ago",
        future1: "tomorrow",
        futureN: "in # days",
      },
      {
        max: 4 * WEEK,
        divisor: WEEK,
        past1: "last week",
        pastN: "# weeks ago",
        future1: "in a week",
        futureN: "in # weeks",
      },
      {
        max: YEAR,
        divisor: MONTH,
        past1: "last month",
        pastN: "# months ago",
        future1: "in a month",
        futureN: "in # months",
      },
      {
        max: 100 * YEAR,
        divisor: YEAR,
        past1: "last year",
        pastN: "# years ago",
        future1: "in a year",
        futureN: "in # years",
      },
      {
        max: 1000 * YEAR,
        divisor: 100 * YEAR,
        past1: "last century",
        pastN: "# centuries ago",
        future1: "in a century",
        futureN: "in # centuries",
      },
      {
        max: Infinity,
        divisor: 1000 * YEAR,
        past1: "last millennium",
        pastN: "# millennia ago",
        future1: "in a millennium",
        futureN: "in # millennia",
      },
    ];
    const diff =
      Date.now() - (typeof date === "object" ? date : new Date(date)).getTime();
    const diffAbs = Math.abs(diff);
    for (const unit of units) {
      if (diffAbs < unit.max) {
        const isFuture = diff < 0;
        const x = Math.round(Math.abs(diff) / unit.divisor);
        if (x <= 1) return isFuture ? unit.future1 : unit.past1;
        return (isFuture ? unit.futureN : unit.pastN).replace("#", x);
      }
    }
  },
  sleep: (ms) => new Promise((r) => setTimeout(r, ms)),
  groupBy: function (xs, key) {
    return xs?.reduce(function (rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  },
  formatDateV2(date, delimeter = "-", joiner = "-") {
    const d = date?.split(delimeter);
    const rev = d?.reverse();
    return rev?.join(joiner);
  },
  formatDate(date, joiner = "-") {
    var d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join(joiner);
  },
  formatDateV3(date, format = "MMM D, YYYY") {
    const d = dayjs(date);
    return d?.format(format);
  },

  formatBytes: (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  },

  formatUptime: (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hours = Math.floor((seconds % (3600 * 24)) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${days}d ${hours}h ${minutes}m`;
  },
  getDaysFromRawDate(start, end) {
    const startDate = dayjs(start);
    const endDate = dayjs(end);
    return endDate.diff(startDate, "days");
  },
  getDaysFromRawDateV2(start, end) {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    return days;
  },
  getColumnStatusColor(status) {
    switch (status) {
      case "active":
        return "success";

      case "pending":
        return "warning";

      case "suspended":
        return "danger";

      default:
        return null;
    }
  },

  getColumnStatusColorV2(
    status,
    keys = ["active", "pending", "blocked"],
    colors = ["success", "warning", "danger"]
  ) {
    const index = keys.indexOf(status);
    return colors[index] ?? null;
  },

  resolveColors(key) {
    const COLOR_MAP = {
      totalAffiliates: {
        bg: "bg-[#E8F0FF]",
        iconBg: "bg-[#D6E4FF]",
        text: "text-[#1A3A8F]",
      },
      activeAffiliates: {
        bg: "bg-[#E9F9EE]",
        iconBg: "bg-[#D1F4DA]",
        text: "text-[#1D7A36]",
      },
      avgRevenue: {
        bg: "bg-[#F3E8FF]",
        iconBg: "bg-[#E8D4FF]",
        text: "text-[#7A1DB8]",
      },
      topPerformer: {
        bg: "bg-[#FFF4E5]",
        iconBg: "bg-[#FFE9CC]",
        text: "text-[#B85C00]",
      },
    };

    // fallback colors for any unknown key
    const DEFAULT_COLORS = {
      bg: "#F5F5F5",
      iconBg: "#E0E0E0",
      text: "#333333",
    };
    return COLOR_MAP[key] || DEFAULT_COLORS;
  },
};
