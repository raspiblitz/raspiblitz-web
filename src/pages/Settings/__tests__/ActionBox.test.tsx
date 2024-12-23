import { fireEvent, render } from "test-utils";
import ActionBox from "../ActionBox";

describe("ActionBox component", () => {
  it("renders the name prop", () => {
    const { getByText } = render(
      <ActionBox
        name="Test Name"
        action={() => {}}
        actionName="Test Action"
        showChild={false}
      >
        <div>Test Child</div>
      </ActionBox>,
    );
    expect(getByText("Test Name")).toBeInTheDocument();
  });

  it("renders the action button with the correct text", () => {
    const { getByText } = render(
      <ActionBox
        name="Test Name"
        action={() => {}}
        actionName="Test Action"
        showChild={false}
      >
        <div>Test Child</div>
      </ActionBox>,
    );
    expect(getByText("Test Action")).toBeInTheDocument();
  });

  it("calls the action prop when the button is clicked", () => {
    const mockAction = vitest.fn();
    const { getByText } = render(
      <ActionBox
        name="Test Name"
        action={mockAction}
        actionName="Test Action"
        showChild={false}
      >
        <div>Test Child</div>
      </ActionBox>,
    );
    fireEvent.click(getByText("Test Action"));
    expect(mockAction).toHaveBeenCalled();
  });

  it("renders the child component when showChild is true", () => {
    const { getByText } = render(
      <ActionBox
        name="Test Name"
        action={() => {}}
        actionName="Test Action"
        showChild={true}
      >
        <div>Test Child</div>
      </ActionBox>,
    );
    expect(getByText("Test Child")).toBeInTheDocument();
  });

  it("does not render the child component when showChild is false", () => {
    const { queryByText } = render(
      <ActionBox
        name="Test Name"
        action={() => {}}
        actionName="Test Action"
        showChild={false}
      >
        <div>Test Child</div>
      </ActionBox>,
    );
    expect(queryByText("Test Child")).toBeNull();
  });
});
