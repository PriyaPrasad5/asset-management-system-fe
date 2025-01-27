import { render, screen, fireEvent, waitFor, within } from "@testing-library/react";
import { vi } from "vitest";
import LoginPage from "./index";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { ChakraProvider, useToast } from "@chakra-ui/react";

vi.mock("@tanstack/react-query", () => ({
  useMutation: vi.fn(),
}));

vi.mock("react-router", () => ({
  useNavigate: vi.fn(),
}));

vi.mock("@chakra-ui/react", async () => {
  const actual = await vi.importActual("@chakra-ui/react");
  return {
    ...actual,
    useToast: vi.fn(),
  };
});

describe("LoginPage Component", () => {
  const mockNavigate = vi.fn();
  const mockMutate = vi.fn();
  const mockToast = vi.fn();

  beforeEach(() => {
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    vi.mocked(useToast).mockReturnValue(mockToast);
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isSuccess: false,
      data: null,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <ChakraProvider>
        <LoginPage />
      </ChakraProvider>
    );

  it("renders the login page correctly", () => {
    renderComponent();
    const container = screen.getByTestId("login-container");
    expect(within(container).getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows validation errors when submitting an empty form", async () => {
    renderComponent();

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    expect(await screen.findByText("Please Enter Email")).toBeInTheDocument();
    expect(await screen.findByText("Please Enter Password")).toBeInTheDocument();
  });

  it("calls mutation function on valid form submission", async () => {
    renderComponent();

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: "Password1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "Password1",
      });
    });
  });

  it("shows an error toast for invalid login credentials", async () => {
    vi.mocked(useMutation).mockReturnValue({
      mutate: mockMutate,
      isSuccess: true,
      data: { status: "error" },
    });

    renderComponent();

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: "Password1" },
    });

    fireEvent.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: "Invalid username or password!",
        status: "error",
      });
    });
  });
});
