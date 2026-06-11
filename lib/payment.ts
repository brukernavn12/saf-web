const DEPOSIT_PCT = 25;
export const MIN_BOOKING_PERSONS = 2;

export function convertEurToNok(eur: number, rate: number): number {
  return Math.max(1, Math.round(eur * rate));
}

export interface BookingPriceBreakdown {
  totalEur: number;
  depositEur: number;
  remainderEur: number;
  doubleRooms: number;
  singleRooms: number;
  singleSupplementEur: number;
  includesSingleSupplement: boolean;
}

export function calculateBookingAmountsEur(
  pricePerPersonEur: number,
  persons: number,
  singleRoomSupplementEur?: number | null
): BookingPriceBreakdown {
  const doubleRooms = Math.floor(persons / 2);
  const singleRooms = persons % 2;
  const supplement = Number(singleRoomSupplementEur ?? 0);
  const singleSupplementEur = singleRooms > 0 ? supplement : 0;
  const baseTotal = pricePerPersonEur * persons;
  const totalEur = baseTotal + singleSupplementEur;
  const depositEur = Math.round(totalEur * (DEPOSIT_PCT / 100));
  const remainderEur = totalEur - depositEur;

  return {
    totalEur,
    depositEur,
    remainderEur,
    doubleRooms,
    singleRooms,
    singleSupplementEur,
    includesSingleSupplement: singleRooms > 0 && supplement > 0,
  };
}

export function generateOrderId(): string {
  return `lc-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

export function getAppUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL?.trim() || "http://localhost:3000";
}

export function getCallbackBaseUrl(): string {
  return process.env.VIPPS_CALLBACK_BASE_URL?.trim() || getAppUrl();
}
