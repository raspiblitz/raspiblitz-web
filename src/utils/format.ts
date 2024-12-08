import { Unit } from "@/context/app-context";

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
		// remove decimals from sat & convert
		return (+num.toFixed(0)).toLocaleString(NUM_LOCALE);
	}
	return num.toFixed(8).toString();
}

/**
 * Formats a normal string like "12345" to a formatted one => "123,456"
 * @param value the value to be formatted
 * @param unit The unit (BTC / SAT) , see also {@link Unit}
 * @returns the formatted value
 */
export function formatAmount(value: string, unit: Unit): string {
	// replace every character except numbers and separators
	let newValue = value.replace(/[^0-9.,]/, "");
	if (unit === Unit.SAT) {
		// remove all separators to format correctly
		newValue = value.replace(/,|\./g, "");
		if (newValue) {
			newValue = new Intl.NumberFormat(NUM_LOCALE).format(+value);
		}
	} else {
		// remove commas
		newValue = value.replace(/,/g, "");
		// replace ".." with "."
		newValue = value.replace(/\.\./g, ".");
		const output = value.split(".");
		// limit to max 8 decimal places
		if (output[1]?.length > 8) {
			output[1] = output[1].substring(0, 8);
		}
		// formatting which respects separator
		// makes either "x.y" or "y"
		newValue = output.shift() + (output.length ? `. ${output.join("")}` : "");
	}
	return value;
}

/**
 * Removes the commas from a string number and returns the number representation of that string
 * e.g. "123,456" => 123456
 * @param value the value to convert e.g. "123,456"
 * @returns the converted number, e.g. 123456
 */
export function stringToNumber(value: string): number {
	const valueCopy = value.replace(/,/g, "");
	return +valueCopy;
}
