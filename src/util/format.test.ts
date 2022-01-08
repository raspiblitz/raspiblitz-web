import { Unit } from "../store/app-context";
import {
  convertBtcToSat,
  convertMSatToBtc,
  convertSatToBtc,
  convertToString,
} from "./format";

describe("format", () => {
  test("format sat to btc", () => {
    const amount = convertSatToBtc(200_000_000);
    expect(amount).toEqual(2);
  });

  test("format sat to btc with single sat", () => {
    const amount = convertSatToBtc(200_000_001);
    expect(amount).toEqual(2.00000001);
  });

  test("format btc to sat without decimals", () => {
    const amount = convertBtcToSat(2);
    expect(amount).toEqual(200_000_000);
  });

  test("format btc to sat with decimals", () => {
    const amount = convertBtcToSat(2.00000001);
    expect(amount).toEqual(200_000_001);
  });

  test("format to String with BTC", () => {
    const amount = convertToString(Unit.BTC, 2.00000001);
    expect(amount).toEqual("2.00000001");
  });

  test("format to String with Sat", () => {
    const amount = convertToString(Unit.SAT, 200_000_001);
    expect(amount).toEqual("200,000,001");
  });

  test("format to String with mSat to BTC", () => {
    const amount = convertToString(Unit.BTC, convertMSatToBtc(21000));
    expect(amount).toEqual("0.00000021");
  });
});
