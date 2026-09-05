import { parseJwt, REFRESH_TIME } from "@/utils";

const now = 1_800_000_000;
const token = (payload: unknown) =>
  `header.${btoa(JSON.stringify(payload)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "")}.signature`;

describe("JWT expiry", () => {
  beforeEach(() => vi.spyOn(Date, "now").mockReturnValue(now * 1000));
  afterEach(() => vi.restoreAllMocks());

  test("decodes the API claims and schedules ten minutes before expiry", () => {
    const payload = { user_id: "admin", iat: now, exp: now + 3600 };
    expect(parseJwt(token(payload))).toEqual(payload);
    expect(REFRESH_TIME(payload.exp)).toBe(3_000_000);
  });

  test("decodes base64url and UTF-8 claims", () => {
    const payload = { user_id: "管理员🿿", iat: now, exp: now + 3600 };
    const encoded = btoa(String.fromCharCode(...new TextEncoder().encode(JSON.stringify(payload))))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
    expect(parseJwt(`header.${encoded}.signature`)).toEqual(payload);
  });

  test.each([null, 12, "broken", "a.%%.c", "a.bnVsbA.c", "a.e30.c"])(
    "rejects malformed token %j",
    (value) => {
      expect(parseJwt(value)).toBeNull();
    },
  );

  test.each([undefined, null, "1800003600", -1, 0, 1e308])("rejects invalid exp %j", (exp) => {
    expect(parseJwt(token({ user_id: "admin", iat: now, exp }))).toBeNull();
  });

  test.each([NaN, Infinity, -Infinity, -1, now, now - 1, now + 0.5, 1e308])(
    "does not schedule invalid or expired time %j",
    (exp) => {
      expect(REFRESH_TIME(exp)).toBeNull();
    },
  );

  test("uses half the remaining lifetime inside the refresh window", () => {
    expect(REFRESH_TIME(now + 60)).toBe(30_000);
    expect(REFRESH_TIME(now + 1)).toBe(500);
  });

  test("caps long lifetimes at the browser timer limit", () => {
    expect(REFRESH_TIME(now + 3_000_000)).toBe(2_147_483_647);
  });
});
