import { ChakraProvider, useToast } from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { useNavigate } from "react-router";
import { vi } from "vitest";
import i18n from "../../i18n"; // Ensure this imports your i18n config
import LoginPage from "./index";

// Mock react-query, react-router, and Chakra UI hooks
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

  // Utility function to render the component
  const renderComponent = () =>
    render(
      <ChakraProvider>
        <I18nextProvider i18n={i18n}>
          <LoginPage />
        </I18nextProvider>
      </ChakraProvider>
    );

  it("renders the login page correctly", () => {
    renderComponent();
    const container = screen.getByTestId("login-container");
    expect(within(container).getByText(/login/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: i18n.t("Login.login") })
    ).toBeInTheDocument();
  });

  it("shows validation errors when submitting an empty form", async () => {
    renderComponent();

    fireEvent.click(
      screen.getByRole("button", { name: i18n.t("Login.login") })
    );

    expect(
      await screen.findByText(i18n.t("Login.pleaseEnterEmail"))
    ).toBeInTheDocument();
    expect(
      await screen.findByText(i18n.t("Login.pleaseEnterPassword"))
    ).toBeInTheDocument();
  });

  it("calls mutation function on valid form submission", async () => {
    renderComponent();

    fireEvent.input(screen.getByLabelText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.input(screen.getByLabelText(/password/i), {
      target: { value: "Password1" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: i18n.t("Login.login") })
    );

    await waitFor(() => {
      expect(mockMutate).toHaveBeenCalledWith({
        email: "test@example.com",
        password: "Password1",
      });
    });
  });

  it("shows an error toast for invalid login credentials", async () => {
    // Mock mutation to return an error
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

    fireEvent.click(
      screen.getByRole("button", { name: i18n.t("Login.login") })
    );

    await waitFor(() => {
      expect(mockToast).toHaveBeenCalledWith({
        title: i18n.t("Login.invalidCredentials"), // Ensure correct translation is used
        status: "error",
      });
    });
  });
});
