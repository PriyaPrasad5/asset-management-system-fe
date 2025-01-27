import { render } from "@testing-library/react";
import AuthLayout from "./authLayout";
import { MemoryRouter } from "react-router-dom";

describe("AuthLayout Component", () => {
  it("renders correctly with the Outlet", () => {
    const { getByTestId } = render(
      <MemoryRouter>
        <AuthLayout />
      </MemoryRouter>
    );

    expect(getByTestId("outlet")).toBeInTheDocument();
  });
});
