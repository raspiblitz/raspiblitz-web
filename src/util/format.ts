import { Unit } from "../store/app-context";

export const SAT_DENOMINATOR = 100_000_000;
export const NUM_LOCALE = "en-US";

export function convertSatToBtc(sat: number | null): number | null {
  return sat ? sat / SAT_DENOMINATOR : null;
}

export function convertBtcToSat(btc: number): number {
  return btc * SAT_DENOMINATOR;
}

export function convertMSatToSat(mSat: number | null): number | null {
  return mSat ? mSat / 1000 : null;
}

export function convertMSatToBtc(mSat: number | null): number | null {
  return convertSatToBtc(mSat ? mSat / 1000 : null);
}

export function convertToString(unit: Unit, num: number | null): string {
  if (num === null) {
    return "-";
  }
  if (unit === Unit.SAT) {
    return num.toLocaleString(NUM_LOCALE);
  }
  return num.toFixed(8).toString();
}
