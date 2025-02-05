import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { vi } from "vitest";
import { createRequest } from "../../services/emplyee";
import AddRequestForm from "./index";

vi.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
  }),
}));

// Mock useToast
const mockToast = vi.fn();
vi.mock("@chakra-ui/react", async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...actual,
    useToast: () => mockToast,
  };
});

// Mock API call
vi.mock("../../services/emplyee", () => ({
  createRequest: vi.fn(),
}));

const queryClient = new QueryClient();

const renderWithProviders = (ui) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>{ui}</MemoryRouter>
    </QueryClientProvider>
  );
};

describe("AddRequestForm Component", () => {
  test("renders the form properly", () => {
    renderWithProviders(<AddRequestForm />);
    expect(screen.getByText("Request.title")).toBeInTheDocument();
    expect(screen.getByLabelText("Request.assetName")).toBeInTheDocument();
    expect(screen.getByLabelText("Request.requestType")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Request.createRequest/i })
    ).toBeInTheDocument();
  });

  test("shows validation errors when required fields are missing", async () => {
    renderWithProviders(<AddRequestForm />);

    const submitButton = screen.getByRole("button", {
      name: /Request.createRequest/i,
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText("Request.errors.assetNameRequired")
      ).toBeInTheDocument();
      expect(
        screen.getByText("Request.errors.requestTypeRequired")
      ).toBeInTheDocument();
    });
  });

  test("submits the form successfully and shows success toast", async () => {
    createRequest.mockResolvedValueOnce({ message: "Success" });

    renderWithProviders(<AddRequestForm />);

    fireEvent.change(screen.getByLabelText("Request.assetName"), {
      target: { value: "Laptop" },
    });
    fireEvent.change(screen.getByLabelText("Request.requestType"), {
      target: { value: "REQUEST_ASSET" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Request.createRequest/i })
    );

    await waitFor(() => {
      expect(createRequest).toHaveBeenCalledWith({
        name: "Laptop",
        type: "REQUEST_ASSET",
      });
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Request.successMessage",
          status: "success",
        })
      );
    });
  });

  test("shows an error toast if the API call fails", async () => {
    createRequest.mockRejectedValueOnce(new Error("API Error"));

    renderWithProviders(<AddRequestForm />);

    fireEvent.change(screen.getByLabelText("Request.assetName"), {
      target: { value: "Laptop" },
    });
    fireEvent.change(screen.getByLabelText("Request.requestType"), {
      target: { value: "REQUEST_ASSET" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /Request.createRequest/i })
    );

    await waitFor(() => {
      expect(createRequest).toHaveBeenCalled();
      expect(mockToast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: "Request.errorMessage",
          status: "error",
        })
      );
    });
  });
});
