import { checkError } from "../checkError";

vi.mock("i18next", () => ({
  t: () => "An error occurred",
}));

describe("checkError", () => {
  it("should display the message with basic detail object", () => {
    const errorMsg = checkError({
      response: {
        data: {
          detail: "old password format invalid",
        },
      },
    });
    expect(errorMsg).toEqual("An error occurred: old password format invalid");
  });

  it("should display the message with detail.msg object", () => {
    const errorMsg = checkError({
      response: {
        data: {
          detail: [
            {
              loc: ["body", "password"],
              msg: "ensure this value has at least 8 characters",
              type: "value_error.any_str.min_length",
              ctx: {
                limit_value: 8,
              },
            },
          ],
        },
      },
    });
    expect(errorMsg).toEqual(
      "An error occurred: ensure this value has at least 8 characters"
    );
  });

  it("should display the message with detail as an array", () => {
    const errorMsg = checkError({
      response: {
        data: {
          detail: [
            {
              loc: ["body", "type"],
              msg: "value is not a valid enumeration member; permitted: 'p2wkh', 'np2wkh'",
              type: "type_error.enum",
              ctx: {
                enum_values: ["p2wkh", "np2wkh"],
              },
            },
          ],
        },
      },
    });
    expect(errorMsg).toEqual(
      "An error occurred: value is not a valid enumeration member; permitted: 'p2wkh', 'np2wkh'"
    );
  });

  it("should display an unknown error on other objects", () => {
    const errorMsg = checkError({
      response: {
        status: 404,
        statusText: "Not found",
        data: {
          detail: {
            //@ts-ignore - We want to test undefined behaviour
            test: "test",
          },
        },
      },
    });
    // different text bc output is mocked
    expect(errorMsg).toEqual("An error occurred: An error occurred");
  });
});
