import { Unit } from "../store/app-context";

export const SAT_DENOMINATOR = 100_000_000;
export const NUM_LOCALE = "en-US";

export function convertSatToBtc(sat: number): number {
  // no locale string to it doesn't remove the sat after
  return sat / SAT_DENOMINATOR;
}

export function convertBtcToSat(btc: number): number {
  return btc * SAT_DENOMINATOR;
}

export function convertMSatToSat(mSat: number): number {
  return mSat / 1000;
}

export function convertMSatToBtc(mSat: number): number {
  return convertSatToBtc(mSat / 1000);
}

export function convertToString(unit: Unit, num: number): string {
  if (unit === Unit.SAT) {
    return num.toLocaleString(NUM_LOCALE);
  }
  return num.toFixed(8).toString();
}
