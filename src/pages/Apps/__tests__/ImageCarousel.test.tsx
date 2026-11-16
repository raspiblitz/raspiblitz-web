import { render, screen } from "test-utils";
import userEvent from "@testing-library/user-event";
import ImageCarousel from "../ImageCarousel";
import i18n from "@/i18n/test_config";
import en from "@/i18n/langs/en.json";

beforeAll(() => {
  i18n.addResourceBundle("en", "translation", en.translation);
});

describe("ImageCarousel", () => {
  test("selects the requested screenshot after a video and wraps both directions", async () => {
    const user = userEvent.setup();
    render(
      <ImageCarousel
        appName="Mempool.space"
        imgs={["one.png", "two.png"]}
        video={<video data-testid="video" />}
      />,
    );
    expect(screen.getByRole("region", { name: "Mempool.space app previews" })).toBeInTheDocument();
    expect(screen.getByTestId("video")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Show screenshot 2" }));
    expect(screen.getByRole("img")).toHaveAttribute("src", "two.png");
    expect(screen.getByRole("button", { name: "Show screenshot 2" })).toHaveAttribute(
      "aria-current",
      "true",
    );
    await user.click(screen.getByRole("button", { name: "Next preview" }));
    expect(screen.getByTestId("video")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Previous preview" }));
    expect(screen.getByRole("img")).toHaveAccessibleName("Mempool.space screenshot 2 of 2");
  });

  test("allows keyboard activation without a video", async () => {
    const user = userEvent.setup();
    render(<ImageCarousel imgs={["one.png", "two.png"]} />);
    const next = screen.getByRole("button", { name: "Next preview" });
    next.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("img")).toHaveAttribute("src", "two.png");
    await user.keyboard(" ");
    expect(screen.getByRole("img")).toHaveAttribute("src", "one.png");
  });

  test("supports video-only previews and empty media", () => {
    const { rerender } = render(<ImageCarousel imgs={[]} video={<video data-testid="video" />} />);
    expect(screen.getByTestId("video")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Next preview" })).not.toBeInTheDocument();
    rerender(<ImageCarousel imgs={[]} />);
    expect(screen.queryByRole("region")).not.toBeInTheDocument();
  });
});
