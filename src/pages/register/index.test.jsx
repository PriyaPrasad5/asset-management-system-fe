import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { I18nextProvider } from "react-i18next";
import { MemoryRouter, useNavigate } from "react-router-dom";
import { vi } from "vitest";
import i18n from "../../i18n";
import { userRegister } from "../../services/authForm";
import RegisterPage from "./index";

vi.mock("react-router-dom", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

vi.mock("../../services/authForm", () => ({
  userRegister: vi.fn(),
}));

vi.mock("react-i18next", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useTranslation: () => ({
      t: (key) => key,
      i18n: { changeLanguage: vi.fn(), language: "en" },
    }),
  };
});

vi.mock("@chakra-ui/react", async (importOriginal) => {
  const actualChakra = await importOriginal();
  return {
    ...actualChakra,
    useToast: vi.fn(() => vi.fn()),
  };
});

const queryClient = new QueryClient();

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders the registration form", () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <I18nextProvider i18n={i18n}>
            <RegisterPage />
          </I18nextProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    expect(screen.getByText("Register.register")).toBeInTheDocument();
    expect(screen.getByLabelText("Register.name")).toBeInTheDocument();
    expect(screen.getByLabelText("Register.employeeId")).toBeInTheDocument();
    expect(screen.getByLabelText("email")).toBeInTheDocument();
    expect(screen.getByLabelText("Register.password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Register.registerButton" })
    ).toBeInTheDocument();
  });

  test("shows validation errors when submitting empty form", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <I18nextProvider i18n={i18n}>
            <RegisterPage />
          </I18nextProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    fireEvent.click(
      screen.getByRole("button", { name: "Register.registerButton" })
    );

    await waitFor(() => {
      expect(screen.getByText("Register.nameRequired")).toBeInTheDocument();
      expect(
        screen.getByText("Register.employeeIdRequired")
      ).toBeInTheDocument();
      expect(screen.getByText("Register.emailRequired")).toBeInTheDocument();
      expect(screen.getByText("Register.passwordRequired")).toBeInTheDocument();
    });
  });

  test("shows error for invalid email", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <I18nextProvider i18n={i18n}>
            <RegisterPage />
          </I18nextProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    fireEvent.input(screen.getByLabelText("email"), {
      target: { value: "invalid-email" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Register.registerButton" })
    );

    await waitFor(() => {
      expect(screen.getByText("Register.emailInvalid")).toBeInTheDocument();
    });
  });

  test("submits the form and navigates on success", async () => {
    const mockNavigate = vi.fn();
    vi.mocked(useNavigate).mockReturnValue(mockNavigate);
    userRegister.mockResolvedValue({ status: "success" });

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <I18nextProvider i18n={i18n}>
            <RegisterPage />
          </I18nextProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    fireEvent.input(screen.getByLabelText("Register.name"), {
      target: { value: "John Doe" },
    });
    fireEvent.input(screen.getByLabelText("Register.employeeId"), {
      target: { value: "12345" },
    });
    fireEvent.input(screen.getByLabelText("email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.input(screen.getByLabelText("Register.password"), {
      target: { value: "Password123" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Register.registerButton" })
    );

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  test("shows error message on registration failure", async () => {
    userRegister.mockRejectedValue(new Error("Registration failed"));

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <I18nextProvider i18n={i18n}>
            <RegisterPage />
          </I18nextProvider>
        </MemoryRouter>
      </QueryClientProvider>
    );

    fireEvent.input(screen.getByLabelText("Register.name"), {
      target: { value: "John Doe" },
    });
    fireEvent.input(screen.getByLabelText("Register.employeeId"), {
      target: { value: "12345" },
    });
    fireEvent.input(screen.getByLabelText("email"), {
      target: { value: "john@example.com" },
    });
    fireEvent.input(screen.getByLabelText("Register.password"), {
      target: { value: "Password123" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: "Register.registerButton" })
    );

    await waitFor(() => {
      expect(screen.findByText(/Register.registrationFailed/i)).toBeTruthy();
    });
  });
});
