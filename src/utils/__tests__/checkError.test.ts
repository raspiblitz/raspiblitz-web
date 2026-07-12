import { checkError } from "../checkError";

vi.mock("i18next", () => ({
  t: () => "An error occurred",
}));

describe("checkError", () => {
  it("shows the string detail", () => {
    const errorMsg = checkError({
      // @ts-expect-error response is not a full AxiosResponse<ApiError> here
      response: {
        data: { detail: "old password format invalid" },
      },
    });
    expect(errorMsg).toEqual("An error occurred: old password format invalid");
  });

  it("falls back to unknown when there is no string detail", () => {
    const errorMsg = checkError({
      response: {
        status: 404,
        statusText: "Not found",
        // @ts-expect-error - testing missing detail
        data: {},
      },
    });
    // t() is mocked, so both segments render as "An error occurred"
    expect(errorMsg).toEqual("An error occurred: An error occurred");
  });
});
