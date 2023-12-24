import { CouponDiscountType, CouponType, Duration, LocalTime, Tier } from "@objects";

export const formatTier = (tier?: Tier) => {
  switch (tier) {
    case Tier.BASIC:
      return "Básico";
    case Tier.PREMIUM:
      return "Premium";
    case Tier.UNLIMITED:
      return "Ilimitado";
    default:
      return "Desconocido";
  }
};

export const formatLocalTime = (time: LocalTime) => {
  const [hour, minute, second] = time.split(":").map(Number);

  const date = new Date();
  date.setHours(hour, minute, second);
  type digits = "2-digit" | "numeric";

  const options = {
    hour12: true,
    hour: "2-digit" as digits,
    minute: "2-digit" as digits,
  };
  const formatted = date.toLocaleTimeString("en-US", options);

  return formatted;
};

export const formatDuration = (duration: Duration) => {
  const [hour, minute] = duration
    .replace("PT", "")
    .replace("H", ":")
    .replace("M", ":")
    .replace("S", "")
    .split(":")
    .map(Number);

  if (minute) {
    return `${hour} hora${hour !== 1 ? "s" : ""} y ${minute} minuto${
      minute !== 1 ? "s" : ""
    }`;
  } else {
    return `${hour} hora${hour !== 1 ? "s" : ""}`;
  }
};

export const formatCouponType = (type: CouponType) => {
  switch (type) {
    case CouponType.PRODUCT:
      return "Producto";
    case CouponType.CATEGORY:
      return "Categoría";
    default:
      return "Desconocido";
  }
};

export const formatCouponDiscountType = (type: CouponDiscountType) => {
  switch (type) {
    case CouponDiscountType.PERCENTAGE:
      return "Porcentaje";
    case CouponDiscountType.AMOUNT:
      return "Monto";
    default:
      return "Desconocido";
  }
};
